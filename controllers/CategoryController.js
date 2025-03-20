// controllers/loanCategoryController.js
const LoanCategory = require('../models/Category');

// Create a new loan category
exports.createLoanCategory = async (req, res) => {
  const { loanType, loanName, loanAmount, serviceCharge, penalty, interestRate, loanDuration, loanFrequency } = req.body;

  // Validate input fields
  if (!loanType || !loanName || !loanAmount || !interestRate || !loanDuration || !loanFrequency) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Calculate totalAmount (Loan Amount + Interest Rate)
  const totalAmount = loanAmount + (loanAmount * interestRate) / 100;

  try {
    const newLoanCategory = new LoanCategory({
      loanType,
      loanName,
      loanAmount,
      serviceCharge,
      penalty,
      interestRate,
      loanDuration,
      loanFrequency,
      totalAmount,
    });

    const savedLoanCategory = await newLoanCategory.save();
    res.status(201).json(savedLoanCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all loan categories
exports.getAllLoanCategories = async (req, res) => {
  try {
    const loanCategories = await LoanCategory.find({ isDeleted: false });
    res.status(200).json(loanCategories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get loan category by ID
exports.getLoanCategoryById = async (req, res) => {
  try {
    const loanCategory = await LoanCategory.findById(req.params.id);
    if (!loanCategory || loanCategory.isDeleted) {
      return res.status(404).json({ message: 'Loan category not found' });
    }
    res.status(200).json(loanCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update loan category
exports.updateLoanCategory = async (req, res) => {
  const { loanType, loanName, loanAmount, serviceCharge, penalty, interestRate, loanDuration, loanFrequency } = req.body;

  try {
    const updatedLoanCategory = await LoanCategory.findByIdAndUpdate(
      req.params.id,
      {
        loanType,
        loanName,
        loanAmount,
        serviceCharge,
        penalty,
        interestRate,
        loanDuration,
        loanFrequency,
        totalAmount: loanAmount + (loanAmount * interestRate) / 100, // Recalculate totalAmount
      },
      { new: true }
    );

    if (!updatedLoanCategory || updatedLoanCategory.isDeleted) {
      return res.status(404).json({ message: 'Loan category not found or deleted' });
    }

    res.status(200).json(updatedLoanCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Soft delete loan category
exports.softDeleteLoanCategory = async (req, res) => {
  try {
    const loanCategory = await LoanCategory.findById(req.params.id);

    if (!loanCategory || loanCategory.isDeleted) {
      return res.status(404).json({ message: 'Loan category not found or already deleted' });
    }

    loanCategory.isDeleted = true;
    await loanCategory.save();

    res.status(200).json({ message: 'Loan category successfully deleted (soft delete)' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all loan names
exports.getAllLoanNames = async (req, res) => {
  try {
    const loanNames = await LoanCategory.find({ isDeleted: false }).select('loanName');
    res.status(200).json(loanNames);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all loan types
exports.getAllLoanTypes = async (req, res) => {
  try {
    const loanTypes = await LoanCategory.find({ isDeleted: false }).select('loanType');
    res.status(200).json(loanTypes);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get loan categories by loan type
exports.getLoanCategoriesByType = async (req, res) => {
  const { loanType } = req.params; // Loan type from request parameters

  try {
    const loanCategories = await LoanCategory.find({
      loanType,
      isDeleted: false,
    });

    if (loanCategories.length === 0) {
      return res.status(404).json({ message: 'No loan categories found for the selected loan type' });
    }

    res.status(200).json(loanCategories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get loan categories by loan type
exports.getLoanCategoriesByType = async (req, res) => {
  const { loanType } = req.params; // Loan type from request parameters

  try {
    const loanCategories = await LoanCategory.find({
      loanType,
      isDeleted: false, // Only fetch categories that are not marked as deleted
    });

    if (loanCategories.length === 0) {
      return res
        .status(404)
        .json({ message: 'No loan categories found for the selected loan type' });
    }

    res.status(200).json(loanCategories);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};


// Example controller for fetching loan categories by loan type
exports.getLoanCategoriesByType = async (req, res) => {
  const { loanType } = req.params;

  try {
    const loanCategories = await LoanCategory.find({ loanType, isDeleted: false });

    if (loanCategories.length === 0) {
      return res.status(404).json({ message: 'No loan categories found for the selected loan type' });
    }

    res.status(200).json(loanCategories);
  } catch (err) {
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// / Get all loan loanDuration

exports.getAllloanDurations= async (req, res) => {
  try {
    const loanDurations = await LoanCategory.find({ isDeleted: false }).select('loanDuration');
    res.status(200).json(loanDurations);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


