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
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
        });

        const user2 = await User.create({
            name: "Jane Smith",
            email: "jane@example.com",
            password: "password456",
        });

        // Create posts
        const post1 = await Post.create({
            message: "Hello, Acebook!",
            user_id: user1._id,
            imageUrl: "https://example.com/image1.jpg",
            comments: [{ user_id: user2._id, message: "Welcome to Acebook!" }],
        });

        const post2 = await Post.create({
            message: "Beautiful day!",
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
