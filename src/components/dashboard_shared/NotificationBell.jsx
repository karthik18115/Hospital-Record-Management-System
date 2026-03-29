import React, { useState } from 'react';
import NotificationsPanel from './NotificationsPanel'; // We'll create this next
import './NotificationBell.css';

// Placeholder for a Bell icon (e.g., from react-icons)
const BellIcon = () => <span>🔔</span>;

function NotificationBell() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Placeholder notifications
  const notifications = [
    { id: 1, message: 'Your lab result for Blood Test is ready.', timestamp: '2 hours ago', isRead: false, link: '/dashboard/patient/records' },
    { id: 2, message: 'Appointment with Dr. Smith confirmed.', timestamp: '1 day ago', isRead: false, link: '/dashboard/patient/appointments' },
    { id: 3, message: 'New message from Dr. Lee.', timestamp: '3 days ago', isRead: true, link: '#' },
  ];

  const togglePanel = () => setIsPanelOpen(!isPanelOpen);

  const actualUnreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="notification-bell-wrapper">
      <button onClick={togglePanel} className="notification-bell-button" aria-label={`Notifications (${actualUnreadCount} unread)`}>
        <BellIcon />
        {actualUnreadCount > 0 && <span className="notification-badge">{actualUnreadCount}</span>}
      </button>
      {isPanelOpen && (
        <NotificationsPanel 
          notifications={notifications} 
          onClose={() => setIsPanelOpen(false)} 
          onMarkAsRead={(id) => console.log('Mark as read:', id) /* Placeholder */} 
          onMarkAllAsRead={() => console.log('Mark all as read') /* Placeholder */} 
        />
      )}
    </div>
  );
}

export default NotificationBell; 