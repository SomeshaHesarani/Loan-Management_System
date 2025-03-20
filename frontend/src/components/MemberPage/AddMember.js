import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddMember.css';
import '../Sidebar.css';

const AddMember = () => {
    const navigate = useNavigate();

    // Initialize form data
    const [formData, setFormData] = useState({
        branch: '',
        center: '',
        group: '',
        postalCode: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        phone: '',
        email: '',
        nationality: '',
        nationalId: '',
        residentialAddress: '',
        memberCategory: '',
        loanCategory: '', // Added loanCategory
        root: '',
        idPhoto: null,
    });

    // Define states for branches, centers, roots, and loan categories
    const [branches, setBranches] = useState([]);
    const [centers, setCenters] = useState([]);
    const [roots, setRoots] = useState([]);
    const [Categories, setCategories] = useState([]); // Added loanCategories state
    const [memberCategory] = useState(['Good', 'Middle', 'Bad']);
    const [loading, setLoading] = useState(false);  // Loading state for fetching data
    const [error, setError] = useState(null);  // Error state for handling API fetch errors

    // Access the base URL from .env file
    const BASE_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        // Fetch branch, center, root, and loan category data from backend
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const branchResponse = await axios.get(`${BASE_URL}/api/branches`);
                const centerResponse = await axios.get(`${BASE_URL}/api/centers`);
                const rootResponse = await axios.get(`${BASE_URL}/api/roots`);
                const CategoryResponse = await axios.get(`${BASE_URL}/api/loan-types`); // Fetch loan categories

                setBranches(branchResponse.data);
                setCenters(centerResponse.data);
                setRoots(rootResponse.data);
                setCategories(CategoryResponse.data); // Set loan categories
            } catch (error) {
                setError('Error fetching data: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [BASE_URL]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0], // Store the first selected file
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const memberData = new FormData();
        for (const key in formData) {
            memberData.append(key, formData[key]);
        }
        
        try {
            setLoading(true);
            setError(null);
            
            // Send the form data to the backend for adding a new member
            const response = await axios.post(`${BASE_URL}/api/members`, memberData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Ensure correct header for file uploads
                },
            });
            
            if (response.status === 201) {
                navigate('/members');  // Redirect to members list after successful submit
            }
        } catch (error) {
            console.error('Error adding member:', error);
            setError('Error adding member: ' + error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="add-member-page">
            <h2>Add New Member</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="member-form" encType="multipart/form-data">
                {/* Branch Dropdown */}
                <div className="form-group">
                    <label>Branch:</label>
                    <select
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                            <option key={branch._id} value={branch._name}>
                                {branch.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Center Dropdown */}
                <div className="form-group">
                    <label>Center:</label>
                    <select
                        name="center"
                        value={formData.center}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="">Select Center</option>
                        {centers.map((center) => (
                            <option key={center._id} value={center._name}>
                                {center.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Root Dropdown */}
                <div className="form-group">
                    <label>Root:</label>
                    <select
                        name="root"
                        value={formData.root}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="">Select Root</option>
                        {roots.map((root) => (
                            <option key={root._id} value={root._name}>
                                {root.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Loan Category Dropdown */}
                <div className="form-group">
                    <label>Loan Category:</label>
                    <select
                        name="loanCategory"
                        value={formData.loanCategory}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="">Select a Loan Category</option>
                        {Categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.loanType} {/* Update this to display loanType */}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Other Form Fields */}
                <div className="form-group">
                    <label>Group:</label>
                    <input
                        type="text"
                        name="group"
                        value={formData.group}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Postal Code:</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        // required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Date of Birth:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Nationality:</label>
                    <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>National ID:</label>
                    <input
                        type="text"
                        name="nationalId"
                        value={formData.nationalId}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                <div className="form-group">
                    <label>Residential Address:</label>
                    <input
                        type="text"
                        name="residentialAddress"
                        value={formData.residentialAddress}
                        onChange={handleChange}
                        required
                        className="input-field"
                    />
                </div>

                {/* Member Category Dropdown */}
                <div className="form-group">
                    <label>Member Category:</label>
                    <select
                        name="memberCategory"
                        value={formData.memberCategory}
                        onChange={handleChange}
                        required
                        className="input-field"
                    >
                        <option value="">Select Member Category</option>
                        {memberCategory.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* File Upload */}
                <div className="form-group">
                    <label>ID Photo:</label>
                    <input
                        type="file"
                        name="idPhoto"
                        onChange={handleChange}
                        required
                        accept="image/*"
                        className="input-field"
                    />
                </div>

                {/* Submit Button */}
                <div className="form-group">
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Saving...' : 'Add Member'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddMember;
