const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.CRYPTO_SECRET_KEY || 'wrixty_crypto_default_key_123';

const encryptPassword = (password) => {
  if (!password) return '';
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

const decryptPassword = (ciphertext) => {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.error('Decryption failed:', err);
    return ciphertext;
  }
};

module.exports = {
  encryptPassword,
  decryptPassword
};
