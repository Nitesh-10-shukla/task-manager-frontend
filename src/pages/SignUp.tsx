import React, { useState } from 'react';
import { Container, Box, Paper, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '@/services/hooks/useAuth';
import PasswordInput from '@/components/PasswordInput';
import { useToast } from '@/components/ui/use-toast';
import { ApiError } from '@/types/error';

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: signUp, isPending, error } = useSignUp();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }

    signUp(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'User',
      },
      {
        onSuccess: () => {
          toast({
            title: 'Account created successfully',
            description: 'Please sign in with your credentials',
          });
          navigate('/signin');
        },
        onError: (error) => {
          const errorMessage =
            (error as ApiError)?.response?.data?.message || 'Failed to create account';
          toast({
            title: 'Error',
            description: errorMessage,
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
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
            Sign Up
          </Typography>

          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Create your account to get started.
          </Typography>

          {(formError || error) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError ||
                (error as ApiError)?.response?.data?.message ||
                'Failed to create account'}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.name}
              onChange={handleChange('name')}
              margin="normal"
              required
              autoComplete="name"
              autoFocus
            />

            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              margin="normal"
              required
              autoComplete="email"
            />

            <Box sx={{ mt: 2, mb: 1 }}>
              <PasswordInput
                value={formData.password}
                onChange={handleChange('password')}
                label="Password"
                autoComplete="new-password"
              />
            </Box>

            <Box sx={{ mt: 2, mb: 1 }}>
              <PasswordInput
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                label="Confirm Password"
                autoComplete="new-password"
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
              {isPending ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link
                  component="button"
                  type="button"
                  onClick={() => navigate('/signin')}
                  underline="hover"
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignUp;
