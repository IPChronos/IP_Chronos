import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-indigo-600 to-blue-500 text-white">
      {/* Titlul principal */}
      <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Welcome to Chronos - Online Exam Planner</h1>
      
      {/* Subtitlu descriptiv */}
      <p className="text-lg text-gray-200 mb-8 max-w-2xl text-center">
        Planificați-vă examenele fără stres. Gestionați toate sesiunile, examenele și programările într-un singur loc simplu și intuitiv.
      </p>
      
      {/* Container pentru butoane */}
      <div className="flex space-x-6">
        {/* Buton Register */}
        <Link
          to="/register"
          className="flex items-center px-8 py-3 bg-white text-purple-600 font-medium rounded-lg shadow hover:bg-gray-200 transition-transform transform hover:scale-105"
        >
          <span className="mr-2">✍️</span> Register
        </Link>
        
        {/* Buton Login */}
        <Link
          to="/login"
          className="flex items-center px-8 py-3 bg-white text-purple-600 font-medium rounded-lg shadow hover:bg-gray-200 transition-transform transform hover:scale-105"
        >
          <span className="mr-2">🔑</span> Login
        </Link>
      </div>
      
      {/* Imagine decorativă */}
      <div className="mt-12">
        <img
          src="https://via.placeholder.com/500x300.png?text=Exam+Planner+Image"
          alt="Exam Planning Illustration"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default Home;
