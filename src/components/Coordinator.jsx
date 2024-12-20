// Coordinator.js

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaEllipsisV,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import ConfirmationModal from "../utils/ConfirmationModel"; // Import the component

const Coordinator = () => {
  const [coordinators, setCoordinators] = useState([]); // State to store coordinator data
  const [error, setError] = useState(""); // State to manage error messages
  const [loading, setLoading] = useState(true); // State to manage loading
  const [openDropdown, setOpenDropdown] = useState(null); // State to track open dropdown
  const [modalOpen, setModalOpen] = useState(false); // State to track modal visibility
  const [modalAction, setModalAction] = useState(null); // 'approve' or 'delete'
  const [selectedUid, setSelectedUid] = useState(null); // State to track selected coordinator UID

  useEffect(() => {
    const fetchCoordinators = async () => {
      const token = localStorage.getItem("adminAuth"); // Retrieve the token from local storage
      try {
        const response = await axios.get(
          `http://localhost:5002/api/admin/coordinators`, // Ensure the endpoint matches backend
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
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchCoordinators();
  }, []);

  // Delete Coordinator Function
  const deleteCoordinator = async () => {
    if (!selectedUid) return;

    const token = localStorage.getItem("adminAuth"); // Retrieve the token from local storage
    try {
      const response = await axios.delete(
        `http://localhost:5002/api/admin/coordinators/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
            "Content-Type": "application/json", // Ensure the content type is set
          },
          data: { uid: selectedUid }, // Send the uid in the request body
        }
      );
      console.log(response.data.message);
      setError(""); // Clear any existing errors

      // Remove the deleted coordinator from the state
      setCoordinators(
        coordinators.filter((coordinator) => coordinator.uid !== selectedUid)
      );
    } catch (error) {
      setError(
        "Error deleting coordinator: " +
          (error.response ? error.response.data.message : "Please try again.")
      );
      console.error(
        "Error deleting coordinator:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Approve Coordinator Function
  const approveCoordinator = async () => {
    if (!selectedUid) return;

    const token = localStorage.getItem("adminAuth"); // Retrieve the token from local storage
    try {
      const response = await axios.post(
        `http://localhost:5002/api/admin/coordinators/approve`,
        { uid: selectedUid }, // Send the uid in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
            "Content-Type": "application/json", // Ensure the content type is set
          },
        }
      );
      console.log(response.data.message);
      setError(""); // Clear any existing errors

      // Update the coordinator's status in the state
      setCoordinators(
        coordinators.map((coordinator) => {
          if (coordinator.uid === selectedUid) {
            return {
              ...coordinator,
              status: "approved",
              approvedAt: new Date().toISOString(),
            };
          }
          return coordinator;
        })
      );
    } catch (error) {
      setError(
        "Error approving coordinator: " +
          (error.response ? error.response.data.message : "Please try again.")
      );
      console.error(
        "Error approving coordinator:",
        error.response ? error.response.data : error.message
      );
    }
  };

  // Toggle Dropdown Visibility
  const toggleDropdown = (uid) => {
    if (openDropdown === uid) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(uid);
    }
  };

  // Open Modal for Approval or Deletion
  const openModal = (action, uid) => {
    setModalAction(action); // 'approve' or 'delete'
    setSelectedUid(uid);
    setModalOpen(true);
    setOpenDropdown(null); // Close dropdown if open
  };

  // Confirm Action from Modal
  const confirmAction = () => {
    if (modalAction === "approve") {
      approveCoordinator();
    } else if (modalAction === "delete") {
      deleteCoordinator();
    }
    setModalOpen(false);
    setSelectedUid(null);
    setModalAction(null);
  };

  // Cancel Action from Modal
  const cancelAction = () => {
    setModalOpen(false);
    setSelectedUid(null);
    setModalAction(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(event.target)) {
          setOpenDropdown(null);
        }
      });
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Coordinators
      </h1>
      {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-10 w-10 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <span className="text-lg text-gray-700">Loading...</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-blue-500 tracking-wider">
                  Status
                </th>

                {/* New Column */}
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center leading-4 text-blue-500 tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coordinators.length > 0 ? (
                coordinators.map((coordinator) => (
                  <tr key={coordinator.uid}>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800">
                        {coordinator.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-blue-600 flex items-center">
                        <FaEnvelope className="mr-2" />
                        {coordinator.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800 flex items-center">
                        <FaPhone className="mr-2" />
                        {coordinator.phoneNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <div className="text-sm leading-5 text-gray-800 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        {coordinator.city || "N/A"},
                        {coordinator.state || "N/A"},
                        {coordinator.country || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {coordinator.role || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500">
                      {coordinator.status === "approved" ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-200 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center relative flex justify-center items-center">
                      <button
                        onClick={() => toggleDropdown(coordinator.uid)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none h-8 w-8 flex items-center justify-center"
                      >
                        <FaEllipsisV />
                      </button>
                      {openDropdown === coordinator.uid && (
                        <div className="dropdown-menu origin-top-right absolute right-0 mt-2 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          {coordinator.status !== "approved" && (
                            <button
                              onClick={() =>
                                openModal("approve", coordinator.uid)
                              }
                              className="block px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 w-full text-left"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => openModal("delete", coordinator.uid)}
                            className="block px-4 py-2 text-sm text-red-700 hover:bg-red-100 w-full text-left"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-center text-gray-500"
                    colSpan="7"
                  >
                    No coordinators found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalOpen}
        title={
          modalAction === "approve" ? "Confirm Approval" : "Confirm Deletion"
        }
        message={
          modalAction === "approve"
            ? "Are you sure you want to approve this coordinator?"
            : "Are you sure you want to delete this coordinator?"
        }
        onConfirm={confirmAction}
        onCancel={cancelAction}
      />
    </div>
  );
};

export default Coordinator;
