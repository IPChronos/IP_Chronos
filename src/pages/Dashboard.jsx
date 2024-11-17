import React, { useState } from "react";

function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    room: "",
    studentName: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    setAppointments([...appointments, { ...formData, status: "pending" }]);
    setFormData({ date: "", time: "", room: "", studentName: "" });
  };

  const handleStatusChange = (index, status) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].status = status;
    setAppointments(updatedAppointments);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-6">Exam Planner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Student Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Add Exam Appointment</h2>
          <form className="flex flex-col gap-4" onSubmit={handleAddAppointment}>
            <input
              type="text"
              name="studentName"
              placeholder="Your Name"
              value={formData.studentName}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2"
              required
            />
            <input
              type="text"
              name="room"
              placeholder="Room"
              value={formData.room}
              onChange={handleInputChange}
              className="border rounded-lg px-4 py-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Add Appointment
            </button>
          </form>
        </div>

        {/* Professor Section */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Manage Appointments</h2>
          <div className="flex flex-col gap-4">
            {appointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : (
              appointments.map((appointment, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p>
                      <strong>Student:</strong> {appointment.studentName}
                    </p>
                    <p>
                      <strong>Date:</strong> {appointment.date}
                    </p>
                    <p>
                      <strong>Time:</strong> {appointment.time}
                    </p>
                    <p>
                      <strong>Room:</strong> {appointment.room}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span
                        className={`${
                          appointment.status === "accepted"
                            ? "text-green-500"
                            : appointment.status === "rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                        } font-bold`}
                      >
                        {appointment.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                      onClick={() => handleStatusChange(index, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      onClick={() => handleStatusChange(index, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
