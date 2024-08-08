const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
const User = require("../../models/user");

require("../mongodb_helper");

describe("FriendsController", () => {
  let user1, user2;

  beforeEach(async () => {
    await User.deleteMany({});
    user1 = new User({
      name: "User One",
      email: "user1@example.com",
      password: "password",
    });
    user2 = new User({
      name: "User Two",
      email: "user2@example.com",
      password: "password",
    });
    await user1.save();
    await user2.save();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("POST /friends/send", () => {
    test("sends a friend request", async () => {
      const response = await request(app)
        .post("/friends/send")
        .send({ senderId: user1._id, recipientId: user2._id });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Friend request sent");

      const updatedUser1 = await User.findById(user1._id);
      const updatedUser2 = await User.findById(user2._id);

      expect(updatedUser1.friendRequestsSent).toContainEqual(user2._id);
      expect(updatedUser2.friendRequestsReceived).toContainEqual(user1._id);
    });

    test("returns an error if the request fails", async () => {
      const response = await request(app)
        .post("/friends/send")
        .send({ senderId: user1._id, recipientId: "invalidId" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Something went wrong with sending a friend request"
      );
    });
  });

  describe("POST /friends/accept", () => {
    beforeEach(async () => {
      user1.friendRequestsSent.push(user2._id);
      user2.friendRequestsReceived.push(user1._id);
      await user1.save();
      await user2.save();
    });

    test("accepts a friend request", async () => {
      const response = await request(app)
        .post("/friends/accept")
        .send({ userId: user2._id, friendId: user1._id });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Friend request accepted");

      const updatedUser1 = await User.findById(user1._id);
      const updatedUser2 = await User.findById(user2._id);

      expect(updatedUser1.friends).toContainEqual(user2._id);
      expect(updatedUser2.friends).toContainEqual(user1._id);

      expect(updatedUser1.friendRequestsSent).not.toContainEqual(user2._id);
      expect(updatedUser2.friendRequestsReceived).not.toContainEqual(user1._id);
    });

    test("returns an error if the acceptance fails", async () => {
      const response = await request(app)
        .post("/friends/accept")
        .send({ userId: user2._id, friendId: "invalidId" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Something went wrong with accepting a friend request"
      );
    });
  });

  describe("POST /friends/decline", () => {
    beforeEach(async () => {
      user1.friendRequestsSent.push(user2._id);
      user2.friendRequestsReceived.push(user1._id);
      await user1.save();
      await user2.save();
    });

    test("declines a friend request", async () => {
      const response = await request(app)
        .post("/friends/decline")
        .send({ userId: user2._id, friendId: user1._id });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Friend request declined");

      const updatedUser1 = await User.findById(user1._id);
      const updatedUser2 = await User.findById(user2._id);

      expect(updatedUser1.friendRequestsSent).not.toContainEqual(user2._id);
      expect(updatedUser2.friendRequestsReceived).not.toContainEqual(user1._id);
    });

    test("returns an error if the decline fails", async () => {
      const response = await request(app)
        .post("/friends/decline")
        .send({ userId: user2._id, friendId: "invalidId" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Something went wrong with declining a friend request"
      );
    });
  });

  describe("DELETE /friends/remove", () => {
    beforeEach(async () => {
      user1.friends.push(user2._id);
      user2.friends.push(user1._id);
      await user1.save();
      await user2.save();
    });

    test("removes a friend", async () => {
      const response = await request(app)
        .delete("/friends/remove")
        .send({ userId: user1._id, friendId: user2._id });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Friend removed successfully");

      const updatedUser1 = await User.findById(user1._id);
      const updatedUser2 = await User.findById(user2._id);

      expect(updatedUser1.friends).not.toContainEqual(user2._id);
      expect(updatedUser2.friends).not.toContainEqual(user1._id);
    });

    test("returns an error if the removal fails", async () => {
      const response = await request(app)
        .delete("/friends/remove")
        .send({ userId: user1._id, friendId: "invalidId" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Something went wrong with removing a friend"
      );
    });
  });

  describe("GET /friends/:id", () => {
    beforeEach(async () => {
      user1.friends.push(user2._id);
      await user1.save();
    });

    test("retrieves the friends list", async () => {
      const response = await request(app).get(`/friends/${user1._id}`);

      expect(response.status).toBe(200);
      expect(response.body.friends.length).toBe(1);
      expect(response.body.friends[0]._id).toEqual(user2._id.toString());
    });

    test("returns an error if retrieving friends list fails", async () => {
      const response = await request(app).get(`/friends/invalidId`);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Something went wrong with retrieving the friends list"
      );
    });
  });
});
