import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Box,
  Stack,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  isDeleting?: boolean;
  isToggling?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
  isDeleting = false,
  isToggling = false,
}) => {
  const { user } = useAuth();

  return (
    <Card
      sx={{
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: isToggling || isDeleting ? 'none' : 'translateY(-2px)',
          boxShadow: isToggling || isDeleting ? 1 : 4,
        },
        opacity: isDeleting || isToggling ? 0.6 : 1,
        pointerEvents: isDeleting || isToggling ? 'none' : 'auto',
      }}
    >
      <CardContent>
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="div" gutterBottom>
              {task.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {task.description}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                label={task.status}
                color={task.status === 'Completed' ? 'success' : 'warning'}
                size="small"
                icon={task.status === 'Completed' ? <CheckCircle /> : <RadioButtonUnchecked />}
              />
              <Typography variant="caption" color="text.secondary">
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </Typography>
              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <Typography variant="caption" color="text.secondary">
                  Updated: {new Date(task.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </Stack>
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onToggleStatus(task._id)}
              title={`Mark as ${task.status === 'Completed' ? 'Pending' : 'Completed'}`}
              disabled={isToggling || isDeleting}
            >
              {isToggling ? (
                <CircularProgress size={20} />
              ) : task.status === 'Completed' ? (
                <CheckCircle />
              ) : (
                <RadioButtonUnchecked />
              )}
            </IconButton>
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit(task)}
              title="Edit Task"
              disabled={isToggling || isDeleting}
            >
              <Edit />
            </IconButton>
            {user?.role === 'Admin' && (
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(task._id)}
                title="Delete Task"
                disabled={isDeleting || isToggling}
              >
                {isDeleting ? <CircularProgress size={20} /> : <Delete />}
              </IconButton>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
