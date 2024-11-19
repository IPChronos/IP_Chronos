import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";

function ProfessorDashboard() {
  const [pendingExams, setPendingExams] = useState([]);
  const [approvedExams, setApprovedExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      const response = await fetch("https://backend-url/professor-exams");
      const data = await response.json();
      setPendingExams(data.pending);
      setApprovedExams(data.approved);
    };
    fetchExams();
  }, []);

  const handleApproval = async (examId, status) => {
    const response = await fetch(`https://backend-url/exam/${examId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      alert(`Exam ${status}`);
      setPendingExams((prev) =>
        prev.filter((exam) => exam.id !== examId)
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Professor Dashboard</h1>
      <div className="flex gap-8">
        {/* Exam Approval Section */}
        <div className="w-1/3 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Pending Exams</h2>
          {pendingExams.map((exam) => (
            <div key={exam.id} className="mb-4 border-b pb-2">
              <p>
                <strong>Subject:</strong> {exam.subject}
              </p>
              <p>
                <strong>Student:</strong> {exam.studentName}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleApproval(exam.id, "approved")}
                >
                  Approve
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleApproval(exam.id, "rejected")}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-4">Approved Exams</h2>
          <Calendar exams={approvedExams} />
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;