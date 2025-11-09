import Post from "../models/postModel.js";

// ✅ Create a new post
export const createPost = async (req, res) => {
  try {
    const { title, content, user } = req.body;

    if (!title || !content)
      return res.status(400).json({ message: "Title and content are required" });

    // ✅ Ensure user is a string
    const username = typeof user === "string" ? user : user?.name;

    if (!username)
      return res.status(400).json({ message: "Username is required" });

    const post = await Post.create({ title, content, user: username });

    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Add a reply
export const addReply = async (req, res) => {
  try {
    const { author, content } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!author || !content)
      return res.status(400).json({ message: "Author and content are required" });

    post.replies.push({ author, content });
    await post.save({ validateBeforeSave: false });

    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Error adding reply:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Upvote
export const upvotePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.votes += 1;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error("❌ Error upvoting post:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Mark as answered
export const markAnswered = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.isAnswered = !post.isAnswered;
    await post.save();
    res.json(post);
  } catch (error) {
    console.error("❌ Error marking answered:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
