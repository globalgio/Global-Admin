"use client"
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation

const Login = () => {
  const router = useRouter(); // Initialize the router
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
 

    try {
      const response = await axios.post(
        "https://api.gioi.isrc.org.in/api/admin/login",
        { email, password }
      );
      // Store admin auth token in local storage
      localStorage.setItem('adminAuth', response.data.token); // Assuming the token is returned in response.data.token
      setSuccess("Login successful!");
      router.push('/'); // Redirect to the home route after successful login
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
