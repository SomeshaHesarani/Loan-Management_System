const mongoose = require('mongoose');

const HolidaySchema = new mongoose.Schema({
  date: { type: Date, required: true }, // Date of the holiday
  name: { type: String, required: true }, // Name of the holiday
  description: { type: String }, // Optional description
});

module.exports = mongoose.model('Holiday', HolidaySchema);