import { motion, Variants } from "framer-motion";
import {
  IconHome,
  IconCheck,
  IconCurrencyDollar,
  IconBell,
  IconSun,
  IconMoon,
  IconPlus,
  IconSettings,
  IconUsers,
  IconCalendar,
  IconActivity,
  IconReceipt,
  IconMessageCircle,
  IconShoppingCart,
  IconCooker,
  IconTrash,
  IconX,
  IconFlag,
  IconArrowRight,
} from "@tabler/icons-react";
import React, { useState } from "react";
import toast from "react-hot-toast";
import * as UI from "./ui";
import { ModernCard, ModernIconButton, StatCard } from "./ui";
import NotificationOverlay from "./NotificationOverlay";
import ParticleBackground from "./ParticleBackground";
import GatewayCalendar from "./GatewayCalendar";

interface DashboardProps {
  isDark: boolean;
  toggleTheme: () => void;
  onNavigate?: (page: string) => void;
}

interface Task {
  id: number;
  title: string;
  assignee: string;
  time: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  completed?: boolean;
  dueDate?: string;
}

interface CalendarTasks {
  [key: string]: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ isDark, toggleTheme, onNavigate }) => {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [showHouseholdMenu, setShowHouseholdMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Enhanced navigation function that also calls parent navigation
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  // Navigate to specific section within a page
  const handleStatNavigation = (page: string, filter?: string) => {
    if (onNavigate) {
      // Store the filter in sessionStorage so the target page can use it
      if (filter) {
        sessionStorage.setItem('pageFilter', filter);
      }
      onNavigate(page);
    }
  };

  // Roommate-specific mock data
  const mockData = {
    user: { 
      name: "Alex Johnson", 
      avatar: "AJ",
      email: "alex@homey.com" 
    },
    apartment: { 
      name: "Sunset Apartment 4B", 
      roommates: 4,
      address: "123 College Ave, Berkeley"
    },
    notifications: 3,
    tasks: { pending: 7, overdue: 2, completed: 15, thisWeek: 12 },
    expenses: { 
      pending: 3, 
      yourShare: 284.50, 
      totalThisMonth: 1138.00,
      youOwe: 142.25,
      owedToYou: 67.50
    },
    announcements: { unread: 2, total: 8 },
    roommates: [
      { name: "Alex Johnson", avatar: "AJ", status: "online", tasks: 3 },
      { name: "Sarah Chen", avatar: "SC", status: "away", tasks: 2 },
      { name: "Mike Rodriguez", avatar: "MR", status: "offline", tasks: 4 },
      { name: "Emma Davis", avatar: "ED", status: "online", tasks: 3 },
    ]
  };

  // Calendar data with enhanced task structure for 3D portal
  const calendarTasks: CalendarTasks = {
    "2024-12-15": [
    {
        id: 1, 
        title: "Take out trash and recycling", 
        assignee: "Alex", 
        time: "Evening", 
        category: "cleaning", 
        priority: "medium" as const,
        description: "Empty all trash bins and take recycling to curb. Don't forget to clean the bins afterward.",
        completed: false,
        dueDate: "2024-12-15"
      },
      { 
        id: 2, 
        title: "Buy groceries", 
        assignee: "Sarah", 
        time: "Afternoon", 
        category: "shopping", 
        priority: "high" as const,
        description: "Milk, bread, eggs, vegetables, and cleaning supplies for the week.",
        completed: false,
        dueDate: "2024-12-15"
      }
    ],
    "2024-12-16": [
    {
        id: 3, 
        title: "Clean bathroom thoroughly", 
        assignee: "Mike", 
        time: "Morning", 
        category: "cleaning", 
        priority: "medium" as const,
        description: "Scrub tub, clean toilet, mop floor, and replace towels.",
        completed: false,
        dueDate: "2024-12-16"
      },
      { 
        id: 6, 
        title: "Cook dinner for everyone", 
        assignee: "Alex", 
        time: "6 PM", 
        category: "cooking", 
        priority: "low" as const,
        description: "Plan and prepare a nice group dinner. Ask everyone for preferences.",
        completed: true,
        dueDate: "2024-12-16"
      }
    ],
    "2024-12-17": [
    {
        id: 4, 
        title: "Pay electricity bill", 
        assignee: "Emma", 
        time: "Due Today", 
        category: "bills", 
        priority: "high" as const,
        description: "December electricity bill is due. Don't forget to update the shared expense tracker.",
        completed: false,
        dueDate: "2024-12-17"
      },
      { 
        id: 5, 
        title: "Vacuum living room", 
        assignee: "Alex", 
        time: "Afternoon", 
        category: "cleaning", 
        priority: "low" as const,
        description: "Deep clean all carpets and rugs in the living room and hallway.",
        completed: true,
        dueDate: "2024-12-17"
      }
    ],
    "2024-12-20": [
      { 
        id: 7, 
        title: "House meeting", 
        assignee: "Everyone", 
        time: "7 PM", 
        category: "meeting", 
        priority: "high" as const,
        description: "Monthly house meeting to discuss December expenses, cleaning rotation, and holiday plans.",
        completed: false,
        dueDate: "2024-12-20"
      }
    ],
    // August 2025 Activities
    "2025-08-01": [
      {
        id: 101,
        title: "Monthly house meeting",
        assignee: "Alex",
        time: "7:00 PM",
        category: "meeting",
        priority: "high" as const,
        description: "Discuss August expenses, upcoming maintenance, and plan for Emma's birthday party.",
        completed: false,
        dueDate: "2025-08-01"
      }
    ],
    "2025-08-03": [
      {
        id: 102,
        title: "Deep clean kitchen",
        assignee: "Sarah",
        time: "Morning",
        category: "cleaning",
        priority: "medium" as const,
        description: "Thorough kitchen cleaning: scrub appliances, organize pantry, clean out fridge.",
        completed: false,
        dueDate: "2025-08-03"
      },
      {
        id: 103,
        title: "Grocery shopping for the week",
        assignee: "Mike",
        time: "2:00 PM",
        category: "shopping",
        priority: "high" as const,
        description: "Stock up for the week: fresh produce, dairy, snacks, and cleaning supplies.",
        completed: false,
        dueDate: "2025-08-03"
      }
    ],
    "2025-08-05": [
      {
        id: 104,
        title: "Game night preparation",
        assignee: "Emma",
        time: "Evening",
        category: "other",
        priority: "low" as const,
        description: "Set up living room for weekly game night. Prepare snacks and drinks.",
        completed: false,
        dueDate: "2025-08-05"
      }
    ],
    "2025-08-08": [
      {
        id: 105,
        title: "Laundry room organization",
        assignee: "Alex",
        time: "Morning",
        category: "cleaning",
        priority: "medium" as const,
        description: "Organize laundry supplies, clean lint trap, and set up drying schedule.",
        completed: true,
        dueDate: "2025-08-08"
      }
    ],
    "2025-08-10": [
      {
        id: 106,
        title: "Internet bill payment",
        assignee: "Sarah",
        time: "Any time",
        category: "bills",
        priority: "high" as const,
        description: "Pay monthly internet bill and review usage for the month.",
        completed: false,
        dueDate: "2025-08-10"
      },
      {
        id: 107,
        title: "Plan Emma's birthday surprise",
        assignee: "Mike",
        time: "Evening",
        category: "other",
        priority: "medium" as const,
        description: "Coordinate with others for Emma's birthday party on the 15th. Secret planning!",
        completed: false,
        dueDate: "2025-08-10"
      }
    ],
    "2025-08-12": [
      {
        id: 108,
        title: "Bathroom deep clean",
        assignee: "Emma",
        time: "Morning",
        category: "cleaning",
        priority: "medium" as const,
        description: "Weekly bathroom cleaning: scrub tiles, clean mirror, replace toiletries.",
        completed: false,
        dueDate: "2025-08-12"
      }
    ],
    "2025-08-15": [
      {
        id: 109,
        title: "Emma's Birthday Party! 🎉",
        assignee: "Everyone",
        time: "6:00 PM",
        category: "other",
        priority: "high" as const,
        description: "Celebrate Emma's birthday! Cake, decorations, and surprise gifts ready.",
        completed: false,
        dueDate: "2025-08-15"
      }
    ],
    "2025-08-17": [
      {
        id: 110,
        title: "Weekly grocery run",
        assignee: "Alex",
        time: "Afternoon",
        category: "shopping",
        priority: "medium" as const,
        description: "Restock after the birthday party: fruits, vegetables, and household items.",
        completed: false,
        dueDate: "2025-08-17"
      }
    ],
    "2025-08-20": [
      {
        id: 111,
        title: "Living room furniture rearrangement",
        assignee: "Mike",
        time: "Morning",
        category: "maintenance",
        priority: "low" as const,
        description: "Try new living room layout for better flow and more space.",
        completed: false,
        dueDate: "2025-08-20"
      },
      {
        id: 112,
        title: "Cook group dinner",
        assignee: "Sarah",
        time: "7:00 PM",
        category: "cooking",
        priority: "medium" as const,
        description: "Prepare a special group dinner with everyone's favorite dishes.",
        completed: false,
        dueDate: "2025-08-20"
      }
    ],
    "2025-08-22": [
      {
        id: 113,
        title: "Garden maintenance",
        assignee: "Emma",
        time: "Morning",
        category: "maintenance",
        priority: "medium" as const,
        description: "Water plants, trim herbs, and harvest vegetables from the balcony garden.",
        completed: false,
        dueDate: "2025-08-22"
      }
    ],
    "2025-08-25": [
      {
        id: 114,
        title: "Electricity bill due",
        assignee: "Alex",
        time: "Before 5 PM",
        category: "bills",
        priority: "high" as const,
        description: "Pay monthly electricity bill. Check if usage increased due to AC in summer.",
        completed: false,
        dueDate: "2025-08-25"
      }
    ],
    "2025-08-27": [
      {
        id: 115,
        title: "House supply shopping",
        assignee: "Mike",
        time: "Afternoon",
        category: "shopping",
        priority: "medium" as const,
        description: "Buy household supplies: toilet paper, detergent, light bulbs, and batteries.",
        completed: false,
        dueDate: "2025-08-27"
      }
    ],
    "2025-08-29": [
      {
        id: 116,
        title: "Movie night setup",
        assignee: "Sarah",
        time: "Evening",
        category: "other",
        priority: "low" as const,
        description: "Set up projector for outdoor movie night. Prepare popcorn and blankets.",
        completed: false,
        dueDate: "2025-08-29"
      }
    ],
    "2025-08-31": [
      {
        id: 117,
        title: "End of month expense review",
        assignee: "Everyone",
        time: "8:00 PM",
        category: "bills",
        priority: "high" as const,
        description: "Review August expenses, settle up payments, and plan September budget.",
        completed: false,
        dueDate: "2025-08-31"
      },
      {
        id: 118,
        title: "Apartment inspection prep",
        assignee: "Emma",
        time: "Morning",
        category: "cleaning",
        priority: "medium" as const,
        description: "Final cleaning and organization before potential apartment inspection.",
        completed: false,
        dueDate: "2025-08-31"
      }
    ]
  };

  const handleTaskClick = (task: Task) => {
    // Handle task navigation or action
    console.log('Task clicked:', task);
    // Could navigate to task details or open edit modal
  };

  const handleTaskComplete = (taskId: number) => {
    // This would normally update the task in the global state
    console.log('Task completed:', taskId);
    toast.success("Task marked as complete!");
    // In a real app, this would update the task state
  };

  const handleTaskEdit = (task: Task) => {
    // Navigate to tasks page with edit modal open
    if (onNavigate) {
      sessionStorage.setItem('editTask', JSON.stringify(task));
      onNavigate('tasks');
    }
  };

  const handleNavigateToTasks = () => {
    if (onNavigate) {
      onNavigate('tasks');
    }
  };

  const handleNavigateToExpenses = () => {
    if (onNavigate) {
      onNavigate('expenses');
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 dark:from-gray-900 dark:via-black dark:to-gray-900 safe-area-inset pb-20">
      
      {/* Subtle Particle Background */}
      <ParticleBackground isDark={isDark} particleCount={30} />
      
      {/* Modern Header */}
      <motion.header
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.08] dark:bg-black/[0.20] border-b border-white/[0.12] dark:border-white/[0.08]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
      >
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
          <motion.div
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center relative overflow-hidden group"
                whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <IconUsers className="w-6 h-6 text-white relative z-10" />
          <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                  initial={{ x: -100 }}
                  whileHover={{ x: 100 }}
                  transition={{ duration: 0.6 }}
                />
          </motion.div>
              <div>
                <motion.h1 
                  className="text-xl font-bold text-gradient refined-text-progressive-glow glass-text-accent streaming-light-text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
          >
                  Homey
                </motion.h1>
                <motion.p 
                  className="refined-caption refined-text-subtle-glow glass-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Smart roommate companion
                </motion.p>
              </div>
        </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ModernIconButton
                icon={isDark ? IconSun : IconMoon}
              onClick={toggleTheme}
                variant="ghost"
                tooltip={isDark ? "Switch to light mode" : "Switch to dark mode"}
                className="hover-lift magnetic"
              />
              
              <ModernIconButton
                icon={IconBell}
                variant="ghost"
                pulse={mockData.notifications > 0}
                tooltip="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
                className="hover-lift magnetic pulse-glow"
              />
              
              <ModernIconButton
                icon={IconSettings}
                variant="ghost"
                tooltip="Settings"
                onClick={() => handleNavigation("settings")}
                className="hover-lift magnetic"
              />
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main
        className="px-4 sm:px-6 py-6 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Compact Mobile-Friendly Header */}
        <motion.section 
          variants={itemVariants}
          className="mb-4"
        >
          <div className="flex items-center justify-between px-1">
            {/* Minimal Welcome */}
            <div className="flex items-center gap-3">
              <motion.div
                className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                {mockData.user.avatar}
                <motion.div 
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                />
              </motion.div>
              
              <div>
                <motion.h2 
                  className="text-xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {(() => {
                    const hour = new Date().getHours();
                    if (hour < 12) return "Good morning";
                    if (hour < 17) return "Good afternoon"; 
                    return "Good evening";
                  })()}, {mockData.user.name.split(' ')[0]}!
                </motion.h2>
                <motion.div
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                  <span>{mockData.apartment.name}</span>
                  <div className="w-1 h-1 rounded-full bg-gray-400"></div>
                  <span>{mockData.apartment.roommates} roommates</span>
                </motion.div>
              </div>
            </div>

            {/* Compact Action Buttons */}
            <div className="flex items-center gap-2">
              {mockData.notifications > 0 && (
                <motion.button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 dark:border-gray-700/50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <IconBell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <motion.div 
                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring", stiffness: 500 }}
                  >
                    <span className="text-white text-xs font-bold">{mockData.notifications}</span>
                  </motion.div>
                </motion.button>
              )}
              
              <motion.button
                onClick={handleAddNew}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg"
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(139, 92, 246, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <IconPlus className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.section>

        {/* Stats Grid - Now Clickable with personalized filters */}
        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-2 gap-4 particle-trail">
          <motion.div
              onClick={() => handleStatNavigation("tasks", "myPending")} 
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="hover-lift magnetic refined-sweep-glow refined-light-worm">
                <StatCard
                  title="Your Pending Tasks"
                  value={mockData.tasks.pending}
                  icon={IconCheck}
                  color="yellow"
                  change={mockData.tasks.pending > mockData.tasks.completed ? 15 : -10}
                  trend={mockData.tasks.pending > mockData.tasks.completed ? "up" : "down"}
                  changeLabel="vs last week"
                />
                      </div>
                  </motion.div>

          <motion.div
              onClick={() => handleStatNavigation("expenses", "myShare")} 
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="hover-lift magnetic refined-sweep-glow refined-light-worm">
                <StatCard
                  title="Your Share"
                  value={mockData.expenses.yourShare}
                  prefix="$"
                  icon={IconCurrencyDollar}
                  color="green"
                  change={-8}
                  trend="down"
                  changeLabel="vs last month"
                />
                </div>
          </motion.div>

                  <motion.div 
              onClick={() => handleStatNavigation("expenses", "myOwed")} 
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="hover-lift magnetic refined-sweep-glow refined-light-worm">
                <StatCard
                  title="You Owe"
                  value={mockData.expenses.youOwe}
                  prefix="$"
                  icon={IconReceipt}
                  color="red"
                  change={mockData.expenses.youOwe > 0 ? 25 : -100}
                  trend={mockData.expenses.youOwe > 0 ? "up" : "down"}
                  changeLabel="settle up soon"
                />
                    </div>
                  </motion.div>

                  <motion.div 
              onClick={() => handleStatNavigation("announcements", "unread")} 
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
              <div className="hover-lift magnetic refined-sweep-glow refined-light-worm">
                <StatCard
                  title="Unread Messages"
                  value={mockData.announcements.unread}
                  icon={IconMessageCircle}
                  color="blue"
                  change={mockData.announcements.unread > 0 ? 100 : -50}
                  trend={mockData.announcements.unread > 0 ? "up" : "down"}
                  changeLabel="new announcements"
                />
                      </div>
            </motion.div>
                      </div>
        </motion.section>

        {/* Calendar and Recent Activity */}
        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gateway Calendar */}
            <div className="lg:col-span-1 refined-diffused-glow refined-flowing-border">
              <div className="crystal-glass shiny-overlay rounded-3xl p-1 border-light-crawl orbiting-lights">
                <GatewayCalendar
                tasks={calendarTasks}
                onTaskClick={handleTaskClick}
                onTaskComplete={handleTaskComplete}
                onTaskEdit={handleTaskEdit}
                onNavigateToTasks={handleNavigateToTasks}
                onNavigateToExpenses={handleNavigateToExpenses}
              />
                    </div>
                </div>

            {/* Recent Activity Feed - Enhanced */}
            <div className="lg:col-span-2 refined-shimmer-accent refined-aurora-glow flowing-energy">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white refined-text-stream-glow glass-text-bold neon-pulse">
                    Recent Activity
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Real-time updates from your roommates
                  </p>
              </div>
                <div className="flex items-center gap-2">
                  <motion.div 
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">Live</span>
            </div>
          </div>

              <div className="space-y-4">
                {[
                  { 
                    icon: IconCheck, 
                    text: "Sarah completed kitchen cleaning", 
                    time: "2 hours ago", 
                    color: "green",
                    action: "completed",
                    avatar: "SC",
                    points: "+8 pts"
                  },
                  { 
                    icon: IconCurrencyDollar, 
                    text: "Mike added grocery receipt: $89.50", 
                    time: "4 hours ago", 
                    color: "blue",
                    action: "added",
                    avatar: "MR",
                    amount: "$89.50"
                  },
                  { 
                    icon: IconMessageCircle, 
                    text: "Emma: House party this Saturday!", 
                    time: "6 hours ago", 
                    color: "purple",
                    action: "announced",
                    avatar: "ED",
                    reactions: "🎉 3"
                  },
                  { 
                    icon: IconTrash, 
                    text: "You completed trash and recycling", 
                    time: "1 day ago", 
                    color: "yellow",
                    action: "completed",
                    avatar: "AJ",
                    points: "+5 pts"
                  },
                  { 
                    icon: IconCooker, 
                    text: "Alex is cooking dinner tonight", 
                    time: "2 days ago", 
                    color: "orange",
                    action: "scheduled",
                    avatar: "AJ",
                    time_detail: "6:30 PM"
                  }
                ].map((activity, index) => (
                  <motion.div 
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {/* Connecting line */}
                    {index < 4 && (
                      <div className="absolute left-6 top-12 w-0.5 h-6 bg-gradient-to-b from-gray-200 to-transparent dark:from-gray-700" />
                    )}
                    
                    <motion.div
                      className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/[0.02] dark:hover:bg-white/[0.02] transition-all duration-300 cursor-pointer border border-transparent hover:border-white/10"
                      whileHover={{ 
                        scale: 1.01,
                        y: -2,
                        boxShadow: "0 8px 32px rgba(139, 92, 246, 0.1)"
                      }}
                      whileTap={{ scale: 0.99 }}
                    >
                      {/* Avatar with activity icon overlay */}
                      <div className="relative flex-shrink-0">
                        <motion.div 
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                            activity.color === 'green' ? 'from-green-400 to-green-500' :
                            activity.color === 'blue' ? 'from-blue-400 to-blue-500' :
                            activity.color === 'purple' ? 'from-purple-400 to-purple-500' :
                            activity.color === 'yellow' ? 'from-yellow-400 to-yellow-500' :
                            'from-orange-400 to-orange-500'
                          } flex items-center justify-center text-white font-bold text-sm relative overflow-hidden`}
                          whileHover={{ rotate: 5, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {activity.avatar}
                          
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3,
                              ease: "easeInOut"
                            }}
                          />
                  </motion.div>
                        
                        {/* Activity type indicator */}
                  <motion.div 
                          className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-${activity.color}-500/90 backdrop-blur-sm border-2 border-white dark:border-gray-900 flex items-center justify-center`}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 500 }}
                        >
                          <activity.icon className="w-3 h-3 text-white" />
                        </motion.div>
                </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                              {activity.text}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {activity.time}
                              </p>
                              
                              {/* Dynamic metadata */}
                              {activity.points && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                                  <IconFlag className="w-3 h-3" />
                                  {activity.points}
                                </span>
                              )}
                              
                              {activity.amount && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">
                                  <IconCurrencyDollar className="w-3 h-3" />
                                  {activity.amount}
                                </span>
                              )}
                              
                              {activity.reactions && (
                                <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">
                                  {activity.reactions}
                                </span>
                              )}
                              
                              {activity.time_detail && (
                                <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded-full font-medium">
                                  {activity.time_detail}
                                </span>
                              )}
                </div>
              </div>

                          {/* Action status */}
                  <motion.div 
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.action === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                              activity.action === 'added' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              activity.action === 'announced' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                              activity.action === 'scheduled' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                            }`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {activity.action}
                          </motion.div>
                      </div>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              
              {/* View more with magnetic effect */}
                  <motion.div 
                className="mt-6 text-center"
                    whileHover={{ scale: 1.02 }}
              >
                <motion.button 
                  className="group relative inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300 font-medium overflow-hidden"
                  whileHover={{ 
                    boxShadow: "0 8px 32px rgba(139, 92, 246, 0.2)",
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Magnetic background effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10"
                    initial={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  <span className="relative z-10">View all activity</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <IconArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        
      </motion.main>

      {/* Notification Overlay */}
      <NotificationOverlay
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        isDark={isDark}
        onNavigate={handleNavigation}
      />

      {/* Add Item Modal - will be improved next */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ModernCard variant="glass" className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                What would you like to add?
              </h3>
              <ModernIconButton
                icon={IconX}
                onClick={() => setShowAddModal(false)}
                variant="ghost"
                size="sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ModernCard
                variant="glass"
                interactive={true}
                onClick={() => {
                  setShowAddModal(false);
                  handleNavigation("tasks");
                }}
                className="cursor-pointer p-4 text-center"
              >
                <IconCheck className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white text-sm">Add Task</p>
              </ModernCard>

              <ModernCard
                variant="glass"
                interactive={true}
                onClick={() => {
                  setShowAddModal(false);
                  handleNavigation("expenses");
                }}
                className="cursor-pointer p-4 text-center"
              >
                <IconCurrencyDollar className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-medium text-gray-900 dark:text-white text-sm">Add Expense</p>
              </ModernCard>
                </div>
          </ModernCard>
                </div>
      )}
    </div>
  );
};

export default Dashboard;
