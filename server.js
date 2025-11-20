import express from 'express';
import mongoose from 'mongoose';
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const schema = mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", schema);

app.get("/getPosts", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

app.post("/addPosts", async (req, res) => {
  await Post.create(req.body);
  res.json({ message: "Post added successfully" });
});

app.delete("/delPosts/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json({ message: "Post deleted" });
});

app.patch("/post/:id", async (req, res) => {
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!updated) return res.status(404).json({ message: "Post not found" });

  res.json({ message: "Post updated", updated });
});

app.listen(3000, () => console.log("Server running on port 3000"));
