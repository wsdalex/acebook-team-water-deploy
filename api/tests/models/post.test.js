require("../mongodb_helper");
const User = require("../../models/user");
const Post = require("../../models/post");

describe("Post model", () => {
  beforeEach(async () => {
    await Post.deleteMany({});
  });

  it("has a message", () => {
    const post = new Post({ message: "some message" });
    expect(post.message).toEqual("some message");
  });

  it("can list all posts", async () => {
    const posts = await Post.find();
    expect(posts).toEqual([]);
  });

  it("can save a post", async () => {
    const post = new Post({ message: "some message" });

    await post.save();
    const posts = await Post.find();
    expect(posts[0].message).toEqual("some message");
  });

  test("has a userid", async () => {
    const user = new User({ email: "email", password: "passsword" });
    await user.save();
    const post = new Post({ user_id: user._id });
    await post.save();
    const posts = await Post.find();
    expect(posts[0].user_id.toString()).toEqual(user._id.toString());
  });

  test("has photoUrl", async () => {
    const post = new Post({ imageUrl: "photo.link" });
    await post.save();
    const posts = await Post.find();
    expect(posts[0].imageUrl).toEqual("photo.link");
  });

  test("has comments", async () => {
    const user = new User({ email: "email", password: "passsword" });
    await user.save();
    const post = new Post({ message: "some message" });
    const comment = {
      user_id: user._id,
      message: "lol",
    };
    post.comments.push(comment);
    await post.save();

    const posts = await Post.find();
    const comments = posts[0].comments;
    expect(comments[0].message).toBe("lol");
    expect(comments[0].user_id.toString()).toBe(user._id.toString());
  });
});
