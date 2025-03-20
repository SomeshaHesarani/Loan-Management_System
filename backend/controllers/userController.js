const User = require('../models/User');
const permissions = require('../config/permissions');

// Get all users (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching users' });
    }
};

// Get a specific user (Admin or the user themselves)
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        // Admin or the same user can view their details
        if (req.user.role === 'admin' || req.user._id.toString() === req.params.id) {
            return res.status(200).json(user);
        }

        return res.status(403).json({ error: 'You do not have permission to view this user' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching user' });
    }
};

// Update user role (Admin only)
const updateUserRole = async (req, res) => {
    const { role } = req.body;

    if (!role || !['admin', 'manager', 'user'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role provided' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Only Admin can update user roles
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to update user role' });
        }

        user.role = role;
        await user.save();
        res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating user role' });
    }
};

// Delete user (Admin only, or set active status to false)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Admin only can delete users
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'You do not have permission to delete this user' });
        }

        // Instead of deleting, set the active state to false
        user.activeState = false;
        await user.save();

        res.status(200).json({ message: 'User deactivated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deactivating user' });
    }
};

module.exports = { getUsers, getUser, updateUserRole, deleteUser };
