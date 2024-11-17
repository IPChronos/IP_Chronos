import React from "react";

function DashboardAdmin() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard, admin!</p>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Manage Users</h2>
        <p className="mt-4">Here you can manage users, add/remove professors, students, etc.</p>
        
        {/* Aici poți adăuga logica de gestionare a utilizatorilor */}
        <button className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Manage Users
        </button>
      </div>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Scheduled Exams</h2>
        <p className="mt-4">You can view and manage scheduled exams here.</p>
        
        {/* Aici poți adăuga logica pentru a vizualiza examenele programate */}
        <button className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          View Exams
        </button>
      </div>
    </div>
  );
}

export default DashboardAdmin;
