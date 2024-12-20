"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCopy } from "react-icons/fa";

const ReferenceCodeGenerator = () => {
  const [schoolName, setSchoolName] = useState("");
  const [prefix, setPrefix] = useState("");
  const [error, setError] = useState("");
  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeneratedCodes = async () => {
      const token = localStorage.getItem("adminAuth");
      try {
        const response = await axios.get(
          "http://localhost:5002/api/admin/reference-codes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data && Array.isArray(response.data)) {
          setGeneratedCodes(response.data);
        } else {
          setGeneratedCodes([]);
          console.error(
            "Invalid data format for generated codes:",
            response.data
          );
        }
      } catch (err) {
        setError("Failed to fetch reference codes. Please try again.");
        console.error("Error fetching reference codes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneratedCodes();
  }, []);

  const handleGenerateCode = async () => {
    if (!prefix || !schoolName) {
      setError("Both School Name and Prefix are required");
      return;
    }

    const token = localStorage.getItem("adminAuth");

    try {
      const response = await axios.post(
        "https://api.gioi.isrc.org.in/api/admin/generate-reference-code",
        { prefix, schoolName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const newCode = {
        schoolName,
        referenceCode: response.data.referenceCode,
      };
      setGeneratedCodes((prevCodes) => [...prevCodes, newCode]);
      setError("");
      setSchoolName("");
      setPrefix("");
    } catch (err) {
      setError("Error generating reference code. Please try again.");
      console.error("Error generating reference code:", err);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code.referenceCode);
    alert(`Copied: ${code.referenceCode}`);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Generate Reference Code
      </h1>
      <input
        type="text"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
        placeholder="Enter School Name"
        className="border p-2 mb-4 w-full"
      />
      <input
        type="text"
        value={prefix}
        onChange={(e) => setPrefix(e.target.value)}
        placeholder="Enter Prefix"
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={handleGenerateCode}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Generate Code
      </button>
      {error && <div className="text-red-500 mt-4">{error}</div>}
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Generated Codes:</h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : generatedCodes.length === 0 ? (
          <div className="text-gray-500 mt-2">
            No codes in the database. Please generate a new code.
          </div>
        ) : (
          <table className="min-w-full border-collapse border border-gray-300 mt-2">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">School Name</th>
                <th className="border border-gray-300 p-2">Reference Code</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {generatedCodes.map((code) => (
                <tr key={code.referenceCode}>
                  <td className="border border-gray-300 p-2">
                    {code.schoolName}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {code.referenceCode}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleCopyCode(code)}
                      className="text-blue-500 hover:underline"
                    >
                      <FaCopy />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReferenceCodeGenerator;
