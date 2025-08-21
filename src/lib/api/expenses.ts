/**
 * Expenses API service
 */

import { api } from './client';
import { 
  Expense, 
  ExpenseCreate, 
  ExpenseUpdate, 
  ExpenseStats,
  PaginatedResponse,
  ResponseMessage,
  ExpenseCategory 
} from './types';

export const expensesApi = {
  /**
   * Get all expenses with pagination and filtering
   */
  getExpenses: async (params?: {
    page?: number;
    page_size?: number;
    category?: ExpenseCategory;
  }): Promise<PaginatedResponse<Expense>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.category) searchParams.append('category', params.category);

    const queryString = searchParams.toString();
    const url = queryString ? `/expenses?${queryString}` : '/expenses';
    
    return api.get<PaginatedResponse<Expense>>(url);
  },

  /**
   * Get a single expense by ID
   */
  getExpense: async (expenseId: string): Promise<Expense> => {
    return api.get<Expense>(`/expenses/${expenseId}`);
  },

  /**
   * Create a new expense
   */
  createExpense: async (expenseData: ExpenseCreate): Promise<Expense> => {
    return api.post<Expense>('/expenses', expenseData);
  },

  /**
   * Update an existing expense
   */
  updateExpense: async (expenseId: string, expenseData: ExpenseUpdate): Promise<Expense> => {
    return api.put<Expense>(`/expenses/${expenseId}`, expenseData);
  },

  /**
   * Delete an expense
   */
  deleteExpense: async (expenseId: string): Promise<ResponseMessage> => {
    return api.delete<ResponseMessage>(`/expenses/${expenseId}`);
  },

  /**
   * Get expense analytics for a year
   */
  getExpenseAnalytics: async (year: number, month?: number): Promise<any> => {
    const url = month 
      ? `/expenses/analytics/${year}?month=${month}`
      : `/expenses/analytics/${year}`;
    return api.get<any>(url);
  },

  /**
   * Get monthly expense summary
   */
  getMonthlySummary: async (year: number, month: number): Promise<any> => {
    return api.get<any>(`/expenses/summary/${year}/${month}`);
  },

  /**
   * Get expense statistics
   */
  getExpenseStats: async (): Promise<ExpenseStats> => {
    // This would need to be implemented in the backend if not available
    // For now, calculate from expenses list
    const expenses = await expensesApi.getExpenses();
    const totalExpenses = expenses.data.length;
    const settledExpenses = expenses.data.filter((e: Expense) => e.settled).length;
    const pendingExpenses = totalExpenses - settledExpenses;
    
    return {
      total_expenses: totalExpenses,
      settled_expenses: settledExpenses,
      pending_expenses: pendingExpenses,
      my_balance: 0, // Would need backend calculation
      expenses_count: totalExpenses,
    };
  },
};
