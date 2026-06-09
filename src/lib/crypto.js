/**
 * Secure password hashing using native Web Crypto API (PBKDF2).
 * Fast, secure, and native to Cloudflare Workers / Modern browsers.
 */

const ITERATIONS = 100000;
const SALT_SIZE = 16;
const KEY_SIZE = 32; // SHA-256

export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_SIZE));
  const passwordBuffer = new TextEncoder().encode(password);
  
  const baseKey = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    KEY_SIZE * 8
  );

  const hashArray = new Uint8Array(derivedBits);
  
  // Combine salt and hash: [SALT_SIZE bytes salt] [KEY_SIZE bytes hash]
  const combined = new Uint8Array(SALT_SIZE + KEY_SIZE);
  combined.set(salt);
  combined.set(hashArray, SALT_SIZE);
  
  // Return as hex string for easy storage
  return Array.from(combined)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyPassword(password, storedHex) {
  try {
    const combined = new Uint8Array(storedHex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const salt = combined.slice(0, SALT_SIZE);
    const originalHash = combined.slice(SALT_SIZE);
    
    const passwordBuffer = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );

    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: ITERATIONS,
        hash: 'SHA-256',
      },
      baseKey,
      KEY_SIZE * 8
    );

    const currentHash = new Uint8Array(derivedBits);
    
    // Constant-time comparison
    if (currentHash.length !== originalHash.length) return false;
    let equal = true;
    for (let i = 0; i < currentHash.length; i++) {
      if (currentHash[i] !== originalHash[i]) equal = false;
    }
    return equal;
  } catch (e) {
    return false;
  }
}
