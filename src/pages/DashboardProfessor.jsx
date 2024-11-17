import React, { useState } from "react";

function DashboardProfessor() {
  const [examRequests, setExamRequests] = useState([
    { id: 1, student: "Student 1", date: "2024-12-01", time: "10:00", room: "101" },
    { id: 2, student: "Student 2", date: "2024-12-02", time: "14:00", room: "102" },
  ]);

  const handleAccept = (id) => {
    setExamRequests((prevRequests) => 
      prevRequests.filter((request) => request.id !== id)
    );
    console.log(`Exam request ${id} accepted.`);
  };

  const handleReject = (id) => {
    setExamRequests((prevRequests) => 
      prevRequests.filter((request) => request.id !== id)
    );
    console.log(`Exam request ${id} rejected.`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">Professor Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard, professor!</p>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Exam Requests</h2>
        <div className="mt-4">
          {examRequests.length > 0 ? (
            examRequests.map((request) => (
              <div key={request.id} className="flex justify-between items-center p-4 border-b">
                <div>
                  <p className="text-lg">{request.student}</p>
                  <p className="text-sm text-gray-500">{request.date} - {request.time}</p>
                  <p className="text-sm text-gray-500">Room: {request.room}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="mr-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No exam requests pending.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardProfessor;
