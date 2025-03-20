import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import './RootAssign.css'; // Ensure proper styling for this component

const RootAssign = () => {
    const [roots, setRoots] = useState([]);
    const [newRootName, setNewRootName] = useState('');
    const [collectorInputs, setCollectorInputs] = useState({}); // State to track collector inputs for each root
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchRoots = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/roots`);
                setRoots(response.data);
            } catch (error) {
                console.error('Error fetching roots:', error);
            }
        };

        fetchRoots();
    }, []);

    const handleAddRoot = async () => {
        if (!newRootName.trim()) {
            alert('Root name is required!');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/roots`, {
                name: newRootName,
                collector: null, // Default collector is null
            });

            setRoots((prevRoots) => [...prevRoots, response.data]);
            setNewRootName('');
        } catch (error) {
            console.error('Error adding root:', error);
        }
    };

    const handleDeleteRoot = async (name) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/roots/name/${name}`);
            setRoots((prevRoots) => prevRoots.filter((root) => root.name !== name));
        } catch (error) {
            console.error('Error deleting root:', error);
        }
    };

    const handleAssignCollector = async (rootName) => {
        if (!collectorInputs[rootName]?.trim()) {
            alert('Collector name is required!');
            return;
        }

        try {
            const collector = collectorInputs[rootName];
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/roots/collector/name/${rootName}`, {
                collector,
            });

            setRoots((prevRoots) =>
                prevRoots.map((root) =>
                    root.name === rootName ? { ...root, collector } : root
                )
            );

            // Clear the input for the specific root
            setCollectorInputs((prevInputs) => ({ ...prevInputs, [rootName]: '' }));
        } catch (error) {
            console.error('Error assigning collector:', error);
        }
    };

    const handleInputChange = (rootName, value) => {
        setCollectorInputs((prevInputs) => ({ ...prevInputs, [rootName]: value }));
    };

    return (
        <div className="root-management">
            <h2>Root Management</h2>

            {/* Add Root Section */}
            <div className="add-root-form">
                <input
                    type="text"
                    value={newRootName}
                    onChange={(e) => setNewRootName(e.target.value)}
                    placeholder="Enter Root Name"
                />
                <button className="add-root-btn" onClick={handleAddRoot}>
                    Add Root
                </button>
            </div>

            {/* List of Roots */}
            <h3>Roots</h3>
            <ul className="root-list">
                {roots.map((root) => (
                    <li key={root._id} className="root-item">
                        <div className="root-details">
                            <span>
                                <strong>{root.name}</strong>
                                {root.collector && (
                                    <span className="collector-assigned">
                                        {' '}
                                        - Assigned to: {root.collector}
                                    </span>
                                )}
                            </span>
                        </div>

                        {/* Assign Collector Section */}
                        <div className="assign-collector">
                            <input
                                type="text"
                                value={collectorInputs[root.name] || ''}
                                onChange={(e) => handleInputChange(root.name, e.target.value)}
                                placeholder="Enter Collector Name"
                            />
                            <button
                                className="update-collector-btn"
                                onClick={() => handleAssignCollector(root.name)}
                            >
                                Assign Collector
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Back Button */}
            <div className="back-button-container">
                <button className="back-button" onClick={() => navigate(-1)}>
                    Back
                </button>
            </div>
        </div>
    );
};

export default RootAssign;
