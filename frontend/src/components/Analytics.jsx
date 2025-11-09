import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

// ✅ Connect to backend socket
const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: false,
});

export default function Analytics({ user }) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReplies: 0,
    totalUpvotes: 0,
  });
  const [loading, setLoading] = useState(true);

  // ✅ Fetch analytics from backend
  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/posts");

      const totalPosts = data.length;
      const totalReplies = data.reduce(
        (sum, post) => sum + (post.replies?.length || 0),
        0
      );
      const totalUpvotes = data.reduce((sum, post) => sum + post.votes, 0);

      setStats({ totalPosts, totalReplies, totalUpvotes });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial load + live updates
  useEffect(() => {
    fetchAnalytics();

    // Refresh on socket updates
    socket.on("updatePosts", fetchAnalytics);
    socket.on("newPost", fetchAnalytics);
    socket.on("newReply", fetchAnalytics);

    return () => {
      socket.off("updatePosts");
      socket.off("newPost");
      socket.off("newReply");
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white bg-black">
        <p>Loading Analytics...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center py-10 px-6">
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 tracking-wide">
        Live Forum Analytics 📊
      </h1>

      <p className="text-gray-400 mb-6 text-lg">
        Welcome back,{" "}
        <span className="text-blue-400 font-semibold">{user?.name}</span> 👋
      </p>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-3xl font-bold text-blue-400">{stats.totalPosts}</h2>
          <p className="text-gray-400 mt-2 text-sm">Total Posts</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-3xl font-bold text-green-400">{stats.totalReplies}</h2>
          <p className="text-gray-400 mt-2 text-sm">Total Replies</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center shadow-lg hover:scale-105 transition-transform">
          <h2 className="text-3xl font-bold text-yellow-400">{stats.totalUpvotes}</h2>
          <p className="text-gray-400 mt-2 text-sm">Total Upvotes</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-10">
        <Link
          to="/forum"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all"
        >
          ← Back to Forum
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        Built with ❤️ by <span className="text-blue-400 font-semibold">Deepanshi</span>
      </footer>
    </div>
  );
}
