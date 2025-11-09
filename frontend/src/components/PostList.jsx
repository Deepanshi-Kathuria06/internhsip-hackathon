import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// ✅ Connect socket.io to your live backend
const socket = io("https://learnato-forum-backend-s14g.onrender.com", {
  transports: ["websocket"],
  withCredentials: false,
});

export default function PostList({ user }) {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(false);
  const [activePost, setActivePost] = useState(null);

  // ✅ Fetch posts
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(
        "https://learnato-forum-backend-s14g.onrender.com/api/posts"
      );
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // ✅ Live updates using socket.io
  useEffect(() => {
    fetchPosts();
    socket.on("updatePosts", fetchPosts);
    return () => socket.off("updatePosts");
  }, []);

  // ✅ Add post
  const addPost = async () => {
    if (!title || !content) return alert("Please enter both title and content!");
    setLoading(true);
    try {
      await axios.post(
        "https://learnato-forum-backend-s14g.onrender.com/api/posts",
        {
          title,
          content,
          user: user.name,
        }
      );

      socket.emit("newPost");
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add reply
  const addReply = async (id) => {
    if (!replyText[id]) return;
    try {
      await axios.post(
        `https://learnato-forum-backend-s14g.onrender.com/api/posts/${id}/reply`,
        {
          author: user.name,
          content: replyText[id],
        }
      );
      socket.emit("newReply");
      setReplyText({ ...replyText, [id]: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // ✅ Upvote post
  const upvote = async (id) => {
    try {
      await axios.post(
        `https://learnato-forum-backend-s14g.onrender.com/api/posts/${id}/upvote`
      );
      socket.emit("updatePosts");
      fetchPosts();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  // ✅ Mark post as answered
  const markAnswered = async (id) => {
    try {
      await axios.post(
        `https://learnato-forum-backend-s14g.onrender.com/api/posts/${id}/mark`
      );
      socket.emit("updatePosts");
      fetchPosts();
    } catch (error) {
      console.error("Error marking answered:", error);
    }
  };

  // ✅ Filter posts by search
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  // SVG Icons
  const SearchIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const UpvoteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
    </svg>
  );

  const ReplyIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  );

  const TimeIcon = () => (
    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-10 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 tracking-tight">
            Learnato Forum
          </h1>
          <p className="text-gray-400 text-lg">Collaborate, Learn, and Grow Together</p>
        </div>

        {/* User Info */}
        <div className="flex items-center justify-between mb-8 p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <UserIcon />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Welcome back</p>
              <p className="text-blue-400 font-semibold text-lg">{user?.name || "Anonymous"}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm font-medium">
              {posts.length} Posts
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search discussions..."
            className="w-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 text-white rounded-2xl px-12 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Post Form */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 mb-10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4 text-gray-100 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start a Discussion
          </h2>
          <p className="text-gray-400 mb-6 flex items-center gap-2">
            <UserIcon />
            Posting as <span className="text-blue-400 font-medium">{user?.name}</span>
          </p>
          
          <div className="space-y-4">
            <input
              className="border border-gray-600 bg-gray-900/50 text-white p-4 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
            />
            <textarea
              className="border border-gray-600 bg-gray-900/50 text-white p-4 rounded-xl w-full h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your topic in detail..."
            />
            <button
              onClick={addPost}
              disabled={loading}
              className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-blue-500/25"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Posting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                  Publish Discussion
                </>
              )}
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 text-gray-600">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-gray-400 text-lg italic">
                No discussions found. Be the first to start one!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:border-gray-600 group"
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`text-2xl font-bold group-hover:text-blue-400 transition-colors duration-300 ${
                        post.isAnswered ? "text-green-400" : "text-white"
                      }`}>
                        {post.title}
                      </h3>
                      {post.isAnswered && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-500/20 rounded-full text-green-400 text-sm font-medium">
                          <CheckIcon />
                          Solved
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <UserIcon />
                        <span className="text-blue-400 font-medium">{post.user}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TimeIcon />
                        <span>{new Date(post.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => markAnswered(post._id)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      post.isAnswered
                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
                    }`}
                  >
                    <CheckIcon />
                    {post.isAnswered ? "Solved" : "Mark Solved"}
                  </button>
                </div>

                {/* Post Content */}
                <p className="text-gray-300 mb-6 text-lg leading-relaxed">{post.content}</p>

                {/* Stats */}
                <div className="flex items-center gap-6 mb-6">
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <UpvoteIcon />
                    </div>
                    <span className="font-semibold">{post.votes} votes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <ReplyIcon />
                    </div>
                    <span className="font-semibold">{post.replies?.length || 0} replies</span>
                  </div>
                </div>

                {/* Replies Section */}
                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-lg font-semibold mb-4 text-gray-300 flex items-center gap-2">
                    <ReplyIcon />
                    Community Responses
                  </h4>
                  
                  <div className="space-y-4 mb-6">
                    {post.replies?.length > 0 ? (
                      post.replies.map((r, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
                        >
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                            <UserIcon />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-blue-400 font-semibold">{r.author}</span>
                              <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                              <span className="text-gray-500 text-sm">
                                {new Date().toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-300">{r.content}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <ReplyIcon />
                        <p className="mt-2">No responses yet. Be the first to help!</p>
                      </div>
                    )}
                  </div>

                  {/* Add Reply */}
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Share your knowledge..."
                      className="flex-1 border border-gray-600 bg-gray-900/50 text-white p-4 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-300"
                      value={replyText[post._id] || ""}
                      onChange={(e) =>
                        setReplyText({
                          ...replyText,
                          [post._id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => e.key === 'Enter' && addReply(post._id)}
                    />
                    <button
                      onClick={() => addReply(post._id)}
                      className="px-6 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <ReplyIcon />
                      Reply
                    </button>
                  </div>
                </div>

                {/* Upvote Button */}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => upvote(post._id)}
                    className="flex items-center gap-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 active:scale-95"
                  >
                    <UpvoteIcon />
                    Upvote • {post.votes}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Live Community</span>
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