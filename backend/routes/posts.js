const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// Rate limiting for post creation (5 posts per 15 minutes)
const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many posts created, please try again later' }
});

// Create post
router.post('/', authMiddleware, postLimiter, async (req, res) => {
  try {
    const { text } = req.body;
console.log(req.body);
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Post text is required' });
    }

    const post = new Post({
      user: req.userId,
      text,
    });

    await post.save();
    await post.populate('user', '-password');

    // Broadcast new post to all connected WebSocket clients
    if (global.broadcast) {
      global.broadcast({
        type: 'NEW_POST',
        post: post
      });
    }

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all posts (feed)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', '-password');

    const total = await Post.countDocuments();

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user owns the post
    if (post.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await post.deleteOne();

    // Broadcast deletion to all connected clients
    if (global.broadcast) {
      global.broadcast({
        type: 'DELETE_POST',
        postId: req.params.id
      });
    }

    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
