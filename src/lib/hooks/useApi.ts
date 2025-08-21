/**
 * React Query hooks for API operations
 */

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { api } from '../api/client';
import {
  User,
  Task,
  TaskCreate,
  TaskUpdate,
  TaskComplete,
  TaskStats,
  Expense,
  ExpenseCreate,
  ExpenseUpdate,
  ExpenseStats,
  Settlement,
  Message,
  MessageCreate,
  MessageUpdate,
  MessageReact,
  MessageStats,
  PaginatedResponse,
  PaginationParams,
  ResponseMessage,
} from '../api/types';

// Query Keys
export const queryKeys = {
  tasks: ['tasks'] as const,
  task: (id: string) => ['tasks', id] as const,
  taskStats: ['tasks', 'stats'] as const,
  
  expenses: ['expenses'] as const,
  expense: (id: string) => ['expenses', id] as const,
  expenseStats: ['expenses', 'stats'] as const,
  settlements: ['expenses', 'settlements'] as const,
  
  messages: ['messages'] as const,
  message: (id: string) => ['messages', id] as const,
  messageStats: ['messages', 'stats'] as const,
  
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
};

// Task Hooks
export const useTasks = (params?: PaginationParams & { assignee_id?: string; completed?: boolean }) => {
  return useQuery({
    queryKey: [...queryKeys.tasks, params],
    queryFn: () => api.get<PaginatedResponse<Task>>('/tasks', { params }),
    staleTime: 30000, // 30 seconds
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: queryKeys.task(id),
    queryFn: () => api.get<Task>(`/tasks/${id}`),
    enabled: !!id,
  });
};

export const useTaskStats = () => {
  return useQuery({
    queryKey: queryKeys.taskStats,
    queryFn: () => api.get<TaskStats>('/tasks/stats'),
    staleTime: 60000, // 1 minute
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: TaskCreate) => api.post<Task>('/tasks', taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskStats });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskUpdate }) =>
      api.patch<Task>(`/tasks/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskStats });
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TaskComplete }) =>
      api.patch<Task>(`/tasks/${id}/complete`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.task(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskStats });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.delete<ResponseMessage>(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.taskStats });
    },
  });
};

// Expense Hooks
export const useExpenses = (params?: PaginationParams & { paid_by_id?: string; settled?: boolean }) => {
  return useQuery({
    queryKey: [...queryKeys.expenses, params],
    queryFn: () => api.get<PaginatedResponse<Expense>>('/expenses', { params }),
    staleTime: 30000,
  });
};

export const useExpense = (id: string) => {
  return useQuery({
    queryKey: queryKeys.expense(id),
    queryFn: () => api.get<Expense>(`/expenses/${id}`),
    enabled: !!id,
  });
};

export const useExpenseStats = () => {
  return useQuery({
    queryKey: queryKeys.expenseStats,
    queryFn: () => api.get<ExpenseStats>('/expenses/stats'),
    staleTime: 60000,
  });
};

export const useSettlements = () => {
  return useQuery({
    queryKey: queryKeys.settlements,
    queryFn: () => api.get<Settlement[]>('/expenses/settlements'),
    staleTime: 30000,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (expenseData: ExpenseCreate) => api.post<Expense>('/expenses', expenseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements });
    },
  });
};

export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ExpenseUpdate }) =>
      api.patch<Expense>(`/expenses/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements });
    },
  });
};

export const useSettleExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.patch<Expense>(`/expenses/${id}/settle`, { settled: true }),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expense(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements });
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.delete<ResponseMessage>(`/expenses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseStats });
      queryClient.invalidateQueries({ queryKey: queryKeys.settlements });
    },
  });
};

// Message Hooks
export const useMessages = (params?: PaginationParams & { type?: string; pinned?: boolean }) => {
  return useQuery({
    queryKey: [...queryKeys.messages, params],
    queryFn: () => api.get<PaginatedResponse<Message>>('/messages', { params }),
    staleTime: 10000, // 10 seconds for real-time feel
  });
};

export const useMessage = (id: string) => {
  return useQuery({
    queryKey: queryKeys.message(id),
    queryFn: () => api.get<Message>(`/messages/${id}`),
    enabled: !!id,
  });
};

export const useMessageStats = () => {
  return useQuery({
    queryKey: queryKeys.messageStats,
    queryFn: () => api.get<MessageStats>('/messages/stats'),
    staleTime: 60000,
  });
};

export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageData: MessageCreate) => api.post<Message>('/messages', messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
      queryClient.invalidateQueries({ queryKey: queryKeys.messageStats });
    },
  });
};

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MessageUpdate }) =>
      api.patch<Message>(`/messages/${id}`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.message(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
};

export const useReactToMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: MessageReact }) =>
      api.post<Message>(`/messages/${id}/react`, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.message(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
    },
  });
};

export const useMarkMessagesAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageIds: string[]) =>
      api.post<ResponseMessage>('/messages/read', { message_ids: messageIds }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
      queryClient.invalidateQueries({ queryKey: queryKeys.messageStats });
    },
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.delete<ResponseMessage>(`/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.messages });
      queryClient.invalidateQueries({ queryKey: queryKeys.messageStats });
    },
  });
};

// Users Hook
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: () => api.get<User[]>('/users'),
    staleTime: 300000, // 5 minutes
  });
};
