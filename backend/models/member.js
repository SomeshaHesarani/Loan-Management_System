// models/Member.js

const mongoose = require('mongoose');

// Define the Member schema
const memberSchema = new mongoose.Schema(
  {
    branch: { type: String, required: true },
    center: { type: String, required: true },
    group: { type: String },
    postalCode: { type: String },
    firstName: { type: String, required: true },
    lastName: { type: String },
    dateOfBirth: { type: Date },
    phone: { type: String, required: true },
    email: { type: String },
    nationality: { type: String },
    nationalId: { type: String, required: true },
    residentialAddress: { type: String },
    memberCategory: { type: String, required: true }, // Good, Middle, Bad
    root: { type: String },
    activeStatus: { type: Boolean, default: true }, 
    isBlacklisted: { type: Boolean, default: false },

    loanCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LoanType', // Reference to the LoanType model
      required: true,
    },

    accountNumber: { type: String, unique: true }, // Auto-generated account number
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Pre-save hook to auto-generate accountNumber
memberSchema.pre('save', async function (next) {
  if (!this.accountNumber) {
    try {
      // Generate a random number and prefix it with "Acc"
      const randomNum = Math.floor(10000 + Math.random() * 90000); // Random 5-digit number
      this.accountNumber = `Acc${randomNum}`;
    } catch (error) {
      next(error);
    }
  }
  next();
});

// Create a model from the schema
const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
