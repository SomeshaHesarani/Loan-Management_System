// const express = require('express');
// const router = express.Router();
// const { verifyToken, authorizePermission } = require('../middlewares/authorization');
// const { getUsers, getUser, updateUserRole, deleteUser } = require('../controllers/userController');

// // Protect routes with role-based permissions
// router.get('/users', verifyToken, authorizePermission('manage_users'), getUsers);
// router.get('/users/:id', verifyToken, getUser); // Admin or same user can access
// router.put('/users/:id/role', verifyToken, authorizePermission('manage_users'), updateUserRole);
// router.delete('/users/:id', verifyToken, authorizePermission('manage_users'), deleteUser);

// module.exports = router;
