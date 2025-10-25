export interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message: string;
}

export type ErrorWithMessage = {
  message: string;
};
