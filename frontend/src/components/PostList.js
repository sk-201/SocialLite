import React from 'react';
import { Box } from '@mui/material';
import PostCard from './PostCard';

function PostList({ posts, onPostDeleted }) {
  return (
    <Box>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} onPostDeleted={onPostDeleted} />
      ))}
      {posts.length === 0 && (
        <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
          No posts yet. Be the first to post!
        </Box>
      )}
    </Box>
  );
}

export default PostList;
