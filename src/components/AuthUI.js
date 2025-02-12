import React, { useState } from "react";
import axios from "axios";

const AuthUI = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Password validation regex
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  // Token format verification
  const isTokenValid = (token) => typeof token === "string" && token.length > 0;

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character."
      );
      return;
    }

    try {
      const url = isSignUp
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";

      const payload = isSignUp
        ? { username, emailOrPhone, password }
        : { username, password };

      const response = await axios.post(url, payload);

      if (!isSignUp) {
        const { token } = response.data;

        if (isTokenValid(token)) {
          localStorage.setItem("authToken", token);
          onLogin({ username, token });
        } else {
          setErrorMessage("Invalid token received!");
          return;
        }
      }

      setUsername("");
      setEmailOrPhone("");
      setPassword("");
      setErrorMessage("");
      setIsSignUp(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Operation failed");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        backgroundImage: "url('./bluebg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#000",
      }}
    >
      <style>
        {`
          .welcome-title {
            font-size: 3rem;
            font-weight: 800;
            color: white;
            margin-bottom: 2rem;
            text-transform: uppercase;
            text-shadow: 4px 4px 6px rgba(0, 0, 0, 0.4);
            animation: fadeSlideDown 2s ease-in-out, colorShift 3s ease-in-out infinite alternate;
          }

          @keyframes fadeSlideDown {
            0% {
              opacity: 0;
              transform: translateY(-30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>

      <h1 className="welcome-title">Welcome to GameNest</h1>

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="relative w-48 h-10 bg-gray-200 rounded-full flex items-center">
            <div
              className={`absolute h-full w-1/2 bg-purple-600 rounded-full transition-transform ${
                isSignUp ? "translate-x-full" : "translate-x-0"
              }`}
            ></div>
            <button
              className={`w-1/2 text-center py-2 z-10 ${
                !isSignUp ? "text-white" : "text-gray-500"
              }`}
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage("");
              }}
            >
              Login
            </button>
            <button
              className={`w-1/2 text-center py-2 z-10 ${
                isSignUp ? "text-white" : "text-gray-500"
              }`}
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage("");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-purple-600 mb-6">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              <input
                type="text"
                placeholder="Enter Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                placeholder="Email or Phone Number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </>
          )}

          {!isSignUp && (
            <input
              type="text"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg focus:outline-none"
          >
            {isSignUp ? "Sign Up" : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthUI;
