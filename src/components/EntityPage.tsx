import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconPlus,
  IconFilter,
  IconSearch,
  IconCheck,
  IconX,
  IconCalendar,
  IconUser,
  IconClock,
  IconRepeat,
  IconFlag,
  IconTrash,
  IconEdit,
  IconDots,
  IconCheckbox,
  IconCalendarTime,
  IconBell,
} from "@tabler/icons-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import hapticFeedback from "../utils/haptics";
import { ModernCard, ModernIconButton, StatCard, PremiumAnalytics } from "./ui";
import CelebrationSystem from "./ui/CelebrationSystem";

interface TasksPageProps {
  onBack: () => void;
  isDark: boolean;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  assignee: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  category: string;
  completed: boolean;
  recurring?: "none" | "daily" | "weekly" | "monthly";
  points?: number;
  completedBy?: string;
  completedAt?: string;
}

const TasksPage: React.FC<TasksPageProps> = ({ onBack, isDark }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAssignee, setFilterAssignee] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [pageTitle, setPageTitle] = useState("Tasks");
  const [pageSubtitle, setPageSubtitle] = useState("Manage household tasks and chores");
  const [celebrateTask, setCelebrateTask] = useState<{trigger: boolean, taskTitle?: string}>({trigger: false});
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Task>>({});

  // Form state for adding new tasks
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "Alex Johnson",
    dueDate: "",
    priority: "medium" as "low" | "medium" | "high",
    category: "cleaning",
    recurring: "none" as "none" | "daily" | "weekly" | "monthly",
    points: 5
  });

  // Check for personalized filters from dashboard
  React.useEffect(() => {
    const pageFilter = sessionStorage.getItem('pageFilter');
    if (pageFilter === 'myPending') {
      setFilterStatus("pending");
      setFilterAssignee("Alex Johnson");
      setPageTitle("Your Pending Tasks");
      setPageSubtitle("Tasks assigned to you that need attention");
      // Clear the filter so it doesn't apply on future visits
      sessionStorage.removeItem('pageFilter');
    }

    // Check for task date filter from calendar
    const taskDateFilter = sessionStorage.getItem('taskDateFilter');
    if (taskDateFilter) {
      setPageTitle("Tasks for " + new Date(taskDateFilter).toLocaleDateString());
      setPageSubtitle("Tasks scheduled for this date");
      sessionStorage.removeItem('taskDateFilter');
    }
  }, []);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Take out trash and recycling",
      description: "Empty all trash bins and take recycling to curb",
      assignee: "Alex Johnson",
      dueDate: "2024-12-16",
      priority: "medium",
      category: "Cleaning",
      completed: false,
      recurring: "weekly",
      points: 5,
    },
    {
      id: 2,
      title: "Buy groceries for the week",
      description: "Milk, bread, eggs, vegetables, and cleaning supplies",
      assignee: "Sarah Chen",
      dueDate: "2024-12-15",
      priority: "high",
      category: "Shopping",
      completed: true,
      recurring: "weekly",
      points: 10,
      completedBy: "Sarah Chen",
      completedAt: "2024-12-14",
    },
    {
      id: 3,
      title: "Clean bathroom thoroughly",
      description: "Scrub tub, clean toilet, mop floor, replace towels",
      assignee: "Mike Rodriguez",
      dueDate: "2024-12-18",
      priority: "medium",
      category: "Cleaning",
      completed: false,
      recurring: "weekly",
      points: 8,
    },
    {
      id: 4,
      title: "Pay electricity bill",
      description: "December electricity bill is due",
      assignee: "Emma Davis",
      dueDate: "2024-12-20",
      priority: "high",
      category: "Bills",
      completed: false,
      recurring: "monthly",
      points: 3,
    },
    {
      id: 5,
      title: "Vacuum living room and bedrooms",
      description: "Deep clean all carpets and rugs",
      assignee: "Alex Johnson",
      dueDate: "2024-12-17",
      priority: "low",
      category: "Cleaning",
      completed: false,
      recurring: "weekly",
      points: 6,
    },
    {
      id: 6,
      title: "Cook dinner for everyone",
      description: "Plan and prepare a nice group dinner",
      assignee: "Sarah Chen",
      dueDate: "2024-12-16",
      priority: "medium",
      category: "Cooking",
      completed: false,
      recurring: "none",
      points: 7,
    },
  ]);

  // Check for edit task from calendar
  React.useEffect(() => {
    const editTaskData = sessionStorage.getItem('editTask');
    if (editTaskData) {
      try {
        const taskToEdit = JSON.parse(editTaskData);
        // Find the task in our current tasks array
        const existingTask = tasks.find(t => t.title === taskToEdit.title && t.assignee === taskToEdit.assignee);
        if (existingTask) {
          setSelectedTask(existingTask);
          setFormData({
            title: existingTask.title,
            description: existingTask.description || "",
            assignee: existingTask.assignee,
            dueDate: existingTask.dueDate,
            priority: existingTask.priority,
            category: existingTask.category.toLowerCase(),
            recurring: existingTask.recurring || "none",
            points: existingTask.points || 5
          });
          setShowAddTask(true);
        }
        sessionStorage.removeItem('editTask');
      } catch (error) {
        console.error('Error parsing edit task data:', error);
        sessionStorage.removeItem('editTask');
      }
    }
  }, [tasks]);

  const roommates = [
    { name: "Alex Johnson", avatar: "AJ", color: "purple" },
    { name: "Sarah Chen", avatar: "SC", color: "blue" },
    { name: "Mike Rodriguez", avatar: "MR", color: "green" },
    { name: "Emma Davis", avatar: "ED", color: "pink" },
  ];

  const categories = ["All", "Cleaning", "Shopping", "Bills", "Cooking", "Maintenance"];
  const priorities = ["Low", "Medium", "High"];
  const recurringOptions = ["None", "Daily", "Weekly", "Monthly"];

  const toggleTaskComplete = (taskId: number) => {
    const taskToUpdate = tasks.find(t => t.id === taskId);
    const isCompleting = taskToUpdate && !taskToUpdate.completed;
    
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              completedBy: !task.completed ? "Alex Johnson" : undefined,
              completedAt: !task.completed ? new Date().toISOString() : undefined,
            }
          : task
      )
    );

    // Trigger celebration for task completion
    if (isCompleting && taskToUpdate) {
      hapticFeedback.taskComplete();
      setCelebrateTask({
        trigger: true,
        taskTitle: taskToUpdate.title
      });
      
      // Reset celebration state after animation
      setTimeout(() => {
        setCelebrateTask({trigger: false});
      }, 100);
    } else {
      hapticFeedback.tap();
    }
  };

  // Add new task function
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return; // Don't add empty tasks
    }

    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: formData.title,
      description: formData.description || undefined,
      assignee: formData.assignee,
      dueDate: formData.dueDate,
      priority: formData.priority,
      category: formData.category,
      completed: false,
      recurring: formData.recurring,
      points: formData.points,
    };

    setTasks(prevTasks => [newTask, ...prevTasks]);
    
    // Reset form and close modal
    setFormData({
      title: "",
      description: "",
      assignee: "Alex Johnson",
      dueDate: "",
      priority: "medium",
      category: "cleaning",
      recurring: "none",
      points: 5
    });
    setShowAddTask(false);
    
    // Show success message with haptic feedback
    hapticFeedback.success();
    toast.success("Task added successfully!");
  };

  // Delete task function
  const handleDeleteTask = (taskId: number) => {
    hapticFeedback.deleteWarning();
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success("Task deleted successfully!");
  };

  // Inline edit functions
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      saveInlineEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelInlineEdit();
    }
  };

  const startInlineEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description || "",
      assignee: task.assignee,
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category,
      recurring: task.recurring || "none",
      points: task.points || 0
    });
  };

  const cancelInlineEdit = () => {
    setEditingTaskId(null);
    setEditFormData({});
  };

  const saveInlineEdit = () => {
    if (editingTaskId && editFormData.title?.trim()) {
      setTasks(prev => prev.map(task => 
        task.id === editingTaskId 
          ? { ...task, ...editFormData, title: editFormData.title!.trim() }
          : task
      ));
      setEditingTaskId(null);
      setEditFormData({});
      toast.success("Task updated successfully!");
      hapticFeedback.success();
    } else {
      toast.error("Please provide a task title");
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" ||
                         (filterStatus === "completed" && task.completed) ||
                         (filterStatus === "pending" && !task.completed) ||
                         (filterStatus === "overdue" && !task.completed && new Date(task.dueDate) < new Date());
    const matchesAssignee = filterAssignee === "all" || task.assignee === filterAssignee;
    const matchesCategory = filterCategory === "all" || task.category.toLowerCase() === filterCategory.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesAssignee && matchesCategory;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length,
    myTasks: tasks.filter(t => t.assignee === "Alex Johnson").length,
    totalPoints: tasks.filter(t => t.completed).reduce((sum, t) => sum + (t.points || 0), 0),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-100 dark:bg-red-900/30";
      case "medium": return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30";
      case "low": return "text-green-500 bg-green-100 dark:bg-green-900/30";
      default: return "text-gray-500 bg-gray-100 dark:bg-gray-900/30";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "cleaning": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
      case "shopping": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
      case "bills": return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "cooking": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
      case "maintenance": return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.completed;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 pb-20 refined-plasma-border holographic" style={{ 
      backgroundColor: "var(--homey-bg)",
      backgroundImage: `
        radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.06) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
      `
    }}>
      {/* Header */}
              <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.08] border-b border-white/[0.12] refined-flowing-border refined-aurora-glow">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ModernIconButton
                icon={IconArrowLeft}
                onClick={onBack}
                variant="ghost"
                tooltip="Back to dashboard"
              />
              <div>
                <h1 className="refined-heading-1 text-gradient streaming-light-text">{pageTitle}</h1>
                <p className="refined-subheading pulsing-glow-text">{pageSubtitle}</p>
              </div>
            </div>

            <ModernIconButton
              icon={IconPlus}
              onClick={() => setShowAddTask(true)}
              variant="primary"
              tooltip="Add new task"
              className="refined-breathing-glow refined-particle-trail electric-border neon-pulse"
            />
              </div>
            </div>
            </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Stats Overview */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 refined-light-worm">
          <motion.div
            className="holographic shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Total Tasks"
              value={stats.total}
              icon={IconCheckbox}
              color="blue"
              change={8}
              trend="up"
              changeLabel="this week"
            />
          </motion.div>

          <motion.div
            className="liquid-glass shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Completed"
              value={stats.completed}
              icon={IconCheck}
              color="green"
              change={25}
              trend="up"
              changeLabel="completion rate"
            />
          </motion.div>

          <motion.div
            className="crystal-glass shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={IconClock}
              color="yellow"
              change={-15}
              trend="down"
              changeLabel="from last week"
            />
          </motion.div>

          <motion.div
            className="frosted-glass shiny-overlay rounded-3xl"
            whileHover={{ scale: 1.05, rotateY: -5 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <StatCard
              title="Points Earned"
              value={stats.totalPoints}
              icon={IconFlag}
              color="purple"
              change={20}
              trend="up"
              changeLabel="this month"
            />
          </motion.div>
            </div>

        {/* Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 refined-shimmer-accent">
              <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
            </div>

              <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>

              <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">All Assignees</option>
            {roommates.map(roommate => (
              <option key={roommate.name} value={roommate.name}>
                {roommate.name}
              </option>
            ))}
              </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category.toLowerCase()}>
                {category}
              </option>
            ))}
          </select>
            </div>

        

        {/* Tasks List */}
        <ModernCard variant="crystal" className="p-6 refined-hover-glow refined-border-light refined-plasma-border shiny-overlay crawling-light">
          <div className="flex items-center justify-between mb-6">
                          <h3 className="refined-heading-4 refined-text-stream-glow glass-text-bold">
              Tasks ({filteredTasks.length})
              </h3>
            <div className="flex gap-2">
              <ModernIconButton icon={IconFilter} variant="ghost" size="sm" />
              <ModernIconButton icon={IconCalendar} variant="ghost" size="sm" />
            </div>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
                  <motion.div
                    key={task.id}
                className={`p-5 border rounded-xl transition-all duration-300 relative overflow-hidden ${
                  task.completed 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-600 shadow-lg shadow-green-100/50 dark:shadow-green-900/20' 
                    : isOverdue(task.dueDate)
                    ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-600 shadow-lg shadow-red-100/50 dark:shadow-red-900/20'
                    : 'bg-gradient-to-r from-white to-purple-50/30 dark:from-gray-800 dark:to-purple-900/10 border-purple-200/40 dark:border-purple-700/40 hover:bg-gradient-to-r hover:from-purple-50/50 hover:to-violet-50/50 dark:hover:from-purple-900/20 dark:hover:to-violet-900/20 hover:border-purple-300/60 dark:hover:border-purple-600/60 hover:shadow-lg hover:shadow-purple-100/30 dark:hover:shadow-purple-900/20'
                } refined-breathing-light refined-hover-glow group`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                  >
                    {/* Subtle accent line */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex items-start gap-4 relative z-10">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    disabled={editingTaskId === task.id}
                    className={`mt-1 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-sm ${
                      editingTaskId === task.id 
                        ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-600'
                        : task.completed
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 border-green-400 text-white shadow-green-200/50 dark:shadow-green-900/30 scale-105'
                        : 'border-purple-300 dark:border-purple-600 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 group-hover:scale-105'
                    }`}
                  >
                    {task.completed && <IconCheck className="w-4 h-4" />}
                  </button>

                                            {/* Task Content */}
                  <div className="flex-1">
                    {editingTaskId === task.id ? (
                      /* Inline Edit Form */
                      <div className="space-y-4">
                        {/* Title Input */}
                        <div>
                          <input
                            type="text"
                            name="title"
                            value={editFormData.title || ""}
                            onChange={handleEditInputChange}
                            onKeyDown={handleEditKeyDown}
                            className="w-full px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Task title"
                            autoFocus
                          />
          </div>

                        {/* Description Input */}
                        <div>
                          <textarea
                            name="description"
                            value={editFormData.description || ""}
                            onChange={handleEditInputChange}
                            onKeyDown={handleEditKeyDown}
                            className="w-full px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            placeholder="Description (optional)"
                            rows={2}
                          />
                        </div>

                        {/* Form Fields Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {/* Assignee */}
                          <select
                            name="assignee"
                            value={editFormData.assignee || ""}
                            onChange={handleEditInputChange}
                            className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            {roommates.map((roommate) => (
                              <option key={roommate.name} value={roommate.name}>
                                {roommate.name}
                              </option>
                            ))}
                          </select>

                          {/* Due Date */}
                          <input
                            type="date"
                            name="dueDate"
                            value={editFormData.dueDate || ""}
                            onChange={handleEditInputChange}
                            className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          />

                          {/* Priority */}
                          <select
                            name="priority"
                            value={editFormData.priority || "medium"}
                            onChange={handleEditInputChange}
                            className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>

                          {/* Category */}
                          <select
                            name="category"
                            value={editFormData.category || "cleaning"}
                            onChange={handleEditInputChange}
                            className="px-3 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                          >
                            <option value="cleaning">Cleaning</option>
                            <option value="shopping">Shopping</option>
                            <option value="bills">Bills</option>
                            <option value="cooking">Cooking</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                      </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 justify-between items-center">
                          <div className="flex gap-2">
                            <motion.button
                              onClick={saveInlineEdit}
                              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <IconCheck className="w-4 h-4" />
                              Save
                            </motion.button>
                            <motion.button
                              onClick={cancelInlineEdit}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <IconX className="w-4 h-4" />
                              Cancel
                            </motion.button>
                          </div>
                          <div className="text-xs text-gray-400 hidden sm:block">
                            Ctrl+Enter to save • Esc to cancel
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Normal Task Display */
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`refined-body font-semibold ${task.completed ? 'line-through refined-status-completed opacity-60' : 'text-gray-900 dark:text-white refined-text-subtle-glow glass-text-bold'}`}>
                              {task.title}
                          </h4>
                          {task.description && (
                            <p className="refined-caption mt-1">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 mt-3 flex-wrap">
                              {/* Assignee */}
                            <div className="flex items-center gap-1">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                                {task.assignee.split(' ').map(n => n[0]).join('')}
                                </div>
                              <span className="text-xs text-gray-500 refined-text-pulse-glow">{task.assignee}</span>
                              </div>

                              {/* Due Date */}
                            <div className="flex items-center gap-1">
                              <IconCalendar className="w-4 h-4 text-gray-400" />
                              <span className={`text-xs ${isOverdue(task.dueDate) && !task.completed ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                                {new Date(task.dueDate).toLocaleDateString()}
                              </span>
                              </div>

                            {/* Priority */}
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border shadow-sm transition-all duration-200 group-hover:scale-105 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>

                            {/* Category */}
                            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border shadow-sm transition-all duration-200 group-hover:scale-105 ${getCategoryColor(task.category)}`}>
                              {task.category}
                            </span>

                            {/* Recurring */}
                            {task.recurring && task.recurring !== "none" && (
                              <div className="flex items-center gap-1">
                                <IconRepeat className="w-4 h-4 text-purple-500" />
                                <span className="text-xs text-purple-500">{task.recurring}</span>
                                </div>
                              )}

                            {/* Points */}
                            {task.points && (
                              <div className="flex items-center gap-1">
                                <IconFlag className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs text-yellow-600">{task.points} pts</span>
                            </div>
                            )}
                          </div>

                          {/* Completion Info */}
                          {task.completed && task.completedBy && (
                            <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                              ✓ Completed by {task.completedBy} on {new Date(task.completedAt!).toLocaleDateString()}
                            </div>
                          )}
                            </div>
                          </div>
                    )}
                      </div>

                      {/* Actions */}
                      {editingTaskId !== task.id && (
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-2 group-hover:translate-x-0">
                          <ModernIconButton
                            icon={IconEdit}
                            variant="ghost"
                            size="sm"
                            tooltip="Edit task"
                            className="hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-600 dark:hover:text-purple-400"
                            onClick={() => startInlineEdit(task)}
                          />
                          <ModernIconButton
                            icon={IconTrash}
                            variant="ghost"
                            size="sm"
                            tooltip="Delete task"
                            className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                            onClick={() => handleDeleteTask(task.id)}
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
            ))}

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <IconCheckbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-2 refined-text-pulse-glow">
                  No tasks found
                </h4>
                <p className="text-gray-400">
                  {searchTerm || filterStatus !== "all" || filterAssignee !== "all" || filterCategory !== "all"
                    ? "Try adjusting your filters"
                    : "Create your first task to get started"}
                </p>
                </div>
            )}
          </div>
        </ModernCard>

        {/* Premium Task Analytics - Only show if we have enough data */}
        {tasks.length >= 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 refined-light-worm refined-aurora-glow">
            {/* Task Distribution Analytics */}
            <PremiumAnalytics
              title="Task Distribution"
              subtitle="Workload by roommate"
              type="distribution"
              icon={<IconUser className="w-4 h-4" />}
              accentColor="#8B5CF6"
              data={roommates.map((roommate, index) => {
                const personTasks = tasks.filter(t => t.assignee === roommate.name);
                const completedTasks = personTasks.filter(t => t.completed).length;
                const completionRate = personTasks.length > 0 ? Math.round((completedTasks / personTasks.length) * 100) : 0;
                
                if (personTasks.length === 0) return null;
                
                return {
                  name: roommate.name,
                  value: personTasks.length,
                  trend: (completionRate >= 80 ? 'up' : completionRate >= 50 ? 'neutral' : 'down') as 'up' | 'down' | 'neutral',
                  change: completionRate,
                  color: ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'][index % 4],
                  details: `${completedTasks} completed, ${personTasks.length - completedTasks} pending`
                };
              }).filter((item): item is NonNullable<typeof item> => item !== null)}
              showInsights={true}
            />

            {/* Task Status Analytics */}
            <PremiumAnalytics
              title="Status Overview"
              subtitle="Current progress tracking"
              type="status"
              icon={<IconFlag className="w-4 h-4" />}
              accentColor="#10B981"
              data={[
                {
                  name: "Completed",
                  value: stats.completed,
                  trend: 'up',
                  change: 15,
                  color: '#10B981',
                  details: `${Math.round((stats.completed / tasks.length) * 100)}% completion rate`
                },
                {
                  name: "Pending",
                  value: stats.pending,
                  trend: 'neutral',
                  change: 0,
                  color: '#F59E0B',
                  details: `${stats.pending} tasks in progress`
                },
                {
                  name: "Overdue",
                  value: stats.overdue,
                  trend: stats.overdue > 0 ? 'down' : 'neutral',
                  change: stats.overdue > 0 ? -5 : 0,
                  color: '#EF4444',
                  details: stats.overdue > 0 ? 'Needs immediate attention' : 'Great! No overdue tasks'
                }
              ]}
              showInsights={true}
            />
          </div>
        )}
      </div>

            {/* Add Task Modal */}
      {showAddTask && (
          <motion.div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowAddTask(false)}
          >
            <motion.div 
            className="absolute top-24 right-6 w-96 max-h-[calc(100vh-8rem)] overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: -20, x: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0, x: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -20, x: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Background with Advanced Glassmorphism */}
            <div className="relative bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-900/40 backdrop-blur-2xl border border-white/30 dark:border-white/20 rounded-3xl shadow-2xl overflow-hidden">
              
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10"></div>
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0" style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                  backgroundSize: '60px 60px'
                }}></div>
              </div>

                            {/* Content Container */}
              <div className="relative z-10 p-6">
                {/* Compact Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-500/20 border border-purple-500/30">
                      <IconPlus className="w-5 h-5 text-purple-400" />
                    </div>
                <div>
                      <h3 className="text-lg font-bold text-white refined-text-progressive-glow">
                        New Task
                      </h3>
                      <p className="text-purple-200/70 text-xs mt-0.5">Quick add</p>
                    </div>
                  </div>
                  <ModernIconButton
                    icon={IconX}
                    onClick={() => setShowAddTask(false)}
                    variant="ghost"
                    size="sm"
                    className="hover:bg-white/10 text-white/70 hover:text-white"
                  />
                </div>

                {/* Compact Form */}
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {/* Task Title */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white/90 refined-text-subtle-glow">
                      Task Title
                    </label>
                  <input 
                    type="text"
                      placeholder="What needs to be done?"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full px-4 py-3.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 focus:bg-white/15"
                  />
                </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-white/90 refined-text-subtle-glow">
                      Description <span className="text-white/50 font-normal">(Optional)</span>
                    </label>
                  <textarea 
                      placeholder="Add more details..."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    rows={3}
                      className="w-full px-4 py-3.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 focus:bg-white/15 resize-none"
                  />
                </div>

                                {/* Assignee and Due Date Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-white/90 refined-text-subtle-glow">
                        Assignee
                      </label>
                      <select 
                        value={formData.assignee}
                        onChange={(e) => handleInputChange("assignee", e.target.value)}
                        className="w-full px-4 py-3.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 focus:bg-white/15">
                        {roommates.map(roommate => (
                          <option key={roommate.name} value={roommate.name} className="bg-gray-800 text-white">
                            {roommate.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-white/90 refined-text-subtle-glow">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => handleInputChange("dueDate", e.target.value)}
                        className="w-full px-4 py-3.5 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-200 hover:bg-white/15 focus:bg-white/15"
                      />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                    Priority
                  </label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => handleInputChange("priority", e.target.value as "low" | "medium" | "high")}
                    className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15">
                    {priorities.map(priority => (
                      <option key={priority} value={priority.toLowerCase()} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {priority}
                      </option>
                    ))}
                    </select>
                  </div>

                  <div>
                  <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                    Category
                  </label>
                  <select 
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15">
                    {categories.slice(1).map(category => (
                      <option key={category} value={category.toLowerCase()} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {category}
                      </option>
                    ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                  <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                    Recurring
                  </label>
                  <select 
                    value={formData.recurring}
                    onChange={(e) => handleInputChange("recurring", e.target.value as "none" | "daily" | "weekly" | "monthly")}
                    className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15">
                    {recurringOptions.map(option => (
                      <option key={option} value={option.toLowerCase()} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium">
                        {option}
                      </option>
                    ))}
                    </select>
                  </div>

                  <div>
                  <label className="block text-sm font-bold text-white mb-2 drop-shadow-sm">
                    Points
                  </label>
                    <input 
                    type="number"
                    min="1"
                    max="20"
                    value={formData.points}
                    onChange={(e) => handleInputChange("points", parseInt(e.target.value, 10))}
                    className="w-full px-4 py-3 bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/20 rounded-xl text-white font-medium placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 focus:bg-white/30 dark:focus:bg-white/15"
                    />
                  </div>
                </div>

                  {/* Compact Action Buttons */}
                  <div className="flex gap-3 pt-6 border-t border-white/10">
                  <motion.button
                      type="button"
                      onClick={() => setShowAddTask(false)}
                      className="flex-1 px-6 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 rounded-2xl text-white font-semibold transition-all duration-200 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                      type="submit"
                      onClick={handleAddTask}
                      className="flex-1 px-6 py-3.5 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 rounded-2xl text-white font-semibold transition-all duration-200 shadow-lg shadow-purple-500/20 border border-purple-400/30 refined-hover-ripple"
                      whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(139, 92, 246, 0.25)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Task
                  </motion.button>
                </div>
              </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* Celebration System */}
      <CelebrationSystem
        trigger={celebrateTask.trigger}
        type="task"
        intensity="high"
        message={celebrateTask.taskTitle ? `"${celebrateTask.taskTitle}" completed! 🎉` : undefined}
        onComplete={() => setCelebrateTask({trigger: false})}
      />
    </div>
  );
};

export default TasksPage;
