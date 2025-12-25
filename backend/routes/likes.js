const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// Toggle like
router.post('/:postId', authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if already liked
    const existingLike = await Like.findOne({ post: postId, user: userId });

    if (existingLike) {
      // Unlike
      await existingLike.deleteOne();
      post.likesCount = Math.max(0, post.likesCount - 1);
      await post.save();

      // Broadcast unlike
      if (global.broadcast) {
        global.broadcast({
          type: 'UNLIKE_POST',
          postId: postId,
          userId: userId
        });
      }

      res.json({ liked: false, likesCount: post.likesCount });
    } else {
      // Like
      const like = new Like({
        post: postId,
        user: userId
      });

      await like.save();
      post.likesCount += 1;
      await post.save();

      // Broadcast like
      if (global.broadcast) {
        global.broadcast({
          type: 'LIKE_POST',
          postId: postId,
          userId: userId
        });
      }

      res.json({ liked: true, likesCount: post.likesCount });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if user liked a post
router.get('/:postId/check', authMiddleware, async (req, res) => {
  try {
    const like = await Like.findOne({
      post: req.params.postId,
      user: req.userId
    });

    res.json({ liked: !!like });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get users who liked a post
router.get('/:postId/users', authMiddleware, async (req, res) => {
  try {
    const likes = await Like.find({ post: req.params.postId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

    res.json(likes.map(like => like.user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
