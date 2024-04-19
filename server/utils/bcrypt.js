const bcrypt = require('bcrypt');

const saltRounds = 10;

// Hash password before saving to database
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  return hash;
};

// Verify password during login
const verifyPassword = async (password, hash) => {
  const match = await bcrypt.compare(password, hash);
  return match;
};

module.exports = {
    hashPassword,
    verifyPassword,
}