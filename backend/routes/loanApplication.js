// routes/loanRoutes.js
// routes/loanRoutes.js
const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanApplication');

// Get all loans
router.get('/', loanController.getLoans);

// Add a new loan application
router.post('/', loanController.createLoan);

// Update loan status (approve or pending)

router.patch('/:id/approve', loanController.approveLoan)

router.patch("/:id",loanController.updateLoanApplication)

router.get("/approved", loanController.getApprovedLoans);

router.get('/approved/:id', loanController.getLoanById);

router.get('/count', loanController.getLoanCount); // Get loan count

router.get('/pending/count', loanController.getPendingLoanCount);

router.get('/pending', loanController.getPendingLoans); 

//router.get('/approved/repayments', loanController.getrepayLoans)


//router.post('/approved/repayments', loanController.createRepayment)

//router.put('/approved/:id/payment', loanController.updateLoanPayment);

//router.get('/approved/:id/paid', loanController.getPaidApprovedLoans);

router.get('/count', loanController.getLoanCount); // Get loan count

router.get('/pending/count', loanController.getPendingLoanCount);

router.get('/pending', loanController.getPendingLoans); 

// router.get('/:loanType',loanController. getLoanDataByType);

module.exports = router;