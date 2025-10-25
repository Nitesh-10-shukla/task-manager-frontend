import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi } from '../api/tasks';
import { useToast } from '@/components/ui/use-toast';
import { CreateTaskData, UpdateTaskData, Task } from '@/types/task';
import { useState } from 'react';
import { ApiError } from '@/types/error';

export const useTasks = (page: number = 1, limit: number = 5) => {
  return useQuery({
    queryKey: ['tasks', { page, limit }],
    queryFn: () => taskApi.getTasks(page, limit),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => taskApi.getTask(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateTaskData) => taskApi.createTask(data),
    onSuccess: (newTask: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.setQueryData(['task', newTask._id], newTask);

      toast({
        title: 'Success',
        description: 'Task created successfully',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create task',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UpdateTaskData) => taskApi.updateTask(data),
    onSuccess: (updatedTask: Task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.setQueryData(['task', updatedTask._id], updatedTask);

      toast({
        title: 'Success',
        description: 'Task updated successfully',
      });
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update task',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: (_id: string) => taskApi.deleteTask(_id),
    onSuccess: (_, deletedId) => {
      setDeletingIds((prev) => prev.filter((id) => id !== deletedId));
      queryClient.removeQueries({ queryKey: ['task', deletedId] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });

      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
    },
    onError: (error: ApiError, deletedId: string) => {
      setDeletingIds((prev) => prev.filter((id) => id !== deletedId));
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete task',
        variant: 'destructive',
      });
    },
  });

  const deleteTask = (_id: string) => {
    setDeletingIds((prev) => [...prev, _id]);
    mutation.mutate(_id);
  };

  return {
    deleteTask,
    isDeleting: (id: string) => deletingIds.includes(id),
    isPending: mutation.isPending,
  };
};

export const useToggleTaskStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [currentlyToggling, setCurrentlyToggling] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (_id: string) => taskApi.toggleTaskStatus(_id),
    onMutate: (_id: string) => {
      setCurrentlyToggling(_id);
      return { _id };
    },
    onSuccess: (updatedTask: Task) => {
      setCurrentlyToggling(null);
      queryClient.setQueryData(['task', updatedTask._id], updatedTask);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error: ApiError, _id: string) => {
      setCurrentlyToggling(null);

      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to toggle task status',
        variant: 'destructive',
      });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const toggleTaskStatus = (_id: string) => {
    mutation.mutate(_id);
  };

  return {
    toggleTaskStatus,
    isToggling: (id: string) => currentlyToggling === id,
    isPending: mutation.isPending,
  };
};
