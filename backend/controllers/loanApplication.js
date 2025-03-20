const mongoose = require('mongoose');
const Loan = require('../models/loanApplication');
const { v4: uuidv4 } = require('uuid');

// Generate unique LoanID
const generateUniqueLoanID = async () => {
  let loanID;
  let exists = true;

  do {
    const count = await Loan.countDocuments();
    loanID = `LID${String(count + 1).padStart(3, "0")}`; // Generate LoanID like LID001, LID002, etc.
    
    // Check if the generated LoanID already exists
    const existingLoan = await Loan.findOne({ LoanID: loanID });
    exists = !!existingLoan; // If the LoanID exists, regenerate it
  } while (exists);

  return loanID;
};

// Get all loans
exports.getLoans = async (req, res) => {
  try {
    // Fetch only the necessary fields
    const loans = await Loan.find({}, "date officer branch member idNumber loanType amountApplied LoanID category status");
    
    // Respond with the filtered data
    res.status(200).json({ data: loans });
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ message: "Error fetching loans", error });
  }
};

// Create a new loan application
exports.createLoan = async (req, res) => {
  try {
    // Log the incoming data to check if idNumber is present
    console.log('Received Loan Data:', req.body);

    const loanData = req.body;
    
    // Check if all required fields are provided
    if (!loanData.idNumber) {
        return res.status(400).json({ message: 'idNumber is required' });
    }

    // Generate a unique LoanID
    const uniqueLoanID = await generateUniqueLoanID();
    loanData.LoanID = uniqueLoanID;

    // Create a new loan instance
    const newLoan = new Loan(loanData);
    
    // Save the loan to the database
    await newLoan.save();
    res.status(201).json({ message: 'Loan application created successfully', loan: newLoan });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ message: 'Error creating loan application', error: error.message });
  }
};

// Approve a loan
exports.approveLoan = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the loan exists
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(400).json({ message: "Loan not found" });
    }

    // Check if the loan is already approved
    if (loan.status === "Approved") {
      return res.status(400).json({ message: "Loan already approved" });
    }

    // Update the loan status to "Approved"
    const updatedLoan = await Loan.findByIdAndUpdate(
      id,
      { status: "Approved" },
      { new: true }
    );

    // Return success response with the updated loan data
    res.status(200).json({
      message: "Loan approved successfully",
      data: updatedLoan,
    });

  } catch (error) {
    console.error("Error approving loan:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a loan by ID
exports.getLoanById = async (req, res) => {
  const { id } = req.params;

  try {
    // Validate the ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid loan ID format" });
    }

    // Fetch the loan by ID
    const loan = await Loan.findById(id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.status(200).json(loan);
  } catch (error) {
    console.error("Error fetching loan:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a loan application
exports.updateLoanApplication = async (req, res) => {
  try {
    // Update the loan application with the data provided in the request body
    const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // If the loan was not found, return a 404 error
    if (!updatedLoan) return res.status(404).json({ message: 'Loan not found' });

    // Send the updated loan data as a response
    res.status(200).json({ message: 'Loan application updated successfully', loan: updatedLoan });
  } catch (error) {
    console.error('Error updating loan application:', error);
    res.status(500).json({ message: 'Error updating loan application', error });
  }
};

// Get approved loans
exports.getApprovedLoans = async (req, res) => {
  try {
    const approvedLoans = await Loan.find({ status: "Approved" })
      .populate({
        path: "member", // Populating Member data
        select: "root collector", // Fields to include from Member
      });

    res.status(200).json(approvedLoans);
  } catch (error) {
    console.error("Error fetching approved loans:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get the total count of loans
exports.getLoanCount = async (req, res) => {
  try {
    const loanCount = await Loan.countDocuments();  // Count all loan documents
    res.status(200).json({ loans: loanCount });
  } catch (error) {
    console.error("Error counting loans:", error);
    res.status(500).json({ message: "Error counting loans", error });
  }
};

// Get the count of pending loans
exports.getPendingLoanCount = async (req, res) => {
  try {
    const pendingLoanCount = await Loan.countDocuments({ status: "Pending" });  // Filter loans with status "Pending"
    res.status(200).json({ pendingLoans: pendingLoanCount });
  } catch (error) {
    console.error("Error counting pending loans:", error);
    res.status(500).json({ message: "Error counting pending loans", error });
  }
};

// Fetch pending loans
exports.getPendingLoans = async (req, res) => {
  try {
    const pendingLoans = await Loan.find({ status: "Pending" }, "date officer branch member LoanID idNumber loanType amountApplied")
      .populate({
        path: "member", // Populating Member data via Member ID
        select: "root collector", // Fields to include from Member
      });

    res.status(200).json(pendingLoans);
  } catch (error) {
    console.error("Error fetching pending loans:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update loan status (Handles Issued Date)
exports.updateLoanStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const loan = await Loan.findById(id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.status = status;

    // Add issuedDate only if the loan status is "Issued"
    if (status === "Issued" && !loan.issuedDate) {
      loan.issuedDate = new Date();
    }

    await loan.save();

    res.status(200).json({ message: "Loan status updated successfully", loan });
  } catch (error) {
    console.error("Error updating loan status:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
