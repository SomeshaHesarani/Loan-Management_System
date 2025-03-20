import React, { useState } from 'react';
import './CenterName.css';
import Sidebar from './Sidebar';
import { jsPDF } from 'jspdf'; // Import jsPDF
import logo from '../assets/images/logo.jpg';

const CenterName = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoansDropdownOpen, setIsLoansDropdownOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [groupFilter, setGroupFilter] = useState('');
    const [centerNameFilter, setCenterNameFilter] = useState('');
    const [paymentAmount, setPaymentAmount] = useState({}); // Store payments for each member

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleLoansDropdown = () => {
        setIsLoansDropdownOpen(!isLoansDropdownOpen);
    };

    const centerData = [
        {
            Group: 'Group 1',
            CenterName: 'Bandarawela 1',
            MemberName: 'john',
            LoanInstalment: '20000',
            LoanAmount: '100000',
            OutstandingAmount: '80000',
            PhoneNumber: '15974590',
            Date1: '2024-11-01', Attendance1: 'Present',
            Date2: '2024-11-08', Attendance2: 'Present',
            Date3: '2024-11-15', Attendance3: 'Present',
            Date4: '2024-11-22', Attendance4: 'Present',
        },
        {
            Group: 'Group 1',
            CenterName: 'Bandarawela 1',
            MemberName: 'hewage',
            LoanInstalment: '20000',
            LoanAmount: '100000',
            OutstandingAmount: '70000',
            PhoneNumber: '0710344937',
            Date1: '2024-11-01', Attendance1: 'Present',
            Date2: '2024-11-08', Attendance2: 'Present',
            Date3: '2024-11-15', Attendance3: 'Present',
            Date4: '2024-11-22', Attendance4: 'Present',
        },
        {
            Group: 'Group 2',
            CenterName: 'Welimada',
            MemberName: 'madusha',
            LoanInstalment: '20000',
            LoanAmount: '100000',
            OutstandingAmount: '90000',
            PhoneNumber: '123456789',
            Date1: '2024-11-01', Attendance1: 'Present',
            Date2: '2024-11-08', Attendance2: 'Present',
            Date3: '2024-11-15', Attendance3: 'Present',
            Date4: '2024-11-22', Attendance4: 'Present',
        },
    ];

    const filterData = (data, groupFilter, centerNameFilter) => {
        return data.filter((item) => {
            const matchesGroup =
                groupFilter === '' || item.Group.toLowerCase().includes(groupFilter.toLowerCase());
            const matchesCenter =
                centerNameFilter === '' || item.CenterName.toLowerCase().includes(centerNameFilter.toLowerCase());
            return matchesGroup && matchesCenter;
        });
    };

    const handlePaymentChange = (memberName, amount) => {
        setPaymentAmount((prev) => ({
            ...prev,
            [memberName]: amount,
        }));
    };

    const filteredData = filterData(centerData, groupFilter, centerNameFilter);

    const groupedFilteredData = filteredData.reduce((groups, center) => {
        const groupName = center.Group;
        if (!groups[groupName]) {
            groups[groupName] = [];
        }
        groups[groupName].push(center);
        return groups;
    }, {});

    const handleDownload = (centerGroup) => {
        if (!centerGroup || centerGroup.length === 0) {
            alert('No data found for this group.');
            return;
        }

        const doc = new jsPDF();

        // Add logo and title
        doc.addImage(logo, 'JPG', 15, 10, 15, 15); // Logo in the top left
        doc.setFontSize(20);
        doc.setFont('Helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        doc.text('Center', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);

        doc.text(`Center Name: ${centerGroup[0].CenterName}`, 15, 50);
        doc.text(`Group: ${centerGroup[0].Group}`, 15, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 50);

        // Table Headers
        const headers = [
            ['Member', 'Loan Instalment', 'Loan Amount', 'Outstanding Amount', 'Phone Number', 'Paid Amount', 'Remaining Balance'],
        ];
        const rows = centerGroup.map((item) => {
            const paidAmount = paymentAmount[item.MemberName] || 0;
            const remainingBalance = Math.max(0, item.OutstandingAmount - paidAmount);
            return [
                item.MemberName || 'N/A',
                item.LoanInstalment || 'N/A',
                item.LoanAmount || 'N/A',
                item.OutstandingAmount || 'N/A',
                item.PhoneNumber || 'N/A',
                paidAmount || '0',
                remainingBalance || '0',
            ];
        });

        // Table Settings
        const startY = 90; // Starting Y position for the table
        doc.autoTable({
            startY: startY,
            head: headers,
            body: rows,
            styles: {
                fontSize: 10,
                cellPadding: 2,
                halign: '', 
            },
            headStyles: {
                fillColor: [41, 128, 185], // Blue header
                textColor: 255, // White text
                fontSize: 8,     // Increase font size for header
            },
            alternateRowStyles: {
                fillColor: [215, 240, 255], // Light blue for alternate rows
            },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 15 },
                2: { cellWidth: 15 },
                3: { cellWidth: 15 },
                4: { cellWidth: 15 },
                5: { cellWidth: 15 },
                6: { cellWidth: 15 },
            },
        });

        // Add Footer
        const finalY = doc.lastAutoTable.finalY; // Y position after the table
        doc.setFont('Helvetica', 'italic');
        doc.setFontSize(10);
        doc.text('Thank you for choosing our service!', 105, finalY + 20, { align: 'center' });
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, 285);

        // Save the PDF
        doc.save(`${centerGroup[0].CenterName}.pdf`);
    };

    const handleViewClick = (groupName) => {
        setSelectedGroup(selectedGroup === groupName ? null : groupName);
    };

    return (
        <div>
            {/* Sidebar */}
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleLoansDropdown={toggleLoansDropdown}
                isLoansDropdownOpen={isLoansDropdownOpen}
            />
            {/* Center Name Page Content */}
            <div className="center-name-content">
                <h2>Center Names</h2>
                {/* Filter Inputs */}
                <div className="filters">
                    <input
                        type="text"
                        placeholder="Filter by Group"
                        value={groupFilter}
                        onChange={(e) => setGroupFilter(e.target.value)}
                        className="filter-input"
                    />
                    <input
                        type="text"
                        placeholder="Filter by Center Name"
                        value={centerNameFilter}
                        onChange={(e) => setCenterNameFilter(e.target.value)}
                        className="filter-input"
                    />
                </div>

                <table className="center-table">
                    <thead>
                        <tr>
                            <th>Group</th>
                            <th>Center Name</th>
                            <th>Member Names</th>
                            <th>Loan Instalments</th>
                            <th>Loan Amounts</th>
                            <th>Outstanding Amounts</th>
                            <th>Phone Numbers</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(groupedFilteredData).map((groupName, index) => (
                            <tr key={index}>
                                <td>{groupName}</td>
                                <td>{groupedFilteredData[groupName][0].CenterName}</td>
                                <td>
                                    {groupedFilteredData[groupName].map((center, idx) => (
                                        <div key={idx}>{center.MemberName}</div>
                                    ))}
                                </td>
                                <td>
                                    {groupedFilteredData[groupName].map((center, idx) => (
                                        <div key={idx}>{center.LoanInstalment}</div>
                                    ))}
                                </td>
                                <td>
                                    {groupedFilteredData[groupName].map((center, idx) => (
                                        <div key={idx}>{center.LoanAmount}</div>
                                    ))}
                                </td>
                                <td>
                                    {groupedFilteredData[groupName].map((center, idx) => (
                                        <div key={idx}>{center.OutstandingAmount}</div>
                                    ))}
                                </td>
                                <td>
                                    {groupedFilteredData[groupName].map((center, idx) => (
                                        <div key={idx}>{center.PhoneNumber}</div>
                                    ))}
                                </td>
                                <td>
                                    <button
                                        className="edit-btn"
                                        onClick={() => handleViewClick(groupName)}
                                    >
                                        View
                                    </button>
                                    <button
                                        className="download-btn"
                                        onClick={() => handleDownload(groupedFilteredData[groupName])}
                                    >
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Show member details when "View" button is clicked */}
                {selectedGroup && (
                    <div className="member-details">
                        <h3>Member Details for {selectedGroup}</h3>
                        <table className="center-table">
                            <thead>
                                <tr>
                                    <th>Member Name</th>
                                    <th>Loan Instalment</th>
                                    <th>Loan Amount</th>
                                    <th>Outstanding Amount</th>
                                    <th>Phone Number</th>
                                    <th>Paid Amount</th>
                                    <th>Remaining Balance</th>
                                    <th>Dates</th>
                                    <th>Attendance</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groupedFilteredData[selectedGroup].map((member, index) => (
                                    <tr key={index}>
                                        <td>{member.MemberName}</td>
                                        <td>{member.LoanInstalment}</td>
                                        <td>{member.LoanAmount}</td>
                                        <td>{member.OutstandingAmount}</td>
                                        <td>{member.PhoneNumber}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={paymentAmount[member.MemberName] || 0}
                                                onChange={(e) => handlePaymentChange(member.MemberName, e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            {Math.max(0, member.OutstandingAmount - (paymentAmount[member.MemberName] || 0))}
                                        </td>
                                        <td>
                                            {member.Date1}, {member.Date2}, {member.Date3}, {member.Date4}
                                        </td>
                                        <td>
                                            {member.Attendance1}, {member.Attendance2}, {member.Attendance3}, {member.Attendance4}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button
                            className="update-btn"
                            onClick={() => handleViewClick(selectedGroup)}
                        >
                            Update
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CenterName;
