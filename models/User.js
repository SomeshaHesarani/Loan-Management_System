const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin','manager','accountant' ,'user'], default: 'user' } // Define roles
});

module.exports = mongoose.model('User ', userSchema);