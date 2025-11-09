import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import PostList from "./components/PostList";
import Login from "./components/Login";
import Analytics from "./components/Analytics"; // ✅ new component

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check localStorage for saved user
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ✅ While checking localStorage, show loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {/* ✅ Global NavBar (shows only when logged in) */}
      {user && (
        <nav className="bg-gray-900 border-b border-gray-700 px-6 py-3 flex justify-between items-center text-white">
          <div className="font-bold text-xl text-blue-400">Learnato Forum 💬</div>
          <div className="flex gap-6 items-center">
            <Link to="/forum" className="hover:text-blue-400 transition">
              🏠 Forum
            </Link>
            <Link to="/analytics" className="hover:text-teal-400 transition">
              📊 Analytics
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      {/* ✅ Routes */}
      <Routes>
        {/* Login route */}
        <Route
          path="/"
          element={
            user ? <Navigate to="/forum" replace /> : <Login setUser={setUser} />
          }
        />

        {/* Forum route */}
        <Route
          path="/forum"
          element={user ? <PostList user={user} /> : <Navigate to="/" replace />}
        />

        {/* Analytics route */}
        <Route
          path="/analytics"
          element={
            user ? <Analytics user={user} /> : <Navigate to="/" replace />
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
