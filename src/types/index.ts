export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  data: AuthData;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
}

export type TasksResponse = PaginatedResponse<Task>;
