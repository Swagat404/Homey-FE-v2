# API Integration Guide

This guide explains how to use the API integration in your Homey frontend.

## 🚀 Quick Start

### 1. Authentication

The app automatically handles authentication. Users will see a login/register page when not authenticated.

```tsx
// Access current user and auth functions
import { useAuth } from '@/lib/contexts/AuthContext';

const { user, isAuthenticated, login, register, logout } = useAuth();
```

### 2. API Hooks

Use React Query hooks for data fetching:

```tsx
import { useTasks, useCreateTask, useTaskStats } from '@/lib/hooks/useApi';

// Get tasks
const { data: tasks, isLoading, error } = useTasks();

// Get task statistics
const { data: stats } = useTaskStats();

// Create a new task
const createTask = useCreateTask();
const handleCreate = () => {
  createTask.mutate({
    title: "New Task",
    assignee_id: user.id,
    due_date: "2024-01-01",
  });
};
```

### 3. Available Hooks

#### Tasks
- `useTasks(params?)` - Get paginated tasks
- `useTask(id)` - Get single task
- `useTaskStats()` - Get task statistics
- `useCreateTask()` - Create new task
- `useUpdateTask()` - Update existing task
- `useCompleteTask()` - Mark task as complete
- `useDeleteTask()` - Delete task

#### Expenses
- `useExpenses(params?)` - Get paginated expenses
- `useExpense(id)` - Get single expense
- `useExpenseStats()` - Get expense statistics
- `useSettlements()` - Get settlement calculations
- `useCreateExpense()` - Create new expense
- `useUpdateExpense()` - Update existing expense
- `useSettleExpense()` - Mark expense as settled
- `useDeleteExpense()` - Delete expense

#### Messages
- `useMessages(params?)` - Get paginated messages
- `useMessage(id)` - Get single message
- `useMessageStats()` - Get message statistics
- `useCreateMessage()` - Create new message
- `useUpdateMessage()` - Update existing message
- `useReactToMessage()` - Add/remove reaction
- `useMarkMessagesAsRead()` - Mark messages as read
- `useDeleteMessage()` - Delete message

#### Users
- `useUsers()` - Get all users

## 🔧 Configuration

### Environment Variables

Create `.env.local` in your frontend root:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

For production, update to your deployed backend URL.

### Backend Health Check

The app automatically checks if the backend is online and shows a warning if it's not available.

## 📝 Usage Examples

### Creating a Task

```tsx
import { useCreateTask } from '@/lib/hooks/useApi';
import { useAuth } from '@/lib/contexts/AuthContext';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const { user } = useAuth();
  const createTask = useCreateTask();

  const handleSubmit = async (formData) => {
    try {
      await createTask.mutateAsync({
        title: formData.title,
        description: formData.description,
        assignee_id: user.id,
        due_date: formData.dueDate,
        priority: 'medium',
        category: 'cleaning',
      });
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  return (
    // Your form JSX here
  );
};
```

### Displaying Tasks with Loading States

```tsx
import { useTasks } from '@/lib/hooks/useApi';

const TaskList = () => {
  const { data: tasksResponse, isLoading, error } = useTasks({
    limit: 10,
    completed: false,
  });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const tasks = tasksResponse?.data || [];

  return (
    <div>
      {tasks.map(task => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <span>Due: {task.due_date}</span>
          <span>Priority: {task.priority}</span>
        </div>
      ))}
    </div>
  );
};
```

### Real-time Updates

React Query automatically handles cache invalidation. When you create, update, or delete items, related queries are automatically refetched.

## 🔐 Authentication Flow

1. User visits the app
2. If no valid token exists, shows login/register page
3. After successful auth, token is stored in localStorage
4. All API requests automatically include the Bearer token
5. If token expires (401 response), user is automatically logged out

## 🎯 Next Steps

1. Start your backend: `cd homey-backend && python run.py`
2. Start your frontend: `npm run dev`
3. Visit `http://localhost:5173` (or your dev server URL)
4. Create an account or login
5. Start using the integrated API features!

The app will automatically connect to your backend and you can start creating tasks, expenses, and messages through the beautiful glassmorphic UI.
