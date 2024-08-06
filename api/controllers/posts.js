const Post = require("../models/post");
const { generateToken } = require("../lib/token");

const getAllPosts = async (req, res) => {
  const posts = await Post.find().populate("user_id", "name email");
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
};

const createPost = async (req, res) => {
  const post = new Post({
    ...req.body, // spread operator works as like a copy and paste to copy the req.body and add in the user_id below
    user_id: req.user_id, // must be same as what its in post
  });
  await post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token: newToken });
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.user_id }).populate("user_id", "name email");
    res.status(200).json({posts: posts});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching the user's posts"})
  }
};

const deletePost = async (req, res) => {
  const { id } = req.params; // id is the id of the post to delete that comes from the request sent
  try {
    const postToDelete = await Post.findById(id);
    if (!postToDelete) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (postToDelete.user_id.toString() !== req.user_id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await Post.deleteOne({ _id: id }); // delete method changed to deleteOne and postToDelete changed from instance to model itself
    return res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getUserPosts: getUserPosts,
  deletePost: deletePost,
};

module.exports = PostsController;

// curl command example to delete a post

// curl -x DELETE -H "Authorization Bearer (token)" http://localhost:3000/posts/(id)

// curl -X DELETE -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjZiMGRhZTVlNzY2ODcxZTkxZDY4NzMzIiwiaWF0IjoxNzIyOTM3MjAyLCJleHAiOjE3MjI5Mzc4MDJ9.8VX79p4vUk3Iq0LZCHoCuYTvXmUS6JQ-fU3WkLtSf2Y" http://localhost:3000/posts/66b1ef77158ea7b19674057f
