"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

const SchoolSection = () => {
  const [schools, setSchools] = useState([]); // State to store school data
  const [error, setError] = useState(""); // State to manage error messages

  useEffect(() => {
    const fetchSchools = async () => {
      const token = localStorage.getItem("adminAuth"); // Retrieve the token from local storage
      try {
        const response = await axios.get(
          "http://localhost:5002/api/admin/schools",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          }
        );
        if (response.data && Array.isArray(response.data.school)) {

          setSchools(response.data.school); // Set school data
        } else {
          console.error(
            "Fetched data does not contain a valid school array:",
            response.data
          );
          setSchools([]); // Fallback to empty array
        }
      } catch (error) {
        setError(
          "Error fetching schools: " +
            (error.response ? error.response.data.message : "Please try again.")
        ); // Updated error message
        console.error(
          "Error fetching schools:",
          error.response ? error.response.data : error.message
        ); // Log detailed error
      }
    };

    fetchSchools();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Registered Schools
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {schools.length > 0 ? (
        schools.map((school) => (
          <div key={school.uid} className="border-b py-2">
            <h2 className="text-xl font-semibold">{school.schoolName}</h2>
            <p className="text-gray-700">Principal: {school.principalName}</p>
            <p className="text-gray-700">Email: {school.email || "N/A"}</p>
            <p className="text-gray-700">Created At: {new Date(school.createdAt).toLocaleDateString() || "N/A"}</p>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center py-6">No schools found.</div>
      )}
    </div>
  );
};

export default SchoolSection;
