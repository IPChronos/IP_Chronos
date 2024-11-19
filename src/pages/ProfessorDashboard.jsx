import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const facultatiSiSpecializari = {
  "Facultatea de Inginerie Electrică și Știința Calculatoarelor": ["Calculatoare","Calculatoare – DUAL", "Electronică Aplicată", "Rețele și software de telecomunicații", "Sisteme electrice" ,"Sisteme electrice – DUAL", "Energetică și tehnologii informatice", "Managementul energiei", "Automatică şi informatică aplicată", "Automatică şi informatică aplicată - DUAL", "Echipamente și sisteme de comandă și control pentru autovehicule" , "Echipamente și sisteme medicale"
],

  "Facultatea de Drept și Științe Administrative": ["Economia comerțului, turismului și serviciilor","Drept European si International", "Administrație Publică", "Poliție Locală"],

  "Facultatea de Economie, Administraţie și Afaceri": ["Administrarea afacerilor", "Finanțe și bănci", "Contabilitate și informatică de gestiune", "Management", "Afaceri internaționale", "Informatică economică", "Economie generală și comunicare economică", "Asistență managerială și administrativă", "	Matematică  informatică"],

  "Facultatea de Educație Fizică și Sport": ["Educaţie Fizică şi Sport", "Kinetoterapie și motricitate specială"],

  "Facultatea de Inginerie Alimentară": ["Ingineria produselor alimentare", "Controlul şi expertiza produselor alimentare", "Protecția consumatorului și a mediului"],
  
  "Facultatea de Inginerie Mecanică, Autovehicule și Robotică": ["Tehnologia Construcțiilor de Mașini", "Tehnologia Construcțiilor de Mașini – DUAL", "Mecatronică", "Robotică","Inginerie Mecanică", "Inginerie Mecanică DUAL", "Autovehicule Rutiere"],

  "Facultatea de Istorie și Geografie": ["Asistență socială", "Geografie", "Geografia turismului", "Istorie", "Relații internaționale și studii europene", "Resurse umane"],

  "Facultatea de Litere și Științe ale Comunicării": ["Limba şi literatura română – Limbă şi literatură modernă", "Limba şi literatura engleză ", "Limba şi literatura franceză", "Limba şi literatura ucrainena", "Media digitala", "Comunicare și relații publice"],
  
  "Facultatea de Medicină și Științe Biologice": ["Medicină", "Asistență medicală generală", "Balneofiziokinetoterapie și recuperare", "Biochimie", "Biologie", "Nutriție și dietetică", "Tehnică dentară"],

  "Facultatea de Silvicultură": ["Silvicultură", "Ecologie si Protectia Mediului"],

  "Facultatea de Științe ale Educației": ["Pedagogia Invatamantului Primar si Prescolar", "Psihologie"]
};


