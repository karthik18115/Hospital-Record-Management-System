import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom'; // Import Outlet
import { AppointmentContext } from '../context/AppointmentContext';
import CustomButton from '../components/ui/Button';
import CustomUICard from '../components/ui/Card';
// Import centralized icons
import {
  UserIcon, BellIcon, CogIcon, CalendarIcon, HealthIcon,
  PrescriptionIcon, LabIcon, PatientsIcon, ChartIcon,
  NotesIcon, EmergencyIcon, AlertIcon, TestTubeIcon, ReportIcon,
  MicroscopeIcon, MedicineIcon, RefillIcon, InventoryIcon,
  SecurityIcon, UsersIcon,
  ClipboardDocumentListIcon, ChatBubbleLeftEllipsisIcon, DocumentTextIcon
  // Add other icons used by getSidebarLinks as needed
} from '../components/icons'; // Adjusted path
import { toast } from 'react-toastify'; // For handleBookAppointment


// Keep getSidebarLinks for now, will adjust paths later
const getSidebarLinks = (role) => {
  // Process the role to remove "ROLE_" prefix and ensure it's lowercase for matching
  const processedRole = role?.toUpperCase().startsWith('ROLE_') 
    ? role.substring(5).toLowerCase()
    : role?.toLowerCase();

  const lowerRole = processedRole; // Use the processedRole for switch and prefix
  const emergencyRoles = ['emergency', 'emergencydoctor', 'emergency_doctor'];
  const prefix = emergencyRoles.includes(lowerRole) ? '/app/emergency' : `/app/${lowerRole}`; // prefix will now be like /app/patient

  switch (lowerRole) { // lowerRole will now be like 'patient'
    case 'patient':
      return [
        { label: 'Overview', path: `${prefix}/dashboard`, icon: <UserIcon /> },
        { label: 'Appointments', path: `${prefix}/appointments`, icon: <CalendarIcon /> },
        { label: 'Health Summary', path: `${prefix}/medical-records`, icon: <HealthIcon /> },
        { label: 'Lab Reports', path: `${prefix}/documents`, icon: <LabIcon /> },
        { label: 'Prescriptions', path: `${prefix}/prescriptions`, icon: <PrescriptionIcon /> },
        { label: 'Profile', path: `${prefix}/profile`, icon: <CogIcon /> },
        { label: 'Messages', path: `${prefix}/messages`, icon: <NotesIcon /> },
      ];
    case 'doctor':
      return [
        { label: 'Overview', path: `${prefix}/dashboard`, icon: <ChartIcon /> },
        { label: 'Appointments', path: `${prefix}/appointments`, icon: <CalendarIcon /> },
        { label: 'Patient Lookup', path: `${prefix}/queue`, icon: <PatientsIcon /> },
        { label: 'Messages', path: `${prefix}/messages`, icon: <NotesIcon /> },
        { label: 'Settings', path: `${prefix}/settings`, icon: <CogIcon /> },
      ];
    case 'emergency':
    case 'emergencydoctor':
    case 'emergency_doctor':
      return [
        { label: 'ER Dashboard', path: `${prefix}/dashboard`, icon: <EmergencyIcon /> },
        { label: 'Triage Queue', path: `${prefix}/triage-queue`, icon: <AlertIcon /> },
        { label: 'Emergency History', path: `${prefix}/history`, icon: <ReportIcon /> },
        { label: 'Patient Quick Access', path: `${prefix}/patient-access`, icon: <PatientsIcon /> },
        { label: 'Emergency Orders', path: `${prefix}/orders`, icon: <PrescriptionIcon /> },
        { label: 'Doctor Collaboration', path: `${prefix}/collaboration`, icon: <ChatBubbleLeftEllipsisIcon /> },
        { label: 'Progress', path: `${prefix}/progress`, icon: <ChartIcon /> },
        { label: 'Settings', path: `${prefix}/settings`, icon: <CogIcon /> },
      ];
    case 'labcenter':
      return [
        { label: 'Lab Overview', path: `${prefix}/dashboard`, icon: <TestTubeIcon /> },
        { label: 'Pending Requests', path: `${prefix}/requests`, icon: <ReportIcon /> },
        { label: 'Results Entry', path: `${prefix}/results`, icon: <MicroscopeIcon /> },
      ];
    case 'pharmacy':
    case 'pharmacyadmin':
      return [
        { label: 'Dashboard Overview', path: `${prefix}/dashboard`, icon: <MedicineIcon /> },
        { label: 'E-Prescriptions Inbox', path: `${prefix}/inbox`, icon: <RefillIcon /> },
        { label: 'Dispensing Logs', path: `${prefix}/logs`, icon: <ClipboardDocumentListIcon /> },
        { label: 'Medicine Inventory', path: `${prefix}/inventory`, icon: <InventoryIcon /> },
        { label: 'Patient Interactions', path: `${prefix}/patient-interactions`, icon: <UserIcon /> },
        { label: 'Doctor Communication', path: `${prefix}/communication`, icon: <ChatBubbleLeftEllipsisIcon /> },
        { label: 'Regulatory Reports', path: `${prefix}/reports`, icon: <DocumentTextIcon /> },
        { label: 'Settings', path: `${prefix}/settings`, icon: <CogIcon /> },
      ];
    default:
      return []; 
  }
};

