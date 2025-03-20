















const mongoose = require('mongoose');

// Models
const Repayment = require("../models/repayment");
const Loan = require("../models/loanApplication"); // Correct model name
const Member = require("../models/member"); // Ensure proper casing

/**
 * Create a new repayment for a loan
 */
exports.createRepayment = async (req, res) => {
  const { paymentAmount, LoanID, paymentMethod, date } = req.body;

  try {
    console.log("Payment Details:", { paymentAmount, LoanID, paymentMethod, date });

    // Step 1: Find the loan using LoanID
    const loan = await Loan.findOne({ LoanID });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found with the provided Loan ID." });
    }
    console.log("Loan Found:", loan);

    // Step 2: Calculate updated amounts
    const loanAmount = loan.amountApplied || 0; // Original loan amount
    const updatedAmountPaid = (loan.amountPaid || 0) + paymentAmount; // Add payment to total paid
    const updatedOutstanding = loanAmount - updatedAmountPaid; // Remaining balance

    // Step 3: Update the loan document
    loan.amountPaid = updatedAmountPaid;
    loan.outstanding = updatedOutstanding;

    // Step 4: Save the updated loan details
    await loan.save();

    // Step 5: Use the current date if no date is provided
    const paymentDate = date ? new Date(date) : new Date(); // Default to current date if no date is provided

    // Step 6: Create repayment entry
    const repaymentData = {
      loanId: loan._id,
      LoanID: loan.LoanID,
      paymentAmount,
      amountPaid: updatedAmountPaid,
      outstanding: updatedOutstanding,
      loanAmount,
      PaymentMethod: paymentMethod,
      status: loan.status, // Add status from the loan
      amountApplied: loanAmount, // Add original loan amount
      Date: paymentDate, // Use the calculated date
    };

    console.log("Repayment Data to Save:", repaymentData);

    // Save repayment record to database
    const repayment = new Repayment(repaymentData);
    await repayment.save();

    // Step 7: Respond with success
    res.status(201).json({
      message: "Repayment successfully created.",
      repayment,
    });
  } catch (error) {
    console.error("Error while creating repayment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

/**
 * Fetch approved loans with member details
 */
exports.getrepayLoans = async (req, res) => {
  try {
    const { loanId } = req.params;

    let loans;

    if (loanId) {
      // Find the loan by loanId and ensure it's approved
      loans = await Loan.findOne({ _id: loanId, status: 'Issued' })
        .populate('member', 'firstName nationalId phone memberCategory branch root') // Populate only required fields
        .exec();

      if (!loans) {
        return res.status(404).json({ message: `Loan with ID ${loanId} not found.` });
      }
    } else {
      // Find all approved loans
      loans = await Loan.find({ status: 'Issued' })
        .populate('member', 'firstName nationalId phone memberCategory branch root') // Populate only required fields
        .exec();

      if (!loans || loans.length === 0) {
        return res.status(404).json({ message: 'No approved loans found.' });
      }
    }

    // Respond with loan details
    res.status(200).json({ data: loans });
  } catch (error) {
    console.error('Error fetching loan details:', error);
    res.status(500).json({ message: 'Error fetching loan details', error: error.message });
  }
};

/**
 * Fetch repayment history by Loan ID
 */
// exports.getPaymentHistoryByLoanID = async (req, res) => {
//   try {
//     // Log the request parameters
//     console.log("Request params:", req.params);

//     const { LoanID } = req.params; // Extract LoanID from params
//     console.log("Received Loan ID from params:", LoanID);

//     if (!LoanID) {
//       return res.status(400).json({ error: "Loan ID is required in the URL path." });
//     }

//     // Fetch repayment history for the provided Loan ID
//     const repaymentHistory = await Repayment.find({ LoanID }).sort({ Date: 1 });

//     console.log("Repayment history retrieved:", repaymentHistory);

//     if (!repaymentHistory || repaymentHistory.length === 0) {
//       return res
//         .status(404)
//         .json({ message: `No repayment history found for Loan ID: ${LoanID}` });
//     }

//     return res.status(200).json({
//       message: "Repayment history fetched successfully.",
//       repaymentHistory,
//     });
//   } catch (error) {
//     console.error("Error fetching repayment history:", error);
//     return res.status(500).json({
//       error: "Server error occurred while fetching repayment history.",
//       details: error.message,
//     });
//   }
// };


exports.createRepaymentByID = async (req, res) => {
  const { paymentAmount, LoanID, paymentMethod, date } = req.body;

  try {
    // Log payment details for debugging
    console.log("Payment Details:", { paymentAmount, LoanID, paymentMethod, date });

    // Step 1: Find the loan using LoanID
    const loan = await Loan.findOne({ LoanID });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found with the provided Loan ID." });
    }
    console.log("Loan Found:", loan);

    // Step 2: Calculate updated amounts
    const loanAmount = loan.amountApplied || 0; // Original loan amount
    const updatedAmountPaid = (loan.amountPaid || 0) + paymentAmount; // Add payment to total paid
    const updatedOutstanding = loanAmount - updatedAmountPaid; // Remaining balance

    // Step 3: Update the loan document with the new amounts
    loan.amountPaid = updatedAmountPaid;
    loan.outstanding = updatedOutstanding;

    // Step 4: Save the updated loan details
    await loan.save();
    console.log("Updated Loan:", loan);

    // Step 5: Use the current date if no date is provided
    const paymentDate = date ? new Date(date) : new Date(); // Default to current date if no date is provided

    // Step 6: Create repayment entry
    const repaymentData = {
      loanId: loan._id,
      LoanID: loan.LoanID,
      paymentAmount,
      amountPaid: updatedAmountPaid,
      outstanding: updatedOutstanding,
      loanAmount,
      PaymentMethod: paymentMethod,
      Date: paymentDate, // Use the calculated date
    };
    console.log("Repayment Created:", repaymentData);

    // Step 7: Respond with success
    res.status(201).json({
      message: "Repayment successfully created.",
      repayment: repaymentData,
    });
  } catch (error) {
    console.error("Error while creating repayment:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getPaymentHistoryByLoanID = async (req, res) => {
  try {
    const { LoanID } = req.params;

    if (!LoanID) {
      return res.status(400).json({ error: "Loan ID is required." });
    }

    // Find loan details
    const loanDetails = await Loan.findOne({ LoanID }).populate('member', 'firstName lastName nationalId phone branch center');
    if (!loanDetails) {
      return res.status(404).json({ message: "Loan not found." });
    }

    // Find repayment history
    const repaymentHistory = await Repayment.find({ LoanID }).sort({ date: 1 });

    // Respond with loan details and repayment history
    res.status(200).json({
      message: "Loan and repayment history fetched successfully.",
      loanDetails,
      repaymentHistory,
    });
  } catch (error) {
    console.error("Error fetching repayment history:", error);
    res.status(500).json({ error: "Server error occurred.", details: error.message });
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
    res.status(500).json({ message: "Internal server error" });
  }
};