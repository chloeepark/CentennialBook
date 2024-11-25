import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import User from "./models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import eventRoutes from "./routes/events.js";
dotenv.config();

const app = express();
const PORT = 5001;

mongoose.connect("mongodb://localhost:27017/centennialbook", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

app.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    //validation
    return res.status(400).send({ message: "Username and password required" });
  }

  try {
    //check for existing user with that username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: "Username Taken" });
    }
    const user = new User({ username, password });
    await user.save(); //everything is fine, save
  } catch (error) {
    if (error.name == "ValidationError") {
      return res.status(400).send({ message: error.message });
    }
    return res.status(500).send({ message: error.message });
  }
  res.send({ message: "User created" });
});

app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .send({ message: "Username and password are required" });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send({ message: "Username is already taken" });
    }

    // Create new admin user
    const user = new User({ username, password, isAdmin: true });
    await user.save();
    res.send({ message: "Admin account created successfully!" });
  } catch (error) {
    console.error("Error during admin signup:", error);
    res.status(500).send({ message: "An error occurred during admin signup" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username and password
    const user = await User.findOne({ username, password });
    if (!user) {
      return res.status(401).send({ message: "Invalid credentials" });
    }

    // Create a token with the isAdmin flag
    const token = jwt.sign(
      { username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Include isAdmin in the response
    res.send({
      message: "Login successful",
      token,
      isAdmin: user.isAdmin, // Pass this to the client
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).send({ message: "An error occurred during login" });
  }
});

//forgot password
app.post("/forgotPassword", async (req, res) => {
  const { username } = req.body;
  if (!username) {
    return res.status(400).send({ message: "Username is required " });
  }
  //search for user
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    //create email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });
    //token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });
    //set up mail option (subject, to, from, etc..)
    const mailOption = {
      from: process.env.EMAIL,
      to: username,
      subject: "Password Reset Request",
      text: `We have received a request to reset your password. Please reset your password using the link below.", ${process.env.FRONTEND}/${token}`,
    };

    await transporter.sendMail(mailOption);
    //send the email
    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        return res.status(500).send({ message: error.message }, error);
      }
      res.send({ message: "Password Request Email Sent!" }, info);
    });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
});

//reset password
app.post("/resetPassword/:token", async (req, res) => {
  const token = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      //page not found if user is not found
      return res.status(404).send({ message: "User not found" });
    }

    user.password = password;
    await user.save();
    res.send({ message: "Password reset!" });
  } catch (error) {
    res.status(400).send(
      {
        message:
          "Something went wrong, please resubmit password reset request. ",
      },
      error
    );
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  console.log("Token received in middleware:", token);
  if (!token)
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch {
    res.status(403).send({ message: "Invalid token" });
  }
};

app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ username: user.username });
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
});

// Update username endpoint
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    const { newUsername } = req.body;

    // Ensure the new username is provided
    if (!newUsername || newUsername.trim() === "") {
      return res.status(400).send({ message: "New username cannot be empty" });
    }

    // Attempt to update the username and enforce validation
    const updatedUser = await User.findOneAndUpdate(
      { username: req.user.username },
      { username: newUsername },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    // Create a new token with the updated username
    const newToken = jwt.sign(
      { username: newUsername },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.send({
      message: "Username updated successfully",
      user: updatedUser,
      token: newToken,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Check to make sure username entered is an email
      if (error.errors && error.errors.username) {
        return res.status(400).send({ message: "Please enter a valid email" });
      }
    }
    console.error("Error updating username:", error);
    return res
      .status(500)
      .send({ message: "An error occurred", error: error.message });
  }
});

app.delete("/profile", authenticateToken, async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      username: req.user.username,
    });
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

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static("uploads"));

app.use("/routes/events", eventRoutes);
