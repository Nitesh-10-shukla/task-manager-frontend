import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Pagination,
  Stack,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AppBarComponent from '../components/AppBarComponent';
import TaskCard, { Task } from '../components/TaskCard';

const ITEMS_PER_PAGE = 5;

// Mock data - replace with API calls
const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [];
  for (let i = 1; i <= 12; i++) {
    tasks.push({
      id: `task-${i}`,
      title: `Task ${i}`,
      description: `This is the description for task ${i}. It contains important details about what needs to be done.`,
      status: i % 3 === 0 ? 'Completed' : 'Pending',
      createdDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    });
  }
  return tasks;
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState(1);
  const [deleteMessage, setDeleteMessage] = useState('');

  useEffect(() => {
    // Load tasks from localStorage or use mock data
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      const mockTasks = generateMockTasks();
      setTasks(mockTasks);
      localStorage.setItem('tasks', JSON.stringify(mockTasks));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleEdit = (task: Task) => {
    navigate('/task/edit', { state: { task } });
  };

  const handleDelete = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    saveTasks(updatedTasks);
    setDeleteMessage('Task deleted successfully');
    setTimeout(() => setDeleteMessage(''), 3000);
  };

  const handleToggleStatus = (id: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? { ...task, status: task.status === 'Pending' ? 'Completed' as const : 'Pending' as const }
        : task
    );
    saveTasks(updatedTasks);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Pagination logic
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTasks = tasks.slice(startIndex, endIndex);

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
              Manage your tasks efficiently
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

        {deleteMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {deleteMessage}
          </Alert>
        )}

        {tasks.length === 0 ? (
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
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => navigate('/task/add')}
            >
              Add Task
            </Button>
          </Box>
        ) : (
          <>
            <Box>
              {paginatedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
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
