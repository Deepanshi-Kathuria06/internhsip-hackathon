import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// ✅ Connect socket.io to backend
const socket = io("http://localhost:5000", {
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

  // ✅ Fetch posts
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/posts");
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
      await axios.post("http://localhost:5000/api/posts", {
  title,
  content,
  user: user.name, // ✅ send only name (string)
});

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
      await axios.post(`http://localhost:5000/api/posts/${id}/reply`, {
        author: user.name,      // ✅ structured author field
        content: replyText[id], // ✅ message text
      });
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
      await axios.post(`http://localhost:5000/api/posts/${id}/upvote`);
      socket.emit("updatePosts");
      fetchPosts();
    } catch (error) {
      console.error("Error upvoting:", error);
    }
  };

  // ✅ Mark post as answered
  const markAnswered = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${id}/mark`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col items-center py-10 px-6">
      {/* Header */}
      <h1 className="text-4xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-300 tracking-wide">
        Learnato Forum 💬
      </h1>

      {/* User Info + Logout */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-6">
        <p className="text-gray-300">
          👋 Logged in as{" "}
          <span className="text-blue-400 font-semibold">
            {user?.name || "Anonymous"}
          </span>
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
          className="text-red-400 hover:text-red-500 text-sm"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="w-full max-w-2xl mb-6">
        <input
          type="text"
          placeholder="Search posts..."
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Post Form */}
      <div className="w-full max-w-2xl bg-gray-800 shadow-xl rounded-2xl p-6 mb-10 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Create a Post</h2>
        <p className="text-sm text-gray-400 mb-3">
          Posting as <span className="text-blue-400">{user?.name}</span>
        </p>
        <input
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded w-full mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title..."
        />
        <textarea
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded w-full mb-3 h-24 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your question or topic..."
        />
        <button
          onClick={addPost}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-lg font-medium transition-all ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Posts List */}
      <div className="w-full max-w-2xl space-y-6">
        {filteredPosts.length === 0 ? (
          <p className="text-gray-400 text-center italic">
            No posts found. Be the first to start a discussion!
          </p>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post._id}
              className="bg-gray-800 border border-gray-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
            >
              <div className="flex justify-between items-center mb-3">
                <h3
                  className={`text-2xl font-semibold ${
                    post.isAnswered ? "text-green-400 line-through" : "text-blue-400"
                  }`}
                >
                  {post.title}
                </h3>
                <button
                  onClick={() => markAnswered(post._id)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    post.isAnswered
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {post.isAnswered ? "✅ Answered" : "Mark Answered"}
                </button>
              </div>

              <p className="text-gray-300 mb-2">{post.content}</p>

              <p className="text-sm text-gray-400 mb-3">
  Votes: {post.votes} | Replies: {post.replies?.length || 0} |{" "}
  Posted by:{" "}
  <span className="text-blue-400 font-medium">{post.user}</span> •{" "}
  <span className="text-gray-500">
    {new Date(post.createdAt).toLocaleString()}
  </span>
</p>


              {/* Replies */}
              <div className="mt-3">
                <h4 className="text-sm text-gray-400 mb-2">Replies:</h4>
                {post.replies?.length > 0 ? (
                  post.replies.map((r, i) => (
                    <div
                      key={i}
                      className="ml-3 mb-2 text-gray-300 border-l-2 border-gray-700 pl-3"
                    >
                      ➤ <span className="text-blue-400 font-medium">{r.author}:</span>{" "}
                      {r.content}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No replies yet.</p>
                )}

                {/* Add reply */}
                <div className="flex gap-2 mt-3">
                  <input
                    type="text"
                    placeholder="Add a reply..."
                    className="border border-gray-600 bg-gray-900 text-white p-2 rounded flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={replyText[post._id] || ""}
                    onChange={(e) =>
                      setReplyText({ ...replyText, [post._id]: e.target.value })
                    }
                  />
                  <button
                    onClick={() => addReply(post._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  >
                    Reply
                  </button>
                </div>
              </div>

              {/* Votes */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-gray-400 text-sm">Votes: {post.votes}</p>
                <button
                  onClick={() => upvote(post._id)}
                  className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-1.5 rounded-full shadow-sm transition-all active:scale-95"
                >
                  👍 Upvote
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-gray-500 text-sm">
        Built with ❤️ by <span className="text-blue-400 font-semibold">Deepanshi</span>
      </footer>
    </div>
  );
}
