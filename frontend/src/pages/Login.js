import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import AnchorIcon from '@mui/icons-material/Anchor';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import {
  

  Avatar,
  IconButton,
   Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
  Container, Box, TextField, Button, Typography, Paper, Alert
} from '@mui/material';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authAPI.login({ email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Box display={"flex"} justifyContent={"space-between"} alignItems={"center"} mx={10}  mt={5}>
     <p style={{cursor:"pointer"}}>1</p>
     <p style={{cursor:"pointer"}}>2</p>
     <p style={{cursor:"pointer"}}>3</p>
     <p style={{cursor:"pointer"}}>4</p>
     <p style={{cursor:"pointer"}}>5</p>
     </Box>
    </>)
     {/* <Container maxWidth="sm">
       <Box
    //     sx={{
    //       marginTop: 8,
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //     }}
    //   >
    //     <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
    //       <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
    //         <Typography variant="h4" component="h1">
    //           Social Lite
    //         </Typography>
    //         <AnchorIcon sx={{ ml: 1, mb: 0.5 }} fontSize="large" />
    //       </Box>
          
    //       <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
    //         Login to your account
    //       </Typography>

    //       {error && (
    //         <Alert severity="error" sx={{ mb: 2 }}>
    //           {error}
    //         </Alert>
    //       )}

    //       <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
    //         <TextField
    //           margin="normal"
    //           fullWidth
    //           required
    //           label="Email Address"
    //           type="email"
    //           autoComplete="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           autoFocus
    //         />
    //         <TextField
    //           margin="normal"
    //           fullWidth
    //           required
    //           label="Password"
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
             
    //         />
    //         <Button
    //           type="submit"
    //           fullWidth
    //           variant="contained"
    //           disabled={loading}
    //           sx={{ mt: 3, mb: 2 }}
    //         >
    //           {loading ? 'Logging in...' : 'Login'}
    //         </Button>
            
    //         <Box textAlign="center">
    //           <Link to="/register" style={{ textDecoration: 'none' }}>
    //             <Typography variant="body2" color="primary">
    //               Don't have an account? Register
    //             </Typography>
    //           </Link>
    //         </Box>
    //       </Box>
    //     </Paper>
    //   </Box>
    // </Container> */}
  
}

export default Login;
