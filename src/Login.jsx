import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "./store";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const currentUser = useSelector((state) => state.users.currentUser);

  // ✅ Email validation
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) return "Email is required";
    if (!emailRegex.test(value))
      return " Enter valid email with '@')";
    return "";
  };

  // ✅ Password validation (min 6 chars, 1 special, 1 number)
  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
    if (!value) return "Password is required";
    if (!passwordRegex.test(value))
      return "Enter strong password...";
    return "";
  };

  // ✅ Handle email input
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  // ✅ Handle password input
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
  };

  // ✅ Submit
  const handleLogin = (e) => {
    e.preventDefault();

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) return;

    // Dispatch login action
    dispatch(loginUser({ email, password }));
  };

  // ✅ Watch login result
  useEffect(() => {
    if (currentUser) {
      navigate("/"); // redirect to home page
    }
  }, [currentUser, navigate]);

  return (
    <div className="login-container my-5">
      <div className="login-card">
        <h2 className="login-title">🔑 Login</h2>
        <form onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter mail.."
              value={email}
              onChange={handleEmailChange}
              className={emailError ? "input-error" : ""}
              required
            />
            {emailError && <p className="error-text">{emailError}</p>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password.."
              value={password}
              onChange={handlePasswordChange}
              className={passwordError ? "input-error" : ""}
              required
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
          </div>

          <button type="submit" className="login-btn">
            ✅ Login
          </button>
        </form>

        <p className="signup-text">
          Don't have an account?{" "}
          <span className="signup-link" onClick={() => navigate("/signup")}>
            Create Account
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
