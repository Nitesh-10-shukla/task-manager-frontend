// pages/Dashboard.tsx
import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Pagination,
  Stack,
  Alert,
  Skeleton,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppBarComponent from '../components/AppBarComponent';
import TaskCard from '../components/TaskCard';
import { Task } from '../types';
import { useDeleteTask, useTasks, useToggleTaskStatus } from '@/services/hooks/useTasks';

const ITEMS_PER_PAGE = 5;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  const { data: tasksData, isLoading, error } = useTasks(page, ITEMS_PER_PAGE);
  const { deleteTask, isDeleting } = useDeleteTask();
  const { toggleTaskStatus, isToggling } = useToggleTaskStatus();

  const handleEdit = (task: Task) => {
    navigate('/task/edit', { state: { task } });
  };

  const handleDelete = (_id: string) => {
    deleteTask(_id);
  };

  const handleToggleStatus = (_id: string) => {
    toggleTaskStatus(_id);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = tasksData?.totalPages || Math.ceil((tasksData?.total || 0) / ITEMS_PER_PAGE);

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBarComponent />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            Failed to load tasks. Please try again.
          </Alert>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBarComponent />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              My Tasks
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tasksData?.total
                ? `Total: ${tasksData.total} tasks`
                : 'Manage your tasks efficiently'}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/task/add')}
            size="large"
          >
            Add Task
          </Button>
        </Box>

        {isLoading ? (
          <Box>
            {[...Array(3)].map((_, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
              </Box>
            ))}
          </Box>
        ) : !tasksData?.tasks || tasksData.tasks.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: 'background.paper',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No tasks yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first task to get started
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/task/add')}>
              Add Task
            </Button>
          </Box>
        ) : (
          <>
            <Box>
              {tasksData.tasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  isDeleting={isDeleting(task._id)}
                  isToggling={isToggling(task._id)}
                />
              ))}
            </Box>

            {totalPages > 1 && (
              <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Stack>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Dashboard;
