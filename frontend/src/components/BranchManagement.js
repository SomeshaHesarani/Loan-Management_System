import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BranchManagement.css';

const BranchManagement = () => {
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [newBranchName, setNewBranchName] = useState('');
    const apiUrl = process.env.REACT_APP_API_URL;  // Get the API URL from the environment variable

    // Fetch branches on component mount
    useEffect(() => {
        const fetchBranches = async () => {
            setIsLoading(true);
            setErrorMessage('');
            try {
                console.log(`${apiUrl}/api/branches`)
                const response = await axios.get(`${apiUrl}/api/branches`);
                console.log (response.data);
                setBranches(response.data);
            } catch (error) {
                setErrorMessage('Error fetching branches. Please try again later.');
                console.error('Error fetching branches:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBranches();
    }, [apiUrl]);

    // Handle adding a new branch
    const handleAddBranch = async (event) => {
        event.preventDefault();
        if (newBranchName) {
            try {
                const response = await axios.post(`${apiUrl}/api/branches`, { name: newBranchName });
                setBranches((prevBranches) => [...prevBranches, response.data]);
                setNewBranchName('');
            } catch (error) {
                console.error('Error adding branch:', error);
                alert(error.response?.data?.message || 'Error adding branch');
            }
        }
    };

    // Handle deleting a branch
    const handleDeleteBranch = async (id) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                await axios.delete(`${apiUrl}/api/branches/${id}`);
                setBranches((prevBranches) => prevBranches.filter((branch) => branch._id !== id));
            } catch (error) {
                console.error('Error deleting branch:', error);
                alert('Error deleting branch');
            }
        }
    };

    return (
        <div className="branch-management">
            <h2>Branch Management</h2>
            <form onSubmit={handleAddBranch}>
                <input
                    type="text"
                    value={newBranchName}
                    onChange={(event) => setNewBranchName(event.target.value)}
                    placeholder="Enter new branch name"
                />
                <button type="submit" className="add-branch-btn">
                    Add Branch
                </button>
            </form>

            {/* Error Message */}
            {errorMessage && <div className="error-message">{errorMessage}</div>}

            {isLoading ? (
                <p>Loading branches...</p>
            ) : (
                <div>
                    {branches.length === 0 ? (
                        <p>No branches available.</p>
                    ) : (
                        <ul>
                            {branches.map((branch) => (
                                <li key={branch._id} className="branch-item">
                                    <span>{branch.name}</span>
                                    <button
                                        onClick={() => handleDeleteBranch(branch._id)}
                                        className="delete-branch-btn"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
       
         {/* Footer */}
         <footer className="mt-10 text-center text-gray-500">
         <p> Cybernetic &copy;2024 Implement By Cybernectic</p>
       </footer>
    
   </div>
    );
};

export default BranchManagement;