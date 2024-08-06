const request = require("supertest");
const JWT = require("jsonwebtoken");
const app = require("../../app");
const Post = require("../../models/post");
const User = require("../../models/user");

require("../mongodb_helper");

const secret = process.env.JWT_SECRET;

const createToken = (userId) => {
  return JWT.sign(
    {
      user_id: userId,
      // Backdate this token of 5 minutes
      iat: Math.floor(Date.now() / 1000) - 5 * 60,
      // Set the JWT token to expire in 10 minutes
      exp: Math.floor(Date.now() / 1000) + 10 * 60,
    },
    secret
  );
};

let token;
let postId;
let user;

describe("/comments", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    user = new User({
      email: "post-test@test.com",
      password: "12345678",
    });
    await user.save();

    token = createToken(user._id);

    const post = new Post({
      message: "Test post",
      user_id: user._id,
    });
    await post.save();
    postId = post._id;
  });
  // the line below updates the comments to be empty without deleting all posts and users
  afterEach(async () => {
    await Post.updateOne({ _id: postId }, { $set: { comments: [] } });
  });

  describe("POST a comment when a valid token is present", () => {
    test("responds with a 201", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({ comment: "This is a test comment", post_id: postId });

      expect(response.status).toEqual(201);
    });

    test("creates a new comment", async () => {
      await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({ comment: "This is a test comment", post_id: postId });

      const post = await Post.findById(postId);
      expect(post).not.toBeNull();
      expect(post.comments.length).toEqual(1);
      expect(post.comments[0].comment).toEqual("This is a test comment");
    });

    test("returns a new token", async () => {
      const response = await request(app)
        .post("/comments")
        .set("Authorization", `Bearer ${token}`)
        .send({ comment: "Test comment", post_id: postId });

      const newToken = response.body.token;
      const newTokenDecoded = JWT.decode(newToken, secret);
      const oldTokenDecoded = JWT.decode(token, secret);

      expect(newTokenDecoded.iat > oldTokenDecoded.iat).toEqual(true);
    });
  });

  describe("POST, when token is missing", () => {
    test("responds with a 401", async () => {
      const response = await request(app)
        .post("/comments")
        .send({ comment: "Test comment", post_id: postId });

      expect(response.status).toEqual(401);
    });

    test("a comment is not created", async () => {
      await request(app)
        .post("/comments")
        .send({ comment: "Test comment", post_id: postId });

      const post = await Post.findById(postId);
      expect(post).not.toBeNull();
      expect(post.comments.length).toEqual(0);
    });

    test("a token is not returned", async () => {
      const response = await request(app)
        .post("/comments")
        .send({ comment: "Test comment", post_id: postId });

      expect(response.body.token).toBeUndefined();
    });
  });
});
