const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch');

// Routes for branch management
router.get('/branches', branchController.getAllBranches);
router.post('/branches', branchController.addBranch);
router.delete('/branches/:id', branchController.deleteBranch);
router.get('/branch-count', branchController.getBranchCount);


module.exports = router;
