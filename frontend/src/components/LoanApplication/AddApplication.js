import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddApplication.css";

const AddApplication = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    member: "",
    officer: "",
    amountApplied: "",
    witnessType: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    nationalId: "",
    residentialAddress: "",
    date: "",
    category: "", // Loan category field
  });

  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]); // State for loan categories
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch members and categories on component mount
  useEffect(() => {
    const fetchMembersAndCategories = async () => {
      try {
        setLoading(true);

        // Fetch members
        const membersResponse = await axios.get(`${API_URL}/api/members`);
        const membersData = membersResponse.data?.data || membersResponse.data;
        setMembers(membersData);

        // Fetch categories
        const categoriesResponse = await axios.get(`${API_URL}/api/loan-types`);
        const categoriesData = categoriesResponse.data?.data || categoriesResponse.data;
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load members or categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchMembersAndCategories();
  }, [API_URL]);

  // Handle form field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const loanData = {
      member: formData.member,
      officer: formData.officer,
      amountApplied: formData.amountApplied,
      witnessType: formData.witnessType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      idNumber: formData.nationalId,
      residentialAddress: formData.residentialAddress,
      date: formData.date,
      category: formData.category, // Include selected category
    };

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/api/loans`, loanData);
      console.log("Loan submitted successfully:", response.data);
      navigate("/loanapplications"); // Redirect after successful submission
    } catch (error) {
      console.error("Error submitting loan application:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Failed to submit loan application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-newapplication-page">
      <h2>Add New Loan Application</h2>
      {error && <p className="error-message">{error}</p>}
      {loading ? (
        <p>Loading members and categories...</p>
      ) : (
        <form onSubmit={handleSubmit} className="newapplication-form">
          <div className="form-section">
            <h3>Loan Information</h3>
            <div className="form-group">
              <label>Member:</label>
              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a Member</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.firstName} {member.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
  <label>Loan Category:</label>
  <select
    name="category"
    value={formData.category}
    onChange={handleChange}
    required
    className="input-field"
  >
    <option value="">Select a Loan Category</option>
    {categories.map((category) => (
      <option key={category._id} value={category._id}>
        {category.loanType} {/* Update this to display loanType */}
      </option>
    ))}
  </select>
</div>


            <div className="form-group">
              <label>Loan Officer:</label>
              <input
                type="text"
                name="officer"
                value={formData.officer}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Amount Applied:</label>
              <input
                type="number"
                name="amountApplied"
                value={formData.amountApplied}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          {/* Guarantor Information */}
          <div className="form-section">
            <h3>Guarantor Information</h3>
            <div className="form-group">
              <label>Witness Type:</label>
              <select
                name="witnessType"
                value={formData.witnessType}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select a Witness Type</option>
                <option value="relative">Relative</option>
                <option value="friend">Friend</option>
              </select>
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

            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="form-buttons">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/loanapplications")}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddApplication;