import React, { useState } from "react";

function DashboardStudent() {
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [examRoom, setExamRoom] = useState("");

  const handleAddExam = (e) => {
    e.preventDefault();
    console.log("Exam scheduled:", { examDate, examTime, examRoom });
    // Aici poți adăuga logica pentru a salva examenele
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold">Student Dashboard</h1>
      <p className="mt-4">Welcome to your dashboard, student!</p>

      <div className="mt-6 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold">Schedule an Exam</h2>
        <form onSubmit={handleAddExam} className="mt-4 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Exam Time</label>
            <input
              type="time"
              value={examTime}
              onChange={(e) => setExamTime(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Room</label>
            <input
              type="text"
              value={examRoom}
              onChange={(e) => setExamRoom(e.target.value)}
              placeholder="Enter room number"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="mt-4 py-3 px-6 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            Schedule Exam
          </button>
        </form>
      </div>
    </div>
  );
}

export default DashboardStudent;
