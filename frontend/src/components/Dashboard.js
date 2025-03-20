import React, { useState, useEffect } from "react";
import { FaPowerOff, FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import axios from "axios";
import "./Dashboard.css";
import { LogOut } from "lucide-react";

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // State for dynamic statistics
  const [branchCount, setBranchCount] = useState(0);
  const [loanCount, setLoanCount] = useState(0);
  const [pendingApplicationsCount, setPendingApplicationsCount] = useState(0);

  // State for pending loans and other data
  const [pendingLoans, setPendingLoans] = useState([]);
  const [loanApplications, setLoanApplications] = useState([]);
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingPendingLoans, setLoadingPendingLoans] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State for user details and settings dropdown
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    role: "Admin",
  });

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Fetch statistics data (branches, loans, pending loans)
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        // Fetch branch count
        const branchResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/branch-count`);
        setBranchCount(branchResponse.data.count);

        // Fetch loan count
        const loansResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/loans/count`);
        setLoanCount(loansResponse.data.loans || loansResponse.data.count);

        // Fetch pending loan applications count
        const pendingLoanResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/loans/pending/count`);
        setPendingApplicationsCount(pendingLoanResponse.data.pendingLoans || 0);

        // Fetch pending loan applications (actual loan data)
        const pendingLoansResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/loans/pending`);
        setPendingLoans(pendingLoansResponse.data);
        setLoadingPendingLoans(false);

        // Fetch all loans and members
        const [loanApplicationsResponse, membersResponse,categoriesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/loans`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/members`),
          axios.get(`${process.env.REACT_APP_API_URL}/api/loan-categories`),
        ]);
       

        setLoanApplications(loanApplicationsResponse.data.data || loanApplicationsResponse.data);
        setMembers(membersResponse.data.data || membersResponse.data);
        setCategories(categoriesResponse.data.data || categoriesResponse.data);


      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    fetchStatistics();
  }, []);

  // Map Member Data to Loans
  const mapMemberData = (loan) => {
    const member = members.find((m) => m._id === loan.member);
    return {
      ...loan,
      customerName: member ? member.firstName : "Unknown",
      idNumber: member ? member.nationalId : "Unknown",
      branch: member ? member.branch : loan.branch, // Fallback to loan's branch if no member data
    };
  };
  const mapCategoryData = (loan) => {
    // Find the category based on the category ID in the loan
    const category = categories.find((c) => c._id === loan.category);
    return {
      ...loan,
      categoryName: category ? category.name : "Unknown", // Default to "Unknown" if no match
    };
  };


  // Enrich loan applications with member and category data
  const enrichedLoanApplications = loanApplications.map((loan) => {
    const withMemberData = mapMemberData(loan);
    return mapCategoryData(withMemberData);
  });

  // Filter loans based on search query and status
  const filteredApplications = enrichedLoanApplications.filter((application) => {
    const customerName = application.customerName || "";
    const isPending = application.status === "Pending"; // Filter only pending loans
    return isPending && customerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Function to handle logout
  const logout = () => {
    // Clear the auth token from localStorage
    localStorage.removeItem("authToken");

    // Redirect to the login page
    window.location.href = "/login";
  };

  // Function to handle loan approval
  const handleApproveLoan = (loanId) => {
    // Handle loan approval logic here (e.g., make an API request to approve the loan)
    console.log(`Loan ${loanId} approved`);
  };

  // Function to handle loan edit
  const handleEditLoan = (loan) => {
    // Handle loan editing logic here (e.g., navigate to a loan edit page or show a modal)
    console.log("Editing loan:", loan);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        toggleLoansDropdown={() => setIsLoansDropdownOpen(!isLoansDropdownOpen)}
        isLoansDropdownOpen={isLoansDropdownOpen}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <h1>Dashboard</h1>
          </div>
          <div className="header-right">
            <div className="settings-menu">
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={logout} // Call logout function here
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Statistics Grid */}
        <section className="stats-grid">
          <StatCard title="Branches" value={branchCount} icon="🏢" />
          <StatCard title="Loans" value={loanCount} icon="💰" />
          <StatCard title="Pending Applications" value={pendingApplicationsCount} icon="⏳" />
        </section>

        {/* Pending Loans Section */}
        <section className="pending-loans-section">
          <h2>Pending Loans</h2>

          {loadingPendingLoans ? (
            <p>Loading pending loans...</p>
          ) : filteredApplications.length > 0 ? (
            <table className="loanApplication-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Officer</th>
                  <th>Branch</th>
                  <th>Loan ID</th>
                  <th>Customer Name</th>
                  <th>ID Number</th>
                  {/* <th>Loan Category</th> */}
                  <th>Amount Applied</th>
                  <th>Status</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.length > 0 ? (
                  filteredApplications.map((application, index) => {
                    const {
                      _id,
                      date,
                      officer,
                      branch,
                      LoanID,
                      customerName,
                      idNumber,
                      // categoryName,
                      amountApplied,
                      status,
                    } = application;

                    return (
                      <tr key={_id || index}>
                        <td>{date}</td>
                        <td>{officer}</td>
                        <td>{branch}</td>
                        <td>{LoanID}</td>
                        <td>{customerName}</td>
                        <td>{idNumber}</td>
                        {/* <td>{categoryName}</td> */}
                        <td>{amountApplied}</td>
                        <td>
                          {status === "Approved" ? (
                            <span>Approved</span>
                          ) : (
                            <span>{status || "Pending"}</span>
                          )}
                        </td>
                        {/* <td>
                          {status !== "Approved" && (
                            <button
                              className="approve-btn"
                              onClick={() => handleApproveLoan(_id)}
                            >
                              Approve
                            </button>
                          )}
                          <button
                            className="edit-btn"
                            onClick={() => handleEditLoan(application)}
                          >
                            Edit
                          </button>
                        </td> */}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="9">No loan applications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <p>No pending loan applications found.</p>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-gray-500">
          <p> Cybernetic &copy;2024 Implement By Cybernectic</p>
        </footer>
      </main>
    </div>
  );
};

// Component for displaying statistics cards
const StatCard = ({ title, value, icon }) => (
  <div className="stat-card">
    <div className="icon">{icon}</div>
    <h2>{value}</h2>
    <p>{title}</p>
  </div>
);

export default Dashboard;