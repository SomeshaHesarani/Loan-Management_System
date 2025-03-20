const mongoose = require("mongoose");

const InterestPenaltyPaymentSchema = new mongoose.Schema({
  loanType: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  customerName: { type: String, required: true },
  group: { type: String, required: true },
  loanAmount: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
  outstandingBalance: { type: mongoose.Schema.Types.ObjectId, ref: "Repayment" },
  penalty: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  interestRate: { type: mongoose.Schema.Types.ObjectId, ref: "Category"},
 
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("InterestPenaltyPayment", InterestPenaltyPaymentSchema);
