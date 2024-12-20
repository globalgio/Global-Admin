import Navbar from '@/components/Navbar';
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto py-10 px-5">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to the Dashboard</h1>
          <p className="mt-4 text-gray-600">
            Here you can manage all your activities, track your progress, and explore available features.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
