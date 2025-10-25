export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface CreateTaskData {
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
}

export interface UpdateTaskData {
  _id: string;
  title?: string;
  description?: string;
  status?: 'Pending' | 'Completed';
}