function HomePage() {
  const [userRole, setUserRole] = useState(null);
  const [userName] = useState('User');
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Lifted appointments state
  const [appointments, setAppointments] = useState([
    // Initial mock appointments - can be the same as PatientAppointments.jsx had
    { id: 1, date: '2024-09-15', time: '10:00 AM', doctor: 'Dr. Emily Carter', department: 'Cardiology', status: 'Confirmed', type: 'In-Person' },
    { id: 5, date: '2024-10-05', time: '03:00 PM', doctor: 'Dr. Emily Carter', department: 'Cardiology', status: 'Confirmed', type: 'Video Call' },
    // Add more initial appointments if needed, or fetch them
  ]);

  // Lifted handleBookAppointment function
  const handleBookAppointment = (appointmentDetails) => {
    const newAppointment = {
      ...appointmentDetails,
      id: Date.now(),
      status: 'Confirmed',
      type: Math.random() < 0.5 ? 'In-Person' : 'Video Call'
    };
    setAppointments(prevAppointments => [newAppointment, ...prevAppointments].sort((a,b) => new Date(a.date) - new Date(b.date))); // Keep sorted
    toast.success('Appointment booked successfully!');
    // setIsModalOpen(false); // Modal open state will be managed by PatientAppointments page
  };

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const token = localStorage.getItem('authToken');
    console.log('[HomePage] useEffect: role from localStorage:', role);
    if (!token || !role) {
      setUserRole('Unknown');
    } else {
      setUserRole(role);
    }

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const sidebarLinks = getSidebarLinks(userRole);

  // No longer need renderRoleSpecificContent

  // Return for Unauthenticated/Unknown state (should not be hit if PrivateRoute works, but good fallback)
  if (userRole === 'Unknown') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4">
        <h1 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Access Denied or Session Expired</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Please log in to access the application.</p>
        <CustomButton onClick={() => navigate('/login')} variant="solid" size="lg">
          Go to Login
        </CustomButton>
      </div>
    );
  }
  
  // The main return for Authenticated Users (when userRole is determined)
  return (
    <AppointmentContext.Provider value={{ appointments, handleBookAppointment, setAppointments }}> {/* Provide setAppointments too for cancellation/reschedule later */}
      <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white dark:bg-slate-800 shadow-lg p-6 space-y-6 hidden md:flex md:flex-col">
          <div className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-6"> {/* Added mb-6 for spacing */} 
            <Link to={`/app/${userRole?.toLowerCase()}/dashboard`}>MedRec</Link> {/* Link logo to role dashboard */} 
          </div>
          <nav className="flex-grow">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <CustomButton 
                    to={link.path} 
                    variant="ghost" 
                    className="w-full flex items-center justify-start space-x-3 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400"
                    activeClassName="bg-teal-100 dark:bg-teal-700 text-teal-700 dark:text-teal-200 font-semibold"
                  >
                    {link.icon && React.cloneElement(link.icon, { className: 'w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400' })}
                    <span>{link.label}</span>
                  </CustomButton>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto">
            <CustomButton 
              to={`/app/${userRole?.toLowerCase()}/settings`} // Correct settings path
              variant="ghost" 
              className="w-full flex items-center justify-start space-x-3 text-slate-600 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-slate-700 hover:text-teal-600 dark:hover:text-teal-400"
            >
              <CogIcon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400" />
              <span>Settings</span>
            </CustomButton>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-slate-800 shadow-md p-4 flex justify-between items-center sticky top-0 z-40 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Welcome, {userName} <span className="text-sm text-slate-500 dark:text-slate-400">({userRole})</span></h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 focus:outline-none">
                <BellIcon className="w-6 h-6" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-800"></span>
              </button>
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 dark:focus:ring-offset-slate-800"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-teal-500 text-white flex items-center justify-center">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </button>
                {profileDropdownOpen && (
                  <div 
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-700 ring-1 ring-black dark:ring-slate-600 ring-opacity-5 dark:ring-opacity-25 focus:outline-none z-50"
                    role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1"
                  >
                    <Link 
                      to={`/app/${userRole?.toLowerCase()}/profile`} // Correct profile path
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-50"
                      role="menuitem" tabIndex="-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      View Profile
                    </Link>
                    <Link 
                      to={`/app/${userRole?.toLowerCase()}/account-settings`} // Link to account settings
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-50"
                      role="menuitem" tabIndex="-1"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setProfileDropdownOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 hover:text-slate-900 dark:hover:text-slate-50"
                      role="menuitem" tabIndex="-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              {/* Mobile menu button placeholder */}
               <button className="md:hidden text-slate-500 hover:text-teal-600">
                 <span>☰</span> 
               </button>
            </div>
          </header>

          {/* Main content area uses Outlet */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-6">
            <Outlet /> {/* Outlet will have access to AppointmentContext */}
          </main>
        </div>
      </div>
    </AppointmentContext.Provider>
  );
}

export default HomePage; 