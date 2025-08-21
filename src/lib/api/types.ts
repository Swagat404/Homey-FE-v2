/**
 * API Types matching the backend Pydantic models
 */

// Base types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  has_more: boolean;
  data: T[];
}

export interface ResponseMessage {
  message: string;
  success: boolean;
  data?: any;
}

// User types
export interface User extends BaseEntity {
  name: string;
  email: string;
  avatar_initials?: string;
  avatar_color?: string;
  is_online: boolean;
  last_seen?: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  avatar_initials?: string;
  avatar_color?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserSession {
  user: User;
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Task types
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskCategory = 'cleaning' | 'shopping' | 'bills' | 'cooking' | 'maintenance';

export interface Task extends BaseEntity {
  title: string;
  description?: string;
  assignee_id: string;
  due_date: string;
  priority: TaskPriority;
  category: TaskCategory;
  recurring: TaskRecurrence;
  points: number;
  completed: boolean;
  completed_by_id?: string;
  completed_at?: string;
  assignee_name?: string;
  completed_by_name?: string;
}

export interface TaskCreate {
  title: string;
  description?: string;
  assignee_id: string;
  due_date: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  recurring?: TaskRecurrence;
  points?: number;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  assignee_id?: string;
  due_date?: string;
  priority?: TaskPriority;
  category?: TaskCategory;
  recurring?: TaskRecurrence;
  points?: number;
}

export interface TaskComplete {
  completed: boolean;
  completed_by_id?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  my_tasks: number;
  total_points: number;
}

// Expense types
export type ExpenseCategory = 'food' | 'utilities' | 'household' | 'entertainment' | 'transportation';

export interface Expense extends BaseEntity {
  title: string;
  amount: string | number; // API returns string, but we want to support both
  paid_by_id: string;
  split_with_ids: string[];
  category: ExpenseCategory;
  expense_date: string;
  receipt_url?: string;
  settled: boolean;
  settled_at?: string;
  amount_per_person: string | number; // API returns string, but we want to support both
  paid_by_name?: string;
  split_with_names?: string[];
}

export interface ExpenseCreate {
  title: string;
  amount: number;
  paid_by_id: string;
  split_with_ids: string[];
  category?: ExpenseCategory;
  expense_date?: string;
  receipt_url?: string;
}

export interface ExpenseUpdate {
  title?: string;
  amount?: number;
  paid_by_id?: string;
  split_with_ids?: string[];
  category?: ExpenseCategory;
  expense_date?: string;
  receipt_url?: string;
  settled?: boolean;
}

export interface Settlement {
  from_user_id: string;
  to_user_id: string;
  amount: number;
  from_user_name?: string;
  to_user_name?: string;
}

export interface ExpenseStats {
  total_expenses: number;
  settled_expenses: number;
  pending_expenses: number;
  my_balance: number;
  expenses_count: number;
}

// Message types
export type MessageType = 'message' | 'announcement' | 'event';

export interface Attachment {
  type: 'image' | 'file' | 'link';
  url: string;
  name: string;
  size?: number;
}

export interface Reaction {
  emoji: string;
  user_ids: string[];
  count: number;
}

export interface Message extends BaseEntity {
  content: string;
  author_id: string;
  type: MessageType;
  pinned: boolean;
  attachments: Attachment[];
  reactions: Reaction[];
  read_by_ids: string[];
  reply_to_id?: string;
  edited_at?: string;
  author_name?: string;
  author_avatar_initials?: string;
  author_avatar_color?: string;
}

export interface MessageCreate {
  content: string;
  author_id: string;
  type?: MessageType;
  pinned?: boolean;
  attachments?: Attachment[];
}

export interface MessageUpdate {
  content?: string;
  pinned?: boolean;
}

export interface MessageReact {
  emoji: string;
  action: 'add' | 'remove';
}

export interface MessageStats {
  total_messages: number;
  announcements_count: number;
  events_count: number;
  pinned_count: number;
  unread_count: number;
}

// API Error type
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}
