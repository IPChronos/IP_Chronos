import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";


const facultatiSiSpecializari = {
  "Facultatea de Inginerie Electrică și Știința Calculatoarelor": ["Calculatoare", "Calculatoare – DUAL", "Electronică Aplicată", "Rețele și software de telecomunicații", "Sisteme electrice", "Sisteme electrice – DUAL", "Energetică și tehnologii informatice", "Managementul energiei", "Automatică şi informatică aplicată", "Automatică şi informatică aplicată - DUAL", "Echipamente și sisteme de comandă și control pentru autovehicule", "Echipamente și sisteme medicale"
  ],

  "Facultatea de Drept și Științe Administrative": ["Economia comerțului, turismului și serviciilor", "Drept European si International", "Administrație Publică", "Poliție Locală"],

  "Facultatea de Economie, Administraţie și Afaceri": ["Administrarea afacerilor", "Finanțe și bănci", "Contabilitate și informatică de gestiune", "Management", "Afaceri internaționale", "Informatică economică", "Economie generală și comunicare economică", "Asistență managerială și administrativă", "	Matematică  informatică"],

  "Facultatea de Educație Fizică și Sport": ["Educaţie Fizică şi Sport", "Kinetoterapie și motricitate specială"],

  "Facultatea de Inginerie Alimentară": ["Ingineria produselor alimentare", "Controlul şi expertiza produselor alimentare", "Protecția consumatorului și a mediului"],

  "Facultatea de Inginerie Mecanică, Autovehicule și Robotică": ["Tehnologia Construcțiilor de Mașini", "Tehnologia Construcțiilor de Mașini – DUAL", "Mecatronică", "Robotică", "Inginerie Mecanică", "Inginerie Mecanică DUAL", "Autovehicule Rutiere"],

  "Facultatea de Istorie și Geografie": ["Asistență socială", "Geografie", "Geografia turismului", "Istorie", "Relații internaționale și studii europene", "Resurse umane"],

  "Facultatea de Litere și Științe ale Comunicării": ["Limba şi literatura română – Limbă şi literatură modernă", "Limba şi literatura engleză ", "Limba şi literatura franceză", "Limba şi literatura ucrainena", "Media digitala", "Comunicare și relații publice"],

  "Facultatea de Medicină și Științe Biologice": ["Medicină", "Asistență medicală generală", "Balneofiziokinetoterapie și recuperare", "Biochimie", "Biologie", "Nutriție și dietetică", "Tehnică dentară"],

  "Facultatea de Silvicultură": ["Silvicultură", "Ecologie si Protectia Mediului"],

  "Facultatea de Științe ale Educației": ["Pedagogia Invatamantului Primar si Prescolar", "Psihologie"]
};



