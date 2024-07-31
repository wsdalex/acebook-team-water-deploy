const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: String,
});

UserSchema.pre('save', function(next) {
  const user = this;

  // only hash the password if it's new or modified
  if (!user.isModified('password')) return next();

  // generating salts
  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);

    // hash the password using the salt generated
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // change the password from the user input to the hashed one
      user.password = hash;
      next();
    });
  });
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
