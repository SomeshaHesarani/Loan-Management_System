// routes/loanCategoryRoutes.js
const express = require("express");
const loanCategoryController = require("../controllers/CategoryController");

const router = express.Router();
// Route to create a new loan category
router.post('/', loanCategoryController.createLoanCategory);

// Route to get all loan categories
router.get('/', loanCategoryController.getAllLoanCategories);

// Route to get a loan category by ID
router.get('/:id', loanCategoryController.getLoanCategoryById);

// Route to update a loan category
router.put('/:id', loanCategoryController.updateLoanCategory);

// Route to soft delete a loan category
router.delete('/:id', loanCategoryController.softDeleteLoanCategory);

// Route to get all loan names
router.get('/names', loanCategoryController.getAllLoanNames);

// Route to get all loan types
router.get('/types', loanCategoryController.getAllLoanTypes);

router.get('/type/:loanType', loanCategoryController.getLoanCategoriesByType);

router.get('/loan-categories/:loanType',loanCategoryController. getLoanCategoriesByType);

// Route to get all loan names
router.get('/Durations', loanCategoryController.getAllloanDurations);

module.exports = router;