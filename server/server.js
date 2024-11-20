import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import User from "./models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"

const app = express();
const PORT = 5000;

mongoose.connect("mongodb://localhost:27017/centennialbook", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

dotenv.config()
app.use(cors());
app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) { //validation
    return res.status(400).send({ message: "Username and password required"}); 
  }

  try{ //check for existing user with that username
    const existingUser = await User.findOne({ username });
    if(existingUser) {
      return res.status(400).send({ message: "Username Taken" });
    }
    const user = new User({ username, password });
    await user.save(); //everything is fine, save
  } catch (error) {
    if(error.name == "ValidationError") {
      return res.status(400).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
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

//forgot password
app.post("/forgotPassword", async (req, res) => {
  const { username }   = req.body;
  if(!username) {
    return res.status(400).send({ message: "Username is required "});
  }
  //search for user
  const user = await User.findOne({ username });
  if(!user) {
    return res.status(400).send({ message : "User not found" });
  }
 try{
   //create email transporter
   const transporter = nodemailer.createTransport({
    service: "gmail",
    auth : {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });
  //token
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "10m"
  })
  //set up mail option (subject, to, from, etc..)
  const mailOption = {
    from: process.env.EMAIL,
    to: username,
    subject: "Password Reset Request",
    text: `We have received a request to reset your password. Please reset your password using the link below.", ${process.env.FRONTEND}/${token}`
  }
  //send the email
  transporter.sendMail(mailOption, (error, info) => {
    if(error) {
      return res.status(500).send({ message: error.message});
    }
    res.send({ message: "Password Request Email Sent!" });
  })
 } catch (error) {
    return res.status(400).send({ message: error.message });
 }
});

//reset password 
app.post("/resetPassword/:token", async (req, res) => {
  const token = req.params;
  const { password } = req.body;

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if(!user) {
      //page not found if user is not found
      return res.status(404).send({ message: "User not found" });
    }

    user.password = password;
    await user.save();
    res.send({ message : "Password reset!" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong, please resubmit password reset request. "});
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


