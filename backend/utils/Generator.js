// backend/utils/Generator.js
const crypto = require('crypto');  // Built-in Node.js module for cryptographic functionality

// Function to generate a random token (32 bytes converted to hex string)
const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');  // Generates a 64-character hexadecimal string
};

// Example function for generating a random verification code (e.g., 6-digit code)
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000);  // Generates a 6-digit number
};

// Export these functions so they can be used in other parts of the project
module.exports = { generateToken, generateVerificationCode };
