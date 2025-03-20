const express = require('express');
const router = express.Router();
const interestPenaltyController = require('../controllers/InterestPenaltyPaymentController');

// Route to get member data by loan type
router.get('/:loanTypeId', interestPenaltyController.getMemberDataByLoanType);

// Route to reverse penalty and interest
router.post('/reverse/:memberId', interestPenaltyController.reversePenaltyInterest);

module.exports = router;
