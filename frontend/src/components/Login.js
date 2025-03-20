import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests
import "./Login.css";
import logo from "../assets/images/logo.jpg";
import login from "../assets/images/login.png";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        setLoading(true);
        const { username, password } = formData;
    
        console.log("Form Data:", formData); // Debugging input data
    
        try {
            const response = await axios.post(`${apiUrl}/api/auth/login`, { username, password });
            console.log("Response data:", response.data); // Debugging API response
    
            if (response.status === 200) {
                localStorage.setItem("authToken", response.data.token);
                navigate("/dashboard");
            } else {
                console.error("Login failed:", response);
                alert("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(error.response?.data?.message || "An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <div className="login-container">
            <div className="login-frame">
                <div className="form-section">
                <img src={logo} alt="Loan Management System Logo" className="logo" />
                    <h1>Welcome Back!</h1>
                    <p>Please sign in to Continue</p>
                    <form className="login-form" onSubmit={handleLogin}>
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
                        <div className="remember-me">
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe">Remember Me</label>
                        </div>
                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading ? "Signing In..." : "Sign In Now"}
                        </button>
                    </form>
                </div>

                <div className="image-section">
                    <div className="overlay-box"></div>
                    <div className="image-content">
                        
                        <h2>Arunalu Lanka Loan Management System</h2>
                        <img
                            src={login}
                            alt="login"
                            className="main-image"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;