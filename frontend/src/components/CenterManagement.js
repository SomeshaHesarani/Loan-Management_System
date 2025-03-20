import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CenterManagement.css'; 

const CenterManagement = () => {
    const [centers, setCenters] = useState([]);
    const [newCenterName, setNewCenterName] = useState(''); // to store the new center name input

    // Fetch centers on component mount
    useEffect(() => {
        const fetchCenters = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/centers`);
                setCenters(response.data);
            } catch (error) {
                console.error('Error fetching centers:', error);
            }
        };
        fetchCenters();
    }, []);

    // Add a new center
    const handleAddCenter = async () => {
        if (!newCenterName.trim()) {
            alert('Center name is required!');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/centers`, { name: newCenterName });
            setCenters((prevCenters) => [...prevCenters, response.data]);
            setNewCenterName(''); // Clear the input field after adding
        } catch (error) {
            console.error('Error adding center:', error);
        }
    };

    // Delete a center
    const handleDeleteCenter = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/centers/${id}`);
            setCenters(centers.filter((center) => center._id !== id)); // Remove the center from the list
        } catch (error) {
            console.error('Error deleting center:', error);
        }
    };

    return (
        <div className="center-management">
            <h2>Center Management</h2>

            {/* Add Center Form */}
            <div className="add-center-form">
                <input
                    type="text"
                    value={newCenterName}
                    onChange={(e) => setNewCenterName(e.target.value)}
                    placeholder="Enter Center Name"
                />
                <button onClick={handleAddCenter} className="add-center-btn">Add Center</button>
            </div>

            {/* List of Centers */}
            <ul className="center-list">
                {centers.map((center) => (
                    <li key={center._id} className="center-item">
                        {center.name}
                        <button 
                            onClick={() => handleDeleteCenter(center._id)} 
                            className="delete-center-btn">
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CenterManagement;
