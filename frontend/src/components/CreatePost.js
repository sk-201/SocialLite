import React,{ useState, useContext } from 'react';
import { Card, CardContent, TextField, Button, Box, Alert } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { postAPI } from '../services/api';

function CreatePost() {
  const [text, setText] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Post text is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await postAPI.create({ text });
      console.log('Post created:', response.data);
      setText('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder={`What's on your mind, ${user?.username}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            sx={{ mb: 2 }}
          />


          <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection:"row-reverse" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !text.trim()}
            >
              {loading ? 'Posting...' : 'Post'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default CreatePost;
