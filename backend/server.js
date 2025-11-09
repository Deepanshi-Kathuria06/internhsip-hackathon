import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ Allow both local + deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://internhsip-hackathon-git-main-deepanshi-kathuria06s-projects.vercel.app", // vercel live URL
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/posts", postRoutes);

const server = createServer(app);

// ✅ Proper Socket.io setup with matching CORS
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://internhsip-hackathon-git-main-deepanshi-kathuria06s-projects.vercel.app",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("newPost", () => io.emit("updatePosts"));
  socket.on("newReply", () => io.emit("updatePosts"));

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

// ✅ Use 0.0.0.0 for Render hosting
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
