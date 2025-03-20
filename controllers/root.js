const Root = require('../models/root');

// Get all roots
exports.getAllRoots = async (req, res) => {
    try {
        const roots = await Root.find().sort({ createdAt: -1 });
        res.status(200).json(roots);
    } catch (error) {
        console.error('Error fetching roots:', error);
        res.status(500).json({ message: 'Error fetching roots' });
    }
};

// Add a new root
exports.addRoot = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Root name is required' });
        }

        const newRoot = new Root({ name });
        await newRoot.save();
        res.status(201).json(newRoot);
    } catch (error) {
        console.error('Error adding root:', error);
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Root name already exists' });
        }
        res.status(500).json({ message: 'Error adding root' });
    }
};

// Delete a root
exports.deleteRoot = async (req, res) => {
    try {
        const { name } = req.params;
        const deletedRoot = await Root.findOneAndDelete({ name });
        if (!deletedRoot) {
            return res.status(404).json({ message: 'Root not found' });
        }
        res.status(200).json({ message: 'Root deleted successfully' });
    } catch (error) {
        console.error('Error deleting root:', error);
        res.status(500).json({ message: 'Error deleting root' });
    }
};

// Assign a collector to a root
exports.assignCollector = async (req, res) => {
    try {
        const { name } = req.params;
        const { collector } = req.body;
        if (!collector) {
            return res.status(400).json({ message: 'Collector name is required' });
        }

        const updatedRoot = await Root.findOneAndUpdate(
            { name },
            { collector },
            { new: true }
        );

        if (!updatedRoot) {
            return res.status(404).json({ message: 'Root not found' });
        }

        res.status(200).json(updatedRoot);
    } catch (error) {
        console.error('Error assigning collector:', error);
        res.status(500).json({ message: 'Error assigning collector' });
    }
};
