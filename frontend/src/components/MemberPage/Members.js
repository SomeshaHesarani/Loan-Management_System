import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import './Members.css';

const Members = () => {
    const navigate = useNavigate();

    const [membersData, setMembersData] = useState([]); // State for members data
    const [branchFilter, setBranchFilter] = useState(''); // Filter for Branch
    const [centerFilter, setCenterFilter] = useState(''); // Filter for Center
    const [searchQuery, setSearchQuery] = useState(''); // Search query state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
    const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false); // Loans dropdown state

    // Fetch members data from the backend API
    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/members`); // Using environment variable
                if (!response.ok) {
                    throw new Error('Failed to fetch members');
                }
                const data = await response.json();
                console.log('Fetched Members Data:', data.data); // Debugging line to log data
                setMembersData(data.data || []); // Assuming the data is returned in a `data` property
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        };

        fetchMembers();
    }, []);

    // Filter members based on branch, center, and search query
    const filteredMembers = membersData.filter((member) => {
        const matchesBranch = branchFilter === '' || member.branch.toLowerCase().includes(branchFilter.toLowerCase());
        const matchesCenter = centerFilter === '' || member.center.toLowerCase().includes(centerFilter.toLowerCase());
        const matchesSearch = searchQuery === '' || 
            Object.values(member).some((value) => 
                value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
            );

        return matchesBranch && matchesCenter && matchesSearch;
    });

    const toggleLoansDropdown = () => {
        setIsLoansDropdownOpen(!isLoansDropdownOpen);
    };

    // Handle member deletion
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/members/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete member');
            }

            // Remove deleted member from the state
            setMembersData(membersData.filter((member) => member._id !== id));
            alert('Member deleted successfully');
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Error deleting member');
        }
    };

    return (
        <div className="members-page-container">
            {/* Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleLoansDropdown={toggleLoansDropdown}
                isLoansDropdownOpen={isLoansDropdownOpen}
            />

            {/* Main content */}
            <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`}>
                <div className="members-header">
                    <h2>Members</h2>
                    <button className="add-btn" onClick={() => navigate('/addmember')}>+ Add New</button>
                </div>
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Filter by Branch"
                        className="filter-input"
                        value={branchFilter}
                        onChange={(e) => setBranchFilter(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by Center"
                        className="filter-input"
                        value={centerFilter}
                        onChange={(e) => setCenterFilter(e.target.value)}
                    />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <table className="members-table">
                    <thead>
                        <tr>
                            <th>Account Number</th>
                            <th>Branch</th>
                            <th>Center</th>
                            <th>First Name</th>
                            <th>ID Number</th>
                            <th>Group</th>
                            <th>Phone</th>
                            <th>Member Category</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.length > 0 ? (
                            filteredMembers.map((member, index) => (
                                <tr key={index}>
                                    <td>{member.accountNumber}</td>
                                    <td>{member.branch}</td>
                                    <td>{member.center}</td>
                                    <td>{member.firstName}</td>
                                    <td>{member.nationalId}</td>
                                    <td>{member.group}</td>
                                    <td>{member.phone}</td>
                                    <td>{member.memberCategory}</td>
                                    <td>
                                        <button
                                            className="edit-btn"
                                            onClick={() => navigate('/editmember', { state: { member } })}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(member._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9">No members found</td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Footer */}
                <footer className="mt-10 text-center text-gray-500">
                    <p> Cybernetic &copy;2024 Implement By Cybernectic</p>
                </footer>
            </div>
        </div>
    );
};

export default Members;
