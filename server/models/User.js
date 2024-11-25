import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  // email based username
  username: {
    type: String,
    required: "Username is required",
    unique: true,
    match: [
      /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/g,
      "Please enter a valid email address",
    ],
  },
  password: {
    type: String,
    required: "Password is required",
  },
  isAdmin: {
    type: Boolean,
    default: false, // Default to false for regular users
  },
});

const User = mongoose.model("User", UserSchema);

export default User;
