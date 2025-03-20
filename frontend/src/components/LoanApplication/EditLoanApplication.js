import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./EditLoanApplication.css";

const EditLoanApplication = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Default form data
  const initialFormData = {
    Date: "",
    Officer: "",
    Branch: "",
    CustomerName: "",
    idNumber: "",
    LoanType: "",
    AmountApplied: "",
    customer: "",
    interestRate: "",
    serviceCharge: "",
    document: null,
    witnessType: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    nationalId: "",
    residentialAddress: "",
  };

  // State for form data
  const [formData, setFormData] = useState(initialFormData);

  // Populate form if editing
  useEffect(() => {
    if (location.state) {
      setFormData((prev) => ({
        ...prev,
        ...location.state, // Populate form fields from passed state
      }));
    }
  }, [location.state]);

  // Handle form input changes for editable fields only
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["residentialAddress", "Officer", "phone"].includes(name)) {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Loan Application:", formData);
    // Add logic to update existing data in the backend
    navigate("/loanApplications"); // Redirect to the main page
  };

  return (
    <div className="add-newapplication-page">
      <h2>Edit Loan Application</h2>
      <form onSubmit={handleSubmit} className="newapplication-form">
        {/* Loan Information Section */}
        <div className="form-section">
          <h3>Loan Information</h3>
          <div className="form-group">
            <label>Date:</label>
            <input
              type="date"
              name="Date"
              value={formData.Date}
              readOnly
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Member:</label>
            <input
              type="text"
              name="customer"
              value={formData.customer}
              readOnly
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Loan Categories:</label>
            <input
              type="text"
              name="LoanType"
              value={formData.LoanType}
              readOnly
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Loan Officer:</label>
            <input
              type="text"
              name="Officer"
              value={formData.Officer}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Amount Applied:</label>
            <input
              type="number"
              name="AmountApplied"
              value={formData.AmountApplied}
              readOnly
              className="input-field"
            />
          </div>
          {/* <div className="form-group">
            <label>Interest Rate (%):</label>
            <input
              type="text"
              name="interestRate"
              value={formData.interestRate}
              readOnly
              className="input-field"
            />
          </div> */}
          {/* <div className="form-group">
            <label>Service Charge:</label>
            <input
              type="text"
              name="serviceCharge"
              value={formData.serviceCharge}
              readOnly
              className="input-field"
            />
          </div> */}
        </div>

        {/* Guarantors Information Section */}
        <div className="form-section">
          <h3>Guarantors Information</h3>
          <div className="form-group">
            <label>Witness Type:</label>
            <input
              type="text"
              name="witnessType"
              value={formData.witnessType}
              readOnly
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              readOnly
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              readOnly
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
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              readOnly
              className="input-field"
            />
          </div>
          <div className="form-group">
            <label>National ID:</label>
            <input
              type="text"
              name="nationalId"
              value={formData.nationalId}
              readOnly
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
              className="input-field"
            />
          </div>
        </div>

        {/* Form Buttons */}
        <div className="form-buttons">
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/loanApplications")}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditLoanApplication;
