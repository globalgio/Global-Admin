"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

const StudentsSection = () => {
  const [students, setStudents] = useState([]); // State to store student data
  const [isEditing, setIsEditing] = useState(false); // State to manage edit popup visibility
  const [currentStudent, setCurrentStudent] = useState(null); // State to store the student being edited

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5002/api/admin/students"
        );

        // Correctly extract the students array from the response
        if (response.data && Array.isArray(response.data.students)) {
          setStudents(response.data.students); // Set student data
          console.log(response.data.students); // Log the students data
        } else {
          console.error(
            "Fetched data does not contain a valid students array:",
            response.data
          );
          setStudents([]); // Fallback to empty array
        }
      } catch (error) {
        console.error("Error fetching students:", error.message); // Log any errors
      }
    };

    fetchStudents();
  }, []);

  const handleEditClick = (student) => {
    setCurrentStudent(student); // Set the current student to be edited
    setIsEditing(true); // Show the edit popup
  };

  const handleClosePopup = () => {
    setIsEditing(false); // Close the edit popup
    setCurrentStudent(null); // Clear the current student
  };

  const handleSaveChanges = async (updatedStudent) => {
    try {
      await axios.put(`http://localhost:5002/api/admin/students/${updatedStudent.id}`, updatedStudent);
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      handleClosePopup(); // Close the popup after saving changes
    } catch (error) {
      console.error("Error updating student:", error.message);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      {/* Section Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Students</h1>
      <p className="text-gray-600 mb-6">
        Here you can find the list of students enrolled in the program.
      </p>

      {/* Table Header */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4 text-gray-700 font-semibold text-sm border-b pb-3">
        <span>Name</span>
        <span>Standard</span>
        <span>Count</span>
        <span>Practice Rankings</span>
        <span>Final Rankings</span>
        <span>Payment Status</span>
        <span>Credential ID</span>
        <span>Edit</span>
      </div>

      {/* Table Rows */}
      {students.length > 0 ? (
        students.map((student, index) => (
          <div
            key={index}
            className={`grid grid-cols-1 md:grid-cols-8 gap-4 text-gray-800 text-sm py-3 border-b last:border-none relative ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }`}
          >
            <span>{student.name}</span>
            <span>{student.standard}</span>
            <span>{student.count || "-"}</span>
            <span>{student.practiceRanking || "-"}</span>
            <span>{student.finalRanking || "-"}</span>
            <span>{student.paymentStatus || "Unpaid"}</span>
            <span>{student.credentialId || "N/A"}</span>
            <span>
              <button className="text-blue-500 hover:underline" onClick={() => handleEditClick(student)}>Edit</button>
            </span>
          </div>
        ))
      ) : (
        <div className="text-gray-500 text-center py-6">No students found.</div>
      )}

      {/* Edit Popup */}
      {isEditing && currentStudent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSaveChanges(currentStudent);
            }}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Standard</label>
                <input
                  type="text"
                  value={currentStudent.standard}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, standard: e.target.value })}
                  required
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Count</label>
                <input
                  type="number"
                  value={currentStudent.count}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, count: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Practice Rankings</label>
                <input
                  type="text"
                  value={currentStudent.practiceRanking}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, practiceRanking: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Final Rankings</label>
                <input
                  type="text"
                  value={currentStudent.finalRanking}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, finalRanking: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Payment Status</label>
                <input
                  type="text"
                  value={currentStudent.paymentStatus}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, paymentStatus: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Credential ID</label>
                <input
                  type="text"
                  value={currentStudent.credentialId}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, credentialId: e.target.value })}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={handleClosePopup} className="mr-4 text-gray-500">Cancel</button>
                <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsSection;
