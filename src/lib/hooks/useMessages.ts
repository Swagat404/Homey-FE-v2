/**
 * React Query hooks for messages
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../api/messages';
import { MessageCreate, MessageUpdate, MessageReact } from '../api/types';
import toast from 'react-hot-toast';

// Query keys
export const messageKeys = {
  all: ['messages'] as const,
  lists: () => [...messageKeys.all, 'list'] as const,
  list: (filters: any) => [...messageKeys.lists(), filters] as const,
  details: () => [...messageKeys.all, 'detail'] as const,
  detail: (id: string) => [...messageKeys.details(), id] as const,
  stats: () => [...messageKeys.all, 'stats'] as const,
};

// Get messages list
export const useMessages = (params?: {
  page?: number;
  page_size?: number;
  type?: string;
}) => {
  return useQuery({
    queryKey: messageKeys.list(params),
    queryFn: () => messagesApi.getMessages(params),
    staleTime: 1000 * 60, // 1 minute for messages
  });
};

// Get single message
export const useMessage = (messageId: string) => {
  return useQuery({
    queryKey: messageKeys.detail(messageId),
    queryFn: () => messagesApi.getMessage(messageId),
    enabled: !!messageId,
  });
};

// Get message statistics
export const useMessageStats = () => {
  return useQuery({
    queryKey: messageKeys.stats(),
    queryFn: () => messagesApi.getMessageStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Create message mutation
export const useCreateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageData: MessageCreate) => messagesApi.createMessage(messageData),
    onSuccess: (newMessage) => {
      // Invalidate messages list to refetch
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageKeys.stats() });
      
      // Add the new message to the cache
      queryClient.setQueryData(messageKeys.detail(newMessage.id), newMessage);
      
      toast.success('Message sent!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};

// Update message mutation
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ messageId, messageData }: { messageId: string; messageData: MessageUpdate }) => 
      messagesApi.updateMessage(messageId, messageData),
    onSuccess: (updatedMessage) => {
      // Update messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      
      // Update the specific message in cache
      queryClient.setQueryData(messageKeys.detail(updatedMessage.id), updatedMessage);
      
      toast.success('Message updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update message');
    },
  });
};

// Delete message mutation
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => messagesApi.deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      // Remove from messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageKeys.stats() });
      
      // Remove the specific message from cache
      queryClient.removeQueries({ queryKey: messageKeys.detail(messageId) });
      
      toast.success('Message deleted!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete message');
    },
  });
};

// React to message mutation
export const useReactToMessage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ messageId, reaction }: { messageId: string; reaction: MessageReact }) => 
      messagesApi.reactToMessage(messageId, reaction),
    onSuccess: (updatedMessage) => {
      // Update messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      
      // Update the specific message in cache
      queryClient.setQueryData(messageKeys.detail(updatedMessage.id), updatedMessage);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to react to message');
    },
  });
};

// Mark message as read mutation
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => messagesApi.markAsRead(messageId),
    onSuccess: () => {
      // Update messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      queryClient.invalidateQueries({ queryKey: messageKeys.stats() });
    },
    onError: (error: any) => {
      console.error('Failed to mark message as read:', error);
    },
  });
};

// Toggle pin message mutation
export const useTogglePin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (messageId: string) => messagesApi.togglePin(messageId),
    onSuccess: (updatedMessage) => {
      // Update messages list
      queryClient.invalidateQueries({ queryKey: messageKeys.lists() });
      
      // Update the specific message in cache
      queryClient.setQueryData(messageKeys.detail(updatedMessage.id), updatedMessage);
      
      const message = updatedMessage.pinned ? 'Message pinned!' : 'Message unpinned!';
      toast.success(message);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to toggle pin');
    },
  });
};
