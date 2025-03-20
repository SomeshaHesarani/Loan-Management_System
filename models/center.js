// models/centerModel.js
const mongoose = require('mongoose');

// Define the Center schema
const centerSchema = new mongoose.Schema({
    name: { type: String, required: true },
});

const Center = mongoose.model('Center', centerSchema);

module.exports = Center;
