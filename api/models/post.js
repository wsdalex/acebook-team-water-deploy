const mongoose = require("mongoose");

// A Schema defines the "shape" of entries in a collection. This is similar to
// defining the columns of an SQL Database.

const CommentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment: String,
});

const PostSchema = new mongoose.Schema({
  message: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  imageUrl: String,
  comments: [CommentSchema],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // array to store ids of users that like the post
}, { timestamps: true });

// We use the Schema to create the Post model. Models are classes which we can
// use to construct entries in our Database.
const Post = mongoose.model("Post", PostSchema);

// These lines will create a test post every time the server starts.
// You can delete this once you are creating your own posts.
// const dateTimeString = new Date().toLocaleString("en-GB");
// new Post({ message: `Test message, created at ${dateTimeString}` }).save();

module.exports = Post;
