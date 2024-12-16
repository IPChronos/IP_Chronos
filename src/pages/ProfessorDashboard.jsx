import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function ProfessorDashboard() {
  const [currentSection, setCurrentSection] = useState("Home");
  const [proposedExams, setProposedExams] = useState([]);
  const [approvedExams, setApprovedExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [examDetails, setExamDetails] = useState(null);
  const [newExam, setNewExam] = useState({
    subject: "",
    date: "",
    room: "",
    assistants: [],
  });

  const navigate = useNavigate();
  const userName = "Nume Prenume"; // Exemplu: numele utilizatorului logat

  useEffect(() => {
    const fetchExams = async () => {
      const response = await fetch("https://backend-url/proposed-exams");
      const data = await response.json();
      setProposedExams(data);
    };
    fetchExams();
  }, []);

  useEffect(() => {
    const examForDate = approvedExams.find(
      (exam) =>
        new Date(exam.date).toDateString() === selectedDate.toDateString()
    );
    setExamDetails(examForDate || null);
  }, [selectedDate, approvedExams]);

  const handleAddExam = async (e) => {
    e.preventDefault();

    const response = await fetch("https://backend-url/add-exam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newExam),
    });

    if (response.ok) {
      alert("Examen adăugat cu succes!");
      setNewExam({
        subject: "",
        date: "",
        room: "",
        assistants: [],
      });
    } else {
      alert("A apărut o eroare la adăugarea examenului.");
    }
  };

  const handleLogout = () => {
    // Logica de logout (de ex., eliminarea tokenului de autentificare)
    navigate("/login"); // Redirecționează către pagina de log in
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col justify-between">
        <div>
          <div className="p-4 text-2xl font-semibold">Chronos - Professor</div>
          <div className="p-4 bg-blue-800 rounded mb-4">
            <p className="text-sm">Bine ai venit,</p>
            <p className="text-lg font-bold">{userName}</p>
          </div>
          <ul className="mt-8 space-y-4">
            <li
              onClick={() => setCurrentSection("Home")}
              className={`pl-4 py-2 rounded cursor-pointer ${
                currentSection === "Home" ? "bg-blue-600" : "bg-blue-800"
              }`}
            >
              Home
            </li>
            <li
              onClick={() => setCurrentSection("Exams")}
              className={`pl-4 py-2 rounded cursor-pointer ${
                currentSection === "Exams" ? "bg-blue-600" : "bg-blue-800"
              }`}
            >
              Exams
            </li>
            <li
              onClick={() => setCurrentSection("AddExam")}
              className={`pl-4 py-2 rounded cursor-pointer ${
                currentSection === "AddExam" ? "bg-blue-600" : "bg-blue-800"
              }`}
            >
              Add Exam
            </li>
            <li
              onClick={() => setCurrentSection("Settings")}
              className={`pl-4 py-2 rounded cursor-pointer ${
                currentSection === "Settings" ? "bg-blue-600" : "bg-blue-800"
              }`}
            >
              Settings
            </li>
          </ul>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white p-2 rounded hover:bg-red-700"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Home Section */}
        {currentSection === "Home" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Examene confirmate</h1>
            <div className="flex">
              <div className="mr-6">
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  tileClassName={({ date }) => {
                    const hasExam = approvedExams.some(
                      (exam) =>
                        new Date(exam.date).toDateString() ===
                        date.toDateString()
                    );
                    return hasExam ? "bg-blue-500 text-white rounded-full" : null;
                  }}
                />
              </div>
              <div className="flex-1 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Detalii examen</h2>
                {examDetails ? (
                  <div>
                    <p>
                      <strong>Subject:</strong> {examDetails.subject}
                    </p>
                    <p>
                      <strong>Room:</strong> {examDetails.room}
                    </p>
                    <p>
                      <strong>Assistants:</strong> {examDetails.assistants.join(", ")}
                    </p>
                  </div>
                ) : (
                  <p>Nu exista examene in aceasta zi.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Exam Section */}
        {currentSection === "AddExam" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Adaugă examen nou</h1>
            <form className="bg-white p-6 rounded shadow" onSubmit={handleAddExam}>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Subiect</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Introdu subiectul examenului"
                  value={newExam.subject}
                  onChange={(e) =>
                    setNewExam({ ...newExam, subject: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Data și ora</label>
                <input
                  type="datetime-local"
                  className="w-full p-2 border rounded"
                  value={newExam.date}
                  onChange={(e) => setNewExam({ ...newExam, date: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Sală</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Introdu sala"
                  value={newExam.room}
                  onChange={(e) => setNewExam({ ...newExam, room: e.target.value })}
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Asistenți</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  placeholder="Introdu asistenții, separați prin virgulă"
                  value={newExam.assistants}
                  onChange={(e) =>
                    setNewExam({
                      ...newExam,
                      assistants: e.target.value.split(","),
                    })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
              >
                Adaugă examen
              </button>
            </form>
          </div>
        )}

        {/* Settings Section */}
        {currentSection === "Settings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Setări</h1>
            <form className="bg-white p-6 rounded shadow">
              <div className="mb-4">
                <label className="block mb-1 font-medium">Nume</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Introdu numele" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Prenume</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Introdu prenumele" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">E-mail</label>
                <input type="email" className="w-full p-2 border rounded bg-gray-100" value="vadim.verhovetchii@student.usv.ro" disabled />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Telefon</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Introdu numărul de telefon" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Facultatea</label>
                <select className="w-full p-2 border rounded">
                  <option>Alege facultatea</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Specializarea</label>
                <select className="w-full p-2 border rounded">
                  <option>Alege specializarea</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Grupa</label>
                <input type="text" className="w-full p-2 border rounded" placeholder="Intrați în grup" />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Parola</label>
                <input type="password" className="w-full p-2 border rounded" value="********" disabled />
              </div>
              <div className="mb-4">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  As dori sa primesc notificari legate de programarea examenelor
                </label>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
              >
                Salvează profilul
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfessorDashboard;
