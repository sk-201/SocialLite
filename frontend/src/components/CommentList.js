import React, { useContext,useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
   Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { commentAPI } from '../services/api';

function CommentList({ comments, onCommentDeleted }) {
  const { user } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
  const [selectedId,setSelectedId] = useState(null);
    const toggleModal = () => {
      setOpen((prev)=>!prev);
    };     
  const handleDeleteComment = async () => {
 
      try {
        await commentAPI.delete(selectedId);
        onCommentDeleted(selectedId);
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
      toggleModal()
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <Box>
      {comments.map((comment) => (
        <Box
          key={comment._id}
          sx={{
            display: 'flex',
            mb: 2,
            p: 1,
            backgroundColor: '#f5f5f5',
            borderRadius: 1,
          }}
        >
          <Avatar
            sx={{ width: 32, height: 32, mr: 1, bgcolor: 'primary.main' }}
          >
            {comment.user?.username?.[0]?.toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="body2" fontWeight="bold" sx={{ mr: 1 }}>
                {comment.user?.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDate(comment.createdAt)}
              </Typography>
            </Box>
            <Typography variant="body2">{comment.text}</Typography>
          </Box>

          {comment.user?._id === user?.id && (
            <IconButton
              size="small"
              onClick={() => {
                setSelectedId(comment._id);
                toggleModal();
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          )}
        </Box>
      ))}

      {comments.length === 0 && (
        <Typography variant="body2" color="text.secondary" align="center">
          No comments yet
        </Typography>
      )}
         <Dialog
             
              open={open}
              onClose={toggleModal}
              aria-labelledby="responsive-dialog-title"
            >
              <DialogTitle id="responsive-dialog-title">
                Delete Comment        
                </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete this comment? This action cannot be undone.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={toggleModal}>
                  Cancel
                </Button>
                <Button onClick={handleDeleteComment} autoFocus>
                  Delete
                </Button>
              </DialogActions>
            </Dialog>
    </Box>
  );
}

export default CommentList;