function SecretariatDashboard() {
  const [currentSection, setCurrentSection] = useState("Home"); // Control pentru navigare
  const [scheduledExams, setScheduledExams] = useState([]); // Lista examenelor
  const [filteredExams, setFilteredExams] = useState([]); // Examenele filtrate
  const navigate = useNavigate();
  // State-uri pentru filtre
  const [groupFilter, setGroupFilter] = useState("");
  const [professorFilter, setProfessorFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");

  // State pentru adăugarea unui examen nou
  const [newExam, setNewExam] = useState({
    subject: "",
    professor: "",
    group: "",
    date: "",
    room: "",
    time: "",
    faculty: "", // Facultatea selectată
    specialization: "", // Specialitatea selectată
  });


  // URL-ul backend-ului
  const backendUrl = "http://127.0.0.1:8000/planning";

  // Preluare examene din backend
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await fetch(backendUrl);
        if (response.ok) {
          const data = await response.json();
          setScheduledExams(data);
          setFilteredExams(data);
        } else {
          console.error("Failed to fetch exams:", response.status);
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, [backendUrl]);

  // Filtrarea datelor pe baza filtrelor selectate
  useEffect(() => {
    const filterExams = () => {
      const filtered = scheduledExams.filter((exam) => {
        const matchesGroup = !groupFilter || exam.idgrupa === groupFilter;
        const matchesProfessor =
          !professorFilter || exam.idprofesor === professorFilter;
        const matchesRoom = !roomFilter || exam.idsala === roomFilter;

        return matchesGroup && matchesProfessor && matchesRoom;
      });

      setFilteredExams(filtered);
    };

    filterExams();
  }, [groupFilter, professorFilter, roomFilter, scheduledExams]);

  // Generare liste dinamice de opțiuni pentru filtre
  const uniqueGroups = [...new Set(scheduledExams.map((exam) => exam.idgrupa))];
  const uniqueProfessors = [
    ...new Set(scheduledExams.map((exam) => exam.idprofesor)),
  ];
  const uniqueRooms = [...new Set(scheduledExams.map((exam) => exam.idsala))];

  // Funcție pentru adăugarea unui examen nou
  const handleAddExam = async () => {
    try {
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idexamen: scheduledExams.length + 1, // ID unic
          idmaterie: newExam.subject,    // ID-ul materiei
          idprofesor: newExam.professor, // ID-ul profesorului
          idgrupa: newExam.group,        // ID-ul grupei
          data: newExam.date,
          idsala: newExam.room,          // ID-ul sălii
          ora: newExam.time,
        }),
      });

      if (response.ok) {
        const addedExam = await response.json();
        setScheduledExams([...scheduledExams, addedExam]);
        setFilteredExams([...filteredExams, addedExam]);

        // Resetare formular
        setNewExam({
          subject: "",
          professor: "",
          group: "",
          date: "",
          room: "",
          time: "",
        });
      } else {
        console.error("Failed to add exam:", response.status);
      }
    } catch (error) {
      console.error("Error adding exam:", error);
    }
  };
  const handleLogout = () => {
    // Logica de logout (de ex., eliminarea tokenului de autentificare)
    navigate("/login"); // Redirecționează către pagina de log in
  };


  return (
    <div className="flex min-h-screen bg-gray-100">
     {/* Sidebar */}
     
<div className="w-64 bg-gradient-to-b from-green-900 to-green-700 text-white flex flex-col justify-between min-h-screen">
  <div>
    <div className="p-4 text-2xl font-semibold">Chronos - Secretariat</div>
    <ul className="mt-8 space-y-4">
      <li
        onClick={() => setCurrentSection("Home")}
        className={`pl-4 py-2 rounded cursor-pointer ${
          currentSection === "Home" ? "bg-green-800" : "bg-green-600"
        }`}
      >
        Home
      </li>
      <li
        onClick={() => setCurrentSection("Exams")}
        className={`pl-4 py-2 rounded cursor-pointer ${
          currentSection === "Exams" ? "bg-green-800" : "bg-green-600"
        }`}
      >
        View Exams
      </li>
      <li
        onClick={() => setCurrentSection("AddExam")}
        className={`pl-4 py-2 rounded cursor-pointer ${
          currentSection === "AddExam" ? "bg-green-800" : "bg-green-600"
        }`}
      >
        Add Exam
      </li>
    </ul>
  </div>

  {/* Buton Deconectați-vă */}
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
        {currentSection === "Home" && (
          <div>
            <div className="bg-green-600 text-white p-6 rounded mb-6">
              <h1 className="text-3xl font-bold">Bun venit la Chronos - Secretariat!</h1>
              <p className="mt-2">
                Administrează cu ușurință examenele programate și accesează informațiile de care ai nevoie.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: View Exams */}
              <div className="bg-white shadow-md rounded p-6 hover:shadow-lg">
                <h2 className="text-xl font-bold mb-2">Vizualizare Examene</h2>
                <p className="text-gray-700">
                  Accesează lista examenelor programate și folosește filtre pentru a găsi rapid ceea ce cauți.
                </p>
                <button
                  onClick={() => setCurrentSection("Exams")}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                >
                  Vezi Examenele
                </button>
              </div>

              {/* Card 2: Add Exam */}
              <div className="bg-white shadow-md rounded p-6 hover:shadow-lg">
                <h2 className="text-xl font-bold mb-2">Adaugă un Examen</h2>
                <p className="text-gray-700">
                  Programează un nou examen completând detalii precum grupă, profesor și sală.
                </p>
                <button
                  onClick={() => setCurrentSection("AddExam")}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                >
                  Adaugă Examen
                </button>
              </div>
            </div>
          </div>
        )}

        {currentSection === "Exams" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Examene Planificate</h1>
            {/* Filtre */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block mb-1 font-medium">Filtrare după grupă</label>
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Toate grupele</option>
                  {uniqueGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Filtrare după profesor
                </label>
                <select
                  value={professorFilter}
                  onChange={(e) => setProfessorFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Toți profesorii</option>
                  {uniqueProfessors.map((professor) => (
                    <option key={professor} value={professor}>
                      {professor}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Filtrare după sală</label>
                <select
                  value={roomFilter}
                  onChange={(e) => setRoomFilter(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Toate sălile</option>
                  {uniqueRooms.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              {filteredExams.length > 0 ? (
                <ul>
                  {filteredExams.map((exam) => (
                    <li key={exam.idexamen} className="mb-2 border-b pb-2">
                      {/* Facultatea și Specializarea afișate primele */}
                      <p>
                        <strong>Facultate:</strong> {exam.idfacultate}
                      </p>
                      <p>
                        <strong>Specializare:</strong> {exam.idspecializare}
                      </p>
                      {/* Restul informațiilor despre examen */}
                      <p>
                        <strong>Materie ID:</strong> {exam.idmaterie}
                      </p>
                      <p>
                        <strong>Profesor ID:</strong> {exam.idprofesor}
                      </p>
                      <p>
                        <strong>Grupă ID:</strong> {exam.idgrupa}
                      </p>
                      <p>
                        <strong>Data:</strong> {exam.data}
                      </p>
                      <p>
                        <strong>Sala ID:</strong> {exam.idsala}
                      </p>
                      <p>
                        <strong>Ora:</strong> {exam.ora}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nicio programare găsită pentru filtrele selectate.</p>
              )}
            </div>

          </div>
        )}

        {currentSection === "AddExam" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Adaugă Examen</h1>
            <div className="bg-white p-4 rounded shadow">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddExam();
                }}
              >
                {/* Facultate */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Facultate</label>
                  <select
                    value={newExam.faculty}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        faculty: e.target.value,
                        specialization: "",
                        subject: "",
                        year: "",
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="">Selectează facultatea</option>
                    {Object.keys(facultatiSiSpecializari).map((faculty) => (
                      <option key={faculty} value={faculty}>
                        {faculty}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Specializare */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Specializare</label>
                  <select
                    value={newExam.specialization}
                    onChange={(e) =>
                      setNewExam({
                        ...newExam,
                        specialization: e.target.value,
                        subject: "",
                        year: "",
                      })
                    }
                    className="w-full p-2 border rounded"
                    required
                    disabled={!newExam.faculty}
                  >
                    <option value="">Selectează specializarea</option>
                    {newExam.faculty &&
                      facultatiSiSpecializari[newExam.faculty]?.map(
                        (specialization) => (
                          <option key={specialization} value={specialization}>
                            {specialization}
                          </option>
                        )
                      )}
                  </select>
                </div>

                {/* Disciplină */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Disciplină</label>
                  <input
                    type="text"
                    value={newExam.subject}
                    onChange={(e) =>
                      setNewExam({ ...newExam, subject: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                    disabled={!newExam.specialization}
                  />
                </div>

                {/* Anul - Input Manual */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Anul</label>
                  <input
                    type="text"
                    value={newExam.year}
                    onChange={(e) =>
                      setNewExam({ ...newExam, year: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    placeholder="Introdu anul (ex: 1, 2, 3, 4)"
                    required
                    disabled={!newExam.subject}
                  />
                </div>

                {/* Profesor */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Profesor</label>
                  <input
                    type="text"
                    value={newExam.professor}
                    onChange={(e) =>
                      setNewExam({ ...newExam, professor: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Grupă */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Grupă</label>
                  <input
                    type="text"
                    value={newExam.group}
                    onChange={(e) =>
                      setNewExam({ ...newExam, group: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Data */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Data</label>
                  <input
                    type="date"
                    value={newExam.date}
                    onChange={(e) =>
                      setNewExam({ ...newExam, date: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Sala */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Sala</label>
                  <input
                    type="text"
                    value={newExam.room}
                    onChange={(e) =>
                      setNewExam({ ...newExam, room: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Ora */}
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Ora</label>
                  <input
                    type="time"
                    value={newExam.time}
                    onChange={(e) =>
                      setNewExam({ ...newExam, time: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
                >
                  Adaugă Examen
                </button>
              </form>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

export default SecretariatDashboard;
