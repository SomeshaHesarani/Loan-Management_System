import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./microloan.css";

const MicroLoanPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false);
  const [microLoans, setMicroLoans] = useState([]);
  const [selectedWeekday, setSelectedWeekday] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("All");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedLoanID, setSelectedLoanID] = useState(null);
  const [isPaymentSectionOpen, setIsPaymentSectionOpen] = useState(false);

  const weekdays = ["All", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    const fetchMicroLoans = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/repayments`);
        setMicroLoans(response.data.data || response.data);
      } catch (error) {
        console.error("Error fetching microloans:", error.message);
      }
    };

    fetchMicroLoans();
  }, []);

  const getWeekday = (date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[new Date(date).getDay()];
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === "weekday") setSelectedWeekday(value);
    if (filterName === "branch") setSelectedBranch(value);
  };

  const filteredMicroLoans = microLoans.filter((loan) => {
    const matchesWeekday = selectedWeekday === "All" || getWeekday(loan.date) === selectedWeekday;
    const matchesBranch = selectedBranch === "All" || loan.branch === selectedBranch;
    return matchesWeekday && matchesBranch;
  });

  const openPaymentSection = (loanID) => {
    setSelectedLoanID(loanID);
    setIsPaymentSectionOpen(true);
  };

  const closePaymentSection = () => {
    setIsPaymentSectionOpen(false);
    setPaymentAmount("");
  };

  const handlePaymentSubmit = async () => {
    if (!selectedLoanID || !paymentAmount) {
      alert("Please enter a valid payment amount.");
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/repayments`, {
        loanID: selectedLoanID,
        paymentAmount: parseFloat(paymentAmount),
      });

      console.log("Payment submitted:", response.data);

      const updatedLoans = microLoans.map((loan) => {
        if (loan.loanID === selectedLoanID) {
          loan.amountPaid = (loan.amountPaid || 0) + parseFloat(paymentAmount);
          loan.outstanding = (loan.loanAmount || 0) - loan.amountPaid;
        }
        return loan;
      });

      setMicroLoans(updatedLoans);
      closePaymentSection();
    } catch (error) {
      console.error("Error submitting payment:", error.message);
    }
  };

  return (
    <div>
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleLoansDropdown={() => setIsLoansDropdownOpen(!isLoansDropdownOpen)}
        isLoansDropdownOpen={isLoansDropdownOpen}
      />
      <div className="main-content">
        <div className="microloan-page">
          <h2>Microloan Records</h2>
          <div className="filters">
            <div>
              <label htmlFor="weekday-filter">Filter by Weekday:</label>
              <select
                id="weekday-filter"
                value={selectedWeekday}
                onChange={(e) => handleFilterChange("weekday", e.target.value)}
              >
                {weekdays.map((day, index) => (
                  <option key={index} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="branch-filter">Filter by Branch:</label>
              <select
                id="branch-filter"
                value={selectedBranch}
                onChange={(e) => handleFilterChange("branch", e.target.value)}
              >
                <option value="All">All</option>
                {[...new Set(microLoans.map((loan) => loan.branch))].map((branch, index) => (
                  <option key={index} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <table className="loan-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Weekday</th>
                <th>Loan ID</th>
                <th>Branch</th>
                <th>Member Name</th>
                <th>Loan Amount</th>
                <th>Amount Paid</th>
                <th>Outstanding</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMicroLoans.map((loan, index) => (
                <tr key={index}>
                  <td>{loan.date || "N/A"}</td>
                  <td>{getWeekday(loan.date)}</td>
                  <td>{loan.loanID || "Unknown"}</td>
                  <td>{loan.branch || "N/A"}</td>
                  <td>{loan.memberName || "Unknown"}</td>
                  <td>{loan.loanAmount?.toLocaleString() || "0"}</td>
                  <td>{loan.amountPaid?.toLocaleString() || "0"}</td>
                  <td>{loan.outstanding?.toLocaleString() || "0"}</td>
                  <td>
                    <button onClick={() => openPaymentSection(loan.loanID)}>Add Payment</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {isPaymentSectionOpen && (
            <div className="payment-section">
              <h3>Add Payment</h3>
              <form>
                <label>
                  Loan ID:
                  <input type="text" value={selectedLoanID} readOnly />
                </label>
                <label>
                  Payment Amount:
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                  />
                </label>
                <button type="button" onClick={handlePaymentSubmit}>
                  Submit Payment
                </button>
                <button type="button" onClick={closePaymentSection}>
                  Close
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicroLoanPage;
