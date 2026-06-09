import crypto from 'crypto';

async function generateHash(password) {
  const encoder = new TextEncoder();
  const salt = crypto.randomBytes(16);
  
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);
      const saltHex = salt.toString('hex');
      const hashHex = derivedKey.toString('hex');
      resolve(`pbkdf2$${saltHex}$100000$${hashHex}`);
    });
  });
}

const password = 'password123';
generateHash(password).then(console.log);
