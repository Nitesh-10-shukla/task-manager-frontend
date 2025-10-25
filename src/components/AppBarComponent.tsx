import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import { Brightness4, Brightness7, Logout, CheckCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';

const AppBarComponent: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <CheckCircle sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>

        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {user.name} ({user.role})
            </Typography>

            <IconButton onClick={toggleTheme} color="inherit">
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <Button
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              Logout
            </Button>
            <IconButton
              onClick={handleLogout}
              color="inherit"
              sx={{ display: { xs: 'flex', sm: 'none' } }}
            >
              <Logout />
            </IconButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarComponent;
