const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const create = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // adding bcrypt hashing - Abdallah
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(400).json({ message: "Unable to hash password" });
        } else {
            const user = new User({ email, password: hash });
            user.save()
                .then((user) => {
                    console.log("User created, id:", user._id.toString());
                    res.status(201).json({ message: "OK" });
                })
                .catch((err) => {
                    console.error(err);
                    res.status(400).json({ message: "Something went wrong" });
                });
        }
    });
};

const UsersController = {
    create: create,
};

module.exports = UsersController;
