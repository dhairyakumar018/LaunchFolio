import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'
import { jwt, sign } from 'hono/jwt'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import nodeCrypto from 'node:crypto'
import bcrypt from 'bcryptjs'

const app = new Hono().basePath('/api')
const webCrypto = globalThis.crypto || nodeCrypto.webcrypto

if (!webCrypto?.subtle || !webCrypto?.getRandomValues) {
  throw new Error('Web Crypto API is not available in this runtime')
}

// Robust Native Hashing (PBKDF2 + Web Crypto)
async function secureHash(password) {
  const encoder = new TextEncoder();
  const salt = webCrypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await webCrypto.subtle.importKey(
    'raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
  );
  const hashBuffer = await webCrypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('');
  const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  return `pbkdf2$${saltHex}$100000$${hashHex}`;
}

async function verifyHash(password, storedHash) {
  if (!storedHash) return false;
  
  // Handle Legacy SHA-256 (from earliest versions)
  if (!storedHash.includes('$')) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await webCrypto.subtle.digest('SHA-256', data);
    const sha256 = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    if (storedHash === sha256) return true;
    
    // Fallback for btoa
    if (storedHash === btoa(password)) return true;
    
    return false;
  }

  // Handle PBKDF2
  if (storedHash.startsWith('pbkdf2$')) {
    const [_, saltHex, iterations, hashHex] = storedHash.split('$');
    const encoder = new TextEncoder();
    const salt = new Uint8Array(saltHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const keyMaterial = await webCrypto.subtle.importKey(
      'raw', encoder.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']
    );
    const hashBuffer = await webCrypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: parseInt(iterations), hash: 'SHA-256' },
      keyMaterial, 256
    );
    const currentHashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    return currentHashHex === hashHex;
  }

  // Handle Legacy Bcrypt (sync to avoid async/await issues with bcryptjs)
  if (storedHash.startsWith('$2')) {
    try {
      return bcrypt.compareSync(password, storedHash);
    } catch (e) {
      console.error('Bcrypt comparison error:', e);
      return false;
    }
  }

  return false;
}

// Basic memory-based rate limiting
const rateLimitStore = new Map()
const rateLimitMiddleware = (limit = 10, windowMs = 60000) => async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || 'anonymous'
  const now = Date.now()
  const record = rateLimitStore.get(ip) || { count: 0, firstAt: now }

  if (now - record.firstAt > windowMs) {
    record.count = 1
    record.firstAt = now
  } else {
    record.count++
  }

  rateLimitStore.set(ip, record)

  if (record.count > limit) {
    return c.json({ error: 'Too many requests. Please try again later.' }, 429)
  }

  await next()
}

// Always return JSON, even for errors
app.onError((err, c) => {
  console.error('API Error:', err.message)
  return c.json({ error: err.message || 'Internal server error' }, 500)
})

app.notFound((c) => {
  return c.json({ error: 'API route not found' }, 404)
})

// Database self-healing middleware
app.use('*', async (c, next) => {
  const { DB } = c.env
  try {
    // Check if the newest table (purchases) exists
    await DB.prepare("SELECT 1 FROM purchases LIMIT 1").first()
  } catch (e) {
    console.log('One or more database tables missing, initializing schema...')
    const schema = `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        name TEXT,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        name TEXT NOT NULL,
        data TEXT NOT NULL,
        template TEXT DEFAULT 'modern',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        order_id TEXT,
        payment_id TEXT,
        plan_id TEXT,
        amount INTEGER,
        status TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `
    for (const statement of schema.split(';')) {
      if (statement.trim()) {
        try {
          await DB.prepare(statement).run()
        } catch (err) {
          console.error('Error executing statement:', statement, err.message)
        }
      }
    }
    console.log('Database initialized successfully.')
  }
  await next()
})

const getJwtSecret = (c) => c.env.JWT_SECRET || 'fallback-secret'

// User registration
app.post('/auth/signup', rateLimitMiddleware(5, 60000), async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = z.object({
    email: z.string().email(),
    password: z.string().min(6)
  }).safeParse(body)

  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400)
  }

  const { email, password } = parsed.data
  const { DB } = c.env

  try {
    const id = webCrypto.randomUUID()
    const password_hash = await secureHash(password) 

    await DB.prepare(
      'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)'
    ).bind(id, email, password_hash).run()

    const token = await sign({ id, email }, getJwtSecret(c), 'HS256')
    return c.json({ token, user: { id, email, name: null } })
  } catch (e) {
    console.error('Signup Error:', e.message)
    return c.json({ error: 'User already exists or database error' }, 400)
  }
})

