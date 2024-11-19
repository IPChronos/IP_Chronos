import React, { useState, useEffect } from "react";
import randomData from "../data/randomData.json"; // Importă fișierul JSON

function SecretariatDashboard() {
  const [currentSection, setCurrentSection] = useState("Home"); // Control pentru navigare
  const [scheduledExams, setScheduledExams] = useState([]); // Lista examenelor
  const [filteredExams, setFilteredExams] = useState([]); // Examenele filtrate

  // State-uri pentru filtre
  const [groupFilter, setGroupFilter] = useState("");
  const [professorFilter, setProfessorFilter] = useState("");
  const [roomFilter, setRoomFilter] = useState("");

  // Preluare examene planificate
  useEffect(() => {
    // Setează datele din JSON
    setScheduledExams(randomData);
    setFilteredExams(randomData);
  }, []);

  // Filtrarea datelor pe baza filtrelor selectate
  useEffect(() => {
    const filterExams = () => {
      const filtered = scheduledExams.filter((exam) => {
        const matchesGroup = !groupFilter || exam.group === groupFilter;
        const matchesProfessor =
          !professorFilter || exam.professor === professorFilter;
        const matchesRoom = !roomFilter || exam.room === roomFilter;

        return matchesGroup && matchesProfessor && matchesRoom;
      });

      setFilteredExams(filtered);
    };

    filterExams();
  }, [groupFilter, professorFilter, roomFilter, scheduledExams]);

  // Generare liste dinamice de opțiuni pentru filtre
  const uniqueGroups = [...new Set(scheduledExams.map((exam) => exam.group))];
  const uniqueProfessors = [
    ...new Set(scheduledExams.map((exam) => exam.professor)),
  ];
  const uniqueRooms = [...new Set(scheduledExams.map((exam) => exam.room))];

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

            {/* Buton pentru resetare filtre */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setGroupFilter("");
                  setProfessorFilter("");
                  setRoomFilter("");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-800"
              >
                Resetează toate filtrele
              </button>
            </div>

            {/* Lista examene filtrate */}
            <div className="bg-white p-4 rounded shadow">
              {filteredExams.length > 0 ? (
                <ul>
                  {filteredExams.map((exam) => (
                    <li key={exam.id} className="mb-2 border-b pb-2">
                      <p>
                        <strong>Materie:</strong> {exam.subject}
                      </p>
                      <p>
                        <strong>Profesor:</strong> {exam.professor}
                      </p>
                      <p>
                        <strong>Data:</strong>{" "}
                        {new Date(exam.date).toLocaleString()}
                      </p>
                      <p>
                        <strong>Sala:</strong> {exam.room}
                      </p>
                      <p>
                        <strong>Grupă:</strong> {exam.group}
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
      </div>
    </div>
  );
}

export default SecretariatDashboard;