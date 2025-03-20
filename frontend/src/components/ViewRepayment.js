import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "./ViewRepayment.css";
import logo from "../assets/images/logo.jpg";

const ViewRepayment = () => {
  const { loanId } = useParams();
  const [loanDetails, setLoanDetails] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchRepaymentDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/repayments/${loanId}`);
        const { loanDetails, repaymentHistory } = response.data;

        setLoanDetails(loanDetails);
        setPaymentHistory(repaymentHistory);
      } catch (err) {
        setError("Unable to fetch repayment details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRepaymentDetails();
  }, [loanId, API_URL]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Add logo and title
    doc.addImage(logo, 'JPG', 85, 10, 40, 40);
    doc.setFontSize(24);
    doc.setFont('Helvetica', 'bold');
    doc.setTextColor(0, 0, 128); // Navy blue
    doc.text('Microfinance Loan Management', 105, 60, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont('Helvetica', 'italic');
    doc.setTextColor(100);
    doc.text('Payment Details', 105, 70, { align: 'center' });

    // Loan details section - Moved down to avoid overlap
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(0);
    doc.text(`Loan ID: ${loanId}`, 20, 90);
    doc.text(`Amount Applied: ${loanDetails.amountApplied}`, 20, 100);
    doc.text(`Amount Paid: ${loanDetails.amountPaid}`, 20, 110);
    doc.text(`Outstanding: ${loanDetails.outstanding}`, 20, 120);
    
  

    // Payment History Section
    let yOffset = 150;
    doc.setFontSize(15);
    doc.setFont('Helvetica', 'bold');
    doc.text("Payment History", 20, yOffset);
    yOffset += 10;

    // Add table headers
    doc.setFontSize(10);
    doc.setFont('Helvetica', 'bold');
    const headers = ['#', 'Date', 'Payment Amount', 'Outstanding', 'Payment Method'];
    const columnPositions = [20, 35, 70, 130, 180];
    headers.forEach((header, index) => {
      doc.text(header, columnPositions[index], yOffset);
    });
    yOffset += 10;

    // Loop through payment history and add each record to the PDF
    doc.setFont('Helvetica', 'normal');
    paymentHistory.forEach((history, index) => {
      // Add new page if content exceeds page height
      if (yOffset > 170) {
        doc.addPage();
        yOffset = 15;
      }

      doc.text(`${index + 1}`, columnPositions[0], yOffset);
      doc.text(
        new Date(history.date).toLocaleDateString(),
        columnPositions[1],
        yOffset
      );
      doc.text(history.paymentAmount.toString(), columnPositions[2], yOffset);
      doc.text(history.outstanding.toString(), columnPositions[3], yOffset);
      doc.text(history.PaymentMethod, columnPositions[4], yOffset);
      yOffset += 5;
    });

    // Footer Section
    doc.setFontSize(10);
    doc.setFont("Helvetica", "italic");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 285);
    doc.text('Thank you for using our services!', 105, 285, { align: 'center' });

    // Save the PDF with a dynamic name
    doc.save(`Repayment_Invoice_${loanId}.pdf`);
  };

  const printPage = () => {
    window.print();
  };

  return (
    <div className="view-repayment-container">
      <div className="invoice">
        <header className="invoice-header">
          <img src={logo} alt="logo" className="logo" />
          <h1>Repayment Invoice</h1>
        </header>

        <main className="invoice-body">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              {loanDetails && (
                <section className="loan-details">
                  <h2>Loan Details</h2>
                  <p><strong>Loan ID:</strong> {loanId}</p>
                  <p><strong>Amount Applied:</strong> {loanDetails.amountApplied}</p>
                  <p><strong>Amount Paid:</strong> {loanDetails.amountPaid}</p>
                  <p><strong>Outstanding:</strong> {loanDetails.outstanding}</p>
                  {/* <p>
                    <strong>Next Due Date:</strong>{" "}
                    {loanDetails.nextDueDate
                      ? new Date(loanDetails.nextDueDate).toLocaleDateString()
                      : "N/A"}
                  </p> */}
                </section>
              )}

              <section className="payment-history">
                <h2>Payment History</h2>
                {paymentHistory.length > 0 ? (
                  <table className="payment-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Payment Amount</th>
                        <th>Outstanding</th>
                        <th>Payment Method</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistory.map((history, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {new Date(history.date).toLocaleDateString()}
                          </td>
                          <td>{history.paymentAmount}</td>
                          <td>{history.outstanding}</td>
                          <td>{history.PaymentMethod}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No payment history available.</p>
                )}
              </section>
            </>
          )}
        </main>

        <footer className="invoice-footer">
          <button onClick={downloadPDF}>Download PDF</button>
          <button onClick={printPage}>Print</button>
        </footer>
      </div>
    </div>
  );
};

export default ViewRepayment;
