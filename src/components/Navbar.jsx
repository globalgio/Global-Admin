"use client"
import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link from Next.js

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [adminToken, setAdminToken] = useState(null); // State to manage admin token

  useEffect(() => {
    // Check localStorage for login status and token
    const token = localStorage.getItem('adminAuth'); // Get adminAuth token from localStorage
    const loggedInStatus = token !== null; // Set loggedInStatus based on token presence
    setIsLoggedIn(loggedInStatus);
    setAdminToken(token);
  }, []);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false'); // Update localStorage on logout
    localStorage.removeItem('adminAuth'); // Remove token on logout
    setIsLoggedIn(false); // Update state
    setAdminToken(null); // Clear token state
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <h1 className="text-white text-2xl font-bold mb-4">Dashboard</h1>
      <ul className="flex space-x-6">
        <li>
          <Link href="/students" className={`text-gray-300 hover:text-white transition duration-200 ${activeLink === 'students' ? 'text-white' : ''}`} onClick={() => handleLinkClick('students')}>Students</Link>
        </li>
        <li>
          <Link href="/schools" className={`text-gray-300 hover:text-white transition duration-200 ${activeLink === 'schools' ? 'text-white' : ''}`} onClick={() => handleLinkClick('schools')}>Schools</Link>
        </li>
        <li>
          <Link href="/coordinator" className={`text-gray-300 hover:text-white transition duration-200 ${activeLink === 'coordinator' ? 'text-white' : ''}`} onClick={() => handleLinkClick('coordinator')}>Coordinator</Link>
        </li>
        <li>
          <Link href="/reference-code" className={`text-gray-300 hover:text-white transition duration-200 ${activeLink === 'reference-code' ? 'text-white' : ''}`} onClick={() => handleLinkClick('reference-code')}>Reference Code</Link>
        </li>
        <li>
          <Link href="/bulk-upload" className={`text-gray-300 hover:text-white transition duration-200 ${activeLink === 'bulk-upload' ? 'text-white' : ''}`} onClick={() => handleLinkClick('bulk-upload')}>Bulk Upload</Link>
        </li>
        {/* Conditional rendering for login/signup/logout */}
        {isLoggedIn ? (
          <li>
            <button onClick={handleLogout} className="text-gray-300 hover:text-white transition duration-200">Logout</button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login" className={`text-gray-300 hover:text-white transition duration-200 ${activeLink === 'login' ? 'text-white' : ''}`} onClick={() => handleLinkClick('login')}>Login</Link>
            </li>
            <li>
              <Link href="/signup" className={`text-gray-300 hover:text-white transition duration-200 ${activeLink === 'signup' ? 'text-white' : ''}`} onClick={() => handleLinkClick('signup')}>Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;