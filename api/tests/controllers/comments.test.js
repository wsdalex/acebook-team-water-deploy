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

describe("/comments", () => {
  beforeAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
  });

  test("POST, when a valid token is present", async () => {
    const user = new User({
      email: "post-test@test.com",
      password: "12345678",
    });
    await user.save();

    const post = new Post({
      message: "test post",
      user_id: user._id,
      comments: [],
    });

    await post.save();

    token = createToken(user._id);

    const response = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${token}`)
      .send({ comment: "test comment", post_id: post._id, user_id: user._id });

    console.log(response.body); // Debugging output
    expect(response.status).toEqual(201);
  });
});
