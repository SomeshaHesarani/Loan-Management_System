import { useState, useEffect } from "react";
import './InterestandPenalty.css';

function InterestPenaltyReverse() {
  const [loanTypes, setLoanTypes] = useState([]); // Store loan types
  const [selectedLoanType, setSelectedLoanType] = useState(""); // Selected loan type
  const [loanData, setLoanData] = useState(null); // Store selected loan type data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(""); // Error state

  // Fetch loan types when component mounts
  useEffect(() => {
    fetch("http://localhost:4000/api/loan-types") // API to fetch loan types
      .then((response) => response.json())
      .then((data) => setLoanTypes(data))
      .catch((error) => console.error("Error fetching loan types:", error));
  }, []);

  // Fetch loan type data when a loan type is selected
  useEffect(() => {
    if (!selectedLoanType) return; // Skip if no loan type is selected

    setLoading(true);
    setError("");
    fetch(`http://localhost:4000/api/loan-categories/${selectedLoanType}`) // API to fetch loan data
      .then((response) => response.json())
      .then((data) => {
        setLoanData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching loan data:", error);
        setError("Failed to load data.");
        setLoading(false);
      });
  }, [selectedLoanType]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Interest and Penalty Reverse</h2>

      {/* Loan Type Dropdown */}
      <div className="mb-4">
        <label htmlFor="loanType" className="block text-sm font-medium text-gray-700">
          Select Loan Type:
        </label>
        <select
          id="loanType"
          value={selectedLoanType}
          onChange={(e) => setSelectedLoanType(e.target.value)}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
        >
          <option value="">-- Select Loan Type --</option>
          {loanTypes.map((loan) => (
            <option key={loan._id} value={loan._id}>
              {loan.loanType}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && <p className="text-blue-500">Loading data...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Loan Data */}
      {loanData && (
        <div className="border p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold">{loanData.loanType} Details</h3>
          <p><strong>Loan Amount:</strong> {loanData.loanAmount}</p>
          <p><strong>interestRate:</strong> {loanData.interestRate }</p>
          <p><strong>loanFrequency:</strong> {loanData.loanFrequency}</p>
          <p><strong>serviceCharge:</strong> {loanData.serviceCharge}</p>
          <p><strong>penalty:</strong> {loanData.penalty}</p>

        </div>
      )}
    </div>
  );
}
export default InterestPenaltyReverse;
