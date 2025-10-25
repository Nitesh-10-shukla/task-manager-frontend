import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import TokenService from '@/utils/token';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { ApiError } from '@/types/error';

export const useCurrentUser = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    enabled: enabled && TokenService.hasToken(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: ApiError) => {
      if (error?.response?.status === 401) {
        TokenService.removeToken();
        return false;
      }
      return failureCount < 2;
    },
  });
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: ({ data }) => {
      if (TokenService.isValidToken(data.token)) {
        // First, clear all existing queries
        queryClient.clear();

        // Then set the new token
        TokenService.setToken(data.token);

        // Finally, fetch fresh data for the new user
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });

        toast({
          title: 'Success',
          description: 'Successfully logged in',
        });
      } else {
        throw new Error('Invalid token received');
      }
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Invalid email or password',
        variant: 'destructive',
      });
    },
  });
};

export const useSignUp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Account created successfully. Please sign in.',
      });
      navigate('/signin');
    },
    onError: (error: ApiError) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create account',
        variant: 'destructive',
      });
    },
  });
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.signOut,
    onSuccess: () => {
      // Clear all queries from the cache
      queryClient.clear();

      // Remove auth token
      TokenService.removeToken();

      // Reset query client
      queryClient.resetQueries();

      toast({
        title: 'Success',
        description: 'Successfully logged out',
      });

      // Navigate to signin page
      navigate('/signin');
    },
  });
};
