import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoanApplications.css";
import Sidebar from "../Sidebar";

const LoanApplications = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false);
    const [loanApplications, setLoanApplications] = useState([]);
    const [members, setMembers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [centers, setCenters] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCenter, setSelectedCenter] = useState("");
    

    const toggleLoansDropdown = () => setIsLoansDropdownOpen(!isLoansDropdownOpen);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [loansResponse, membersResponse, categoriesResponse, centersResponse] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/api/loans`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/members`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/loan-categories`),
                    axios.get(`${process.env.REACT_APP_API_URL}/api/centers`),
                ]);

                setLoanApplications(loansResponse.data.data || loansResponse.data);
                setMembers(membersResponse.data.data || membersResponse.data);
                setCategories(categoriesResponse.data.data || categoriesResponse.data);
                setCenters(centersResponse.data.data || centersResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchData();
    }, []);

    const mapDataToLoan = (loan) => {
        const member = members.find((m) => m._id === loan.member);
        const category = categories.find((c) => c._id === loan.category);

        return {
            ...loan,
            customerName: member ? member.firstName : "Unknown",
            idNumber: member ? member.nationalId : "Unknown",
            phone: member ? member.phone : "Unknown",
            branch: member ? member.branch : loan.branch,
            center: member ? member.center : loan.center,
            categoryloanType: category ? category.loanType : "Unknown",
            categoryloanDuration: category ? category.loanDuration : "Unknown",
            loanissuedDate: loan.issuedDate || loan.issuedDate 
        };
    };

    const enrichedLoanApplications = loanApplications.map(mapDataToLoan);

    // Filter for active and issued loans
    const activeLoans = enrichedLoanApplications.filter((loan) => loan.status !== "Issued");
    const issuedLoans = enrichedLoanApplications.filter((loan) => loan.status === "Issued");

    const filteredApplications = activeLoans.filter((application) => {
        const customerName = application.customerName || "";
        const matchesSearchQuery = customerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCenter = selectedCenter ? application.center === selectedCenter : true;
        return matchesSearchQuery && matchesCenter;
    });

    const handleStatusChange = async (loanId, newStatus) => {
        try {
            await axios.patch(`${process.env.REACT_APP_API_URL}/api/loans/${loanId}`, { status: newStatus });

            setLoanApplications((prevApplications) =>
                prevApplications.map((loan) =>
                    loan._id === loanId ? { ...loan, status: newStatus } : loan
                )
            );
        } catch (error) {
            console.error("Error updating loan status:", error);
        }
    };

    const handleIssueLoan = async (loan) => {
        const idNumber = prompt("Enter the member's ID number to issue the loan:");
    
        if (!idNumber) {
            alert("ID number is required!");
            return;
        }
    
        if (loan.idNumber !== idNumber) {
            alert("The entered ID number does not match the member's ID number.");
            return;
        }
    
        try {
            const issuedDate = new Date().toISOString(); // Get current date
    
            // Send request to the backend and get updated loan data
            const response = await axios.patch(`${process.env.REACT_APP_API_URL}/api/loans/${loan._id}`, {
                status: "Issued",
                issuedDate, // Send issuedDate to backend
            });
    
            // Ensure we get updated data from the response
            const updatedLoan = response.data;
    
            // Update the state with the new issued loan details
            setLoanApplications((prevApplications) =>
                prevApplications.map((l) =>
                    l._id === loan._id ? { ...l, status: "Issued", issuedDate: updatedLoan.issuedDate } : l
                )
            );
    
            alert("Loan successfully issued!");
        } catch (error) {
            console.error("Error issuing loan:", error);
            alert("Failed to issue the loan. Please try again.");
        }
    };
    

    const handleAddLoan = () => {
        navigate("/Addnewapplication");
    };

    const handleEditLoan = (loan) => {
        navigate(`/editloanapplication/${loan._id}`, { state: loan });
    };

    return (
        <div>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleLoansDropdown={toggleLoansDropdown}
                isLoansDropdownOpen={isLoansDropdownOpen}
            />
            <div className="main-content">
                <div className="loanApplication-page">
                    <div className="loanApplication-header">
                        <h2>Loan Applications</h2>
                        <button className="add-btn" onClick={handleAddLoan}>
                            + Add New
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Customer Name..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <select
                        className="center-filter"
                        value={selectedCenter}
                        onChange={(e) => setSelectedCenter(e.target.value)}
                    >
                        <option value="">All Centers</option>
                        {centers.map((center) => (
                            <option key={center._id} value={center.name}>
                                {center.name}
                            </option>
                        ))}
                    </select>

                    {/* Active Loans Table */}
                    <h3>Active Loan Applications</h3>
                    <table className="loanApplication-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Officer</th>
                                <th>Branch</th>
                                <th>Center</th>
                                <th>Loan ID</th>
                                <th>Customer Name</th>
                                <th>ID Number</th>
                                <th>Loan Category</th>
                                <th>Loan Durations</th>
                                <th>Amount Applied</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications.length > 0 ? (
                                filteredApplications.map((application, index) => (
                                    <tr key={application._id || index}>
                                        <td>{application.date}</td>
                                        <td>{application.officer}</td>
                                        <td>{application.branch}</td>
                                        <td>{application.center}</td>
                                        <td>{application.LoanID}</td>
                                        <td>{application.customerName}</td>
                                        <td>{application.idNumber}</td>
                                        <td>{application.categoryloanType}</td>
                                        <td>{application.categoryloanDuration}</td>
                                        <td>{application.amountApplied}</td>
                                        <td>
                                            <select
                                                value={application.status}
                                                onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                                disabled={application.status === "Issued"}
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                                <option value="Issued">Issued</option>
                                            </select>
                                        </td>
                                        <td>
                                            {application.status === "Approved" && (
                                                <button className="issue-btn" onClick={() => handleIssueLoan(application)}>
                                                    Issue Loan
                                                </button>
                                            )}
                                            <button className="edit-btn" onClick={() => handleEditLoan(application)}>
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11">No active loan applications found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Issued Loans Table */}
                    {/* Issued Loans Table */}
<h3>Issued Loans</h3>
<table className="loanApplication-table">
    <thead>
        <tr>
            <th>Issued Date</th>
            <th>Officer</th>
            <th>Branch</th>
            <th>Center</th>
            <th>Loan ID</th>
            <th>Customer Name</th>
            <th>ID Number</th>
            <th>Loan Category</th>
            <th>Loan Durations</th>
            <th>Amount Applied</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        {issuedLoans.length > 0 ? (
            issuedLoans.map((loan, index) => (
                <tr key={loan._id || index}>
                    {/* Properly format and display the issuedDate */}
                    <td>{loan.issuedDate ? new Date(loan.issuedDate).toLocaleDateString() : "N/A"}</td>
                    <td>{loan.officer}</td>
                    <td>{loan.branch}</td>
                    <td>{loan.center}</td>
                    <td>{loan.LoanID}</td>
                    <td>{loan.customerName}</td>
                    <td>{loan.idNumber}</td>
                    <td>{loan.categoryloanType}</td>
                    <td>{loan.categoryloanDuration}</td>
                    <td>{loan.amountApplied}</td>
                    <td>{loan.status}</td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="10">No issued loans found</td>
            </tr>
        )}
    </tbody>
</table>

                </div>
            </div>
        </div>
    );
};

export default LoanApplications;
