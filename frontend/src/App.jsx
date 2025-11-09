import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useLocation,
} from "react-router-dom";
import PostList from "./components/PostList";
import Login from "./components/Login";
import Analytics from "./components/Analytics";

// Navbar Component with enhanced UI
function NavBar({ user }) {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActiveRoute = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 shadow-2xl" 
        : "bg-gray-900/80 backdrop-blur-lg border-b border-gray-700/30"
    }`}>
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link 
            to="/forum" 
            className="flex items-center gap-3 group"
          >
            <div className="p-2 bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300">
                Learnato Forum
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1 bg-gray-800/50 rounded-2xl p-1 border border-gray-700">
            <Link
              to="/forum"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActiveRoute("/forum")
                  ? "bg-gradient-to-r from-blue-500/20 to-teal-500/20 text-blue-400 border border-blue-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Forum
            </Link>

            <Link
              to="/analytics"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                isActiveRoute("/analytics")
                  ? "bg-gradient-to-r from-teal-500/20 to-green-500/20 text-teal-400 border border-teal-500/30"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </Link>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-800/50 rounded-xl border border-gray-700">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-400">Welcome</span>
                <span className="text-blue-400 font-semibold text-sm">{user?.name || "Anonymous"}</span>
              </div>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 border border-red-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Enhanced Loading Component
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-4 absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-45"></div>
        </div>
        <p className="text-gray-400 text-lg">Loading Learnato Forum...</p>
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}

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

  // ✅ While checking localStorage, show enhanced loader
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      {/* ✅ Enhanced Global NavBar */}
      {user && <NavBar user={user} />}

      {/* ✅ Main Content with padding for fixed navbar */}
      <div className={user ? "pt-20 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black" : ""}>
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
      </div>
    </Router>
  );
}