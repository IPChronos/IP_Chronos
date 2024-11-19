import React, { useState, useEffect } from "react";
import Calendar from "react-calendar"; // Importăm librăria react-calendar
import "react-calendar/dist/Calendar.css"; // Importăm stilurile pentru calendar

function StudentDashboard() {
  const [currentSection, setCurrentSection] = useState("Home"); // Control pentru navigare
  const [examData, setExamData] = useState({
    date: "",
    time: "",
    room: "",
    subject: "",
    professor: "",
  });
  const [scheduledExams, setScheduledExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date()); // Data selectată în calendar
  const [examDetails, setExamDetails] = useState(null); // Detalii despre examen

  // Preluarea examenelor aprobate
  useEffect(() => {
    const fetchExams = async () => {
      // Simulăm un examen fictiv
      const mockExam = {
        id: 1,
        subject: "Analiza matematica",
        professor: "Prof. Satco Bianca",
        date: new Date(2024, 11, 5, 9, 0), // 5 Decembrie 2024, 9 AM
        room: "Amf. RR",
      };
      // Adăugăm examenul fictiv la lista de examene
      setScheduledExams([mockExam]);
    };
    fetchExams();
  }, []);

  // Actualizează detaliile examenului în funcție de ziua selectată
  useEffect(() => {
    const examForDate = scheduledExams.find(
      (exam) =>
        new Date(exam.date).toDateString() === selectedDate.toDateString()
    );
    setExamDetails(examForDate || null);
  }, [selectedDate, scheduledExams]);

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
      alert("Exam added successfully!");
      setExamData({
        date: "",
        time: "",
        room: "",
        subject: "",
        professor: "",
      });
      // Refresh the exams list
      const updatedExams = await fetch("https://backend-url/student-exams");
      const data = await updatedExams.json();
      setScheduledExams(data);
    } else {
      alert("Failed to add exam. Please try again.");
    }
  };

  const [studentSettings, setStudentSettings] = useState({
    firstName: "",
    lastName: "",
    password: "",
    phone: "",
    email: "",
    group: "",
    faculty: "", // Facultatea selectată
    specialization: "", // Specializarea selectată
    university: "",
    notifications: false,
  });

  const facultatiSiSpecializari = {
    // Faculties and specializations data
    "Facultatea de Inginerie Electrică și Știința Calculatoarelor": [
      "Calculatoare",
      "Calculatoare – DUAL",
      "Electronică Aplicată",
      "Rețele și software de telecomunicații",
      "Sisteme electrice",
      "Sisteme electrice – DUAL",
      "Energetică și tehnologii informatice",
      "Managementul energiei",
      "Automatică şi informatică aplicată",
      "Automatică şi informatică aplicată - DUAL",
      "Echipamente și sisteme de comandă și control pentru autovehicule",
      "Echipamente și sisteme medicale",
    ],
    "Facultatea de Drept și Științe Administrative": [
      "Economia comerțului, turismului și serviciilor",
      "Drept European si International",
      "Administrație Publică",
      "Poliție Locală",
    ],
    "Facultatea de Economie, Administraţie și Afaceri": [
      "Administrarea afacerilor",
      "Finanțe și bănci",
      "Contabilitate și informatică de gestiune",
      "Management",
      "Afaceri internaționale",
      "Informatică economică",
      "Economie generală și comunicare economică",
      "Asistență managerială și administrativă",
      "Matematică informatică",
    ],
    "Facultatea de Educație Fizică și Sport": [
      "Educaţie Fizică şi Sport",
      "Kinetoterapie și motricitate specială",
    ],
    "Facultatea de Inginerie Alimentară": [
      "Ingineria produselor alimentare",
      "Controlul şi expertiza produselor alimentare",
      "Protecția consumatorului și a mediului",
    ],
    "Facultatea de Inginerie Mecanică, Autovehicule și Robotică": [
      "Tehnologia Construcțiilor de Mașini",
      "Tehnologia Construcțiilor de Mașini – DUAL",
      "Mecatronică",
      "Robotică",
      "Inginerie Mecanică",
      "Inginerie Mecanică DUAL",
      "Autovehicule Rutiere",
    ],
    "Facultatea de Istorie și Geografie": [
      "Asistență socială",
      "Geografie",
      "Geografia turismului",
      "Istorie",
      "Relații internaționale și studii europene",
      "Resurse umane",
    ],
    "Facultatea de Litere și Științe ale Comunicării": [
      "Limba şi literatura română – Limbă şi literatură modernă",
      "Limba şi literatura engleză",
      "Limba şi literatura franceză",
      "Limba şi literatura ucrainena",
      "Media digitala",
      "Comunicare și relații publice",
    ],
    "Facultatea de Medicină și Științe Biologice": [
      "Medicină",
      "Asistență medicală generală",
      "Balneofiziokinetoterapie și recuperare",
      "Biochimie",
      "Biologie",
      "Nutriție și dietetică",
      "Tehnică dentară",
    ],
    "Facultatea de Silvicultură": [
      "Silvicultură",
      "Ecologie si Protectia Mediului",
    ],
    "Facultatea de Științe ale Educației": [
      "Pedagogia Invatamantului Primar si Prescolar",
      "Psihologie",
    ],
  };

  // Modificăm valorile setărilor studentului
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStudentSettings((prevSettings) => ({
      ...prevSettings,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Actualizează specializarea în funcție de facultatea selectată
  const handleFacultyChange = (e) => {
    const faculty = e.target.value;
    setStudentSettings((prevSettings) => ({
      ...prevSettings,
      faculty,
      specialization: "", // Resetăm specializarea când schimbăm facultatea
    }));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-900 to-purple-700 text-gray">
        <div className="p-4 text-2xl font-semibold">Chronos - Student</div>
        <ul className="mt-8 space-y-4">
          <li
            onClick={() => setCurrentSection("Home")}
            className={`pl-4 py-2 rounded cursor-pointer ${
              currentSection === "Home" ? "bg-purple-600" : "bg-purple-800"
            }`}
          >
            Home
          </li>
          <li
            onClick={() => setCurrentSection("Exams")}
            className={`pl-4 py-2 rounded cursor-pointer ${
              currentSection === "Exams" ? "bg-purple-600" : "bg-purple-800"
            }`}
          >
            Exams
          </li>
          <li
            onClick={() => setCurrentSection("Settings")}
            className={`pl-4 py-2 rounded cursor-pointer ${
              currentSection === "Settings" ? "bg-purple-600" : "bg-purple-800"
            }`}
          >
            Settings
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {currentSection === "Home" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to Chronos!</h1>
            <div className="flex">
              {/* Calendarul */}
              <div className="mr-6">
                <Calendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  tileClassName={({ date }) => {
                    const hasExam = scheduledExams.some(
                      (exam) =>
                        new Date(exam.date).toDateString() ===
                        date.toDateString()
                    );
                    return hasExam
                      ? "bg-purple-500 text-gray rounded-full"
                      : null;
                  }}
                />
              </div>

              {/* Detalii despre examen */}
              <div className="flex-1 bg-white p-4 rounded shadow">
                <h2 className="text-xl font-semibold mb-2">Detalii examen</h2>
                {examDetails ? (
                  <div>
                    <p>
                      <strong>Subject:</strong> {examDetails.subject}
                    </p>
                    <p>
                      <strong>Professor:</strong> {examDetails.professor}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(examDetails.date).toLocaleString()}
                    </p>
                    <p>
                      <strong>Room:</strong> {examDetails.room}
                    </p>
                  </div>
                ) : (
                  <p>Niciun examen pentru aceasta zi.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {currentSection === "Exams" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Examene planificate</h1>
            <div>
              <ul>
                {scheduledExams.length === 0 ? (
                  <p>Niciun examen planificat</p>
                ) : (
                  scheduledExams.map((exam) => (
                    <li key={exam.id}>
                      <p>
                        <strong>{exam.subject}</strong> - {exam.professor} at{" "}
                        {new Date(exam.date).toLocaleString()} in room{" "}
                        {exam.room}.
                      </p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        )}

        {currentSection === "Settings" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <p>Actualizeaza-ti profilul aici.</p>

            <form className="bg-white p-6 rounded shadow">
              {/* Nume */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Nume</label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full p-2 border rounded"
                  value={studentSettings.firstName}
                  onChange={handleChange}
                  placeholder="Introdu numele:"
                  required
                />
              </div>

              {/* Prenume */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Prenume</label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full p-2 border rounded"
                  value={studentSettings.lastName}
                  onChange={handleChange}
                  placeholder="Introdu prenumele:"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full p-2 border rounded"
                  value={studentSettings.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1 font-medium">Telefon</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full p-2 border rounded"
                  value={studentSettings.phone}
                  onChange={handleChange}
                  placeholder="Introdu numarul de telefon"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Facultatea</label>
                <select
                  name="faculty"
                  className="w-full p-2 border rounded"
                  value={studentSettings.faculty}
                  onChange={handleFacultyChange}
                  required
                >
                  <option value="">Alege facultatea</option>
                  {Object.keys(facultatiSiSpecializari).map((faculty) => (
                    <option key={faculty} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Specializarea */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">Specializarea</label>
                <select
                  name="specialization"
                  className="w-full p-2 border rounded"
                  value={studentSettings.specialization}
                  onChange={handleChange}
                  disabled={!studentSettings.faculty} // Dacă nu este selectată facultatea, dezactivează selectarea specializării
                  required
                >
                  <option value="">Alege specializarea</option>
                  {studentSettings.faculty &&
                    facultatiSiSpecializari[studentSettings.faculty].map(
                      (specialization, index) => (
                        <option key={index} value={specialization}>
                          {specialization}
                        </option>
                      )
                    )}
                </select>
              </div>

              {/* Alte câmpuri */}

              <div className="mb-4">
                <label className="block mb-1 font-medium">Grupa</label>
                <input
                  type="text"
                  name="group"
                  className="w-full p-2 border rounded"
                  value={studentSettings.group}
                  onChange={handleChange}
                  placeholder="Enter group"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-1 font-medium">Parola</label>
                <input
                  type="password"
                  name="password"
                  className="w-full p-2 border rounded"
                  value={studentSettings.password}
                  onChange={handleChange}
                  placeholder="Introdu parola"
                />
              </div>
              {/* Notifications */}
              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  <input
                    type="checkbox"
                    name="notifications"
                    className="mr-2"
                    checked={studentSettings.notifications}
                    onChange={handleChange}
                  />
                  As dori sa primesc notificari legate de programarea examenelor
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
              >
                Salveaza profilul
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
    
  );
}

export default StudentDashboard;