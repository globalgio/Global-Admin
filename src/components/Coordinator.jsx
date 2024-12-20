"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEllipsisV, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import Modal from "react-modal";

const Coordinator = () => {
  const [coordinators, setCoordinators] = useState([]);
  const [filteredCoordinators, setFilteredCoordinators] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'approve', 'delete', or 'viewPayment'
  const [selectedUid, setSelectedUid] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    Modal.setAppElement("body");
  }, []);

  useEffect(() => {
    const fetchCoordinators = async () => {
      const token = localStorage.getItem("adminAuth");
      try {
        const response = await axios.get(`http://localhost:5002/api/admin/coordinators`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data.coordinators)) {
          setCoordinators(response.data.coordinators);
          setFilteredCoordinators(response.data.coordinators);
        } else {
          console.error("Invalid coordinators data:", response.data);
          setCoordinators([]);
          setFilteredCoordinators([]);
        }
      } catch (error) {
        setError(
          "Error fetching coordinators: " +
            (error.response ? error.response.data.message : "Please try again.")
        );
        console.error("Error fetching coordinators:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinators();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCoordinators(coordinators);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const filtered = coordinators.filter((coordinator) =>
        coordinator.name?.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredCoordinators(filtered);
    }
  }, [searchQuery, coordinators]);

  const deleteCoordinator = async () => {
    if (!selectedUid) return;

    const token = localStorage.getItem("adminAuth");
    try {
      const response = await axios.delete(
        `http://localhost:5002/api/admin/coordinators/delete`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: { uid: selectedUid },
        }
      );
      console.log(response.data.message);
      setError("");
      setCoordinators(coordinators.filter((coordinator) => coordinator.uid !== selectedUid));
    } catch (error) {
      setError("Error deleting coordinator: " + (error.response ? error.response.data.message : "Please try again."));
      console.error("Error deleting coordinator:", error.response ? error.response.data : error.message);
    }
  };

  const approveCoordinator = async () => {
    if (!selectedUid) return;

    const token = localStorage.getItem("adminAuth");
    try {
      const response = await axios.post(
        `http://localhost:5002/api/admin/coordinators/approve`,
        { uid: selectedUid },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data.message);
      setError("");
      setCoordinators(
        coordinators.map((coordinator) => {
          if (coordinator.uid === selectedUid) {
            return { ...coordinator, status: "approved", approvedAt: new Date().toISOString() };
          }
          return coordinator;
        })
      );
    } catch (error) {
      setError("Error approving coordinator: " + (error.response ? error.response.data.message : "Please try again."));
      console.error("Error approving coordinator:", error.response ? error.response.data : error.message);
    }
  };

  const toggleDropdown = (uid) => {
    setOpenDropdown((prev) => (prev === uid ? null : uid));
  };

  const openModal = (action, uid) => {
    setSelectedUid(uid);
    setModalAction(action);
    setModalOpen(true);
    setOpenDropdown(null);
  };

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

  const cancelAction = () => {
    setModalOpen(false);
    setSelectedUid(null);
    setModalAction(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll(".dropdown-menu");
      let clickedInsideDropdown = false;
      dropdowns.forEach((dropdown) => {
        if (dropdown.contains(event.target)) {
          clickedInsideDropdown = true;
        }
      });
      if (!clickedInsideDropdown) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchPaymentDetails = async (userId) => {
    const token = localStorage.getItem("adminAuth");
    try {
      const response = await axios.get(
        "https://api.gioi.isrc.org.in/api/admin/coordinators/payment-details?userId=${userId}",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPaymentDetails(response.data.paymentDetails);
      setModalAction("viewPayment");
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching payment details:", error.response || error.message);
      setError("Failed to fetch payment details.");
    }
  };

  // Toggle the search input visibility
  const toggleSearch = () => {
    setSearchVisible((prev) => !prev);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Coordinators</h1>

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
        <div className="">
          <table className="min-w-full bg-white rounded-lg shadow-md relative">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-blue-500 font-semibold tracking-wider relative">
                  <div className="flex items-center space-x-2">
                    <span>Name</span>
                    <button
                      onClick={toggleSearch}
                      className="text-gray-600 hover:text-gray-800 focus:outline-none"
                      title="Search by Name"
                    >
                      <FaSearch />
                    </button>
                  </div>
                  {searchVisible && (
                    <div
                      className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50 p-2"
                      style={{ zIndex: 9999 }}
                    >
                      <input
                        type="text"
                        placeholder="Search name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-blue-500 font-semibold tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-blue-500 font-semibold tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-blue-500 font-semibold tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-blue-500 font-semibold tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-blue-500 font-semibold tracking-wider">
                  Earnings
                </th>
                <th className="px-6 py-3 border-b-2 border-gray-300 text-center text-blue-500 font-semibold tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCoordinators.length > 0 ? (
                filteredCoordinators.map((coordinator) => (
                  <tr key={coordinator.uid} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-800 font-medium">
                        {coordinator.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-blue-600 flex items-center">
                        <FaEnvelope className="mr-2" />
                        {coordinator.email || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-800 flex items-center">
                        <FaPhone className="mr-2" />
                        {coordinator.phoneNumber || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-800 flex items-center">
                        <FaMapMarkerAlt className="mr-2" />
                        {coordinator.city || "N/A"}, {coordinator.state || "N/A"}, {coordinator.country || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-800">
                        {coordinator.category || "N/A"}
                      </div>
                    </td>
                    {/* Earnings Column */}
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                      <div className="text-sm leading-5 text-gray-800">
                        <strong>Total:</strong> {coordinator.totalEarnings || "N/A"}
                        <br />
                        <span className="text-xs text-gray-500">
                          Incentives: {coordinator.totalIncentives || 0}, Bonus: {coordinator.bonusAmount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center relative">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropdown(coordinator.uid)}
                          className="text-gray-600 hover:text-gray-800 focus:outline-none"
                          title="More actions"
                        >
                          <FaEllipsisV />
                        </button>
                        {openDropdown === coordinator.uid && (
                          <div
                            className="dropdown-menu absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-lg z-50"
                            style={{ zIndex: 9999 }}
                          >
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                fetchPaymentDetails(coordinator.uid);
                                setOpenDropdown(null);
                              }}
                            >
                              View Payment Details
                            </button>
                            <button
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                coordinator.status === "approved"
                                  ? "text-gray-400 cursor-not-allowed"
                                  : "text-gray-700 hover:bg-gray-100"
                              }`}
                              onClick={() => {
                                if (coordinator.status !== "approved") {
                                  openModal("approve", coordinator.uid);
                                  setOpenDropdown(null);
                                }
                              }}
                              disabled={coordinator.status === "approved"}
                            >
                              Approve
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                              onClick={() => {
                                openModal("delete", coordinator.uid);
                                setOpenDropdown(null);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-center text-gray-500"
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

      {/* Confirmation Modal for Approve/Delete */}
      <Modal
        isOpen={modalOpen && (modalAction === "approve" || modalAction === "delete")}
        onRequestClose={cancelAction}
        contentLabel="Confirmation Modal"
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">
          {modalAction === "approve" ? "Confirm Approval" : "Confirm Deletion"}
        </h2>
        <p className="mb-6">
          {modalAction === "approve"
            ? "Are you sure you want to approve this coordinator?"
            : "Are you sure you want to delete this coordinator?"}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={cancelAction}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={confirmAction}
            className={`px-4 py-2 ${
              modalAction === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            } text-white rounded`}
          >
            {modalAction === "approve" ? "Approve" : "Delete"}
          </button>
        </div>
      </Modal>

      {/* Modal for Payment Details */}
      <Modal
        isOpen={modalOpen && modalAction === "viewPayment"}
        onRequestClose={() => {
          setModalOpen(false);
          setSelectedUid(null);
          setPaymentDetails(null);
        }}
        contentLabel="Payment Details"
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-20"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
        {paymentDetails ? (
          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>Account Holder Name:</strong> {paymentDetails.accountHolderName || "N/A"}
            </p>
            <p>
              <strong>Bank Name:</strong> {paymentDetails.bankName || "N/A"}
            </p>
            <p>
              <strong>Account Number:</strong> {paymentDetails.accountNumber || "N/A"}
            </p>
            <p>
              <strong>IFSC Code:</strong> {paymentDetails.ifsc || "N/A"}
            </p>
            <p>
              <strong>Branch:</strong> {paymentDetails.branch || "N/A"}
            </p>
            <p>
              <strong>UPI ID:</strong> {paymentDetails.upiId || "N/A"}
            </p>
          </div>
        ) : (
          <p className="text-sm text-gray-700">No payment details available.</p>
        )}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setModalOpen(false);
              setSelectedUid(null);
              setPaymentDetails(null);
            }}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Coordinator;
