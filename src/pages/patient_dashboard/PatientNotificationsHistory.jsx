import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { BellIcon, CheckIcon, TrashIcon } from '../../components/icons'; // Use SVG Icons
// import './PatientNotificationsHistory.css'; // Removed CSS import

// TODO: Replace with a proper icon library
// const BellIcon = () => <span role="img" aria-label="Notification">🔔</span>;
// const CheckIcon = () => <span role="img" aria-label="Mark as Read">✔️</span>;
// const DeleteIcon = () => <span role="img" aria-label="Delete">🗑️</span>;

export default function PatientNotificationsHistory() {
  const [isLoading] = useState(false);
  // Mock data - enhance with more details and types
  const [allNotifications, setAllNotifications] = useState([
    { id: 1, type: 'LAB_RESULT_READY', message: 'Your lab result for Blood Test is ready.', timestamp: '2024-08-10 10:00 AM', isRead: false, link: '/patient/medical-records' },
    { id: 2, type: 'APPOINTMENT_CONFIRMED', message: 'Appointment with Dr. Smith confirmed for Aug 15.', timestamp: '2024-08-09 03:30 PM', isRead: true, link: '/patient/appointments' },
    { id: 3, type: 'NEW_MESSAGE', message: 'New message from Dr. Lee regarding your recent query.', timestamp: '2024-08-07 11:15 AM', isRead: true, link: '/patient/messages' },
    { id: 4, type: 'PRESCRIPTION_REMINDER', message: 'Reminder: Refill your Lisinopril prescription soon.', timestamp: '2024-08-05 09:00 AM', isRead: true, link: '/patient/prescriptions' },
    { id: 5, type: 'SYSTEM_ANNOUNCEMENT', message: 'Our patient portal will be undergoing maintenance on Aug 20.', timestamp: '2024-08-01 05:00 PM', isRead: true, link: '#' },
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))); // Sort newest first

  // Placeholder functions for actions - would involve API calls & state updates
  const handleMarkAsRead = (notificationId) => {
    setAllNotifications(prevNotifications =>
      prevNotifications.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
    );
    alert(`Marking notification ${notificationId} as read.`);
  };

  const handleDeleteNotification = (notificationId) => {
    setAllNotifications(prevNotifications =>
      prevNotifications.filter(n => n.id !== notificationId)
    );
    alert(`Deleting notification ${notificationId}.`);
  };

  const handleClearAll = () => {
    setAllNotifications([]);
    alert('Clearing all notifications.');
  };

  const handleMarkAllRead = () => {
     setAllNotifications(prevNotifications =>
      prevNotifications.map(n => ({ ...n, isRead: true }))
    );
    alert('Marking all notifications as read.');
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Notifications</h1>
          <p className="text-lg text-slate-600 mt-1">Review your past and current notifications.</p>
        </div>
         <div className="flex space-x-2 mt-4 sm:mt-0 flex-shrink-0">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMarkAllRead} 
              disabled={isLoading || allNotifications.every(n => n.isRead)}
            >
                Mark All Read
            </Button>
            <Button 
              variant="danger-outline" 
              size="sm" 
              onClick={handleClearAll} 
              disabled={isLoading || allNotifications.length === 0}
            >
                Clear All
            </Button>
        </div>
      </header>
      
      <div className="space-y-3">
        {isLoading ? (
          Array(4).fill(0).map((_, index) => (
            <Card key={index} className="p-4 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-3/4">
                  <Skeleton height={20} width="80%" className="mb-2" />
                  <Skeleton height={16} width="40%" />
                </div>
                <div className="flex space-x-2">
                  <Skeleton height={32} width={90} />
                  <Skeleton height={32} width={80} />
                </div>
              </div>
            </Card>
          ))
        ) : allNotifications.length === 0 ? (
          <Card className="p-6 text-center border border-slate-200 bg-white">
            <BellIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 text-lg">You have no notifications.</p>
          </Card>
        ) : (
          allNotifications.map(notification => (
            <Card 
              key={notification.id} 
              className={`p-4 transition-colors duration-200 border-l-4 ${notification.isRead ? 'bg-white border-slate-300' : 'bg-teal-50 border-teal-500 shadow-sm'}`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${notification.isRead ? 'text-slate-600' : 'font-medium text-slate-800'}`}>{notification.message}</p>
                  <span className="text-xs text-slate-400 mt-1 block">{notification.timestamp}</span>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 self-start sm:self-center">
                  {!notification.isRead && (
                    <Button 
                      variant="outline"
                      size="xs" 
                      className="flex items-center space-x-1 !p-1.5 text-xs"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as Read"
                    >
                      <CheckIcon className="w-4 h-4"/>
                    </Button>
                  )}
                  <Button 
                    variant="danger-outline" 
                    size="xs" 
                    className="flex items-center space-x-1 !p-1.5 text-xs"
                    onClick={() => handleDeleteNotification(notification.id)}
                    title="Delete Notification"
                  >
                    <TrashIcon className="w-4 h-4"/>
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
} 