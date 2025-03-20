import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        role: "user", // Default role is "user"
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
    
        setLoading(true);
        setMessage("");
        setError("");
    
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/register`,
                formData
            );
    
            if (response.status === 201) {
                setMessage("Registration successful! You can now log in.");
            }
        } catch (error) {
            console.error("Registration error:", error);
            setError(error.response?.data?.error || "An error occurred during registration. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="register-container">
            <h1>Register</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            <form className="register-form" onSubmit={handleRegister}>
                <div className="input-group">
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        name="role"
                        placeholder="Role (e.g., user, admin, manager)"
                        value={formData.role}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn-register" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
};

export default Register;
