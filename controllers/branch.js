const Branch = require('../models/branch');

// Get all branches
exports.getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find().sort({ createdAt: -1 });
        res.status(200).json(branches);
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({ message: 'Error fetching branches' });
    }
};

// Add a new branch
exports.addBranch = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Branch name is required' });
        }

        const newBranch = new Branch({ name });
        await newBranch.save();
        res.status(201).json(newBranch);
    } catch (error) {
        console.error('Error adding branch:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Branch name already exists' });
        }
        res.status(500).json({ message: 'Error adding branch' });
    }
};

// Delete a branch
exports.deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBranch = await Branch.findByIdAndDelete(id);
        if (!deletedBranch) {
            return res.status(404).json({ message: 'Branch not found' });
        }
        res.status(200).json({ message: 'Branch deleted successfully' });
    } catch (error) {
        console.error('Error deleting branch:', error);
        res.status(500).json({ message: 'Error deleting branch' });
    }
};

// Get branch count
exports.getBranchCount = async (req, res) => {
    try {
        const branchCount = await Branch.countDocuments();
        res.status(200).json({ success: true, count: branchCount });
    } catch (error) {
        console.error('Error fetching branch count:', error);
        res.status(500).json({ message: 'Error fetching branch count' });
    }
};