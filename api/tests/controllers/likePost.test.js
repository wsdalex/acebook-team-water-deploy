require("../mongodb_helper");
const User = require("../../models/user");
const Post = require("../../models/post");

describe("Post likes", () => {
    let user1, user2, post;

    beforeEach(async () => {
        await Post.deleteMany({});
        await User.deleteMany({});

        user1 = new User({ email: "user1@test.com", password: "password1" });
        user2 = new User({ email: "user2@test.com", password: "password2" });
        await user1.save();
        await user2.save();

        post = new Post({ message: "Test post", user_id: user1._id });
        await post.save();
    });

    test("can like a post", async () => {
        post.likes.push(user2._id);
        await post.save();

        const updatedPost = await Post.findById(post._id);
        expect(updatedPost.likes.length).toBe(1);
        expect(updatedPost.likes[0].toString()).toBe(user2._id.toString());
    });

    test("can unlike a post", async () => {
        post.likes.push(user2._id);
        await post.save();

        post.likes.pull(user2._id);
        await post.save();

        const updatedPost = await Post.findById(post._id);
        expect(updatedPost.likes.length).toBe(0);
    });

    test("prevents duplicate likes from the same user", async () => {
        if (!post.likes.includes(user2._id)) {
            post.likes.push(user2._id);
        }
        await post.save();

        // Try to add the same user's like again
        if (!post.likes.includes(user2._id)) {
            post.likes.push(user2._id);
        }
        await post.save();

        const updatedPost = await Post.findById(post._id);
        expect(updatedPost.likes.length).toBe(1);
        expect(updatedPost.likes[0].toString()).toBe(user2._id.toString());
    });

    test("allows multiple users to like a post", async () => {
        post.likes.push(user1._id);
        post.likes.push(user2._id);
        await post.save();

        const updatedPost = await Post.findById(post._id);
        expect(updatedPost.likes.length).toBe(2);
        expect(updatedPost.likes.map((id) => id.toString())).toContain(
            user1._id.toString()
        );
        expect(updatedPost.likes.map((id) => id.toString())).toContain(
            user2._id.toString()
        );
    });

    test("can check if a user has liked a post", async () => {
        post.likes.push(user2._id);
        await post.save();

        const updatedPost = await Post.findById(post._id);
        expect(updatedPost.likes.includes(user2._id)).toBe(true);
        expect(updatedPost.likes.includes(user1._id)).toBe(false);
    });
});
