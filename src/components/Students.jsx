"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentsSection = () => {
  const [students, setStudents] = useState([]); // Original student data
  const [filteredStudents, setFilteredStudents] = useState([]); // Filtered student data
  const [searchTerm, setSearchTerm] = useState(""); // Search term for name
  const [scoreFilter, setScoreFilter] = useState("all"); // all, practice, or live
  const [selectedStandard, setSelectedStandard] = useState("All"); // Filter for standard
  const [isEditing, setIsEditing] = useState(false); // Edit popup visibility
  const [currentStudent, setCurrentStudent] = useState(null); // Student being edited
  const [sortOrder, setSortOrder] = useState("high-to-low"); // Sorting order for scores
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const studentsPerPage = 10; // Number of students per page
  const [startAfter, setStartAfter] = useState(null);
  // Fetch all students data
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/admin/students",
          {
            params: {
              limit: studentsPerPage,
              startAfter, // Pass the startAfter value for pagination
            },
          }
        );
        if (response.data && Array.isArray(response.data.students)) {
          setStudents(response.data.students);
          setFilteredStudents(response.data.students);
        }
      } catch (error) {
        console.error("Error fetching students:", error.message);
      }
    };
    fetchStudents();
  }, [startAfter]);

  useEffect(() => {
    let tempStudents = [...students]; // Initialize with a copy of students

    // Search by name or school name
    if (searchTerm) {
      tempStudents = tempStudents.filter(
        (student) =>
          (student.name &&
            student.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (student.schoolName &&
            student.schoolName.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by standard
    if (selectedStandard !== "All") {
      tempStudents = tempStudents.filter(
        (student) => student.standard?.toString() === selectedStandard
      );
    }

    // Sort by score
    tempStudents.sort((a, b) => {
      const getScore = (student, type) => {
        const practiceScore = student.marks?.mock
          ? Object.values(student.marks.mock)?.[0]?.score || 0
          : 0;
        const liveScore = student.marks?.live
          ? Object.values(student.marks.live)?.[0]?.score || 0
          : 0;

        if (type === "practice") return practiceScore;
        if (type === "live") return liveScore;
        return practiceScore + liveScore;
      };

      const scoreA = getScore(a, scoreFilter);
      const scoreB = getScore(b, scoreFilter);

      return sortOrder === "high-to-low" ? scoreB - scoreA : scoreA - scoreB;
    });

    setFilteredStudents(tempStudents);
  }, [searchTerm, selectedStandard, scoreFilter, sortOrder, students]);

  const handleEditClick = (student) => {
    setCurrentStudent(student);
    setIsEditing(true);
  };

  const handleClosePopup = () => {
    setIsEditing(false);
    setCurrentStudent(null);
  };

  const handleSaveChanges = async (updatedStudent) => {
    try {
      const token = localStorage.getItem("adminAuth"); // Get token from localStorage

      const response = await axios.post(
        `http://localhost:5002/api/admin/adminreq/students`,
        updatedStudent,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to headers
          },
        }
      );

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.uid === updatedStudent.uid ? response.data.user : student
        )
      );
      setFilteredStudents((prevFiltered) =>
        prevFiltered.map((student) =>
          student.uid === updatedStudent.uid ? response.data.user : student
        )
      );

      alert("Student updated successfully!");
      handleClosePopup();
    } catch (error) {
      console.error("Error updating student:", error.message);
      alert("Failed to update student.");
    }
  };

  const handleDeleteStudent = async (uid) => {
    console.log("Deleting student with UID:", uid); // Debugging to confirm correct UID
    const token = localStorage.getItem("adminAuth"); // Fetch token

    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.post(
          "http://localhost:5002/api/admin/adminreq/students",
          { uid, deleteAccount: true }, // Correct JSON payload
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update state after deletion
        setStudents((prevStudents) =>
          prevStudents.filter((student) => student.uid !== uid)
        );
        setFilteredStudents((prevFiltered) =>
          prevFiltered.filter((student) => student.uid !== uid)
        );

        alert("Student deleted successfully!");
      } catch (error) {
        console.error(
          "Error deleting student:",
          error.response?.data || error.message
        );
        alert("Failed to delete student.");
      }
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setStartAfter(filteredStudents[(pageNumber - 1) * studentsPerPage]?.uid); // Set the startAfter to the last student's UID
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Students</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by name or school name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        />

        {/* Score Filter */}
        <select
          value={scoreFilter}
          onChange={(e) => setScoreFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">All Scores</option>
          <option value="practice">Practice Score</option>
          <option value="live">Live Score</option>
        </select>

        {/* Sorting Order */}
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="high-to-low">High to Low</option>
          <option value="low-to-high">Low to High</option>
        </select>

        {/* Standard Filter */}
        <select
          value={selectedStandard}
          onChange={(e) => setSelectedStandard(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="All">All Standards</option>
          {[5, 6, 7, 8, 9, 10].map((std) => (
            <option key={std} value={std}>
              Standard {std}
            </option>
          ))}
        </select>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-1 md:grid-cols-11 gap-4 text-gray-700 font-semibold text-sm border-b pb-3">
        <span>Name</span>
        <span>Username</span>
        <span>Standard</span>
        <span>School Name</span>
        <span>Scores</span>
        <span>Global Rank</span>
        <span>Country Rank</span>
        <span>State Rank</span>
        <span>Credential ID</span>
        <span>Payment Status</span>
        <span>Edit</span>
      </div>

      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => {
          const practiceScore = student.marks?.mock
            ? Object.values(student.marks.mock)?.[0]?.score || "N/A"
            : "N/A";

          const liveScore = student.marks?.live
            ? Object.values(student.marks.live)?.[0]?.score || "N/A"
            : "N/A";

          return (
            <div
              key={student.uid}
              className="grid grid-cols-1 md:grid-cols-11 gap-4 text-gray-800 text-sm py-3 border-b last:border-none"
            >
              {/* Student Name */}
              <span>{student.name || "N/A"}</span>

              {/* Username */}
              <span>{student.username || "N/A"}</span>

              {/* Standard */}
              <span>{student.standard || "N/A"}</span>

              {/* School Name */}
              <span>{student.schoolName || "N/A"}</span>

              {/* Scores Section */}
              <span>
                {scoreFilter === "practice" && (
                  <div>
                    <strong>Practice: </strong>
                    {student.marks?.mock
                      ? Object.values(student.marks.mock)?.[0]?.score || "N/A"
                      : "N/A"}
                  </div>
                )}
                {scoreFilter === "live" && (
                  <div>
                    <strong>Live: </strong>
                    {student.marks?.live
                      ? Object.values(student.marks.live)?.[0]?.score || "N/A"
                      : "N/A"}
                  </div>
                )}
                {scoreFilter === "all" && (
                  <div>
                    <strong>Practice: </strong>
                    {student.marks?.mock
                      ? Object.values(student.marks.mock)?.[0]?.score || "N/A"
                      : "N/A"}
                    <br />
                    <strong>Live: </strong>
                    {student.marks?.live
                      ? Object.values(student.marks.live)?.[0]?.score || "N/A"
                      : "N/A"}
                  </div>
                )}
              </span>

              {/* Global Rank */}
              <span>{student.ranks?.live?.global?.rank || "N/A"}</span>

              {/* Country Rank */}
              <span>{student.ranks?.live?.country?.rank || "N/A"}</span>

              {/* State Rank */}
              <span>{student.ranks?.live?.state?.rank || "N/A"}</span>

              {/* Credential ID */}
              <span>{student.certificateCodes?.code || "N/A"}</span>

              {/* Payment Status */}
              <span>{student.paymentStatus || "Unpaid"}</span>

              {/* Edit Button */}
              <span>
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleEditClick(student)}
                >
                  Edit
                </button>
              </span>
            </div>
          );
        })
      ) : (
        <div className="text-gray-500 text-center py-6">No students found.</div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(filteredStudents.length / studentsPerPage) },
          (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 mx-1 border rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>

      {isEditing && currentStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
              Edit Student Details
            </h2>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveChanges(currentStudent);
              }}
            >
              {/* Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {Object.keys(currentStudent).map((key) => {
                  const value = currentStudent[key];
                  const displayValue =
                    typeof value === "object" && value !== null
                      ? JSON.stringify(value, null, 2)
                      : value;

                  return (
                    <div key={key} className="flex flex-col">
                      {/* Label */}
                      <label className="block text-gray-600 capitalize font-medium mb-1">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </label>

                      {/* Input Field */}
                      <textarea
                        rows={displayValue?.length > 50 ? 3 : 1}
                        value={displayValue || ""}
                        onChange={(e) =>
                          setCurrentStudent({
                            ...currentStudent,
                            [key]: e.target.value,
                          })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm transition"
                      ></textarea>
                    </div>
                  );
                })}
              </div>

              {/* Buttons */}
              <div className="flex justify-between mt-8">
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => handleDeleteStudent(currentStudent.uid)} // Use currentStudent.uid
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                >
                  Delete
                </button>

                {/* Save and Cancel Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow-md"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsSection;
