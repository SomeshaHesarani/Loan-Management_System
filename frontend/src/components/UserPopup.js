import React, { useEffect, useState } from "react";
import "./UserPopup.css";

const UserPopup = ({ onClose }) => {
    const [userDetails, setUserDetails] = useState(null);
    const [error, setError] = useState("");

    // Fetch user details after the component mounts
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    setError("No token found. Please log in.");
                    return;
                }

                const response = await fetch("http://localhost:4000/api/user-details", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`, // Send JWT token in Authorization header
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Failed to fetch user details");
                }

                const data = await response.json();
                setUserDetails(data);  // Set the user details in state
            } catch (error) {
                setError(error.message);
            }
        };

        fetchUserDetails();
    }, []);  // Empty dependency array to run once when the component mounts

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-header">
                    <h2>User Information</h2>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </div>

                {/* Display user details or error */}
                {error && <p className="error">{error}</p>}
                {userDetails ? (
                    <div className="user-details">
                        <p><strong>Name:</strong> {userDetails.name}</p>
                        <p><strong>Username:</strong> {userDetails.username}</p>
                        <p><strong>Role:</strong> {userDetails.role}</p>
                    </div>
                ) : (
                    <p>Loading user details...</p>
                )}
            </div>
        </div>
    );
};

export default UserPopup;
