"use client";
import React, { useState } from "react"; // Corrected import statement
import axios from "axios";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BulkSection = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const fileType = selectedFile.name.split(".").pop();
      if (!["xls", "xlsx"].includes(fileType)) {
        toast.error("Invalid file format. Please upload an Excel file.");
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        // 20MB limit
        toast.error("File size exceeds the 20MB limit.");
        return;
      }
      setFile(selectedFile);
      toast.success(`${selectedFile.name} added for upload.`);
    }
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    handleFileChange({ target: { files: [droppedFile] } });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle file upload with progress
  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("adminAuth"); // Get token

      const response = await axios.post(
        "https://api.gioi.isrc.org.in/api/admin/bulk-upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress); // Update upload progress
          },
        }
      );

      if (response.status === 200) {
        toast.success("File uploaded successfully!");
        setFile(null);
        setUploadProgress(0);
      } else {
        toast.error("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("An error occurred during file upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-blue-100 to-blue-200 min-h-screen flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white shadow-2xl rounded-2xl p-10 text-center max-w-lg w-full">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-8">
          Bulk Upload
        </h2>
        <a
          href="/Dummy_Data.xlsx"
          download="bulk-upload-template.xlsx"
          className="text-blue-800 hover:text-blue-900 font-semibold underline mb-6 inline-block"
        >
          Download Bulk Upload Template
        </a>
        <div
          className="border-dashed border-4 border-blue-400 p-10 rounded-xl cursor-pointer hover:bg-blue-100 transition-all duration-300"
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
        >
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col justify-center items-center text-blue-800 hover:text-blue-900 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16M5 12l7 7 7-7"
              />
            </svg>
            <span className="text-xl">
              {file ? file.name : "Click or Drag & Drop your file here"}
            </span>
          </label>
        </div>
        <p className="text-gray-700 mt-4">Formats: .xls, .xlsx</p>
        <p className="text-gray-700 mt-2">
          See the process and video for guidance:
          <Link
            href="https://www.youtube.com/watch?v=6B8zIbeHcK8"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            Watch here
          </Link>
        </p>
        <p className="text-gray-700 mt-4">
          For assistance, contact us at
          <a
            href="https://wa.me/919594402916"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            +91 959 440 2916
          </a>
        </p>
        {file && (
          <div className="mt-8">
            {uploading ? (
              <div>
                <p className="text-lg font-medium">
                  Uploading: {uploadProgress}%
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4 mt-3">
                  <div
                    className="bg-blue-700 h-4 rounded-full transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleFileUpload}
                className="bg-blue-800 text-white px-10 py-3 rounded-xl mt-8 hover:bg-blue-900 transition-all duration-200"
              >
                Upload File
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkSection;