// User login
app.post('/auth/login', rateLimitMiddleware(10, 60000), async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = z.object({
    email: z.string().email(),
    password: z.string()
  }).safeParse(body)

  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400)
  }

  const { email, password } = parsed.data
  const { DB } = c.env

  const user = await DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first()

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const isValid = await verifyHash(password, user.password_hash)

  if (!isValid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  // Automatic Upgrade to PBKDF2 if using legacy Bcrypt or SHA-256
  if (!user.password_hash.startsWith('pbkdf2$')) {
    try {
      const newHash = await secureHash(password)
      await DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(newHash, user.id).run()
      console.log(`[Auth] Upgraded password for ${user.email} to PBKDF2`);
    } catch (e) {
      console.error('Password upgrade failed:', e)
    }
  }

  const token = await sign({ id: user.id, email: user.email }, getJwtSecret(c), 'HS256')
  return c.json({ token, user: { id: user.id, email: user.email, name: user.name } })
})

// Middleware to protect routes
const auth = async (c, next) => {
  const handler = jwt({ secret: getJwtSecret(c), alg: 'HS256' })
  return handler(c, next)
}

// Update Profile
app.patch('/auth/profile', auth, async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = z.object({
    name: z.string().max(100).optional(),
    email: z.string().email().optional()
  }).safeParse(body)

  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400)
  }

  const payload = c.get('jwtPayload')
  const { name, email } = parsed.data
  const { DB } = c.env

  try {
    if (name !== undefined && email !== undefined) {
      await DB.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
        .bind(name, email, payload.id).run()
    } else if (name !== undefined) {
      await DB.prepare('UPDATE users SET name = ? WHERE id = ?')
        .bind(name, payload.id).run()
    } else if (email !== undefined) {
      await DB.prepare('UPDATE users SET email = ? WHERE id = ?')
        .bind(email, payload.id).run()
    }

    const user = await DB.prepare('SELECT id, email, name FROM users WHERE id = ?')
      .bind(payload.id).first()
      
    return c.json({ user })
  } catch (e) {
    console.error('Profile Update Error:', e.message)
    if (e.message.includes('UNIQUE constraint failed')) {
      return c.json({ error: 'This email address is already in use by another protocol.' }, 400)
    }
    return c.json({ error: 'Failed to update profile identity' }, 500)
  }
})

// Forgot Password - Step 1: Generate Code
app.post('/auth/forgot-password', rateLimitMiddleware(3, 60000), async (c) => {
  const body = await c.req.json().catch(() => null)
  const { email } = body || {}

  if (!email) return c.json({ error: 'Email is required' }, 400)

  const { DB } = c.env
  const user = await DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()

  if (!user) {
    // Return success anyway to prevent email enumeration
    return c.json({ success: true, message: 'If this email exists, a reset code has been generated.' })
  }

  // Generate 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  const expiry = new Date(Date.now() + 15 * 60000).toISOString() // 15 mins

  await DB.prepare('UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?')
    .bind(code, expiry, user.id).run()

  console.log(`[AUTH] Password reset code for ${email}: ${code}`)

  // SEND REAL EMAIL VIA RESEND
  const { RESEND_API_KEY } = c.env
  if (RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Launchfolio <security@launchfolio.tech>',
          to: [email],
          subject: 'MASTER KEY RECOVERY PROTOCOL',
          html: `
            <div style="font-family: sans-serif; background: #0b0a1a; color: #ffffff; padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
              <h1 style="color: #00ffc3; font-size: 24px; letter-spacing: 2px; margin-bottom: 10px;">IDENTITY VERIFICATION</h1>
              <p style="color: #888; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 30px;">Module: Password Reconstruction</p>
              
              <div style="margin: 30px 0; padding: 30px; border: 1px solid rgba(0,255,163,0.2); border-radius: 15px; background: rgba(0,255,163,0.05); text-align: center;">
                <p style="font-size: 14px; color: #fff; margin-bottom: 20px; opacity: 0.8;">A request has been initialized to reconstruct the Master Key for your node.</p>
                <div style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #00ffc3; margin: 25px 0; font-family: monospace;">${code}</div>
                <p style="font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 2px;">This code will expire in 15 minutes.</p>
              </div>
              
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05);">
                <p style="font-size: 10px; color: #444; line-height: 1.6;">
                  If you did not initialize this transmission, please terminate your current session immediately. 
                  This is an automated security protocol.
                </p>
              </div>
            </div>
          `
        })
      })
      
      const resData = await response.json()
      if (!response.ok) {
        console.error('[RESEND] API Error:', resData)
        throw new Error(resData.message || 'Email service rejection')
      }
      console.log(`[RESEND] Email transmitted to ${email} (ID: ${resData.id})`)
    } catch (e) {
      console.error('[RESEND] Transmission Failed:', e.message)
      // Fallback for development: the code will be in logs or available if RESEND_API_KEY is missing
    }
  }

  return c.json({ 
    success: true, 
    message: 'Reset code generated and transmitted to your archive.',
    // Keep this for dev if no key is set
    _dev_code: RESEND_API_KEY ? null : code 
  })
})

