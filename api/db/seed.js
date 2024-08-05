/*

Instructions

- Go to a terminal and go to the route of the acebook project.
- cd api
- node db/seed.js

You'll see a success message.


*/
const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const { connectToDatabase } = require("./db");
require("dotenv").config();

const seedData = async () => {
    try {
        await connectToDatabase();
        // Clear existing data
        await User.deleteMany({});
        await Post.deleteMany({});
        
        // Create users
        const user1 = await User.create({
            name: "Elon Musk",
            email: "elon@musk.com",
            password: "password123",
        });
        const user2 = await User.create({
            name: "Bill Gates",
            email: "bill@gates.com",
            password: "password456",
        });
        
        // Create posts
        const post1 = await Post.create({
            message: "Government shelves £1.3bn UK tech and AI plans",
            user_id: user1._id,
            imageUrl: "https://example.com/image1.jpg",
            comments: [{ user_id: user2._id, message: "That is a shame" }],
        });
        const post2 = await Post.create({
            message: "Intel axes 15,000 jobs after sales tumble",
            user_id: user2._id,
            imageUrl: "https://example.com/image2.jpg",
            comments: [{ user_id: user1._id, message: "Gosh, the market is on a downward turn!" }],
        });

        const post3 = await Post.create({
          message: "Guinea pig home in cash crunch after Facebook funding row",
          user_id: user2._id,
          imageUrl: "https://example.com/image2.jpg",
          comments: [{ user_id: user1._id, message: "Indeed it is!" }],
      });

        console.log("Seed data created successfully");
    } catch (error) {
        console.error("Error creating seed data:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedData();