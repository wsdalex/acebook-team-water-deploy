const User = require("../models/user");

const create = (req, res) => {

  const name = req.body.name
  const email = req.body.email;
  const password = req.body.password;
  const profileImage = req.body.profileImage;

  const user = new User({ name, email, password, profileImage });
  user
    .save()
    .then((user) => {
      console.log("User created, id:", user._id.toString());
      res.status(201).json({ message: "OK" });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Email address is already taken") { // added if else statement for checking unique email
        res.status(400).json({ message: "Email address is already taken" });
    } else {
        res.status(400).json({ message: "Something went wrong" });
    }
    });

};

const UsersController = {
    create: create,
};

module.exports = UsersController;
