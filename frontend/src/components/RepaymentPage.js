import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RepaymentPage.css";
import Sidebar from "./Sidebar";

const RepaymentPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false);
  const [isPaymentSectionOpen, setIsPaymentSectionOpen] = useState(false);
  const [IDofLoan, setIDofLoan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [repaymentApply, setRepaymentsApply] = useState([]);
  const [members, setMembers] = useState([]);
  const [roots, setRoots] = useState([]);
  const [Categories, setCategories] = useState([]);
  const [selectedWeekday, setSelectedWeekday] = useState("All");
  const [selectedRoot, setSelectedRoot] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedGroup, setSelectedGroup] = useState("All");
  const [selectedCenter, setSelectedCenter] = useState("All");
  const [showGroupAndCenter, setShowGroupAndCenter] = useState(false);
  const [isBulkPaymentOpen, setIsBulkPaymentOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  // New state: to track selected loan rows via checkboxes.
  const [selectedLoans, setSelectedLoans] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [repaymentResponse, membersResponse, rootsResponse, categoriesResponse] =
            await Promise.all([
              axios.get(`${process.env.REACT_APP_API_URL}/api/repayments`),
              axios.get(`${process.env.REACT_APP_API_URL}/api/members`),
              axios.get(`${process.env.REACT_APP_API_URL}/api/roots`),
              axios.get(`${process.env.REACT_APP_API_URL}/api/loan-types`),
            ]);

        const repayment = repaymentResponse.data.data || repaymentResponse.data;
        const memberList = membersResponse.data.data || membersResponse.data;
        const rootsList = rootsResponse.data.data || rootsResponse.data;
        const categoriesList = categoriesResponse.data.data || categoriesResponse.data;

        const enrichedLoans = repayment.map((loan) => {
          const member = memberList.find((m) => m._id === loan.member) || {};
          const category = categoriesList.find(
              (c) => String(c._id) === String(loan.category)
          ) || {};

          return {
            ...loan,
            accountNumber: member.accountNumber || "Unknown",
            customerName: member.firstName || "Unknown",
            root: member.root || "Unknown",
            branch: member.branch || "Unknown",
            center: member.center || "Unknown",
            group: member.group || "Unknown",
            categoryName: category ? category.loanType : "Unknown",
            // For bulk payment inputs
            bulkPaymentAmount: "",
            bulkPaymentMethod: "",
          };
        });

        setRepaymentsApply(enrichedLoans);
        setMembers(memberList);
        setRoots(rootsList);
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  const toggleLoansDropdown = () => setIsLoansDropdownOpen(!isLoansDropdownOpen);

  const weekdays = [
    "All",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const paymentMethods = ["Cash", "Bank"];

  const handleViewDetails = (loanId) => {
    if (!loanId) {
      console.error("Loan ID is required.");
      alert("Loan ID is required.");
      return;
    }
    // Navigate to the details page for this specific loan ID
    navigate(`/repayments/${loanId}`);
  };

  const openPaymentSection = (LoanID) => {
    setIDofLoan(LoanID);
    setIsPaymentSectionOpen(true);
  };

  const closePaymentSection = () => {
    setIsPaymentSectionOpen(false);
    setPaymentAmount("");
    setPaymentMethod("Cash");
  };

  const handlePaymentSubmit = async () => {
    if (!IDofLoan || !paymentAmount) {
      alert("Please enter a valid payment amount.");
      return;
    }

    const repayment = repaymentApply.find(
        (repayment) => repayment.LoanID === IDofLoan
    );
    if (!repayment) {
      alert("Loan not found for the provided Loan ID.");
      return;
    }

    const updatedAmountPaid = (repayment.amountPaid || 0) + parseFloat(paymentAmount);
    const updatedOutstanding = (repayment.amountApplied || 0) - updatedAmountPaid;

    const paymentData = {
      LoanID: IDofLoan,
      paymentAmount: parseFloat(paymentAmount),
      paymentMethod,
      updatedAmountPaid,
      updatedOutstanding,
    };

    try {
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/repayments`,
          paymentData
      );
      console.log("Payment successfully submitted:", response.data);

      const updatedRepaymentApply = repaymentApply.map((loan) => {
        if (loan.LoanID === IDofLoan) {
          loan.amountPaid = updatedAmountPaid;
          loan.outstanding = updatedOutstanding;
          loan.paymentHistory = loan.paymentHistory || [];
          loan.paymentHistory.push({
            date: new Date().toLocaleDateString(),
            amountPaid: paymentAmount,
            outstanding: updatedOutstanding,
            paymentMethod,
          });
        }
        return loan;
      });
      setRepaymentsApply(updatedRepaymentApply);
      closePaymentSection();
    } catch (error) {
      console.error(
          "Error submitting payment:",
          error.response?.data?.message || error.message
      );
    }
  };

  // Handle checkbox selection for each loan row.
  const handleLoanSelection = (loanID) => {
    setSelectedLoans((prevSelectedLoans) =>
        prevSelectedLoans.includes(loanID)
            ? prevSelectedLoans.filter((id) => id !== loanID)
            : [...prevSelectedLoans, loanID]
    );
  };

  // Compute the loans that are selected and have a valid bulk payment entry (amount > 0)
  const loansForBulkPayment = repaymentApply.filter(
      (loan) =>
          selectedLoans.includes(loan.LoanID) &&
          parseFloat(loan.bulkPaymentAmount) > 0
  );
  const totalBulkPaymentAmount = loansForBulkPayment.reduce((total, loan) => {
    return total + (parseFloat(loan.bulkPaymentAmount) || 0);
  }, 0);

  const handleBulkPaymentSubmit = async () => {
    if (loansForBulkPayment.length === 0) {
      alert("Please select loans and enter bulk payment amounts for one or more loans.");
      return;
    }

    try {
      // Prepare and validate each loan's bulk payment before submission
      const bulkPaymentPromises = loansForBulkPayment.map((loan) => {
        const paymentAmount = parseFloat(loan.bulkPaymentAmount || 0);
        const paymentMethod = loan.bulkPaymentMethod || "";

        if (!paymentAmount || paymentAmount <= 0) {
          throw new Error(`Invalid payment amount for Loan ID ${loan.LoanID}`);
        }

        if (!paymentMethod) {
          throw new Error(`Please select a payment method for Loan ID ${loan.LoanID}`);
        }

        const updatedAmountPaid = (loan.amountPaid || 0) + paymentAmount;
        const updatedOutstanding = (loan.amountApplied || 0) - updatedAmountPaid;

        const paymentData = {
          LoanID: loan.LoanID,
          paymentAmount,
          paymentMethod,
          updatedAmountPaid,
          updatedOutstanding,
        };

        // API call for each loan
        return axios.post(`${process.env.REACT_APP_API_URL}/api/repayments`, paymentData);
      });

      await Promise.all(bulkPaymentPromises);
      alert("Bulk payment successfully applied.");

      // Update state with new amounts and clear bulk payment inputs
      const updatedRepaymentApply = repaymentApply.map((loan) => {
        if (selectedLoans.includes(loan.LoanID) && parseFloat(loan.bulkPaymentAmount) > 0) {
          const paymentAmount = parseFloat(loan.bulkPaymentAmount || 0);
          return {
            ...loan,
            amountPaid: (loan.amountPaid || 0) + paymentAmount,
            outstanding: (loan.amountApplied || 0) - ((loan.amountPaid || 0) + paymentAmount),
            bulkPaymentAmount: "",
            bulkPaymentMethod: "",
          };
        }
        return loan;
      });

      setRepaymentsApply(updatedRepaymentApply);
      // Optionally clear selectedLoans after bulk payment submission:
      setSelectedLoans([]);
    } catch (error) {
      console.error("Error submitting bulk payment:", error.message);
      alert(error.message);
    }
  };

  const filterByDateRange = (loan) => {
    if (!startDate || !endDate) return true; // Allow if no date range is set.

    const loanDate = new Date(loan.date);
    const start = new Date(startDate);
    const end = new Date(endDate);

    return loanDate >= start && loanDate <= end;
  };

  const handleDownload = () => {
    const filteredLoans = filteredLoanData;

    if (filteredLoans.length === 0) {
      alert("No data found for the selected date range.");
      return;
    }

    // Generate a list of all dates within the selected range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateArray = [];
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
      dateArray.push(new Date(dt).toLocaleDateString());
    }

    // Create a map of loans by customer for quick lookup
    const loansByCustomer = filteredLoans.reduce((acc, loan) => {
      const customerKey = loan.customerName;
      if (!acc[customerKey]) {
        acc[customerKey] = {};
      }
      const loanDate = new Date(loan.date).toLocaleDateString();
      acc[customerKey][loanDate] = loan;
      return acc;
    }, {});

    // Get a list of unique customers
    const customers = Object.keys(loansByCustomer);

    // Create the header row with Customer Name, Account Number, Loan ID, Amount Paid, and Dates
    const headerRow = [
      "Customer Name",
      "Account Number",
      "Loan ID",
      "Amount Paid",
      "Phone Number",
      "Loan Installment",
      "Loan Amount Applied",
      "Loan Outstanding",
      ...dateArray, // Add all dates as columns
    ];

    // Add the date range row at the top
    const dateRangeRow = [`Date Range: ${startDate} to ${endDate}`];

    // Convert data into CSV format
    const csvData = [
      dateRangeRow, // Date range row
      [], // Empty row for spacing
      headerRow, // Header row
      ...customers.map((customer) => {
        const customerLoans = loansByCustomer[customer];
        const firstLoan = customerLoans[Object.keys(customerLoans)[0]];
        return [
          customer, // Customer Name
          firstLoan.accountNumber, // Account Number
          firstLoan.LoanID, // Loan ID
          firstLoan.amountPaid,
          firstLoan.phonenumber,
          firstLoan.LoanInstallment,
          firstLoan.loanoutstanding,
          // Amount Paid for each date
          ...dateArray.map((date) => {
            const loan = customerLoans[date];
            return loan ? loan.amountPaid : "";
          }),
        ];
      }),
    ];

    // Convert the array of data to CSV string
    const csvString = csvData.map((row) => row.join(",")).join("\n");

    // Create a blob for download
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "repayment_data.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  // Apply filters to the repayment data
  const filteredLoanData = repaymentApply.filter((repayment) => {
    const matchesWeekday =
        selectedWeekday === "All" ||
        new Date(repayment.date).toLocaleDateString().includes(selectedWeekday);
    const matchesRoot = selectedRoot === "All" || repayment.root === selectedRoot;
    const matchesCategory =
        selectedCategory === "All" || repayment.category === selectedCategory;
    const matchesGroup = selectedGroup === "All" || repayment.group === selectedGroup;
    const matchesCenter = selectedCenter === "All" || repayment.center === selectedCenter;
    return matchesWeekday && matchesRoot && matchesCategory && matchesGroup && matchesCenter;
  });

  // Unique group and center options from members
  const uniqueGroups = [...new Set(members.map((member) => member.group))];
  const uniqueCenters = [...new Set(members.map((member) => member.center))];

  // Determine if the selected category is "Micro Loan"
  const selectedCat = Categories.find((cat) => cat._id === selectedCategory);
  const isMicroLoan = selectedCat && selectedCat.loanType === "Micro Loan";

  // Show extra filters when the selected category is Micro Loan
  useEffect(() => {
    if (isMicroLoan) {
      setShowGroupAndCenter(true);
    } else {
      setShowGroupAndCenter(false);
      setSelectedGroup("All");
      setSelectedCenter("All");
    }
  }, [selectedCategory, Categories, isMicroLoan]);

  // Open bulk payment section only if Micro Loan is selected and both Group & Center are chosen.
  useEffect(() => {
    if (isMicroLoan && selectedCenter !== "All" && selectedGroup !== "All") {
      setIsBulkPaymentOpen(true);
    } else {
      setIsBulkPaymentOpen(false);
    }
  }, [selectedCategory, selectedGroup, selectedCenter, isMicroLoan]);

  // Update a specific loan’s bulk payment data (amount or method)
  const updateLoanPayment = (loanID, key, value) => {
    try {
      setRepaymentsApply((prevRepaymentApply) =>
          prevRepaymentApply.map((loan) => {
            if (loan.LoanID === loanID) {
              return {
                ...loan,
                [key]: value,
              };
            }
            return loan;
          })
      );
    } catch (error) {
      console.error("Error updating loan payment:", error);
      alert("Failed to update loan payment");
    }
  };

  return (
      <div>
        <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleLoansDropdown={toggleLoansDropdown}
            isLoansDropdownOpen={isLoansDropdownOpen}
        />
        <div className="main-content">
          <div className="repayment-page">
            <h2>Loan Records</h2>

            {/* Date Range Filter */}
            <div className="date-range-filter">
              <label>Start Date:</label>
              <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
              />
              <label>End Date:</label>
              <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Download Button */}
            <button onClick={handleDownload}>Download Filtered Data</button>

            {/* Other Filters */}
            <div className="filters">
              <div className="weekday-filter">
                <label htmlFor="weekday-select">Filter by Weekday:</label>
                <select
                    id="weekday-select"
                    value={selectedWeekday}
                    onChange={(e) => setSelectedWeekday(e.target.value)}
                >
                  {weekdays.map((day, index) => (
                      <option key={index} value={day}>
                        {day}
                      </option>
                  ))}
                </select>
              </div>
              <div className="root-filter">
                <label htmlFor="root-select">Filter by Root:</label>
                <select
                    id="root-select"
                    value={selectedRoot}
                    onChange={(e) => setSelectedRoot(e.target.value)}
                >
                  <option value="All">All</option>
                  {roots.map((root, index) => (
                      <option key={index} value={root.name}>
                        {root.name}
                      </option>
                  ))}
                </select>
              </div>
              <div className="category-filter">
                <label htmlFor="category-select">Filter by Loan Category:</label>
                <select
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  {Categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.loanType}
                      </option>
                  ))}
                </select>
              </div>

              {/* Show extra filters when the selected category is Micro Loan */}
              {showGroupAndCenter && (
                  <>
                    <div className="center-filter">
                      <label htmlFor="center-select">Filter by Center:</label>
                      <select
                          id="center-select"
                          value={selectedCenter}
                          onChange={(e) => setSelectedCenter(e.target.value)}
                      >
                        <option value="All">All</option>
                        {uniqueCenters.map((center, index) => (
                            <option key={index} value={center}>
                              {center}
                            </option>
                        ))}
                      </select>
                    </div>
                    <div className="group-filter">
                      <label htmlFor="group-select">Filter by Group:</label>
                      <select
                          id="group-select"
                          value={selectedGroup}
                          onChange={(e) => setSelectedGroup(e.target.value)}
                      >
                        <option value="All">All</option>
                        {uniqueGroups.map((group, index) => (
                            <option key={index} value={group}>
                              {group}
                            </option>
                        ))}
                      </select>
                    </div>
                  </>
              )}
            </div>

            {/* Loans Table */}
            <table className="loans-table">
              <thead>
              <tr>
                {/* Render the selection checkbox header column if Micro Loan */}
                {isMicroLoan && <th>Select</th>}
                <th>Date</th>
                <th>Weekday</th>
                <th>Customer Name</th>
                <th>Account Number</th>
                <th>Branch</th>
                <th>Center</th>
                <th>Group</th>
                <th>Loan ID</th>
                <th>Root</th>
                <th>Category</th>
                <th>Amount Applied</th>
                <th>Amount Paid</th>
                <th>Outstanding</th>
                <th>Actions</th>
                {/* For Micro Loans, always show the Enter Payment column */}
                {isMicroLoan && <th>Enter Payment</th>}
              </tr>
              </thead>
              <tbody>
              {filteredLoanData.map((loan) => (
                  <tr key={loan.LoanID}>
                    {/* Render selection checkbox */}
                    {isMicroLoan && (
                        <td>
                          <input
                              type="checkbox"
                              checked={selectedLoans.includes(loan.LoanID)}
                              onChange={() => handleLoanSelection(loan.LoanID)}
                          />
                        </td>
                    )}
                    <td>{new Date(loan.date).toLocaleDateString()}</td>
                    <td>
                      {new Date(loan.date).toLocaleString("en-US", {
                        weekday: "long",
                      })}
                    </td>
                    <td>{loan.customerName}</td>
                    <td>{loan.accountNumber}</td>
                    <td>{loan.branch}</td>
                    <td>{loan.center}</td>
                    <td>{loan.group}</td>
                    <td>{loan.LoanID}</td>
                    <td>{loan.root}</td>
                    <td>{loan.categoryName}</td>
                    <td>{loan.amountApplied}</td>
                    <td>{loan.amountPaid}</td>
                    <td>{loan.outstanding}</td>
                    <td>
                      <button onClick={() => openPaymentSection(loan.LoanID)}>
                        Make Payment
                      </button>
                      <button onClick={() => handleViewDetails(loan.LoanID)}>
                        View Details
                      </button>
                    </td>
                    {isMicroLoan && (
                        <td>
                          <div>
                            <div>
                              <label>
                                Payment Amount:
                                <input
                                    type="number"
                                    value={loan.bulkPaymentAmount || ""}
                                    onChange={(e) =>
                                        updateLoanPayment(
                                            loan.LoanID,
                                            "bulkPaymentAmount",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter payment amount"
                                />
                              </label>
                            </div>
                            <div>
                              <label>
                                Payment Method:
                                <select
                                    value={loan.bulkPaymentMethod || ""}
                                    onChange={(e) =>
                                        updateLoanPayment(
                                            loan.LoanID,
                                            "bulkPaymentMethod",
                                            e.target.value
                                        )
                                    }
                                >
                                  <option value="">Select Method</option>
                                  <option value="cash">Cash</option>
                                  <option value="creditCard">Credit Card</option>
                                  <option value="bankTransfer">Bank Transfer</option>
                                </select>
                              </label>
                            </div>
                          </div>
                        </td>
                    )}
                  </tr>
              ))}
              </tbody>
            </table>

            {/* Bulk Payment Summary Section */}
            {isMicroLoan && (
                <div className="bulk-payment-summary">
                  <h3>Bulk Payment Summary</h3>
                  {loansForBulkPayment.length > 0 ? (
                      <ul>
                        {loansForBulkPayment.map((loan) => (
                            <li key={loan.LoanID}>
                              Loan ID: {loan.LoanID} - Entered Amount:{" "}
                              {parseFloat(loan.bulkPaymentAmount).toFixed(2)}
                            </li>
                        ))}
                      </ul>
                  ) : (
                      <p>No bulk payment amounts entered for selected rows yet.</p>
                  )}
                  <h4>Total Bulk Payment Amount: {totalBulkPaymentAmount.toFixed(2)}</h4>
                </div>
            )}

            {/* Individual Payment Section */}
            {isPaymentSectionOpen && (
                <div className="payments-section">
                  <h3>Payment for Loan ID: {IDofLoan}</h3>
                  <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="Enter payment amount"
                  />
                  <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {paymentMethods.map((method, index) => (
                        <option key={index} value={method}>
                          {method}
                        </option>
                    ))}
                  </select>
                  <button onClick={handlePaymentSubmit}>Submit Payment</button>
                  <button onClick={closePaymentSection}>Cancel</button>
                </div>
            )}

            {/* Bulk Payment Section */}
            {isBulkPaymentOpen && (
                <div className="bulk-payments-section">
                  <h3>Bulk Payment for Selected Loans</h3>
                  <div className="total-bulk-payment">
                    <h4>
                      Total Entered Bulk Payment Amount:{" "}
                      {totalBulkPaymentAmount.toFixed(2)}
                    </h4>
                  </div>
                  <button onClick={handleBulkPaymentSubmit}>
                    Submit Bulk Payment
                  </button>
                </div>
            )}

            {/* Footer */}
            <footer className="mt-10 text-center text-gray-500">
              <p>Cybernetic &copy;2024 Implemented By Cybernetic</p>
            </footer>
          </div>
        </div>
      </div>
  );
};

export default RepaymentPage;