// Reset Password - Step 2: Verify & Update
app.post('/auth/reset-password', rateLimitMiddleware(5, 60000), async (c) => {
  const body = await c.req.json().catch(() => null)
  const { email, code, newPassword } = body || {}

  if (!email || !code || !newPassword) {
    return c.json({ error: 'Email, code, and new password are required' }, 400)
  }

  const { DB } = c.env
  const user = await DB.prepare('SELECT id, reset_token, reset_token_expiry FROM users WHERE email = ?')
    .bind(email).first()

  if (!user || user.reset_token !== code) {
    return c.json({ error: 'Invalid or expired verification code' }, 401)
  }

  const now = new Date().toISOString()
  if (user.reset_token_expiry < now) {
    return c.json({ error: 'Verification code has expired' }, 401)
  }

  // Hash new password
  const newHash = await secureHash(newPassword)

  // Update password and clear token
  await DB.prepare('UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?')
    .bind(newHash, user.id).run()

  return c.json({ success: true, message: 'Password has been successfully reset.' })
})

// Get resumes
app.get('/resumes', auth, async (c) => {
  const payload = c.get('jwtPayload')
  const { DB } = c.env

  const { results } = await DB.prepare(
    'SELECT * FROM resumes WHERE user_id = ? ORDER BY updated_at DESC'
  ).bind(payload.id).all()

  return c.json(results.map(r => ({ ...r, data: JSON.parse(r.data) })))
})

// Save/Update resume
app.post('/resumes', auth, async (c) => {
  const body = await c.req.json().catch(() => null)
  const parsed = z.object({
    id: z.string().optional(),
    name: z.string(),
    data: z.any(),
    template: z.string()
  }).safeParse(body)

  if (!parsed.success) {
    return c.json({ error: parsed.error.message }, 400)
  }

  const payload = c.get('jwtPayload')
  const resume = parsed.data
  const { DB } = c.env

  const id = resume.id || webCrypto.randomUUID()
  const dataStr = JSON.stringify(resume.data)

  await DB.prepare(`
    INSERT INTO resumes (id, user_id, name, data, template, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      data = excluded.data,
      template = excluded.template,
      updated_at = CURRENT_TIMESTAMP
  `).bind(id, payload.id, resume.name, dataStr, resume.template).run()

  return c.json({ id, status: 'saved' })
})

// Razorpay: Create Order
app.post('/payments/create-order', auth, async (c) => {
  const body = await c.req.json().catch(() => null)
  const { amount, currency, planId } = body || {}
  
  if (!amount) {
    return c.json({ error: 'Amount is required' }, 400)
  }

  const payload = c.get('jwtPayload')
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = c.env
  const authString = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`)

  try {
    console.log('[Payment] Creating order for user:', payload.id, 'Amount:', amount);
    
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        currency: currency || 'INR',
        receipt: `receipt_${uuidv4().substring(0, 8)}`,
        notes: {
          userId: payload.id,
          planId: planId,
        },
      })
    })

    const order = await response.json()
    console.log('[Payment] Razorpay Response:', response.status, order.id || 'NO_ID');
    
    if (!response.ok) {
      console.error('Razorpay API Error:', order)
      throw new Error(order.error?.description || 'Razorpay initialization failed')
    }

    return c.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: RAZORPAY_KEY_ID // Pass the public key to the frontend
    })
  } catch (error) {
    console.error('Payment Initialization Error:', error)
    return c.json({ error: error.message }, 500)
  }
})

// Razorpay: Verify Payment
app.post('/payments/verify', auth, async (c) => {
  const body = await c.req.json().catch(() => null)
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId,
    amount
  } = body || {}

  const { RAZORPAY_KEY_SECRET, DB } = c.env
  const generated_signature = nodeCrypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex')

  if (generated_signature !== razorpay_signature) {
    return c.json({ error: 'Invalid payment signature' }, 400)
  }

  const payload = c.get('jwtPayload')

  // Save to D1
  await DB.prepare(`
    INSERT INTO purchases (id, user_id, order_id, payment_id, plan_id, amount, status)
    VALUES (?, ?, ?, ?, ?, ?, 'completed')
  `).bind(
    uuidv4(),
    payload.id,
    razorpay_order_id,
    razorpay_payment_id,
    planId,
    amount || 0
  ).run()

  return c.json({ success: true, message: 'Payment verified successfully' })
})

// Razorpay: Get User Purchases
app.get('/payments/purchases', auth, async (c) => {
  const payload = c.get('jwtPayload')
  const { DB } = c.env
  
  const { results } = await DB.prepare(
    'SELECT * FROM purchases WHERE user_id = ? ORDER BY created_at DESC'
  ).bind(payload.id).all()
  
  // Normalize results to match frontend expectations
  const normalizedResults = results.map(p => ({
    id: p.id,
    planId: p.plan_id,
    type: p.plan_id.includes('portfolio') ? 'portfolio' : 'resume',
    template: p.plan_id.includes('creative') ? 'creative' : 'minimalist',
    status: p.status === 'completed' ? 'active' : p.status,
    purchasedAt: p.created_at
  }))

  return c.json(normalizedResults)
})

export const onRequest = handle(app)
