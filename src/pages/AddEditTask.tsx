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
  CircularProgress,
  SelectChangeEvent,
  Skeleton,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBarComponent from '../components/AppBarComponent';
import { CreateTaskData, UpdateTaskData } from '@/types/task';
import { useCreateTask, useTask, useUpdateTask } from '@/services/hooks/useTasks';

const AddEditTask: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editTask = location.state?.task;

  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    status: 'Pending',
  });
  const [formError, setFormError] = useState('');

  // Fetch task data if in edit mode
  const { data: task, isLoading: isLoadingTask } = useTask(editTask?._id);
  const { mutate: createTask, isPending: isCreating } = useCreateTask();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const isEditMode = !!editTask;
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    // Use the task from the hook if available, otherwise use the passed task
    const currentTask = task || editTask;
    if (currentTask && isEditMode) {
      setFormData({
        title: currentTask.title,
        description: currentTask.description,
        status: currentTask.status,
      });
    }
  }, [task, editTask, isEditMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title.trim()) {
      setFormError('Title is required');
      return;
    }

    if (!formData.description.trim()) {
      setFormError('Description is required');
      return;
    }

    if (isEditMode) {
      const updateData: UpdateTaskData = {
        _id: editTask._id,
        ...formData,
      };
      updateTask(updateData, {
        onSuccess: () => {
          navigate('/dashboard');
        },
      });
    } else {
      createTask(formData, {
        onSuccess: () => {
          navigate('/dashboard');
        },
      });
    }
  };

  const handleInputChange =
    (field: keyof CreateTaskData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSelectChange = (e: SelectChangeEvent) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value as 'Pending' | 'Completed',
    }));
  };

  if (isEditMode && isLoadingTask) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBarComponent />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mb: 3 }}>
            Back to Dashboard
          </Button>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={30} sx={{ mb: 3 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={56} />
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarComponent />

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mb: 3 }}>
          Back to Dashboard
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {isEditMode ? 'Edit Task' : 'Add New Task'}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {isEditMode ? 'Update your task details' : 'Create a new task to track your work'}
          </Typography>

          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Task Title"
              value={formData.title}
              onChange={handleInputChange('title')}
              margin="normal"
              required
              disabled={isSubmitting}
              autoFocus
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={handleInputChange('description')}
              margin="normal"
              required
              multiline
              rows={4}
              disabled={isSubmitting}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={handleSelectChange}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? (
                  <CircularProgress size={24} />
                ) : isEditMode ? (
                  'Update Task'
                ) : (
                  'Create Task'
                )}
              </Button>

              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
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
