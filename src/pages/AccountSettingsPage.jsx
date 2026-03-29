import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { useTheme } from '../context/useTheme'; // Import useTheme

function AccountSettingsPage() {
  const { theme, toggleTheme } = useTheme(); // Use theme from context

  // State for mock settings
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Handlers
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setIsSavingPassword(true);
    // Basic validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New password and confirmation do not match.');
      setIsSavingPassword(false);
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      setIsSavingPassword(false);
      return;
    }
    // Simulate API call
    setTimeout(() => {
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); // Clear fields
      setIsSavingPassword(false);
    }, 1500);
  };

  const handleNotificationToggle = (setting) => {
    setIsSavingNotifications(true);
    const newSettings = { ...notifications, [setting]: !notifications[setting] };
    setNotifications(newSettings);
    // Simulate API call
    setTimeout(() => {
      toast.success('Notification settings saved.');
      setIsSavingNotifications(false);
    }, 800);
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";
  const cardSubheadingClass = "text-lg font-medium text-slate-600 dark:text-slate-400 mb-2 border-b dark:border-slate-700 pb-2";
  const cardParagraphClass = "text-sm text-slate-500 dark:text-slate-400 mb-3";


  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 dark:bg-slate-900 min-h-full text-slate-800 dark:text-slate-200">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">Account Settings</h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-1">Manage your account preferences and security.</p>
      </header>

      {/* Security Section */}
      <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Account Security</h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h3 className={cardSubheadingClass}>Change Password</h3>
          <div>
            <label htmlFor="currentPassword" className={labelClass}>Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="newPassword" className={labelClass}>New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength={8}
              className={inputClass}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={isSavingPassword} disabled={isSavingPassword}>
              {isSavingPassword ? 'Saving...' : 'Update Password'}
            </Button>
          </div>
        </form>
        {/* Placeholder for 2FA setup */}
        <div className="mt-6 border-t dark:border-slate-700 pt-6">
           <h3 className={cardSubheadingClass}>Two-Factor Authentication (2FA)</h3>
           <p className={cardParagraphClass}>Enhance your account security.</p>
           <Button variant="outline" disabled>Setup 2FA (Not Implemented)</Button>
        </div>
      </Card>

      {/* Notification Preferences Section */}
      <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <ToggleSwitch
            id="emailNotifications"
            label="Email Notifications (Appointments, Messages, etc.)"
            checked={notifications.email}
            onChange={() => handleNotificationToggle('email')}
            disabled={isSavingNotifications}
          />
          <ToggleSwitch
            id="smsNotifications"
            label="SMS Notifications (Reminders, Critical Alerts)"
            checked={notifications.sms}
            onChange={() => handleNotificationToggle('sms')}
            disabled={isSavingNotifications}
          />
        </div>
      </Card>

       {/* Appearance Section */}
       <Card className="p-6 dark:bg-slate-800 dark:border-slate-700">
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Appearance</h2>
        <div className="space-y-4">
           <ToggleSwitch
            id="themeToggle"
            label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            checked={theme === 'dark'}
            onChange={toggleTheme} // Use toggleTheme from context
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">Full dark mode support is now active!</p>
        </div>
      </Card>

      {/* TODO: Add Account Deactivation Section */}

    </div>
  );
}

export default AccountSettingsPage; 