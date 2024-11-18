import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";

function StudentDashboard() {
  const [examData, setExamData] = useState({
    date: "",
    time: "",
    room: "",
    subject: "",
    professor: "",
  });
  const [scheduledExams, setScheduledExams] = useState([]);

  // Preluarea examenelor aprobate
  useEffect(() => {
    const fetchExams = async () => {
      const response = await fetch("https://backend-url/student-exams");
      const data = await response.json();
      setScheduledExams(data);
    };
    fetchExams();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://backend-url/add-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(examData),
    });

    if (response.ok) {
      alert("Exam submitted for approval!");
      setExamData({
        date: "",
        time: "",
        room: "",
        subject: "",
        professor: "",
      });
    } else {
      alert("Failed to submit exam. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="flex gap-8">
        {/* Formul pentru adăugare examen */}
        <form
          className="w-1/3 bg-white p-6 rounded shadow"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-semibold mb-4">Add Exam</h2>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              value={examData.date}
              onChange={(e) =>
                setExamData({ ...examData, date: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Time</label>
            <input
              type="time"
              className="w-full p-2 border rounded"
              value={examData.time}
              onChange={(e) =>
                setExamData({ ...examData, time: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Room</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={examData.room}
              onChange={(e) =>
                setExamData({ ...examData, room: e.target.value })
              }
              placeholder="Room number"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Subject</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={examData.subject}
              onChange={(e) =>
                setExamData({ ...examData, subject: e.target.value })
              }
              placeholder="Subject name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Professor</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={examData.professor}
              onChange={(e) =>
                setExamData({ ...examData, professor: e.target.value })
              }
              placeholder="Professor name"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
          >
            Submit Exam
          </button>
        </form>

        {/* Calendar */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Scheduled Exams</h2>
          <Calendar exams={scheduledExams} />
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
