const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid for default value

// Define loan schema
const loanSchema = new mongoose.Schema({
  loanID: { type: String, unique: true, default: uuidv4 }, // Unique loanID field with default value
  
  member: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  amountApplied: { type: Number, required: true },
  officer: { type: String, required: true },
  idNumber: { type: String, required: true },
  // interestRate: { type: Number, required: true },
  // servicesCharge: { type: Number, required: true },
  witnessType: { type: String, required: true },
  amountPaid: { type: Number, required: false },
  outstanding: { type: Number, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: false },
  issuedDate:{ type: Date, default: Date.now },// New field to store the issue date
  LoanID: { type: String, unique: true },
  residentialAddress: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected","Issued"],  // Add "Approved" here if not already present
    default: "Pending"},
  date: { type: Date, default: Date.now }
  
});

loanSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Loan").countDocuments();
    this.LoanID = `LID${String(count + 1).padStart(3, "0")}`;
  }
  next();
});
// Create the model from the schema
const Loan = mongoose.model('Loan', loanSchema);



module.exports = Loan;