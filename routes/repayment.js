// routes/repaymentRoutes.js
const express = require('express');
const router = express.Router();
const repaymentController = require('../controllers/repayment');

// Create a new repayment
router.post('/', repaymentController.createRepayment);

// // Get all repayments
router.get('/', repaymentController.getrepayLoans);
//router.get('/:id', repaymentController.getPaymentHistory);

router.post('/:id', repaymentController.createRepaymentByID)

// // Get a single repayment by ID
router.get('/:LoanID', repaymentController.getPaymentHistoryByLoanID);


// // Update a repayment
// router.put('/payment/:id', repaymentController.updateRepayment);

// // Soft delete a repayment
// router.delete('/payment/:id', repaymentController.deleteRepayment);

module.exports = router;