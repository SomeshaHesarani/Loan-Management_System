import React, { useState, useEffect } from "react";
import axios from "axios";
import './LoanCategory.css';

const LoanCategory = () => {
  const [formData, setFormData] = useState({
    loanType: "",
    loanName: "",
    loanAmount: "",
    serviceCharge: "",
    penalty: "",
    interestRate: "", // No percentage, just a flat amount
    loanDuration: "",
    loanFrequency: "weekly",
    customLoanField: "" // Custom field for "Other Loan"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [perDayAmount, setPerDayAmount] = useState(null);
  const [totalAmount, setTotalAmount] = useState(null);

  // Watch for changes in loan type to adjust the form accordingly
  useEffect(() => {
    // Reset fields when loan type changes
    setFormData((prev) => ({
      ...prev,
      loanName: "",
      loanAmount: "",
      serviceCharge: "",
      penalty: "",
      interestRate: "",
      loanDuration: "",
      customLoanField: ""
    }));
  }, [formData.loanType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(false);
  };

  const calculateTotalAmount = () => {
    if (formData.loanAmount && formData.interestRate) {
      const amount = parseFloat(formData.loanAmount);
      const interestRate = parseFloat(formData.interestRate);
      
      // Total Amount = Loan Amount + Interest Rate (flat amount)
      const total = amount + interestRate;
      setTotalAmount(total);

      // Per Day Amount = Total Amount / Loan Duration
      if (formData.loanDuration) {
        const perDay = total / parseFloat(formData.loanDuration);
        setPerDayAmount(perDay);
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/loan-categories`, {
        ...formData,
        loanAmount: parseFloat(formData.loanAmount),
        serviceCharge: parseFloat(formData.serviceCharge) || 0,
        penalty: parseFloat(formData.penalty) || 0,
        interestRate: parseFloat(formData.interestRate),
        loanDuration: parseInt(formData.loanDuration)
      });

      if (response.status === 201) {
        setFormData({
          loanType: "",
          loanName: "",
          loanAmount: "",
          serviceCharge: "",
          penalty: "",
          interestRate: "",
          loanDuration: "",
          loanFrequency: "weekly",
          customLoanField: "" // Reset custom field when form is submitted
        });
        setSuccess(true);
        setTotalAmount(null);
        setPerDayAmount(null);
      }
    } catch (error) {
      setError(error.response ? error.response.data.message : "Failed to create loan category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loan-category-container">
      <h2 className="loan-category-title">Create Loan Category</h2>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}

      {success && (
        <div className="alert alert-success">Loan category created successfully!</div>
      )}

      <form className="loan-category-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Loan Type</label>
          <select
            name="loanType"
            value={formData.loanType}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="Micro Loan">Micro Loan</option>
            <option value="Business Loan">Business Loan</option>
            <option value="Daily Loan">Daily Loan</option>
            <option value="Monthly Loan">Monthly Loan</option>
            <option value="Other Loan">Other Loan</option>
          </select>
        </div>

        {/* Display loan name field */}
        {formData.loanType && (
          <div className="form-group">
            <label className="form-label">Loan Name</label>
            <input
              type="text"
              name="loanName"
              value={formData.loanName}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        )}

        {/* Display loan amount field */}
        {formData.loanType && (
          <div className="form-group">
            <label className="form-label">Loan Amount</label>
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        )}

        {/* Display interest rate field */}
        {formData.loanType && (
          <div className="form-group">
            <label className="form-label">Interest Rate (flat amount)</label>
            <input
              type="number"
              name="interestRate"
              value={formData.interestRate}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        )}

        {/* Display service charge field */}
        {formData.loanType && (
          <div className="form-group">
            <label className="form-label">Service Charge</label>
            <input
              type="number"
              name="serviceCharge"
              value={formData.serviceCharge}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        )}

        {/* Display penalty field */}
        {formData.loanType && (
          <div className="form-group">
            <label className="form-label">Penalty</label>
            <input
              type="number"
              name="penalty"
              value={formData.penalty}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        )}

        {/* Display loan frequency field */}
        {formData.loanType && (
          <div className="form-group">
            <label className="form-label">Loan Frequency</label>
            <select
              name="loanFrequency"
              value={formData.loanFrequency}
              onChange={handleInputChange}
              className="form-select"
              required
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        )}

        {/* Display loan duration field */}
        {formData.loanType && (
          <div className="form-group">
            <label className="form-label">Loan Duration (days)</label>
            <input
              type="number"
              name="loanDuration"
              value={formData.loanDuration}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>
        )}

        {/* Display custom field if "Other Loan" is selected */}
        {formData.loanType === "other" && (
          <div className="form-group">
            <label className="form-label">Custom Loan Field</label>
            <input
              type="text"
              name="customLoanField"
              value={formData.customLoanField}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>
        )}

        {/* Show the Calculate Total Amount button only after loan type is selected */}
        {formData.loanType && (
          <div className="button-group">
            <button
              type="button"
              onClick={calculateTotalAmount}
              className="button button-secondary"
            >
              Calculate Total Amount
            </button>
          </div>
        )}

        {totalAmount !== null && (
          <div className="calculation-result">
            <p className="calculation-amount">Total Amount: ${totalAmount.toFixed(2)}</p>
          </div>
        )}

        {perDayAmount !== null && (
          <div className="calculation-result">
            <p className="calculation-amount">Per Day Amount: ${perDayAmount.toFixed(2)}</p>
          </div>
        )}

        {/* Show the Create Loan Category button only after loan type is selected */}
        {formData.loanType && (
          <button
            type="submit"
            className="button button-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Loan Category"}
          </button>
        )}
      </form>
    </div>
  );
};

export default LoanCategory;
