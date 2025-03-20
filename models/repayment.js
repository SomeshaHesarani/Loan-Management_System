const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  LoanID: { 
    type: String, // This should be a string to accommodate custom Loan IDs like "LID032"
    required: true 
  },
  loanId: { 
    type: mongoose.Schema.Types.ObjectId, // This links to the Loan document in your database
    ref: 'Loan', 
    required: true 
  },
  amountApplied: { 
    type: Number, 
    required: true 
  },
  paymentAmount: { 
    type: Number, 
    required: true 
  },
  amountPaid: { 
    type: Number, 
    default: 0 
  },
  outstanding: { 
    type: Number, 
    default: 0 
  },
  PaymentMethod: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  },
});


const Repayment = mongoose.model('Repayment', loanSchema);


module.exports = Repayment;