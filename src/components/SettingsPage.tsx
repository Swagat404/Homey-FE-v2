import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  IconArrowLeft,
  IconUsers,
  IconBell,
  IconPalette,
  IconUser,
  IconShield,
  IconHelpCircle,
  IconLogout,
  IconEdit,
  IconTrash,
  IconPlus,
  IconX,
  IconCheck,
  IconSettings,
  IconNotification,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import { ModernCard, ModernIconButton } from "./ui";

interface SettingsPageProps {
  onBack: () => void;
  isDark: boolean;
  toggleTheme: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, isDark, toggleTheme }) => {
  const [selectedSection, setSelectedSection] = useState("general");
  const [showAddRoommate, setShowAddRoommate] = useState(false);
  const [notifications, setNotifications] = useState({
    tasks: true,
    expenses: true,
    announcements: true,
    email: false,
  });

  const currentUser = { name: "Alex Johnson", avatar: "AJ", email: "alex@homey.com" };
  
  const [roommates, setRoommates] = useState([
    { id: 1, name: "Alex Johnson", avatar: "AJ", status: "online", tasks: 3, email: "alex@homey.com", role: "admin" },
    { id: 2, name: "Sarah Chen", avatar: "SC", status: "away", tasks: 2, email: "sarah@homey.com", role: "member" },
    { id: 3, name: "Mike Rodriguez", avatar: "MR", status: "offline", tasks: 4, email: "mike@homey.com", role: "member" },
    { id: 4, name: "Emma Davis", avatar: "ED", status: "online", tasks: 3, email: "emma@homey.com", role: "member" },
  ]);

  const settingSections = [
    { id: "general", icon: IconSettings, label: "General", description: "App preferences and display" },
    { id: "roommates", icon: IconUsers, label: "Roommates", description: "Manage household members" },
    { id: "notifications", icon: IconBell, label: "Notifications", description: "Alert preferences" },
    { id: "account", icon: IconUser, label: "Account", description: "Profile and security" },
    { id: "help", icon: IconHelpCircle, label: "Help & Support", description: "FAQ and contact" },
  ];

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const removeRoommate = (id: number) => {
    setRoommates(prev => prev.filter(r => r.id !== id));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Appearance</h3>
        <ModernCard variant="glass" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <IconMoon className="w-5 h-5 text-purple-500" /> : <IconSun className="w-5 h-5 text-yellow-500" />}
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isDark ? "Dark mode" : "Light mode"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isDark ? "bg-purple-500" : "bg-gray-300"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                isDark ? "translate-x-7" : "translate-x-1"
              }`} />
            </button>
          </div>
        </ModernCard>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Language & Region</h3>
        <ModernCard variant="glass" className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Currency
            </label>
            <select className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="cad">CAD (C$)</option>
            </select>
          </div>
        </ModernCard>
      </div>
    </div>
  );

  const renderRoommatesSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Household Members</h3>
        <ModernIconButton
          icon={IconPlus}
          variant="primary"
          size="sm"
          tooltip="Invite roommate"
          onClick={() => setShowAddRoommate(true)}
        />
      </div>

      <div className="space-y-4">
        {roommates.map((roommate) => (
          <ModernCard key={roommate.id} variant="glass" className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white font-bold">
                    {roommate.avatar}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                    roommate.status === 'online' ? 'bg-green-500' :
                    roommate.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`}></div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white refined-text-pulse-glow">{roommate.name}</p>
                    {roommate.role === 'admin' && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{roommate.email}</p>
                  <p className="text-xs text-gray-400">{roommate.tasks} active tasks</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ModernIconButton icon={IconEdit} variant="ghost" size="sm" />
                {roommate.name !== currentUser.name && (
                  <ModernIconButton 
                    icon={IconTrash} 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeRoommate(roommate.id)}
                  />
                )}
              </div>
            </div>
          </ModernCard>
        ))}
      </div>

      {/* Add Roommate Modal */}
      {showAddRoommate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <ModernCard variant="glass" className="w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Invite Roommate
              </h3>
              <ModernIconButton
                icon={IconX}
                onClick={() => setShowAddRoommate(false)}
                variant="ghost"
                size="sm"
              />
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="roommate@example.com"
                  className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRoommate(false)}
                  className="flex-1 px-4 py-3 bg-white/[0.08] border border-white/[0.12] text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-white/[0.12] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-violet-700 transition-colors"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </ModernCard>
        </div>
      )}
    </div>
  );

  const renderNotificationsSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Preferences</h3>
      
      <ModernCard variant="glass" className="p-4 space-y-4">
        {[
          { key: "tasks", label: "Task Updates", description: "New tasks assigned and completed" },
          { key: "expenses", label: "Expense Notifications", description: "New expenses and payment reminders" },
          { key: "announcements", label: "Announcements", description: "Messages and house updates" },
          { key: "email", label: "Email Notifications", description: "Receive notifications via email" },
        ].map((setting) => (
          <div key={setting.key} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{setting.label}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{setting.description}</p>
            </div>
            <button
              onClick={() => handleNotificationChange(setting.key as keyof typeof notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications[setting.key as keyof typeof notifications] ? "bg-purple-500" : "bg-gray-300"
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                notifications[setting.key as keyof typeof notifications] ? "translate-x-7" : "translate-x-1"
              }`} />
            </button>
          </div>
        ))}
      </ModernCard>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h3>
      
      <ModernCard variant="glass" className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name
          </label>
          <input
            type="text"
            defaultValue={currentUser.name}
            className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue={currentUser.email}
            className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <button className="w-full px-4 py-3 bg-white/[0.08] border border-white/[0.12] rounded-xl backdrop-blur-xl text-left text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] transition-colors">
            Change password...
          </button>
        </div>
      </ModernCard>

      <ModernCard variant="glass" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-red-600 dark:text-red-400">Danger Zone</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Permanently delete your account</p>
          </div>
          <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-500/20 transition-colors">
            Delete Account
          </button>
        </div>
      </ModernCard>
    </div>
  );

  const renderHelpSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Help & Support</h3>
      
      <div className="space-y-4">
        {[
          { title: "Getting Started", description: "Learn the basics of RoomieHub" },
          { title: "Managing Tasks", description: "How to create and assign tasks" },
          { title: "Splitting Expenses", description: "Track and split bills easily" },
          { title: "Privacy & Security", description: "Keep your data safe" },
          { title: "Contact Support", description: "Get help from our team" },
        ].map((item, index) => (
          <ModernCard key={index} variant="glass" className="p-4 cursor-pointer hover:bg-white/[0.12] transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <IconArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </div>
          </ModernCard>
        ))}
      </div>

      <ModernCard variant="glass" className="p-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">RoomieHub v1.0.0</p>
        <p className="text-xs text-gray-400">Made with ❤️ for better roommate life</p>
      </ModernCard>
    </div>
  );

  const renderContent = () => {
    switch (selectedSection) {
      case "general": return renderGeneralSettings();
      case "roommates": return renderRoommatesSettings();
      case "notifications": return renderNotificationsSettings();
      case "account": return renderAccountSettings();
      case "help": return renderHelpSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-purple-50/20 dark:from-gray-900 dark:via-black dark:to-gray-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.08] dark:bg-black/[0.20] border-b border-white/[0.12] dark:border-white/[0.08]">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <ModernIconButton
              icon={IconArrowLeft}
              onClick={onBack}
              variant="ghost"
              tooltip="Back to dashboard"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white refined-text-progressive-glow">Settings</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 refined-text-subtle-glow">Manage your preferences and account</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)]">
        {/* Settings Sidebar */}
        <div className="lg:w-80 border-r border-white/[0.12] dark:border-white/[0.08] bg-white/[0.02] dark:bg-black/[0.10]">
          <div className="p-4 space-y-2">
            {settingSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  selectedSection === section.id
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-white/[0.08]"
                }`}
              >
                <section.icon className="w-5 h-5" />
                <div className="text-left">
                  <p className="font-medium">{section.label}</p>
                  <p className="text-xs opacity-70">{section.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={selectedSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 