/**
 * React Query hooks for expenses
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { expensesApi } from '../api/expenses';
import { ExpenseCreate, ExpenseUpdate, ExpenseCategory } from '../api/types';
import toast from 'react-hot-toast';

// Query keys
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  list: (filters: any) => [...expenseKeys.lists(), filters] as const,
  details: () => [...expenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...expenseKeys.details(), id] as const,
  stats: () => [...expenseKeys.all, 'stats'] as const,
  analytics: (year: number, month?: number) => [...expenseKeys.all, 'analytics', year, month] as const,
  summary: (year: number, month: number) => [...expenseKeys.all, 'summary', year, month] as const,
};

// Get expenses list
export const useExpenses = (params?: {
  page?: number;
  page_size?: number;
  category?: ExpenseCategory;
}) => {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => expensesApi.getExpenses(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get single expense
export const useExpense = (expenseId: string) => {
  return useQuery({
    queryKey: expenseKeys.detail(expenseId),
    queryFn: () => expensesApi.getExpense(expenseId),
    enabled: !!expenseId,
  });
};

// Get expense statistics
export const useExpenseStats = () => {
  return useQuery({
    queryKey: expenseKeys.stats(),
    queryFn: () => expensesApi.getExpenseStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Get expense analytics
export const useExpenseAnalytics = (year: number, month?: number) => {
  return useQuery({
    queryKey: expenseKeys.analytics(year, month),
    queryFn: () => expensesApi.getExpenseAnalytics(year, month),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get monthly summary
export const useMonthlySummary = (year: number, month: number) => {
  return useQuery({
    queryKey: expenseKeys.summary(year, month),
    queryFn: () => expensesApi.getMonthlySummary(year, month),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Create expense mutation
export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (expenseData: ExpenseCreate) => expensesApi.createExpense(expenseData),
    onSuccess: (newExpense) => {
      // Invalidate expenses list to refetch
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
      
      // Add the new expense to the cache
      queryClient.setQueryData(expenseKeys.detail(newExpense.id), newExpense);
      
      toast.success('Expense created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create expense');
    },
  });
};

// Update expense mutation
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ expenseId, expenseData }: { expenseId: string; expenseData: ExpenseUpdate }) => 
      expensesApi.updateExpense(expenseId, expenseData),
    onSuccess: (updatedExpense) => {
      // Update expenses list
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
      
      // Update the specific expense in cache
      queryClient.setQueryData(expenseKeys.detail(updatedExpense.id), updatedExpense);
      
      toast.success('Expense updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update expense');
    },
  });
};

// Delete expense mutation
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (expenseId: string) => expensesApi.deleteExpense(expenseId),
    onSuccess: (_, expenseId) => {
      // Remove from expenses list
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: expenseKeys.stats() });
      
      // Remove the specific expense from cache
      queryClient.removeQueries({ queryKey: expenseKeys.detail(expenseId) });
      
      toast.success('Expense deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete expense');
    },
  });
};
