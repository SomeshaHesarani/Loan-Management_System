import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Members from './components/MemberPage/Members';
import Dashboard from './components/Dashboard';
import LoanApplications from './components/LoanApplication/LoanApplications';
import AddMember from './components/MemberPage/AddMember';
import Login from './components/Login';
import AddApplication from './components/LoanApplication/AddApplication';
import ActiveLoans from './components/ActiveLoans/ActiveLoans';
import ViewLoan from './components/ActiveLoans/ViewLoan';
import RepaymentPage from './components/RepaymentPage';
import ViewRepayment from './components/ViewRepayment';
import MemberEdit from './components/MemberPage/MemberEdit';
import EditLoanApplication from './components/LoanApplication/EditLoanApplication';
import CenterName from './components/CenterName';
import RootAssign from './components/RootAssign';
import CenterManagement from './components/CenterManagement';
import BranchManagement from './components/BranchManagement';
import Register from './components/Register';
import LoanCategory from './components/LoanCategory';
import MicroLoanPage from "./components/micrololan";
import Holiday from "./components/Holiday.js";
import InterestandPenalty from "./components/InterestandPenalty";
import BlacklistCustomer from "./components/BlacklistCustomer";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Redirect '/' to '/login' */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/members" element={<Members />} />
                <Route path="/categories" element={<LoanCategory />} />
                <Route path="/loanApplications" element={<LoanApplications />} />
                <Route path="/addnewapplication" element={<AddApplication />} />
                <Route path="/addmember" element={<AddMember />} />
                <Route path="/activeLoans" element={<ActiveLoans />} />
                <Route path="/viewloan/:loanId" element={<ViewLoan />} />
                <Route path="/repayment" element={<RepaymentPage />} />
                <Route path="/repayments/:loanId" element={<ViewRepayment />} />
                <Route path="/editmember" element={<MemberEdit />} />
                <Route path="/editloanapplication/:id" element={<EditLoanApplication />} />
                <Route path="/centername" element={<CenterName />} />
                <Route path="/rootassign" element={<RootAssign />} />
                <Route path="/microloans" element={<MicroLoanPage />} />
                <Route path="/center-management" element={<CenterManagement />} />
                <Route path="/branch-management" element={<BranchManagement />} />
                <Route path="/holiday" element={<Holiday />} />
                <Route path="/interestandpenalty" element={<InterestandPenalty />} />
                <Route path="/blacklistcustomer" element={<BlacklistCustomer />} />
                {/* Add the route for RegisterForm */}
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
