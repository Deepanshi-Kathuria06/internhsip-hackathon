import React, { useState } from "react";

export default function Login({ setUser }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!name.trim()) {
      alert("Please enter your name!");
      return;
    }

    setLoading(true);
    
    // Simulate loading for better UX
    setTimeout(() => {
      const userData = { name: name.trim() };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      setLoading(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 tracking-tight">
            Learnato Forum
          </h1>
          <p className="text-xl text-gray-400 mb-2">Where Knowledge Meets Community</p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Community Platform</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl w-full max-w-md hover:shadow-blue-500/10 transition-all duration-500">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Join the Discussion</h2>
            <p className="text-gray-400">Enter your name to continue</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Enter your display name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-4 bg-gray-900/50 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-500"
                autoFocus
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-blue-500/25"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Entering Forum...
                </>
              ) : (
                <>
                  <span>Continue to Forum</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Features List */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Real-time Chat</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Live Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Community Driven</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Instant Help</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Secure • Fast • Reliable</span>
          </div>
          <p className="text-gray-500">
            Built with ❤️ by{" "}
            <span className="text-blue-400 font-semibold">Deepanshi</span>
          </p>
        </footer>
      </div>
    </div>
  );
}