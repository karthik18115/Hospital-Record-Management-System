import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard_shared/StatsCard';
import Card from '../../components/ui/Card';
import { UsersIcon, UserCheck, Activity, BarChart3, PieChart, LineChart, AlertTriangle } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Import dashboard service functions
import {
  getDashboardSummaryStats,
  getDashboardUserRoleStats,
} from '../../services/dashboardService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Initial empty states for dashboard data
const initialKpiStats = {
  activeDoctors: 0,
  activeLabs: 0,
  activePharmacies: 0,
  pendingSignups: 0,
  loginsToday: 0,
  dataUploadsToday: 0,
};

const initialUserRoleDistribution = {
  labels: [],
  values: [],
};

export default function AdminDashboardOverview() {
  const [kpiStats, setKpiStats] = useState(initialKpiStats);
  const [userRoleDistribution, setUserRoleDistribution] = useState(initialUserRoleDistribution);
  const adminName = 'Admin'; // Placeholder, fetch from auth context ideally
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Assume getDashboardSummaryStats now returns all KPIs including new ones
        // And getDashboardUserRoleStats returns data for the user distribution chart
        const [summary, roleStats] = await Promise.all([
          getDashboardSummaryStats(), // This API needs to be updated in backend for new KPIs
          getDashboardUserRoleStats(),
        ]);

        if (summary) {
          // Map API response to kpiStats state
          // Backend should provide: activeDoctors, activeLabs, activePharmacies, pendingSignups, loginsToday, dataUploadsToday
          setKpiStats({
            activeDoctors: summary.activeDoctors || 0,
            activeLabs: summary.activeLabs || 0,
            activePharmacies: summary.activePharmacies || 0,
            pendingSignups: summary.pendingSignups || 0,
            loginsToday: summary.loginsToday || 0,
            dataUploadsToday: summary.dataUploadsToday || 0,
          });
        }
        if (roleStats) setUserRoleDistribution(roleStats);
        
        // TODO: Fetch actual admin name from user context or a profile API endpoint

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || 'Could not load dashboard data. Please try again later.');
      }
      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  // KPI Cards Data - structure driven by new requirements
  const kpiCardsData = [
    {
      title: "Active Doctors",
      value: kpiStats.activeDoctors,
      icon: <UsersIcon className="text-sky-500" />,
      bgColor: 'bg-sky-50 dark:bg-sky-800/30',
      textColor: 'text-sky-600 dark:text-sky-300',
      borderColor: 'border-sky-500/50'
    },
    {
      title: "Active Lab Centers",
      value: kpiStats.activeLabs,
      icon: <UsersIcon className="text-emerald-500" />,
      bgColor: 'bg-emerald-50 dark:bg-emerald-800/30',
      textColor: 'text-emerald-600 dark:text-emerald-300',
      borderColor: 'border-emerald-500/50'
    },
    {
      title: "Active Pharmacies",
      value: kpiStats.activePharmacies,
      icon: <UsersIcon className="text-amber-500" />,
      bgColor: 'bg-amber-50 dark:bg-amber-800/30',
      textColor: 'text-amber-600 dark:text-amber-300',
      borderColor: 'border-amber-500/50'
    },
    {
      title: "Pending Signups",
      value: kpiStats.pendingSignups,
      icon: <UserCheck className="text-red-500" />,
      bgColor: 'bg-red-50 dark:bg-red-800/30',
      textColor: 'text-red-600 dark:text-red-300',
      borderColor: 'border-red-500/50'
    },
    {
      title: "Logins Today",
      value: kpiStats.loginsToday,
      icon: <Activity className="text-indigo-500" />,
      bgColor: 'bg-indigo-50 dark:bg-indigo-800/30',
      textColor: 'text-indigo-600 dark:text-indigo-300',
      borderColor: 'border-indigo-500/50'
    },
    {
      title: "Data Uploads Today",
      value: kpiStats.dataUploadsToday,
      icon: <Activity className="text-purple-500" />,
      bgColor: 'bg-purple-50 dark:bg-purple-800/30',
      textColor: 'text-purple-600 dark:text-purple-300',
      borderColor: 'border-purple-500/50'
    },
  ];

  const userDistributionChartData = {
    labels: userRoleDistribution.labels, // e.g., ['Doctors', 'Labs', 'Pharmacies', 'Patients']
    datasets: [
      {
        label: 'User Roles',
        data: userRoleDistribution.values,
        backgroundColor: [
          'rgba(59, 130, 246, 0.7)', // blue-500
          'rgba(16, 185, 129, 0.7)', // emerald-500
          'rgba(245, 158, 11, 0.7)', // amber-500
          'rgba(107, 114, 128, 0.7)',// gray-500
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(107, 114, 128, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top',
        labels: { color: '#94a3b8' /* slate-400 */}
      },
      title: { 
        display: true, 
        text: 'User Role Distribution', 
        color: '#cbd5e1', /* slate-300 */
        font: { size: 18 }
      },
    },
    scales: {
      y: { 
        beginAtZero: true,
        grid: { color: 'rgba(203, 213, 225, 0.1)' /* slate-300 with opacity */ },
        ticks: { color: '#94a3b8' /* slate-400 */ }
      },
      x: { 
        grid: { display: false },
        ticks: { color: '#94a3b8' /* slate-400 */ }
      },
    },
  };

  // Main return for the component - This is within the AdminLayout context
  return (
    <div className="space-y-6 md:space-y-8">
      <header className="mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">Dashboard Overview</h1>
        <p className="text-md text-slate-600 dark:text-slate-400 mt-1">
          Welcome, {adminName}! Here is a summary of platform activity.
        </p>
      </header>

      {error && (
        <Card className="bg-red-50 dark:bg-red-800/30 border border-red-500/50 text-red-700 dark:text-red-300 p-4 rounded-xl shadow-md">
          <div className="flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
            <div>
              <h3 className="font-semibold">Error Loading Dashboard</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* KPI Cards Section */}
      <section aria-labelledby="kpi-summary-title">
        <h2 id="kpi-summary-title" className="sr-only">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {kpiCardsData.map(card => (
            <Card 
              key={card.title} 
              className={`rounded-xl shadow-lg p-5 border-l-4 ${card.borderColor} ${card.bgColor}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-md font-semibold ${card.textColor}`}>{card.title}</h3>
                {card.icon}, {/* Ensure icon is rendered correctly */}
              </div>
              {isLoading ? (
                <Skeleton width={80} height={30} baseColor="#475569" highlightColor="#64748b" />
              ) : (
                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* User Distribution Chart */}
        <div className="lg:col-span-3">
          <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-6 h-96 md:h-[450px]">
            {isLoading ? (
              <Skeleton height={380} className="rounded-lg" baseColor="#334155" highlightColor="#475569" />
            ) : (
              <div className="h-full">
                <Bar data={userDistributionChartData} options={chartOptions} />
              </div>
            )}
          </Card>
        </div>

        {/* Placeholder for another chart (e.g., Line Chart for System Usage) */}
        <div className="lg:col-span-2">
          <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-4 md:p-6 h-96 md:h-[450px]">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center">
              <LineChart className="w-5 h-5 mr-2 text-slate-500" /> System Usage Over Time
            </h3>
            {isLoading ? (
              <Skeleton height={320} className="rounded-lg" baseColor="#334155" highlightColor="#475569" />
            ) : (
              <div className="flex items-center justify-center h-full text-slate-500">
                <p>(Line chart placeholder - e.g., Logins per day)</p>
                {/* Example: <Line data={systemUsageLineData} options={lineChartOptions} /> */}
              </div>
            )}
          </Card>
        </div>
      </section>
      
      {/* Placeholder for another row of charts or data tables */}
      {/* <section>
        <Card className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">More Analytics (e.g., Pie Chart)</h3>
           <Pie data={...} /> 
        </Card>
      </section> */}

    </div>
  );
} 