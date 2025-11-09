import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: String, required: true }, // ✅ plain username
    votes: { type: Number, default: 0 },
    isAnswered: { type: Boolean, default: false },
    replies: [replySchema],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
