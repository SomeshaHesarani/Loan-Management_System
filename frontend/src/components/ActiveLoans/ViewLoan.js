import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ViewLoan.css";

const ViewLoan = () => {
    const { loanId } = useParams(); // Get loanId from route parameters
    const navigate = useNavigate();
    const [loanApplications, setLoanApplications] = useState([]);
    const [members, setMembers] = useState([]);
    const [roots, setRoots] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000"; // Default to localhost if not defined in .env

    // Fetch Loans, Members, and Roots
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); // Reset error on each fetch attempt
            try {
                const [loansResponse, membersResponse, rootsResponse] = await Promise.all([
                    axios.get(`${API_URL}/api/loans/approved/${loanId}`), // Corrected endpoint for specific loan
                    axios.get(`${API_URL}/api/members`),
                    axios.get(`${API_URL}/api/roots`)
                ]);
    
                const loansData = loansResponse.data.data;
                setLoanApplications(Array.isArray(loansData) ? loansData : [loansData]);
                setMembers(membersResponse.data.data || membersResponse.data);
                setRoots(rootsResponse.data.data || rootsResponse.data);
            } catch (error) {
                setError("Error fetching data. Please try again later.");
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };
    
        fetchData();
    }, [loanId, API_URL]); // Include loanId and API_URL in the dependency array

    // Create lookup objects for members and roots to optimize data mapping
    const membersLookup = members.reduce((acc, member) => {
        acc[member._id] = member;
        return acc;
    }, {});

    const rootsLookup = roots.reduce((acc, root) => {
        acc[root.name] = root;
        return acc;
    }, {});

    // Map Member Data to Loans
    const mapMemberData = (loan) => {
        const member = membersLookup[loan.member];
        return {
            ...loan,
            customerName: member ? member.firstName : "Unknown",
            idNumber: member ? member.nationalId : "Unknown",
            branch: member ? member.branch : loan.branch,
            root: member ? member.root : "Unknown",
            phone: member ? member.phone : "Unknown",
            memberCategory: member ? member.memberCategory : "Unknown",
        };
    };
    
    // Map Root Data to Loans
    const mapRootData = (loan) => {
        const root = rootsLookup[loan.root];
        return {
            ...loan,
            collector: root ? root.collector : "Unknown",
        };
    };

    // Enrich loan applications with member and root data
    const enrichedLoanApplications = loanApplications.map(mapMemberData).map(mapRootData);

    return (
        <div className="view-loan-container">
            <h2>Loan Details</h2>

            {loading ? (
                <p>Loading data...</p>
            ) : error ? (
                <p className="error-message">{error}</p> // Display error message
            ) : (
                <div className="loan-details">
                    {enrichedLoanApplications.length > 0 ? (
                        enrichedLoanApplications.map((application, index) => {
                            const {
                                _id,
                                date,
                                officer,
                                branch,
                                customerName,
                                idNumber,
                                LoanID,
                                phone,
                                loanType,
                                amountApplied,
                                root,
                                collector,
                                memberCategory,
                            } = application;

                            return (
                                <div key={_id || index} className="loan-item">
                                    <p>Date: {date}</p>
                                    <p>Officer: {officer}</p>
                                    <p>Branch: {branch}</p>
                                    <p>Customer Name: {customerName}</p>
                                    <p>ID Number: {idNumber}</p>
                                    <p>Loan ID: {LoanID}</p>
                                    <p>Phone: {phone}</p>
                                    <p>Loan Type: {loanType}</p>
                                    <p>Amount Applied: {amountApplied}</p>
                                    <p>Root: {root}</p>
                                    <p>Collector: {collector}</p>
                                    <p>Member Category: {memberCategory}</p>
                                </div>
                            );
                        })
                    ) : (
                        <p>No loan applications found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ViewLoan;