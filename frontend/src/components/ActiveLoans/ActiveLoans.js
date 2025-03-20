import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ActiveLoans.css";
import Sidebar from "../Sidebar";

// Reusable filter function
const filterLoanApplications = (applications, filters) => {
    const { searchQuery, centerFilter, loanCategoryFilter, rootFilter } = filters;

    return applications.filter((application) => {
        const customerName = application.customerName?.toLowerCase() || "";
        const matchesSearchQuery = customerName.includes(searchQuery.toLowerCase());
        const matchesCenter = centerFilter ? application.center === centerFilter : true;
        const matchesCategory = loanCategoryFilter
            ? application.categoryName === loanCategoryFilter
            : true;
        const matchesRoot = rootFilter ? application.rootName === rootFilter : true;

        return matchesSearchQuery && matchesCenter && matchesCategory && matchesRoot;
    });
};

const ActiveLoans = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loanApplications, setLoanApplications] = useState([]);
    const [members, setMembers] = useState([]);
    const [roots, setRoots] = useState([]);
    const [centers, setCenters] = useState([]);
    const [loanCategories, setLoanCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [rootFilter, setRootFilter] = useState("");
    const [centerFilter, setCenterFilter] = useState("");
    const [loanCategoryFilter, setLoanCategoryFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    loansResponse,
                    membersResponse,
                    categoriesResponse,
                    centersResponse,
                    rootsResponse,
                ] = await Promise.all([
                    axios.get(`${apiUrl}/api/loans/approved`),
                    axios.get(`${apiUrl}/api/members`),
                    axios.get(`${apiUrl}/api/loan-types`),
                    axios.get(`${apiUrl}/api/centers`),
                    axios.get(`${apiUrl}/api/roots`),
                ]);

                setLoanApplications(loansResponse.data.data || loansResponse.data);
                setMembers(membersResponse.data.data || membersResponse.data);
                setLoanCategories(categoriesResponse.data.data || categoriesResponse.data);
                setCenters(centersResponse.data.data || centersResponse.data);
                setRoots(rootsResponse.data.data || rootsResponse.data);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    const mapDataToLoan = (loan) => {
        const member = members.find((m) => m._id === loan.member);
        const category = loanCategories.find((c) => c._id === loan.category);
        const root = roots.find((r) => r._name === loan.root);

        return {
            ...loan,
            customerName: member ? member.firstName : "Unknown",
            idNumber: member ? member.nationalId : "Unknown",
            memberCategory: member ? member.memberCategory : "Unknown",
            phone: member ? member.phone : "Unknown",
            branch: member?.branch || loan.branch,
            center: member?.center || loan.center,
            categoryName: category ? category.name : "Unknown",
            rootName: root ? root.name : "Unknown",
            collectorName: root ? root.collector : "Unknown",
        };
    };

    const enrichedLoanApplications = loanApplications.map(mapDataToLoan);

    const filteredApplications = filterLoanApplications(enrichedLoanApplications, {
        searchQuery,
        centerFilter,
        loanCategoryFilter,
        rootFilter,
    });

    const handleView = (loan) => {
        navigate(`/viewloan/${loan._id}`, { state: loan });
    };

    return (
        <div>
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <div className="main-content">
                <div className="loanApplication-page">
                    <div className="loanApplication-header">
                        <h2>Active Loans</h2>
                    </div>

                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search by Customer Name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        {/* Root Filter Dropdown */}
                        <select
                            value={rootFilter}
                            onChange={(e) => setRootFilter(e.target.value)}
                        >
                            <option value="">Filter by Root...</option>
                            {roots.map((root) => (
                                <option key={root._id} value={root.name}>
                                    {root.name}
                                </option>
                            ))}
                        </select>

                        {/* Center Filter Dropdown */}
                        <select
                            value={centerFilter}
                            onChange={(e) => setCenterFilter(e.target.value)}
                        >
                            <option value="">Filter by Center...</option>
                            {centers.map((center) => (
                                <option key={center._id} value={center.name}>
                                    {center.name}
                                </option>
                            ))}
                        </select>

                        {/* Loan Category Filter Dropdown */}
                        <select
                            value={loanCategoryFilter}
                            onChange={(e) => setLoanCategoryFilter(e.target.value)}
                        >
                            <option value="">Filter by Loan Category...</option>
                            {loanCategories.map((category) => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading data...</p>
                    ) : (
                        <table className="loanApplication-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Officer</th>
                                    <th>Branch</th>
                                    <th>Center</th>
                                    <th>Customer Name</th>
                                    <th>ID Number</th>
                                    <th>Loan ID</th>
                                    <th>Phone</th>
                                    <th>Loan Category</th>
                                    <th>Amount Applied</th>
                                    <th>Root</th>
                                    <th>Collector</th>
                                    <th>Member Category</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((application) => (
                                        <tr key={application._id}>
                                            <td>{application.date}</td>
                                            <td>{application.officer}</td>
                                            <td>{application.branch}</td>
                                            <td>{application.center}</td>
                                            <td>{application.customerName}</td>
                                            <td>{application.idNumber}</td>
                                            <td>{application.LoanID}</td>
                                            <td>{application.phone}</td>
                                            <td>{application.categoryName}</td>
                                            <td>{application.amountApplied}</td>
                                            <td>{application.rootName}</td>
                                            <td>{application.collectorName}</td>
                                            <td>{application.memberCategory}</td>
                                            <td>
                                                <button onClick={() => handleView(application)}>
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="14">No loan applications found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActiveLoans;
