/**
 * Messages API service
 */

import { api } from './client';
import { 
  Message, 
  MessageCreate, 
  MessageUpdate, 
  MessageReact,
  MessageStats,
  PaginatedResponse,
  ResponseMessage 
} from './types';

export const messagesApi = {
  /**
   * Get all messages with pagination
   */
  getMessages: async (params?: {
    page?: number;
    page_size?: number;
    type?: string;
  }): Promise<PaginatedResponse<Message>> => {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.type) searchParams.append('type', params.type);

    const queryString = searchParams.toString();
    const url = queryString ? `/messages?${queryString}` : '/messages';
    
    return api.get<PaginatedResponse<Message>>(url);
  },

  /**
   * Get a single message by ID
   */
  getMessage: async (messageId: string): Promise<Message> => {
    return api.get<Message>(`/messages/${messageId}`);
  },

  /**
   * Create a new message
   */
  createMessage: async (messageData: MessageCreate): Promise<Message> => {
    return api.post<Message>('/messages', messageData);
  },

  /**
   * Update an existing message
   */
  updateMessage: async (messageId: string, messageData: MessageUpdate): Promise<Message> => {
    return api.put<Message>(`/messages/${messageId}`, messageData);
  },

  /**
   * Delete a message
   */
  deleteMessage: async (messageId: string): Promise<ResponseMessage> => {
    return api.delete<ResponseMessage>(`/messages/${messageId}`);
  },

  /**
   * React to a message
   */
  reactToMessage: async (messageId: string, reaction: MessageReact): Promise<Message> => {
    return api.post<Message>(`/messages/${messageId}/react`, reaction);
  },

  /**
   * Mark message as read
   */
  markAsRead: async (messageId: string): Promise<ResponseMessage> => {
    return api.post<ResponseMessage>(`/messages/${messageId}/read`);
  },

  /**
   * Pin/unpin a message
   */
  togglePin: async (messageId: string): Promise<Message> => {
    return api.post<Message>(`/messages/${messageId}/pin`);
  },

  /**
   * Get message statistics
   */
  getMessageStats: async (): Promise<MessageStats> => {
    return api.get<MessageStats>('/messages/statistics/summary');
  },
};
