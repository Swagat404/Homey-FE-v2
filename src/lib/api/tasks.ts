/**
 * Tasks API service
 */

import { api } from './client';
import { 
  Task, 
  TaskCreate, 
  TaskUpdate, 
  TaskStats,
  PaginatedResponse,
  ResponseMessage,
  TaskPriority,
  TaskCategory 
} from './types';

export const tasksApi = {
  /**
   * Get all tasks with pagination and filtering
   */
  getTasks: async (params?: {
    page?: number;
    page_size?: number;
    completed?: boolean;
    priority?: TaskPriority;
    category?: TaskCategory;
  }): Promise<PaginatedResponse<Task>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.completed !== undefined) searchParams.append('completed', params.completed.toString());
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.category) searchParams.append('category', params.category);

    const queryString = searchParams.toString();
    const url = queryString ? `/tasks?${queryString}` : '/tasks';
    
    return api.get<PaginatedResponse<Task>>(url);
  },

  /**
   * Get a single task by ID
   */
  getTask: async (taskId: string): Promise<Task> => {
    return api.get<Task>(`/tasks/${taskId}`);
  },

  /**
   * Create a new task
   */
  createTask: async (taskData: TaskCreate): Promise<Task> => {
    return api.post<Task>('/tasks', taskData);
  },

  /**
   * Update an existing task
   */
  updateTask: async (taskId: string, taskData: TaskUpdate): Promise<Task> => {
    return api.put<Task>(`/tasks/${taskId}`, taskData);
  },

  /**
   * Delete a task
   */
  deleteTask: async (taskId: string): Promise<ResponseMessage> => {
    return api.delete<ResponseMessage>(`/tasks/${taskId}`);
  },

  /**
   * Mark task as complete/incomplete
   */
  toggleTaskComplete: async (taskId: string): Promise<Task> => {
    return api.post<Task>(`/tasks/${taskId}/complete`);
  },

  /**
   * Get task statistics
   */
  getTaskStats: async (): Promise<TaskStats> => {
    return api.get<TaskStats>('/tasks/statistics/summary');
  },
};
