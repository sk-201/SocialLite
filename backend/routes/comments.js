const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const Post = require('../models/Post');
const authMiddleware = require('../middleware/auth');

// Create comment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { postId, text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = new Comment({
      post: postId,
      user: req.userId,
      text
    });

    await comment.save();
    await comment.populate('user', '-password');

    // Update comment count
    post.commentsCount += 1;
    await post.save();

    // Broadcast new comment
    if (global.broadcast) {
      global.broadcast({
        type: 'NEW_COMMENT',
        comment: comment,
        postId: postId
      });
    }

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments for a post
router.get('/post/:postId', authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate('user', '-password');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete comment
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const postId = comment.post;
    await comment.deleteOne();

    // Update comment count
    const post = await Post.findById(postId);
    if (post) {
      post.commentsCount = Math.max(0, post.commentsCount - 1);
      await post.save();
    }

    // Broadcast deletion
    if (global.broadcast) {
      global.broadcast({
        type: 'DELETE_COMMENT',
        commentId: req.params.id,
        postId: postId
      });
    }

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
