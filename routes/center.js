// routes/centerRoutes.js
const express = require('express');
const router = express.Router();
const { getCenters, addCenter, deleteCenter } = require('../controllers/center');

// Route for fetching all centers
router.get('/', getCenters);

// Route for adding a new center
router.post('/', addCenter);

// Route for deleting a center by ID
router.delete('/:id', deleteCenter);

module.exports = router;