function ProfessorDashboard() {
  const [currentSection, setCurrentSection] = useState("Home");
  const [proposedExams, setProposedExams] = useState([]);
  const [approvedExams, setApprovedExams] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [examDetails, setExamDetails] = useState(null);
  const [settings, setSettings] = useState({
    name: "",
    surname: "",
    password: "",
    phone: "",
    email: "",
    notifications: false,
    faculties: [],
    specializations: "",
    university: "Universitatea Aleasă",
  });

  const facultiesList = [
    "Facultatea de Drept și Științe Administrative",
    "Facultatea de Economie, Administraţie și Afaceri",
    "Facultatea de Educație Fizică și Sport",
    "Facultatea de Inginerie Alimentară",
    "Facultatea de Inginerie Electrică și Știința Calculatoarelor",
    "Facultatea de Inginerie Mecanică, Autovehicule și Robotică",
    "Facultatea de Istorie și Geografie",
    "Facultatea de Litere și Științe ale Comunicării",
    "Facultatea de Medicină și Științe Biologice",
    "Facultatea de Silvicultură",
    "Facultatea de Științe ale Educației",
  ];

  // Fetch proposed exams
  useEffect(() => {
    const fetchExams = async () => {
      const response = await fetch("https://backend-url/proposed-exams");
      const data = await response.json();
      setProposedExams(data);
    };
    fetchExams();
  }, []);

  // Set exam details for a selected date
  useEffect(() => {
    const examForDate = approvedExams.find(
      (exam) =>
        new Date(exam.date).toDateString() === selectedDate.toDateString()
    );
    setExamDetails(examForDate || null);
  }, [selectedDate, approvedExams]);

  const handleExamApproval = async (examId, updatedDetails) => {
    const response = await fetch('https://backend-url/approve-exam/${examId}', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedDetails),
    });

    if (response.ok) {
      alert("Exam approved successfully!");
      // Refresh exams list
      const data = await response.json();
      setApprovedExams((prev) => [...prev, data]);
      setProposedExams((prev) => prev.filter((exam) => exam.id !== examId));
    } else {
      alert("Failed to approve exam.");
    }
  };
  const handleFacultySelection = (faculty) => {
    const newSelection = settings.faculties.includes(faculty)
      ? settings.faculties.filter((f) => f !== faculty)
      : [...settings.faculties, faculty];

    // Actualizăm starea facultăților și specializărilor
    setSettings({
      ...settings,
      faculties: newSelection,
      specializations: Object.keys(facultatiSiSpecializari)
        .filter((f) => newSelection.includes(f))
        .flatMap((f) => facultatiSiSpecializari[f]),
    });
  };

  const handleSpecializationSelection = (specialization) => {
    const newSpecializations = settings.specializations.includes(specialization)
      ? settings.specializations.filter((s) => s !== specialization)
      : [...settings.specializations, specialization];

    setSettings({ ...settings, specializations: newSpecializations });
  };

  const handleSettingsChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white">
        <div className="p-4 text-2xl font-semibold">Chronos - Professor</div>
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
            onClick={() => setCurrentSection("Settings")}
            className={`pl-4 py-2 rounded cursor-pointer ${
              currentSection === "Settings" ? "bg-blue-600" : "bg-blue-800"
            }`}
          >
            Settings
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Home */}
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
                <h2 className="text-xl font-semibold mb-2">Detalii  examen</h2>
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

        {/* Exams */}
        {currentSection === "Exams" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Examene propuse</h1>
            {proposedExams.length > 0 ? (
              <ul className="space-y-4">
                {proposedExams.map((exam) => (
                  <li
                    key={exam.id}
                    className="bg-white p-4 rounded shadow flex justify-between items-center"
                  >
                    <div>
                      <p>
                        <strong>Student Proposal:</strong> {exam.subject}
                      </p>
                      <p>Date: {exam.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                        onClick={() =>
                          handleExamApproval(exam.id, {
                            room: "Room 1",
                            time: "10:00",
                            assistants: ["Assistant A", "Assistant B"],
                          })
                        }
                      >
                        Approve
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                        Edit
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nu exista examene propuse.</p>
            )}
          </div>
        )}

        {/* Settings */}
{currentSection === "Settings" && (
  <div>
    <h1 className="text-2xl font-bold mb-4">Settings</h1>
    <p>Actualizeaza datele aici!</p>

    <form className="bg-white p-6 rounded shadow">
      {/* Basic Settings */}
      <div className="mb-4">
        <label className="block mb-1 font-medium">Nume</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Introdu numele"
          value={settings.name}
          onChange={(e) => handleSettingsChange("name", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Prenume</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Introdu prenumele"
          value={settings.surname}
          onChange={(e) => handleSettingsChange("surname", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Parola</label>
        <input
          type="password"
          className="w-full p-2 border rounded"
          placeholder="Introdu parola"
          value={settings.password}
          onChange={(e) => handleSettingsChange("password", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Telefon</label>
        <input
          type="tel"
          className="w-full p-2 border rounded"
          placeholder="Introdu numărul de telefon"
          value={settings.phone}
          onChange={(e) => handleSettingsChange("phone", e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full p-2 border rounded"
          placeholder="Introdu adresa de email"
          value={settings.email}
          onChange={(e) => handleSettingsChange("email", e.target.value)}
        />
      </div>

 {/* Faculties Section */}
 <div className="mb-4">
        <label className="block mb-1 font-medium">Facultăți</label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {facultiesList.map((faculty, index) => (
            <label key={index} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                value={faculty}
                checked={settings.faculties.includes(faculty)}
                onChange={(e) => {
                  const selectedFaculties = e.target.checked
                    ? [...settings.faculties, faculty]
                    : settings.faculties.filter((f) => f !== faculty);
                  handleSettingsChange("faculties", selectedFaculties);
                }}
              />
              {faculty}
            </label>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Selectează una sau mai multe facultăți la care predai.
        </p>
      </div>

      {/* Specializations Section */}
<div className="mb-4">
  <label className="block mb-1 font-medium">Specializări</label>
  {settings.faculties.length > 0 ? (
    <div className="grid grid-cols-1 gap-2 mt-2">
      {settings.faculties
        .flatMap((faculty) => facultatiSiSpecializari[faculty] || [])
        .sort()
        .map((specialization, index) => (
          <label key={index} className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              value={specialization}
              checked={settings.specializations.includes(specialization)}
              onChange={(e) => {
                const selectedSpecializations = e.target.checked
                  ? [...settings.specializations, specialization]
                  : settings.specializations.filter((s) => s !== specialization);
                handleSettingsChange("specializations", selectedSpecializations);
              }}
            />
            {specialization}
          </label>
        ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500 mt-2">
      Selectează facultățile pentru a vedea specializările.
    </p>
  )}
</div>


      <div className="mb-4">
        <label className="block mb-1 font-medium">
          <input
            type="checkbox"
            className="mr-2"
            checked={settings.notifications}
            onChange={(e) =>
              handleSettingsChange("notifications", e.target.checked)
            }
          />
          Doresc să primesc notificări legate de examenele propuse sau planificate!
        </label>
      </div>

     

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white p-2 rounded hover:bg-indigo-700"
      >
        Salvează modificările
      </button>
    </form>
  </div>
)}


      </div>
    </div>
  );
}

export default ProfessorDashboard;