import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  Settings as SettingsIcon,
  Bell,
  Moon,
  Sun,
  Lock,
  Shield,
  LogOut,
  Trash2,
  ChevronRight,
  Loader2,
  Save,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { authFetch, getCurrentUser, logout } from '../utils/auth-utils';

interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    emailNotifications: boolean;
    taskReminders: boolean;
    taskAssignments: boolean;
    systemUpdates: boolean;
  };
  privacy: {
    showProfileToOthers: boolean;
    showActivityStatus: boolean;
  };
}

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'privacy' | 'danger'>('general');
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'system',
    notifications: {
      emailNotifications: true,
      taskReminders: true,
      taskAssignments: true,
      systemUpdates: false,
    },
    privacy: {
      showProfileToOthers: true,
      showActivityStatus: true,
    }
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string>('');
  const [user, setUser] = useState(getCurrentUser());

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('taskforge_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing saved settings:', error);
      }
    }
    
    // Detect system theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark' || settings.theme === 'system');
    } else {
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    }
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (settings.theme === 'system') {
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Handle theme change
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setSettings(prev => ({ ...prev, theme }));
    // Save to localStorage
    localStorage.setItem('taskforge_settings', JSON.stringify({ ...settings, theme }));
  };

  // Handle notification settings
  const handleNotificationChange = (setting: keyof typeof settings.notifications) => {
    const newSettings = { 
      ...settings, 
      notifications: { 
        ...settings.notifications, 
        [setting]: !settings.notifications[setting] 
      } 
    };
    setSettings(newSettings);
    localStorage.setItem('taskforge_settings', JSON.stringify(newSettings));
  };

  // Handle privacy settings
  const handlePrivacyChange = (setting: keyof typeof settings.privacy) => {
    const newSettings = { 
      ...settings, 
      privacy: { 
        ...settings.privacy, 
        [setting]: !settings.privacy[setting] 
      } 
    };
    setSettings(newSettings);
    localStorage.setItem('taskforge_settings', JSON.stringify(newSettings));
  };

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    
    try {
      setSavingSettings(true);
      
      const response = await authFetch('http://localhost:3001/api/users/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to change password');
      }
      
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Password changed successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setSavingSettings(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.username) {
      toast.error('Username confirmation does not match');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await authFetch(`http://localhost:3001/api/users/${user?._id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete account');
      }
      
      toast.success('Account deleted successfully');
      // Log out the user
      logout();
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <SettingsIcon className="mr-2 h-6 w-6" />
          Settings
        </h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 p-4 border-r border-gray-200">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'general'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <SettingsIcon className="mr-3 h-5 w-5" />
                  General
                  <ChevronRight className="ml-auto h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Lock className="mr-3 h-5 w-5" />
                  Security
                  <ChevronRight className="ml-auto h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Bell className="mr-3 h-5 w-5" />
                  Notifications
                  <ChevronRight className="ml-auto h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setActiveTab('privacy')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'privacy'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Privacy
                  <ChevronRight className="ml-auto h-5 w-5" />
                </button>
                
                <button
                  onClick={() => setActiveTab('danger')}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === 'danger'
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <AlertCircle className="mr-3 h-5 w-5" />
                  Danger Zone
                  <ChevronRight className="ml-auto h-5 w-5" />
                </button>
              </nav>
            </div>
            
            {/* Content Area */}
            <div className="flex-1 p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">General Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Theme Settings */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-2">Theme</h3>
                      <div className="flex flex-wrap gap-4">
                        <button
                          onClick={() => handleThemeChange('light')}
                          className={`flex items-center p-3 border rounded-lg ${
                            settings.theme === 'light'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Sun className="h-5 w-5 mr-2" />
                          <span>Light</span>
                        </button>
                        
                        <button
                          onClick={() => handleThemeChange('dark')}
                          className={`flex items-center p-3 border rounded-lg ${
                            settings.theme === 'dark'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Moon className="h-5 w-5 mr-2" />
                          <span>Dark</span>
                        </button>
                        
                        <button
                          onClick={() => handleThemeChange('system')}
                          className={`flex items-center p-3 border rounded-lg ${
                            settings.theme === 'system'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <SettingsIcon className="h-5 w-5 mr-2" />
                          <span>System</span>
                        </button>
                      </div>
                    </div>

                    {/* Language Setting Placeholder */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-2">Language</h3>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value="en"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        This setting is currently in development.
                      </p>
                    </div>
                    
                    {/* Time Zone Setting Placeholder */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-2">Time Zone</h3>
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                        value="UTC"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="CST">CST (Central Standard Time)</option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                      </select>
                      <p className="mt-2 text-sm text-gray-500">
                        This setting is currently in development.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Settings */}
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
                  
                  <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="current-password"
                          name="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          required
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="new-password"
                          name="new-password"
                          type={showNewPassword ? "text" : "password"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        Minimum 8 characters
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirm-password"
                        name="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={savingSettings}
                        className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          savingSettings ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {savingSettings ? (
                          <>
                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="-ml-1 mr-2 h-4 w-4" />
                            Update Password
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                  
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-2">Sessions</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Manage your active sessions and devices.
                    </p>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <LogOut className="-ml-1 mr-2 h-4 w-4 text-gray-500" />
                      Log out from all devices
                    </button>
                  </div>
                </div>
              )}
              
              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive email notifications</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.notifications.emailNotifications}
                          onChange={() => handleNotificationChange('emailNotifications')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Task Reminders</h3>
                        <p className="text-sm text-gray-500">Receive reminders for upcoming tasks</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.notifications.taskReminders}
                          onChange={() => handleNotificationChange('taskReminders')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Task Assignments</h3>
                        <p className="text-sm text-gray-500">Receive notifications for new task assignments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.notifications.taskAssignments}
                          onChange={() => handleNotificationChange('taskAssignments')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">System Updates</h3>
                        <p className="text-sm text-gray-500">Receive notifications about system updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.notifications.systemUpdates}
                          onChange={() => handleNotificationChange('systemUpdates')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Profile Visibility</h3>
                        <p className="text-sm text-gray-500">Allow other users to see your profile information</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.privacy.showProfileToOthers}
                          onChange={() => handlePrivacyChange('showProfileToOthers')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">Activity Status</h3>
                        <p className="text-sm text-gray-500">Show when you're active on the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.privacy.showActivityStatus}
                          onChange={() => handlePrivacyChange('showActivityStatus')}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-2">Data Privacy</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Manage how your data is used and stored within the system.
                    </p>
                    
                    <button
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Download my data
                    </button>
                  </div>
                </div>
              )}
              
              {/* Danger Zone */}
              {activeTab === 'danger' && (
                <div>
                  <h2 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    These actions are irreversible. Please proceed with caution.
                  </p>
                  
                  <div className="border border-red-200 rounded-md p-4 bg-red-50">
                    <h3 className="text-base font-medium text-red-800 mb-2 flex items-center">
                      <Trash2 className="mr-2 h-5 w-5" />
                      Delete Account
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      Once you delete your account, all of your data will be permanently removed.
                      This action cannot be undone.
                    </p>
                    
                    {!confirmDelete ? (
                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete Account
                      </button>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-red-700">
                          To confirm, please type your username: <span className="font-bold">{user?.username}</span>
                        </p>
                        <input
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          placeholder="Type your username to confirm"
                        />
                        <div className="flex space-x-3">
                          <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleDeleteAccount}
                            disabled={loading || deleteConfirmation !== user?.username}
                            className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                              loading || deleteConfirmation !== user?.username
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                Deleting...
                              </>
                            ) : (
                              'Permanently Delete Account'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-base font-medium text-gray-900 mb-2 flex items-center">
                      <LogOut className="mr-2 h-5 w-5" />
                      Log Out
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Log out of your account on this device.
                    </p>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;