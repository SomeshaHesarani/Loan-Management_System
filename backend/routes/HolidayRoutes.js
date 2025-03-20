// routes/holidayRoutes.js
const express = require('express');
const router = express.Router();
const HolidayController = require('../controllers/HolidayController');

// Route to get all loan types
router.get('/loan-types', HolidayController.getLoanTypes);

// Route to get loan categories by type
router.get('/loan-categories/type/:type', HolidayController.getLoanCategoriesByType);

// Route to get centers
router.get('/centers', HolidayController.getCenters);

// Route to get loans with optional filters (loanType, center)
router.get('/loans', HolidayController.getLoans);

// Route to get repayable loans (optionally by loanId)
router.get('/repay-loans/:loanId?', HolidayController.getrepayLoans);

// Route to get members by loan type
router.get('/members/loan-type/:loanType', HolidayController.getMembersByLoanType);

// Add a new holiday
router.post('/holidays', HolidayController.addHoliday);

// Get all holidays
router.get('/holidays', HolidayController.getHolidays);

module.exports = router;
