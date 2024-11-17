import React, { useState } from "react";
import Login from "../components/Login";
import Register from "../components/Register";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {isLogin ? (
        <Login />
      ) : (
        <Register />
      )}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="absolute top-4 right-4 text-blue-500 underline"
      >
        Switch to {isLogin ? "Register" : "Login"}
      </button>
    </div>
  );
}

export default AuthPage;
