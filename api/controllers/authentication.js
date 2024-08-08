const User = require("../models/user");
const { generateToken } = require("../lib/token");
const bcrypt = require("bcrypt");

const createToken = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log("Auth Error: User not found");
            return res.status(401).json({ message: "User not found" });
        }

        // comparePassword method from user model
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log("Auth Error: Passwords do not match");
            return res.status(401).json({ message: "Password incorrect" });
        }

        const token = generateToken(user.id);
        res.status(201).json({
            token: token,
            message: "OK",
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                profileImage: user.profileImage,
            },
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};

const AuthenticationController = {
    createToken: createToken,
};

module.exports = AuthenticationController;
