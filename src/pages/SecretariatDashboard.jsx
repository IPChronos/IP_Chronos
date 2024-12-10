import React, { useState, useEffect } from "react";

function SecretariatDashboard() {
  const [currentSection, setCurrentSection] = useState("Home"); // Control pentru navigare
  const [scheduledExams, setScheduledExams] = useState([]); // Lista examenelor
  const [filteredExams, setFilteredExams] = useState([]); // Examenele filtrate

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-900 to-green-700 text-white">
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

      {/* Content */}
      <div className="flex-1 p-6">
        {currentSection === "Home" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome, Secretariat!</h1>
            <p>
              Aici poți vizualiza și administra examenele programate după grupă,
              profesor sau sală.
            </p>
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

            {/* Lista examene filtrate */}
            <div className="bg-white p-4 rounded shadow">
              {filteredExams.length > 0 ? (
                <ul>
                  {filteredExams.map((exam) => (
                    <li key={exam.idexamen} className="mb-2 border-b pb-2">
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
                <div className="mb-4">
                  <label className="block mb-1 font-medium">Materie</label>
                  <input
                    type="text"
                    value={newExam.subject}
                    onChange={(e) =>
                      setNewExam({ ...newExam, subject: e.target.value })
                    }
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
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
