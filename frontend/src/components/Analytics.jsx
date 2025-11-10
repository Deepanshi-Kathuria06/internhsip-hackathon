import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";

// ✅ Connect to backend socket - Use the same URL as in PostList
const socket = io("https://learnato-forum-backend-s14g.onrender.com", {
  transports: ["websocket"],
  withCredentials: false,
});

// Base URL for API calls
const API_BASE_URL = "https://learnato-forum-backend-s14g.onrender.com/api";

export default function Analytics({ user }) {
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalReplies: 0,
    totalUpvotes: 0,
    answeredPosts: 0,
    activeUsers: 0,
    engagementRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  // ✅ Fetch analytics from backend
  const fetchAnalytics = async () => {
    try {
      setError(null);
      const { data } = await axios.get(`${API_BASE_URL}/posts`);

      const totalPosts = data.length;
      const totalReplies = data.reduce(
        (sum, post) => sum + (post.replies?.length || 0),
        0
      );
      const totalUpvotes = data.reduce((sum, post) => sum + (post.votes || 0), 0);
      const answeredPosts = data.filter(post => post.isAnswered).length;
      
      // Calculate unique users
      const users = new Set(data.map(post => post.user).filter(Boolean));
      const activeUsers = users.size;
      
      // Calculate engagement rate
      const engagementRate = totalPosts > 0 ? 
        Number(((totalReplies + totalUpvotes) / totalPosts).toFixed(1)) : 0;

      // Get recent activity
      const activity = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(post => ({
          id: post._id,
          title: post.title,
          type: 'post',
          user: post.user || 'Anonymous',
          timestamp: post.createdAt,
          replies: post.replies?.length || 0,
          votes: post.votes || 0
        }));

      setStats({ 
        totalPosts, 
        totalReplies, 
        totalUpvotes, 
        answeredPosts, 
        activeUsers, 
        engagementRate 
      });
      setRecentActivity(activity);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setError("Failed to load analytics data. Please check your connection.");
      // Set default values to prevent UI breaking
      setStats({
        totalPosts: 0,
        totalReplies: 0,
        totalUpvotes: 0,
        answeredPosts: 0,
        activeUsers: 0,
        engagementRate: 0,
      });
      setRecentActivity([]);
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

  // SVG Icons
  const StatIcon = ({ type }) => {
    const icons = {
      posts: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      replies: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      ),
      upvotes: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      solved: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      users: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      engagement: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    };
    return icons[type] || icons.posts;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="w-16 h-16 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-4 absolute top-0 left-1/2 transform -translate-x-1/2 -rotate-45"></div>
          </div>
          <p className="text-gray-400 text-lg">Loading Analytics...</p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 container mx-auto px-6 py-10 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-teal-500 to-green-400 rounded-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-green-300 tracking-tight">
            Forum Analytics
          </h1>
          <p className="text-gray-400 text-lg mb-2">Real-time community insights and metrics</p>
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Updates Active</span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 text-center">
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <button
              onClick={fetchAnalytics}
              className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* User Welcome */}
        <div className="flex items-center justify-between mb-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Welcome to Analytics</p>
              <p className="text-blue-400 font-semibold text-lg">{user?.name || "Anonymous"}</p>
            </div>
          </div>
          <Link
            to="/forum"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Forum
          </Link>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Posts */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <StatIcon type="posts" />
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stats.totalPosts}</h3>
            <p className="text-gray-400 text-sm">Total Discussions</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.totalPosts / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Total Replies */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-green-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <StatIcon type="replies" />
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stats.totalReplies}</h3>
            <p className="text-gray-400 text-sm">Community Responses</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.totalReplies / 200) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Total Upvotes */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <StatIcon type="upvotes" />
              </div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stats.totalUpvotes}</h3>
            <p className="text-gray-400 text-sm">Total Upvotes</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.totalUpvotes / 300) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Answered Posts */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <StatIcon type="solved" />
              </div>
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stats.answeredPosts}</h3>
            <p className="text-gray-400 text-sm">Solved Discussions</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${stats.totalPosts > 0 ? (stats.answeredPosts / stats.totalPosts) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Active Users */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-pink-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-pink-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <StatIcon type="users" />
              </div>
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stats.activeUsers}</h3>
            <p className="text-gray-400 text-sm">Active Community Members</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-pink-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.activeUsers / 20) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Engagement Rate */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-teal-500/10 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <StatIcon type="engagement" />
              </div>
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-2">{stats.engagementRate}</h3>
            <p className="text-gray-400 text-sm">Avg. Engagement per Post</p>
            <div className="mt-3 w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-teal-500 h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((stats.engagementRate / 10) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl mb-8">
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold mb-1">{activity.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>By {activity.user}</span>
                      <span>{activity.replies} replies</span>
                      <span>{activity.votes} votes</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No recent activity yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Real-time Analytics • Live Updates</span>
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