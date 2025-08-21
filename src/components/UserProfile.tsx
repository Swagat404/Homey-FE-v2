/**
 * User Profile Component - Example of using API hooks
 */

import React from 'react';
import * as UI from '@/components/ui/index';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useTaskStats, useExpenseStats, useMessageStats } from '@/lib/hooks/useApi';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: taskStats } = useTaskStats();
  const { data: expenseStats } = useExpenseStats();
  const { data: messageStats } = useMessageStats();

  if (!user) return null;

  return (
    <UI.GlassCard className="p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: `var(--homey-${user.avatar_color || 'purple'}-500)` }}
        >
          {user.avatar_initials || user.name.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <UI.GlassHeading level={3}>{user.name}</UI.GlassHeading>
          <UI.GlassText className="text-sm opacity-70">{user.email}</UI.GlassText>
          <div className="flex items-center space-x-2 mt-1">
            <div className={`w-2 h-2 rounded-full ${user.is_online ? 'bg-green-500' : 'bg-gray-400'}`} />
            <UI.GlassText className="text-xs opacity-60">
              {user.is_online ? 'Online' : 'Offline'}
            </UI.GlassText>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-homey-glass-bg rounded-lg border border-homey-glass-border">
          <div className="text-lg font-semibold text-homey-violet-500">
            {taskStats?.completed || 0}
          </div>
          <UI.GlassText className="text-xs opacity-70">Tasks Completed</UI.GlassText>
        </div>
        
        <div className="text-center p-3 bg-homey-glass-bg rounded-lg border border-homey-glass-border">
          <div className="text-lg font-semibold text-green-500">
            {taskStats?.total_points || 0}
          </div>
          <UI.GlassText className="text-xs opacity-70">Points Earned</UI.GlassText>
        </div>
        
        <div className="text-center p-3 bg-homey-glass-bg rounded-lg border border-homey-glass-border">
          <div className="text-lg font-semibold text-blue-500">
            ${expenseStats?.my_balance?.toFixed(2) || '0.00'}
          </div>
          <UI.GlassText className="text-xs opacity-70">Balance</UI.GlassText>
        </div>
        
        <div className="text-center p-3 bg-homey-glass-bg rounded-lg border border-homey-glass-border">
          <div className="text-lg font-semibold text-orange-500">
            {messageStats?.unread_count || 0}
          </div>
          <UI.GlassText className="text-xs opacity-70">Unread Messages</UI.GlassText>
        </div>
      </div>

      <UI.GlassButton 
        onClick={logout}
        className="w-full"
        variant="outline"
      >
        Sign Out
      </UI.GlassButton>
    </UI.GlassCard>
  );
};

export default UserProfile;
