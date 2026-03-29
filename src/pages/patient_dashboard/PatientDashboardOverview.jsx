import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard_shared/StatsCard';
import Button from '../../components/ui/Button';
import ActivityItem from '../../components/dashboard_shared/ActivityItem';
import Card from '../../components/ui/Card';
import EmergencyContactDisplay from '../../components/dashboard_shared/EmergencyContactDisplay';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import usePatientData from '../../hooks/usePatientData';
import { useAppointments } from '../../context/AppointmentContext';
import {
  CalendarIcon as AppointmentIcon,
  LabIcon,
  PrescriptionIcon,
  DocumentTextIcon as RecordsIcon,
  ArrowRightIcon,
} from '../../components/icons';
import { Link } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function PatientDashboardOverview() {
  const { patientData, isLoading: patientLoading, error: patientError } = usePatientData();
  const { appointments, isLoading: appointmentsLoadingFromContext, error: appointmentsErrorFromContext } = useAppointments();
  const [healthData, setHealthData] = useState({
    upcomingAppointments: 0,
    pendingTests: 0,
    recentActivity: 'No recent activity',
    healthRiskTrend: { scores: [], dates: [], trend: 'Unknown', color: '#64748b' /* slate-500 */ },
  });

  useEffect(() => {
    if (patientData) {
      setHealthData(prev => ({
        ...prev,
        pendingTests: patientData.pendingTests || 0,
        recentActivity: patientData.recentActivity || 'No recent activity',
        healthRiskTrend: {
          ...prev.healthRiskTrend,
          scores: patientData.healthRiskScores || [],
          dates: patientData.healthRiskDates || [],
        }
      }));
    }
  }, [patientData]);

  useEffect(() => {
    if (appointments && appointments.length > 0) {
      setHealthData(prev => ({
        ...prev,
        upcomingAppointments: appointments.filter(a => new Date(a.date) > new Date() && a.status !== 'Cancelled' && a.status !== 'Completed').length
      }));
    } else if (appointments) {
        setHealthData(prev => ({ ...prev, upcomingAppointments: 0 }));
    }
  }, [appointments]);

  useEffect(() => {
    const scores = healthData.healthRiskTrend.scores;
    if (scores.length > 1) {
      const trendDirection = scores[scores.length - 1] > scores[0] ? 'Worsening' : 'Improving';
      const trendColor = trendDirection === 'Worsening' ? '#ef4444' /* red-500 */ : '#22c55e' /* green-500 */;
      setHealthData(prev => ({ ...prev, healthRiskTrend: { ...prev.healthRiskTrend, trend: trendDirection, color: trendColor } }));
    }
  }, [healthData.healthRiskTrend.scores]);

  const chartDataConfig = {
    labels: healthData.healthRiskTrend.dates,
    datasets: [{
      label: 'Health Risk Score',
      data: healthData.healthRiskTrend.scores,
      borderColor: healthData.healthRiskTrend.color,
      backgroundColor: healthData.healthRiskTrend.color,
      fill: false,
      tension: 0.2,
      pointRadius: 4,
      pointBackgroundColor: healthData.healthRiskTrend.color,
    }],
  };

  const chartOptionsConfig = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'circle' } },
      title: { display: false }, // Title is handled by Card header
    },
    scales: {
      y: { beginAtZero: false, min: 50, max: 100, grid: { drawBorder: false } },
      x: { grid: { display: false } },
    },
  };

  const isLoading = patientLoading || appointmentsLoadingFromContext;
  const error = patientError || appointmentsErrorFromContext;

  if (error) {
    return (
        <div className="p-4 md:p-6 lg:p-8 bg-med-slate-gray min-h-full">
            <Card className="p-6 border border-red-300 bg-red-50">
                <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Dashboard</h2>
                <p className="text-red-600">{error}</p>
            </Card>
        </div>
    );
  }
  
  const statsCardsData = [
    {
      title: "Upcoming Appointments",
      value: isLoading ? <Skeleton width={40} inline={true} /> : healthData.upcomingAppointments,
      details: isLoading ? <Skeleton width={100} /> : 
                (appointments && appointments.filter(a => new Date(a.date) > new Date() && a.status !== 'Cancelled' && a.status !== 'Completed').length > 0 ? 
                `Next: Dr. ${appointments.filter(a => new Date(a.date) > new Date() && a.status !== 'Cancelled' && a.status !== 'Completed').sort((a,b) => new Date(a.date) - new Date(b.date))[0].doctor} - ${new Date(appointments.filter(a => new Date(a.date) > new Date() && a.status !== 'Cancelled' && a.status !== 'Completed').sort((a,b) => new Date(a.date) - new Date(b.date))[0].date).toLocaleDateString()}` 
                : 'None scheduled'),
      icon: <AppointmentIcon />,
      colorTheme: 'teal'
    },
    {
      title: "Recent Lab Results",
      value: isLoading ? <Skeleton width={40} inline={true} /> : (patientData?.pendingTests || 0),
      details: isLoading ? <Skeleton width={100} /> : (healthData.recentActivity.includes('Lab') ? healthData.recentActivity : "No new results"),
      icon: <LabIcon />,
      colorTheme: 'blue'
    },
    {
      title: "Active Prescriptions",
      value: isLoading ? <Skeleton width={40} inline={true} /> : (patientData?.activePrescriptions?.length || 0),
      details: isLoading ? <Skeleton width={100} /> : (patientData?.activePrescriptions?.length > 0 ? `${patientData.activePrescriptions[0].name}` : 'None active'),
      icon: <PrescriptionIcon />,
      colorTheme: 'teal'
    },
  ];

  const quickActionsData = [
    {
      label: "View Medical Records",
      icon: <RecordsIcon className="w-8 h-8 mb-1 text-indigo-600" />,
      to: "/patient/medical-records",
      variant: "outline",
    },
    {
      label: "Manage Appointments",
      icon: <AppointmentIcon className="w-8 h-8 mb-1 text-teal-600" />,
      to: "/patient/appointments",
      variant: "outline",
    },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Dashboard Overview</h1>
        <p className="text-lg text-slate-600 mt-1">
            Welcome back, {isLoading ? <Skeleton width={100} inline={true} /> : (patientData?.name || 'User')}! Here's your health at a glance.
        </p>
      </header>

      {/* Profile Update Notification */}
      {!isLoading && patientData && !patientData.profileSetupComplete && (
        <Card className="mb-6 bg-yellow-50 border border-yellow-300 p-4">
          <div className="flex items-start">
            <InformationCircleIcon className="h-6 w-6 text-yellow-500 mr-3 flex-shrink-0" />
            <div className="flex-grow">
              <h3 className="text-md font-semibold text-yellow-700">Complete Your Profile</h3>
              <p className="text-sm text-yellow-600 mt-1">
                Help us provide you with the best care by completing your profile information. 
                Some important details like Date of Birth or Address might be missing.
              </p>
              <Link 
                to="/app/patient/profile"
                className="mt-2 inline-block text-sm font-medium text-yellow-700 hover:text-yellow-800 underline"
              >
                Update Profile Now &rarr;
              </Link>
            </div>
          </div>
        </Card>
      )}

      <section aria-labelledby="summary-title">
        <h2 id="summary-title" className="sr-only">Health Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCardsData.map(card => (
            <StatsCard 
              key={card.title} 
              title={card.title}
              value={card.value}
              details={card.details}
              icon={card.icon}
              colorTheme={card.colorTheme}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1" aria-labelledby="quick-actions-title">
          <Card>
            <h2 id="quick-actions-title" className="text-xl font-semibold text-slate-700 mb-4">Quick Actions</h2>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4">
                <Skeleton height={128} className="rounded-lg" />
                <Skeleton height={128} className="rounded-lg" />
              </div>
            ) : quickActionsData.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {quickActionsData.map(({ label, icon, to, onClick, variant }) => (
                   <Button
                    key={label}
                    variant={variant || 'secondary'}
                    to={to}
                    onClick={!to ? onClick : undefined}
                    className="flex flex-col items-center justify-center h-32 text-center p-2 space-y-1 text-sm hover:shadow-lg focus:ring-offset-slate-100"
                    disabled={isLoading}
                  >
                    {icon}
                    <span className="font-semibold tracking-wide">{label}</span>
                    {to && <ArrowRightIcon className="w-4 h-4 mt-1 text-slate-400 group-hover:text-teal-500" />}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">No quick actions available.</p>
            )}
          </Card>
        </section>

        <section className="lg:col-span-2" aria-labelledby="recent-activity-title">
          <Card>
            <h2 id="recent-activity-title" className="text-xl font-semibold text-slate-700 mb-4">Recent Activity</h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, idx) => <Skeleton key={idx} height={60} className="rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {patientData?.recentActivities?.length > 0 ? (
                  patientData.recentActivities.map(activity => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">No recent activity to show.</p>
                )}
              </div>
            )}
          </Card>
        </section>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1" aria-labelledby="emergency-contact-title">
           <Card>
            <h2 id="emergency-contact-title" className="text-xl font-semibold text-slate-700 mb-4">Emergency Contacts</h2>
            {isLoading ? (
              <Skeleton height={100} className="rounded-lg" />
            ) : patientData?.emergencyContacts?.length > 0 ? (
              <EmergencyContactDisplay contacts={patientData.emergencyContacts} />
            ) : (
              <p className="text-slate-500 text-center py-4">No emergency contacts listed.</p>
            )}
          </Card>
        </section>

        <section className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-semibold text-slate-700 mb-1">Pending Tests</h2>
            {isLoading ? (
              <Skeleton height={40} width={80} className="mt-2 rounded" />
            ) : (
              <p className="text-4xl font-bold text-slate-800 mt-2">{healthData.pendingTests}</p>
            )}
          </Card>
          <Card className="h-80 md:h-auto">
            <h2 className="text-xl font-semibold text-slate-700 mb-2">Health Risk Trend</h2>
            {isLoading ? (
              <Skeleton height={200} className="mt-2 rounded-lg" />
            ) : healthData.healthRiskTrend.scores.length > 0 ? (
              <div className="h-64">
                <Line data={chartDataConfig} options={chartOptionsConfig} />
              </div>
            ) : (
              <p className="text-slate-500 text-center py-4">Not enough data for trend.</p>
            )}
          </Card>
        </section>
      </div>
    </div>
  );
} 