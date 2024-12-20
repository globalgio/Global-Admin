"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const RequestCallback = () => {
    const [callbacks, setCallbacks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCallbacks = async () => {
            const adminAuth = localStorage.getItem("adminAuth");
            if (!adminAuth) {
                alert("Unauthorized access. Please log in.");
                return;
            }

            try {
                const response = await axios.get(
                    "http://localhost:5002/api/admin/request-callbacks",
                    {
                        headers: {
                            Authorization: `Bearer ${adminAuth}`,
                        },
                    }
                );

                setCallbacks(response.data.requestCallbacks);
            } catch (error) {
                console.error("Error fetching callbacks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCallbacks();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="loader border-t-4 border-blue-500 rounded-full w-12 h-12 animate-spin mx-auto"></div>
                    <p className="mt-4 text-lg font-medium text-gray-700">
                        Loading, please wait...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Request Callbacks</h1>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="py-3 px-5 text-left font-medium border-b">Name</th>
                            <th className="py-3 px-5 text-left font-medium border-b">Mobile</th>
                            <th className="py-3 px-5 text-left font-medium border-b">Message</th>
                            <th className="py-3 px-5 text-left font-medium border-b">Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {callbacks.map((callback, index) => (
                            <tr
                                key={callback.id}
                                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                            >
                                <td className="py-3 px-5 border-b text-gray-700">
                                    {callback.name}
                                </td>
                                <td className="py-3 px-5 border-b text-gray-700">
                                    {callback.mobile}
                                </td>
                                <td className="py-3 px-5 border-b text-gray-700">
                                    {callback.message}
                                </td>
                                <td className="py-3 px-5 border-b text-gray-700">
                                    {new Date(callback.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RequestCallback;
