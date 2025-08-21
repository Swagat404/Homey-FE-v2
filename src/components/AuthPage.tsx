/**
 * Authentication Page - Login/Register
 */

import React, { useState } from 'react';
import * as UI from '@/components/ui/index';
import { useAuth } from '@/lib/contexts/AuthContext';
import { UserLogin, UserCreate } from '@/lib/api/types';

interface AuthPageProps {
  isDark: boolean;
}

const AuthPage: React.FC<AuthPageProps> = ({ isDark }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState<UserLogin>({
    email: '',
    password: '',
  });

  const [registerForm, setRegisterForm] = useState<UserCreate>({
    name: '',
    email: '',
    password: '',
    avatar_color: 'purple',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;

    setIsLoading(true);
    try {
      await login(loginForm);
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) return;

    setIsLoading(true);
    try {
      // Generate initials from name
      const words = registerForm.name.trim().split(' ');
      const initials = words.length >= 2 
        ? `${words[0][0]}${words[1][0]}`.toUpperCase()
        : words[0].substring(0, 2).toUpperCase();

      await register({
        ...registerForm,
        avatar_initials: initials,
      });
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const avatarColors = [
    'purple', 'blue', 'green', 'red', 'orange', 'pink', 'indigo', 'teal'
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-homey-violet-50 to-homey-violet-100 dark:from-homey-violet-900 dark:to-homey-violet-800">
      <div className="w-full max-w-md">
        <UI.GlassCard className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-homey-violet-500 to-homey-violet-600 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">H</span>
            </div>
            <UI.GlassHeading level={1} className="mb-2">
              Welcome to Homey
            </UI.GlassHeading>
            <UI.GlassText className="opacity-70">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </UI.GlassText>
          </div>

          {/* Tab Switcher */}
          <div className="flex mb-6 p-1 bg-homey-glass-bg rounded-lg border border-homey-glass-border">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isLogin
                  ? 'bg-homey-violet-500 text-white shadow-lg'
                  : 'text-homey-text-secondary hover:text-homey-text'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isLogin
                  ? 'bg-homey-violet-500 text-white shadow-lg'
                  : 'text-homey-text-secondary hover:text-homey-text'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Login Form */}
          {isLogin && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-homey-text mb-2">
                  Email
                </label>
                <UI.GlassInput
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-homey-text mb-2">
                  Password
                </label>
                <UI.GlassInput
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <UI.GlassButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </UI.GlassButton>
            </form>
          )}

          {/* Register Form */}
          {!isLogin && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-homey-text mb-2">
                  Full Name
                </label>
                <UI.GlassInput
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-homey-text mb-2">
                  Email
                </label>
                <UI.GlassInput
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-homey-text mb-2">
                  Password
                </label>
                <UI.GlassInput
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-homey-text mb-2">
                  Avatar Color
                </label>
                <div className="flex space-x-2">
                  {avatarColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setRegisterForm({ ...registerForm, avatar_color: color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        registerForm.avatar_color === color
                          ? 'border-white shadow-lg scale-110'
                          : 'border-transparent hover:scale-105'
                      }`}
                      style={{
                        background: `var(--homey-${color}-500)`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <UI.GlassButton
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </UI.GlassButton>
            </form>
          )}

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-homey-glass-bg rounded-lg border border-homey-glass-border">
            <UI.GlassText className="text-xs opacity-70 text-center">
              💡 Demo: Try creating an account or use any email/password to test
            </UI.GlassText>
          </div>
        </UI.GlassCard>
      </div>
    </div>
  );
};

export default AuthPage;
