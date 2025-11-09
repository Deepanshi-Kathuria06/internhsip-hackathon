import React, { useState } from "react";

export default function Login({ setUser }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    const userData = { name: name.trim() };
    localStorage.setItem("user", JSON.stringify(userData)); // ✅ store object as JSON
    setUser(userData); // ✅ pass correct object
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
        Welcome to Learnato Forum 💬
      </h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 w-80">
        <input
          type="text"
          placeholder="Enter your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 rounded bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-lg font-medium transition-all active:scale-95"
        >
          Continue →
        </button>
      </div>

      <p className="text-gray-500 mt-6 text-sm">Built by ❤️ Deepanshi</p>
    </div>
  );
}
