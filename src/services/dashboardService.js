// Base URL for the API. Adjust if your backend is on a different port or domain.
const API_BASE_URL = '/api'; // Example: 'http://localhost:8080/api' if not proxied
const USE_MOCK_DATA = false; // Set to false when backend is ready

// Helper function to get authorization headers (can be shared or imported if in a common utils file)
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken'); // Example: retrieve token
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle API responses (can be shared or imported)
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred while fetching dashboard data.' }));
    const error = new Error(errorData.message || `HTTP error! status: ${response.status}`);
    error.data = errorData;
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) {
    return null; 
  }
  return response.json();
};

// MOCK DATA Section
const mockSummaryStats = {
  activeDoctors: 78,
  activeLabs: 12,
  activePharmacies: 23,
  pendingSignups: 5,
  loginsToday: 156,
  dataUploadsToday: 340,
};

const mockUserRoleStats = {
  labels: ['Doctors', 'Labs', 'Pharmacies', 'Patients', 'Pending'],
  values: [78, 12, 23, 350, 5],
};

const mockRecentLogs = [
  { id: 'L001', timestamp: '10:32 AM', level: 'INFO', message: 'User \'doctor_jane\' logged in.' },
  { id: 'L002', timestamp: '10:35 AM', level: 'WARN', message: 'Database connection pool nearing capacity (85%).' },
  { id: 'L003', timestamp: '10:38 AM', level: 'INFO', message: 'Scheduled backup task \'DailyBackup\' completed successfully.' },
  { id: 'L004', timestamp: '10:40 AM', level: 'ERROR', message: 'Failed to process payment for invoice INV-0123. Reason: Card declined.' },
  { id: 'L005', timestamp: '10:42 AM', level: 'INFO', message: 'New user \'lab_center_xyz\' registered, pending approval.' },
];
// END MOCK DATA Section

/**
 * Fetches summary statistics for the admin dashboard.
 * GET /api/admin/dashboard/summary-stats
 */
export const getDashboardSummaryStats = async () => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(mockSummaryStats), 500));
  }
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/summary-stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Fetches user role statistics for the admin dashboard chart.
 * GET /api/admin/dashboard/user-role-stats
 */
export const getDashboardUserRoleStats = async () => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(mockUserRoleStats), 500));
  }
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/user-role-stats`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

/**
 * Fetches recent system logs for the admin dashboard.
 * GET /api/admin/dashboard/recent-logs?limit={limit}
 * @param {number} limit - The maximum number of logs to fetch.
 */
export const getDashboardRecentLogs = async (limit = 5) => {
  if (USE_MOCK_DATA) {
    return new Promise(resolve => setTimeout(() => resolve(mockRecentLogs.slice(0, limit)), 500));
  }
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/recent-logs?limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
};

// Note: Admin's name would typically be fetched as part of user authentication/profile data,
// possibly from a different service (e.g., authService.js or userService.js like getCurrentUserProfile()).
// If a dedicated endpoint under /admin/dashboard for admin info is preferred, it can be added here. 