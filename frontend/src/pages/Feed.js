import React, { useState, useEffect, useContext } from 'react';
import { Container, Box, AppBar, Toolbar, Typography, Button, CircularProgress, IconButton, Tooltip } from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AnchorIcon from '@mui/icons-material/Anchor';
import { AuthContext } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import { postAPI } from '../services/api';
function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { user, logout } = useContext(AuthContext);

  const fetchPosts = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await postAPI.getAll(pageNum, 20);
      
      if (pageNum === 1) {
        setPosts(response.data.posts);
      } else {
        setPosts(prev => [...prev, ...response.data.posts]);
      }
      
      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // websocket for real-time
    const ws = new WebSocket('ws://localhost:5000');

    ws.onopen = () => {
      console.log('Socket is connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'NEW_POST') {
        setPosts(prev => [data.post, ...prev]);
      } else if (data.type === 'DELETE_POST') {
        setPosts(prev => prev.filter(p => p._id !== data.postId));
      } else if (data.type === 'LIKE_POST' || data.type === 'UNLIKE_POST') {
        setPosts(prev =>
          prev.map(p =>
            p._id === data.postId
              ? { ...p, likesCount: p.likesCount + (data.type === 'LIKE_POST' ? 1 : -1) }
              : p
          )
        );
      } else if (data.type === 'NEW_COMMENT') {
        setPosts(prev =>
          prev.map(p =>
            p._id === data.postId
              ? { ...p, commentsCount: p.commentsCount + 1 }
              : p
          )
        );
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId));
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <Box>
      <AppBar position="sticky">
        <Toolbar>
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection:"row",cursor:"pointer" }}>
          <Typography variant="h6"  component={"div"}>
            Social Lite
          </Typography>
          <AnchorIcon sx={{ ml: 1 ,mt:0.5}} />
          </Box>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome {user?.username}
          </Typography>
         <Tooltip title="Logout">
             <IconButton
              size="medium"
              color="inherit"
              onClick={logout}
            >
                
              <ExitToAppIcon fontSize="medium"   />
            </IconButton>
            </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <CreatePost onPostCreated={handlePostCreated} />

        {loading && posts.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <PostList posts={posts} onPostDeleted={handlePostDeleted} />

            {hasMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button variant="outlined" onClick={loadMore} disabled={loading}>
                  {loading ? 'Loading...' : 'Load More'}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default Feed;
