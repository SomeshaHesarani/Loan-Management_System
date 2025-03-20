import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCalendarAlt,
  FaMoneyBillAlt,
  FaBan,
  FaChartBar,
  FaBuilding,
  FaLocationArrow,
  FaAddressCard,
  FaHome,
  FaUserPlus,
} from "react-icons/fa";
import logo from "../assets/images/logo.jpg";
import "./Sidebar.css";

const Sidebar = ({ isSidebarOpen }) => {
  const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleLoansDropdown = () => setIsLoansDropdownOpen(!isLoansDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsLoansDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <div className="logo-content">
        <img src={logo} alt="Logo" className="logo-photo" />
        {isSidebarOpen && <h1 className="brand-name">Loan Manager</h1>}
      </div>
      <ul className="menu">
        <li className="menu-item">
          <Link to="/dashboard" className="menu-link">
            <FaHome className="menu-icon" /> <span>Dashboard</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/register" className="menu-link">
            <FaUserPlus className="menu-icon" /> <span>Register User</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/holiday" className="menu-link">
            <FaCalendarAlt className="menu-icon" /> <span>Holiday</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/branch-management" className="menu-link">
            <FaBuilding className="menu-icon" /><span>Branch Management</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/center-management" className="menu-link">
            <FaLocationArrow className="menu-icon" /> <span>Center Management</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/rootassign" className="menu-link">
            <FaAddressCard className="menu-icon" /> <span>Root Assign</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/categories" className="menu-link">
            <FaUsers className="menu-icon" /> <span>Loan Type</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/members" className="menu-link">
            <FaUsers className="menu-icon" /> <span>Members</span>
          </Link>
        </li>
        <li className="menu-item dropdown-container">
          <div
            className="dropdown"
            onClick={toggleLoansDropdown}
            ref={dropdownRef}
          >
            <span className="dropdown-toggle">
              <FaChartBar className="menu-icon" /> <span>Loans</span>
              <span className="dropdown-arrow">
                {isLoansDropdownOpen ? "▲" : "▼"}
              </span>
            </span>
            {isLoansDropdownOpen && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/loanApplications" className="menu-link">
                    Loan Applications
                  </Link>
                </li>
                <li>
                  <Link to="/activeLoans" className="menu-link">
                    Active Loans
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </li>
        <li className="menu-item">
          <Link to="/repayment" className="menu-link">
            <FaChartBar className="menu-icon" /> <span>Repayment</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/interestandpenalty" className="menu-link">
            <FaMoneyBillAlt className="menu-icon" /> <span>Interest / Penalty</span>
          </Link>
        </li>
        <li className="menu-item">
          <Link to="/blacklistcustomer" className="menu-link">
            <FaBan className="menu-icon" /> <span>Blacklist Customer</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
