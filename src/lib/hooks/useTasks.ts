/**
 * React Query hooks for tasks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { TaskCreate, TaskUpdate, TaskPriority, TaskCategory } from '../api/types';
import toast from 'react-hot-toast';

// Query keys
export const taskKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskKeys.all, 'list'] as const,
  list: (filters: any) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
  stats: () => [...taskKeys.all, 'stats'] as const,
};

// Get tasks list
export const useTasks = (params?: {
  page?: number;
  page_size?: number;
  completed?: boolean;
  priority?: TaskPriority;
  category?: TaskCategory;
}) => {
  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: () => tasksApi.getTasks(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single task
export const useTask = (taskId: string) => {
  return useQuery({
    queryKey: taskKeys.detail(taskId),
    queryFn: () => tasksApi.getTask(taskId),
    enabled: !!taskId,
  });
};

// Get task statistics
export const useTaskStats = () => {
  return useQuery({
    queryKey: taskKeys.stats(),
    queryFn: () => tasksApi.getTaskStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create task mutation
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskData: TaskCreate) => tasksApi.createTask(taskData),
    onSuccess: (newTask) => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      
      // Add the new task to the cache
      queryClient.setQueryData(taskKeys.detail(newTask.id), newTask);
      
      toast.success('Task created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create task');
    },
  });
};

// Update task mutation
export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ taskId, taskData }: { taskId: string; taskData: TaskUpdate }) => 
      tasksApi.updateTask(taskId, taskData),
    onSuccess: (updatedTask) => {
      // Update tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      
      // Update the specific task in cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      
      toast.success('Task updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
};

// Delete task mutation
export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.deleteTask(taskId),
    onSuccess: (_, taskId) => {
      // Remove from tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      
      // Remove the specific task from cache
      queryClient.removeQueries({ queryKey: taskKeys.detail(taskId) });
      
      toast.success('Task deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete task');
    },
  });
};

// Toggle task completion mutation
export const useToggleTaskComplete = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (taskId: string) => tasksApi.toggleTaskComplete(taskId),
    onSuccess: (updatedTask) => {
      // Update tasks list
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.stats() });
      
      // Update the specific task in cache
      queryClient.setQueryData(taskKeys.detail(updatedTask.id), updatedTask);
      
      const message = updatedTask.completed ? 'Task completed!' : 'Task marked as incomplete';
      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update task');
    },
  });
};
