// controllers/centerController.js
const Center = require('../models/center');

// Get all centers
const getCenters = async (req, res) => {
    try {
        const centers = await Center.find();
        res.json(centers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching centers', error });
    }
};

// Create a new center
const addCenter = async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: 'Center name is required' });
    }

    try {
        const newCenter = new Center({ name });
        await newCenter.save();
        res.status(201).json(newCenter);
    } catch (error) {
        res.status(500).json({ message: 'Error adding center', error });
    }
};

// Delete a center
const deleteCenter = async (req, res) => {
    const { id } = req.params;

    try {
        const center = await Center.findByIdAndDelete(id);
        if (!center) {
            return res.status(404).json({ message: 'Center not found' });
        }
        res.status(200).json({ message: 'Center deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting center', error });
    }
};

module.exports = { getCenters, addCenter, deleteCenter };
