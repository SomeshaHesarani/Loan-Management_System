// backend/routes/protectedRoutes.js
const express = require('express');
const { verifyToken, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
    '/view-data',
    verifyToken,
    authorize(['read']), // Roles with 'read' permission can access
    (req, res) => {
        res.status(200).json({ message: 'View data success', user: req.user });
    }
);

router.post(
    '/create-data',
    verifyToken,
    authorize(['create']), // Roles with 'create' permission can access
    (req, res) => {
        res.status(201).json({ message: 'Create data success' });
    }
);

router.delete(
    '/delete-data',
    verifyToken,
    authorize(['delete']), // Only admin can delete
    (req, res) => {
        res.status(200).json({ message: 'Delete data success' });
    }
);

module.exports = router;
