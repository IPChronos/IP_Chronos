import React from "react";

function Calendar({ exams }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      {exams.length === 0 ? (
        <p>No exams scheduled.</p>
      ) : (
        <ul>
          {exams.map((exam) => (
            <li key={exam.id} className="mb-2">
              <strong>{exam.subject}</strong> - {exam.date} {exam.time} | Room:{" "}
              {exam.room} | Professor: {exam.professor}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Calendar;
