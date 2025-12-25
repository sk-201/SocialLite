import React, { useState, useEffect, useContext } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
  Collapse,
  TextField,
  Button,
  Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ChatBubbleOutline,
  Delete,
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { likeAPI, commentAPI, postAPI } from '../services/api';
import CommentList from './CommentList';

function PostCard({ post, onPostDeleted }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen((prev)=>!prev);
  };  
  const { user } = useContext(AuthContext);

  useEffect(() => {
    checkIfLiked();
  }, [post._id]);

  const checkIfLiked = async () => {
    try {
      const response = await likeAPI.check(post._id);
      setLiked(response.data.liked);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    try {
      const response = await likeAPI.toggle(post._id);
      setLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleToggleComments = async () => {
    setShowComments(!showComments);
    if (!showComments && comments.length === 0) {
      await fetchComments();
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getByPost(post._id);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const response = await commentAPI.create({
        postId: post._id,
        text: commentText,
      });
      setComments([response.data, ...comments]);
      setCommentText('');
      setCommentsCount(commentsCount + 1);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleDeletePost = async () => {
  
      try {
        await postAPI.delete(post._id);
        onPostDeleted(post._id);
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter(c => c._id !== commentId));
    setCommentsCount(Math.max(0, commentsCount - 1));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            {post.user?.username?.[0]?.toUpperCase()}
          </Avatar>
        }
        action={
          post.user?._id === user?.id && (
            <IconButton onClick={toggleModal}>
              <Delete />
            </IconButton>
          )
        }
        title={post.user?.username}
        subheader={formatDate(post.createdAt)}
      />

      <CardContent>
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.text}
        </Typography>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton onClick={handleLike}>
          {liked ? <Favorite color="error" /> : <FavoriteBorder />}
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {likesCount}
        </Typography>

        <IconButton onClick={handleToggleComments} sx={{ ml: 2 }}>
          <ChatBubbleOutline />
        </IconButton>
        <Typography variant="body2" color="text.secondary">
          {commentsCount}
        </Typography>
      </CardActions>

      <Collapse in={showComments} timeout="auto" unmountOnExit>
        <CardContent>
          <Box component="form" onSubmit={handleCommentSubmit} sx={{ mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Button
              type="submit"
              variant="contained"
              size="small"
              disabled={!commentText.trim()}
            >
              Comment
            </Button>
          </Box>

          <CommentList comments={comments} onCommentDeleted={handleCommentDeleted} />
        </CardContent>
      </Collapse>
        <Dialog
       
        open={open}
        onClose={toggleModal}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          Delete Post        
          </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this post? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={toggleModal}>
            Cancel
          </Button>
          <Button onClick={handleDeletePost} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
}

export default PostCard;
