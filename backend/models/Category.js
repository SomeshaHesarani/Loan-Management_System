// models/LoanCategory.js
const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  loanType: {
    type: String,
    enum: ['Micro Loan', 'Business Loan', 'Daily Loan', 'Monthly Loan', 'Other Loan'], // The five loan types
    required: true, // Ensure that a loan type is provided
  },
  loanName: {
    type: String,
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
  },
  serviceCharge: {
    type: Number,
    default: 0,
  },
  penalty: {
    type: Number,
    default: 0,
  },
  interestRate: {
    type: Number,
    required: true,
  },
  loanDuration: {
    type: Number,
    required: true,
  },
  loanFrequency: {
    type: String,
    enum: ['weekly', 'daily', 'monthly'],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false, // Soft delete flag
  },
}, { timestamps: true });

const LoanCategory = mongoose.model('Category', CategorySchema);

module.exports = LoanCategory;
