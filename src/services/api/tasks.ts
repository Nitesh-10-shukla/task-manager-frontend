import { CreateTaskData, Task, TasksResponse, UpdateTaskData } from '@/types/task';
import axiosInstance from '../../utils/axios';

export const taskApi = {
  getTasks: async (page: number = 1, limit: number = 5): Promise<TasksResponse> => {
    const response = await axiosInstance.get(`/api/tasks?page=${page}&limit=${limit}`);
    return response.data;
  },

  getTask: async (id: string): Promise<Task> => {
    const response = await axiosInstance.get(`/api/tasks/${id}`);
    return response.data;
  },

  createTask: async (data: CreateTaskData): Promise<Task> => {
    const response = await axiosInstance.post('/api/tasks', data);
    return response.data;
  },

  updateTask: async ({ _id, ...data }: UpdateTaskData): Promise<Task> => {
    const response = await axiosInstance.put(`/api/tasks/${_id}`, data);
    return response.data;
  },

  deleteTask: async (_id: string): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`/api/tasks/${_id}`);
    return response.data;
  },

  toggleTaskStatus: async (_id: string): Promise<Task> => {
    const response = await axiosInstance.patch(`/api/tasks/${_id}/toggle-status`);
    return response.data;
  },
};
