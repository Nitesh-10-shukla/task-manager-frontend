import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBarComponent from '../components/AppBarComponent';
import { Task } from '../components/TaskCard';

const AddEditTask: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editTask = location.state?.task as Task | undefined;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'Pending' | 'Completed'>('Pending');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description);
      setStatus(editTask.status);
    }
  }, [editTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!description.trim()) {
      setError('Description is required');
      return;
    }

    // Get existing tasks
    const storedTasks = localStorage.getItem('tasks');
    const tasks: Task[] = storedTasks ? JSON.parse(storedTasks) : [];

    if (editTask) {
      // Update existing task
      const updatedTasks = tasks.map((task) =>
        task.id === editTask.id
          ? { ...task, title, description, status }
          : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } else {
      // Create new task
      const newTask: Task = {
        id: `task-${Date.now()}`,
        title,
        description,
        status,
        createdDate: new Date().toISOString(),
      };
      tasks.unshift(newTask);
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    setSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarComponent />
      
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {editTask ? 'Edit Task' : 'Add New Task'}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {editTask ? 'Update your task details' : 'Create a new task to track your work'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Task {editTask ? 'updated' : 'created'} successfully!
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
              required
              autoFocus
            />

            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              required
              multiline
              rows={4}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value as 'Pending' | 'Completed')}
              >
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<Save />}
                fullWidth
              >
                {editTask ? 'Update Task' : 'Create Task'}
              </Button>
              
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                fullWidth
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default AddEditTask;
