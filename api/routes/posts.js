const express = require("express");
const router = express.Router();

const PostsController = require("../controllers/posts");

router.get("/all", PostsController.getAllPosts);
router.post("/", PostsController.createPost);
router.get("/user", PostsController.getUserPosts);
router.delete("/:id", PostsController.deletePost);

module.exports = router;
