import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import { Edit, Delete, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  createdDate: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggleStatus }) => {
  const { user } = useAuth();

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {task.description}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={task.status}
                color={task.status === 'Completed' ? 'success' : 'warning'}
                size="small"
                icon={task.status === 'Completed' ? <CheckCircle /> : <RadioButtonUnchecked />}
              />
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(task.createdDate).toLocaleDateString()}
              </Typography>
            </Stack>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onToggleStatus(task.id)}
              title="Toggle Status"
            >
              {task.status === 'Completed' ? <RadioButtonUnchecked /> : <CheckCircle />}
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(task)}
              title="Edit Task"
            >
              <Edit />
            </IconButton>
            {user?.role === 'admin' && (
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(task.id)}
                title="Delete Task"
              >
                <Delete />
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
