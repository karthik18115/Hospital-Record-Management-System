import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import SidebarNav from './doctor_dashboard/components/SidebarNav';
import DashboardNavbar from '../components/DashboardNavbar'; // Corrected path
import { useAuth } from '../context/useAuth'; // Import useAuth
import './DoctorDashboardPage.css';

// Placeholder Icons (can be replaced with actual icons later)
const OverviewIcon = () => <span>📊</span>;
const QueueIcon = () => <span>👥</span>;
const AppointmentsIcon = () => <span>🗓️</span>;
const CalendarIcon = () => <span>📅</span>;
const MessagesIcon = () => <span>💬</span>;
const LabsIcon = () => <span>🔬</span>;
const PrescriptionsIcon = () => <span>℞</span>;
const SettingsIcon = () => <span>⚙️</span>;
// Removed MenuIcon and CloseIcon as they are handled by lucide-react in Navbar

function DoctorDashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, token } = useAuth(); // Get user and logout from AuthContext

  // If there is no token, redirect to login. Consider a loading state if user is being fetched.
  // This is a basic check; a more robust solution might involve a protected route component.
  // React.useEffect(() => {
  //   if (!token) {
  //     navigate('/login', { replace: true });
  //   }
  // }, [token, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getTitle = () => {
    const path = location.pathname;
    // Adjusted paths to match typical /app/doctor/... structure
    if (path.endsWith('/doctor/overview')) return 'Dashboard Overview';
    if (path.endsWith('/doctor/queue')) return 'Patient Queue';
    if (path.endsWith('/doctor/appointments')) return 'My Appointments';
    if (path.endsWith('/doctor/calendar')) return 'My Calendar';
    if (path.endsWith('/doctor/messages')) return 'Messages & Consults';
    if (path.endsWith('/doctor/lab-results')) return 'Lab Results';
    if (path.endsWith('/doctor/prescriptions')) return 'Prescriptions Log';
    if (path.endsWith('/doctor/settings')) return 'Settings';
    if (path.includes('/doctor/patient/')) return 'Patient Details'; // For patient profile view by doctor
    return 'Doctor Dashboard';
  };

  const sidebarNavItems = [
    { to: '/app/doctor/overview', label: 'Overview', icon: <OverviewIcon /> },
    { to: '/app/doctor/queue', label: 'Patient Queue', icon: <QueueIcon /> },
    { to: '/app/doctor/appointments', label: 'Appointments', icon: <AppointmentsIcon /> },
    { to: '/app/doctor/calendar', label: 'Calendar', icon: <CalendarIcon /> },
    { to: '/app/doctor/messages', label: 'Messages', icon: <MessagesIcon /> },
    { to: '/app/doctor/lab-results', label: 'Lab Results', icon: <LabsIcon /> },
    { to: '/app/doctor/prescriptions', label: 'Prescriptions Log', icon: <PrescriptionsIcon /> },
    // { to: '/app/doctor/patient/some-patient-id', label: 'Test Patient', icon: <QueueIcon /> }, // Example for testing patient view link
    { to: '/app/doctor/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  // Render null or a loading spinner if user is not yet available or redirecting
  if (!token || !user) {
      // Depending on your AuthProvider logic, user might take a moment to populate after token is found.
      // You might want a more sophisticated loading state here.
      // For now, if no token, useEffect above handles redirect. If token but no user, it might be loading.
      return null; // Or <LoadingSpinner />
  }

  return (
    <div className={`doctor-dashboard-layout flex h-screen bg-slate-100 dark:bg-slate-900 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <SidebarNav items={sidebarNavItems} isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar
          navTitle={getTitle()} // Corrected prop name
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          user={user} // Pass user object
          onLogout={handleLogout} // Pass logout handler
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 dark:bg-slate-900 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboardPage; 