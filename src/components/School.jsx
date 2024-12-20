"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

const SchoolSection = () => {
  const [schools, setSchools] = useState([]); // State to store school data
  const [error, setError] = useState(""); // State to manage error messages
  const [editingSchool, setEditingSchool] = useState(null); // State to manage the school being edited
  const [updatedSchoolName, setUpdatedSchoolName] = useState(""); // State for updated school name
  const [updatedPrincipalName, setUpdatedPrincipalName] = useState(""); // State for updated principal name
  const [updatedEmail, setUpdatedEmail] = useState(""); // State for updated email

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
        console.log("Fetched schools data:", response.data); // Log the fetched data
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

  const handleEdit = (school) => {
    setEditingSchool(school.uid);
    setUpdatedSchoolName(school.schoolName);
    setUpdatedPrincipalName(school.principalName);
    setUpdatedEmail(school.email || "");
  };

  const handleSave = async (uid) => {
    const token = localStorage.getItem("adminAuth");
    try {
      const response = await axios.post(
        `http://localhost:5002/api/admin/schools/update-or-delete`,
        {
          uid,
          schoolName: updatedSchoolName,
          principalName: updatedPrincipalName,
          email: updatedEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchools((prevSchools) =>
        prevSchools.map((school) =>
          school.uid === uid
            ? {
                ...school,
                schoolName: updatedSchoolName,
                principalName: updatedPrincipalName,
                email: updatedEmail,
              }
            : school
        )
      );
      setEditingSchool(null);
    } catch (error) {
      console.error("Error updating school:", error);
      setError("Error updating school. Please try again.");
    }
  };

  const handleDelete = async (uid) => {
    const token = localStorage.getItem("adminAuth");
    try {
      const response = await axios.post(
        `http://localhost:5002/api/admin/schools/update-or-delete`,
        { uid, deleteSchool: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSchools((prevSchools) =>
        prevSchools.filter((school) => school.uid !== uid)
      );
    } catch (error) {
      console.error("Error deleting school:", error);
      setError("Error deleting school. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingSchool(null);
    setUpdatedSchoolName("");
    setUpdatedPrincipalName("");
    setUpdatedEmail("");
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Registered Schools
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {schools.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="border-b py-2 text-left">School Name</th>
              <th className="border-b py-2 text-left">Principal</th>
              <th className="border-b py-2 text-left">Email</th>
              <th className="border-b py-2 text-left">Created At</th>
              <th className="border-b py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr key={school.uid} className="border-b">
                <td className="py-2">
                  {editingSchool === school.uid ? (
                    <input
                      type="text"
                      value={updatedSchoolName}
                      onChange={(e) => setUpdatedSchoolName(e.target.value)}
                      className="border rounded p-1"
                    />
                  ) : (
                    school.schoolName
                  )}
                </td>
                <td className="py-2">
                  {editingSchool === school.uid ? (
                    <input
                      type="text"
                      value={updatedPrincipalName}
                      onChange={(e) => setUpdatedPrincipalName(e.target.value)}
                      className="border rounded p-1"
                    />
                  ) : (
                    school.principalName
                  )}
                </td>
                <td className="py-2">
                  {editingSchool === school.uid ? (
                    <input
                      type="email"
                      value={updatedEmail}
                      onChange={(e) => setUpdatedEmail(e.target.value)}
                      className="border rounded p-1"
                    />
                  ) : (
                    school.email || "N/A"
                  )}
                </td>
                <td className="py-2">
                  {new Date(school.createdAt).toLocaleDateString() || "N/A"}
                </td>
                <td className="py-2">
                  {editingSchool === school.uid ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSave(school.uid)}
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(school)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(school.uid)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-500 text-center py-6">No schools found.</div>
      )}
    </div>
  );
};

export default SchoolSection;
