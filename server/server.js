import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import User from "./models/User.js";

const app = express();
const PORT = 5000;

mongoose.connect("mongodb://localhost:27017/centennialbook", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.send({ message: "User created" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.send({ message: "Login successful" });
  } else {
    res.send({ message: "Invalid credentials" });
  }
});

// Update username endpoint
app.put("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const { newUsername } = req.body;

    const currentUser = req.header("x-username");

    if (username !== currentUser) {
      return res
        .status(403)
        .send({ message: "Unauthorized to update this account" });
    }

    if (!newUsername || newUsername.trim() === "") {
      return res.status(400).send({ message: "New username cannot be empty" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { username },
      { username: newUsername },
      { new: true }
    );

    if (updatedUser) {
      res.send({ message: "Username updated successfully", user: updatedUser });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
});

app.delete("/profile/:username", async (req, res) => {
  try {
    const { username } = req.params;

    const currentUser = req.header("x-username");

    if (username !== currentUser) {
      return res
        .status(403)
        .send({ message: "Unauthorized to delete this account" });
    }

    const deletedUser = await User.findOneAndDelete({ username });
    if (deletedUser) {
      res.send({ message: "User account deleted successfully" });
    } else {
      res.status(404).send({ message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
