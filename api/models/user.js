const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, required: true, unique: true }, // added unique: true to make sure the email can only be used once
  password: { type: String, required: true },
  profileImage: String,
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

// comparePassword method to use in authentication
UserSchema.methods.comparePassword = function(passwordToCompare) {
  return bcrypt.compare(passwordToCompare, this.password);
}

// checks for a duplicate key error and throws an error message - Email address is already taken
UserSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('Email address is already taken'));
  } else {
    next(error);
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
