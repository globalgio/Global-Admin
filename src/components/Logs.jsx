    "use client";
    import React, { useEffect, useState } from "react";
    import Navbar from "./Navbar";

    const Logs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:5002");
        // / WebSocket server ka URL

        ws.onmessage = (event) => {
        setLogs((prevLogs) => [...prevLogs, event.data]); // Add new log entry
        };

        return () => ws.close(); // Cleanup WebSocket on unmount
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">


        <div className="flex flex-col items-center justify-start py-6 px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Real-Time Logs
            </h1>

            <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-200 border-b border-gray-300">
                <h2 className="text-lg font-semibold text-gray-700">
                Live Log Feed
                </h2>
            </div>
            <div
                id="log-container"
                className="h-96 overflow-y-scroll p-4 text-sm font-mono text-gray-600 bg-gray-50"
            >
                {logs.length > 0 ? (
                logs.map((log, index) => <p key={index}>{log}</p>)
                ) : (
                <p>Connecting to logs...</p>
                )}
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default Logs;
