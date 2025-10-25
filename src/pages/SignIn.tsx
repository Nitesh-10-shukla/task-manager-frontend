import React, { useState, useEffect } from 'react';
import { Container, Box, Paper, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSignIn } from '@/services/hooks/useAuth';
import PasswordInput from '@/components/PasswordInput';
import { ApiError } from '@/types/error';

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: signIn, isPending, error } = useSignIn();
  const { isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }

    signIn({ email, password });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <CheckCircle sx={{ fontSize: 40, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" component="h1">
              Task Manager
            </Typography>
          </Box>

          <Typography variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Welcome back! Please sign in to continue.
          </Typography>

          {(formError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError ||
                (error as ApiError)?.response?.data?.message ||
                'Invalid email or password'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              autoComplete="email"
              autoFocus
            />

            <Box sx={{ mt: 2, mb: 1 }}>
              <PasswordInput
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isPending}
              sx={{ mt: 3, mb: 2 }}
            >
              {isPending ? 'Signing In...' : 'Sign In'}
            </Button>

            {/* <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2">
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  underline="hover"
                >
                  Forgot Password?
                </Link>
              </Typography>
            </Box> */}

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/signup')}
                  underline="hover"
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignIn;
