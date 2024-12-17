"use client"
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

const Coordinator = () => {
  const [coordinators, setCoordinators] = useState([]); // State to store coordinator data
  const [error, setError] = useState(""); // State to manage error messages

  useEffect(() => {
    const fetchCoordinators = async () => {
      const token = localStorage.getItem("adminAuth"); // Retrieve the token from local storage
      try {
        const response = await axios.get(
          "http://localhost:5002/api/admin/coordinator",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
          }
        );
        if (response.data && Array.isArray(response.data.coordinators)) {
          setCoordinators(response.data.coordinators); // Set coordinator data
        } else {
          console.error(
            "Fetched data does not contain a valid coordinators array:",
            response.data
          );
          setCoordinators([]); // Fallback to empty array
        }
      } catch (error) {
        setError(
          "Error fetching coordinators: " +
            (error.response ? error.response.data.message : "Please try again.")
        ); // Updated error message
        console.error(
          "Error fetching coordinators:",
          error.response ? error.response.data : error.message
        ); // Log detailed error
      }
    };

    fetchCoordinators();
  }, []);

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Coordinators</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {coordinators.length > 0 ? (
        coordinators.map((coordinator) => (
          <div key={coordinator.id} className="border-b py-2">
            <h2 className="text-xl font-semibold">{coordinator.name}</h2>
            <p className="text-gray-700">Email: {coordinator.email || "N/A"}</p>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center py-6">
          No coordinators found.
        </div>
      )}
    </div>
  );
};

export default Coordinator;
