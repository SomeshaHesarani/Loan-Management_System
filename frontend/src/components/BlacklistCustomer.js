import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BlacklistMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [memberName, setMemberName] = useState('');
  const [selectedCenter, setSelectedCenter] = useState('');
  const [centers, setCenters] = useState([]);

  // Fetch members when component mounts
  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/members`);
      console.log('Members fetched from API:', response.data); // Log fetched members

      const memberData = response.data.data || response.data;

      if (Array.isArray(memberData)) {
        setMembers(memberData);
        setFilteredMembers(memberData);
        // Extract unique centers
        const uniqueCenters = [...new Set(memberData.map(member => member.center))].filter(Boolean);
        setCenters(uniqueCenters);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(); // Fetch members initially
  }, []);

  // Handle search by national ID
  const handleIdSearch = (e) => {
    const idValue = e.target.value;
    setSearchId(idValue);
    filterMembers(idValue, selectedCenter);

    const foundMember = members.find(member => member.nationalId.toLowerCase().includes(idValue.toLowerCase()));
    setMemberName(foundMember ? foundMember.firstName : 'No member found');
  };

  // Handle center filter
  const handleCenterFilter = (e) => {
    const centerValue = e.target.value;
    setSelectedCenter(centerValue);
    filterMembers(searchId, centerValue);
  };

  // Filter members by ID and center
  const filterMembers = (id, center) => {
    let filtered = [...members];

    if (id.trim() !== '') {
      filtered = filtered.filter(member => 
        member.nationalId.toLowerCase().includes(id.toLowerCase())
      );
    }

    if (center) {
      filtered = filtered.filter(member => member.center === center);
    }

    setFilteredMembers(filtered);
  };

  // Handle blacklisting member
  const handleBlacklist = async (nationalId) => {
    try {
      console.log('Sending data to blacklist member:', nationalId); // Log the nationalId being sent

      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/blacklist/blacklist/${nationalId}`);

      console.log('Response from backend after blacklisting:', response.data); // Log the response from the backend

      if (response.status === 200) {
        // Update the member's blacklisted status
        const updatedMembers = members.map((member) => 
          member.nationalId === nationalId ? { ...member, isBlacklisted: true } : member
        );
        setMembers(updatedMembers);
        filterMembers(searchId, selectedCenter); // Reapply filters after update
        alert('Member blacklisted successfully');
        fetchMembers(); // Re-fetch members to get updated data
      }
    } catch (error) {
      console.error('Error blacklisting member:', error);
      alert(error.response?.data?.message || 'Failed to blacklist member. Please try again.');
    }
  };

  // Handle unblacklisting member
  const handleUnBlacklist = async (nationalId) => {
    try {
      console.log('Sending data to unblacklist member:', nationalId); // Log the nationalId being sent

      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/blacklist/unblacklist/${nationalId}`);

      console.log('Response from backend after unblacklisting:', response.data); // Log the response from the backend

      if (response.status === 200) {
        const updatedMembers = members.map((member) => 
          member.nationalId === nationalId ? { ...member, isBlacklisted: false } : member
        );
        setMembers(updatedMembers);
        filterMembers(searchId, selectedCenter); // Reapply filters after update
        alert('Member unblacklisted successfully');
        fetchMembers(); // Re-fetch members to get updated data
      }
    } catch (error) {
      console.error('Error un-blacklisting member:', error);
      alert(error.response?.data?.message || 'Failed to unblacklist member. Please try again.');
    }
  };

  // Reset search and filter
  const handleReset = () => {
    setSearchId('');
    setSelectedCenter('');
    setMemberName('');
    setFilteredMembers(members);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Blacklist Members</h2>

      {/* Search and Filter Section */}
      <div className="mb-6 p-4 bg-white rounded shadow">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="idSearch" className="block text-sm font-medium text-gray-700 mb-1">
              Search by ID Number
            </label>
            <input
              id="idSearch"
              type="text"
              value={searchId}
              onChange={handleIdSearch}
              placeholder="Enter ID number..."
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex-1">
            <label htmlFor="centerFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Center
            </label>
            <select
              id="centerFilter"
              value={selectedCenter}
              onChange={handleCenterFilter}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Centers</option>
              {centers.map((center, index) => (
                <option key={index} value={center}>{center}</option>
              ))}
            </select>
          </div>

          {(memberName || selectedCenter) && (
            <div className="flex-1">
              {memberName && (
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Member Name
                  </label>
                  <div className="p-2 bg-gray-50 border border-gray-300 rounded">
                    {memberName}
                  </div>
                </div>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'}
        {selectedCenter && ` in ${selectedCenter}`}
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b text-left">Full Name</th>
              <th className="px-6 py-3 border-b text-left">Loan Type</th>
              <th className="px-6 py-3 border-b text-left">Loan Amount</th>
              <th className="px-6 py-3 border-b text-left">Id Number</th>
              <th className="px-6 py-3 border-b text-left">Center</th>
              <th className="px-6 py-3 border-b text-left">Status</th>
              <th className="px-6 py-3 border-b text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">{member.firstName}</td>
                  <td className="px-6 py-4 border-b">{member.loanCategory}</td>
                  <td className="px-6 py-4 border-b">{member.loanAmount}</td>
                  <td className="px-6 py-4 border-b">{member.nationalId}</td>
                  <td className="px-6 py-4 border-b">{member.center}</td>
                  <td className="px-6 py-4 border-b">
                    <span className={`px-2 py-1 rounded ${member.isBlacklisted ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                      {member.isBlacklisted ? 'Blacklisted' : 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleBlacklist(member.nationalId)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                        disabled={member.isBlacklisted}
                      >
                        Blacklist
                      </button>
                      <button 
                        onClick={() => handleUnBlacklist(member.nationalId)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        disabled={!member.isBlacklisted}
                      >
                        Unblacklist
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No members found with the current filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlacklistMembers;
