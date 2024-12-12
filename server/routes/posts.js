// server/routes/posts.js
const express = require('express');
const multer = require('multer');
const Post = require('../models/Post'); // Assuming you have a Post model
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Route to handle new post submissions
router.post('/create', upload.single('image'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const newPost = new Post({
      title,
      content,
      image,
      createdAt: new Date(),
    });

    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Search and filter posts
router.get('/search', async (req, res) => {
  const { keyword, category, startDate, endDate } = req.query;

  const filter = {};
  if (keyword) filter.title = { $regex: keyword, $options: 'i' }; // Case-insensitive search
  if (category) filter.category = category;
  if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  try {
      const posts = await Post.find(filter);
      res.status(200).json(posts);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching posts', error });
  }
});



module.exports = router;
