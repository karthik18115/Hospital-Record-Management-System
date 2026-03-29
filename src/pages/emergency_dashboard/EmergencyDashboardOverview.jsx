import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard_shared/StatsCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { EmergencyIcon, PatientsIcon, AlertIcon, UserIcon } from '../../components/icons'; // Assuming UserIcon for Staff
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { onBayStatus, onIncomingPatients, onCriticalAlerts, onStaffShifts, disconnect } from '../../services/emergencyDashboardService';

// Mock data (replace with API calls later)
const mockEmergencyData = {
  incomingPatients: 5,
  nextCriticalPatient: { name: 'John Doe', eta: '5 mins' },
  availableBays: { total: 10, urgent: 3, nonUrgent: 7 },
  staffOnDuty: { doctors: 4, nurses: 8, specialists: 2 },
  criticalAlerts: [
    { id: 1, type: 'Cardiac Arrest', patient: 'Jane Smith', location: 'Ambulance 3', time: '2 mins ago', severity: 'High' },
    { id: 2, type: 'Multiple Trauma', patient: 'Unknown', location: 'Incoming ETA 10m', time: '5 mins ago', severity: 'High' },
  ],
  erStatus: 'Extremely Busy',
};

export default function EmergencyDashboardOverview() {
  const [data, setData] = useState(mockEmergencyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    onBayStatus(update => setData(prev => ({ ...prev, equipmentStatus: update })));
    onIncomingPatients(update => setData(prev => ({ ...prev, pendingTests: update.pendingTests, processedToday: update.processedToday })));
    onCriticalAlerts(update => setData(prev => ({ ...prev, urgentQueue: update })));
    onStaffShifts(update => setData(prev => ({ ...prev, staffOnDuty: update })));
    setIsLoading(false);
    return () => disconnect();
  }, []);

  const statsCardsData = [
    {
      title: "Incoming Patients",
      value: data.incomingPatients,
      details: data.nextCriticalPatient ? `Next critical: ${data.nextCriticalPatient.name} (ETA ${data.nextCriticalPatient.eta})` : 'None critical',
      icon: <PatientsIcon />,
      colorTheme: 'red'
    },
    {
      title: "Available ER Bays",
      value: data.availableBays.total,
      details: `${data.availableBays.urgent} Urgent / ${data.availableBays.nonUrgent} Non-Urgent`,
      icon: <EmergencyIcon />, // Or a specific Bay icon if created
      colorTheme: 'orange' // Need to add 'orange' theme to StatsCard or use existing
    },
    {
      title: "Staff on Duty",
      value: data.staffOnDuty.doctors + data.staffOnDuty.nurses + data.staffOnDuty.specialists,
      details: `${data.staffOnDuty.doctors} Drs, ${data.staffOnDuty.nurses} Nurses, ${data.staffOnDuty.specialists} Specialists`,
      icon: <UserIcon />, // Using UserIcon, could be more specific like a group icon
      colorTheme: 'blue'
    },
  ];
  
  const quickActionsData = [
    { label: 'Register New Patient', icon: <PatientsIcon />, onClick: () => {}, variant: 'primary'},
    { label: 'View Triage Queue', icon: <AlertIcon />, onClick: () => {}, variant: 'secondary'},
    { label: 'Request Medical Team', icon: <EmergencyIcon />, onClick: () => {}, variant: 'secondary'},
    { label: 'Update ER Status', icon: <UserIcon />, onClick: () => {}, variant: 'secondary'}, // TODO: Better icon
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Emergency Dashboard</h1>
        <p className="text-lg text-slate-600 mt-1">
          {isLoading ? <Skeleton width={250} inline={true} /> : `Current ER Status: ${data.erStatus}. Live updates enabled.`}
        </p>
      </header>

      <section aria-labelledby="emergency-summary-title">
        <h2 id="emergency-summary-title" className="sr-only">Emergency Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCardsData.map(card => (
            <StatsCard 
              key={card.title} 
              title={card.title}
              value={isLoading ? <Skeleton width={40} inline /> : card.value}
              details={isLoading ? <Skeleton width={100} /> : card.details}
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
              Array(quickActionsData.length).fill(0).map((_, idx) => <Skeleton key={idx} height={40} className="mb-2 rounded-lg" />)
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {quickActionsData.map(({ label, icon, onClick, variant }) => (
                  <Button
                    key={label}
                    variant={variant || 'secondary'}
                    onClick={onClick}
                    className="flex flex-col items-center justify-center h-28 text-center p-2 space-y-1 text-sm"
                  >
                    {icon}
                    <span className="font-semibold tracking-wide">{label}</span>
                  </Button>
                ))}
              </div>
            )}
          </Card>
        </section>

        <section className="lg:col-span-2" aria-labelledby="critical-alerts-title">
          <Card>
            <h2 id="critical-alerts-title" className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
              <AlertIcon /> <span className="ml-2">Critical Alerts</span>
            </h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array(2).fill(0).map((_, idx) => <Skeleton key={idx} height={60} className="rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {data.criticalAlerts.length > 0 ? (
                  data.criticalAlerts.map(alert => (
                    <div key={alert.id} className={`p-3 rounded-lg shadow-md border-l-4 ${alert.severity === 'High' ? 'border-red-500 bg-red-50' : 'border-yellow-500 bg-yellow-50'}`}>
                      <div className="flex justify-between items-start">
                        <h3 className={`font-semibold ${alert.severity === 'High' ? 'text-red-700' : 'text-yellow-700'}`}>{alert.type} - {alert.patient}</h3>
                        <span className="text-xs text-slate-500">{alert.time}</span>
                      </div>
                      <p className="text-sm text-slate-600">Location: {alert.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">No critical alerts at this time.</p>
                )}
              </div>
            )}
          </Card>
        </section>
      </div>

      {/* Placeholder for more sections like Resource Availability, Team Communication, etc. */}
      {/* 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section aria-labelledby="resource-availability-title">
          <Card>
            <h2 id="resource-availability-title" className="text-xl font-semibold text-slate-700 mb-4">Resource Availability</h2>
            <p className="text-slate-500">Details on ER bays, equipment, etc.</p>
          </Card>
        </section>
        <section aria-labelledby="team-communication-title">
          <Card>
            <h2 id="team-communication-title" className="text-xl font-semibold text-slate-700 mb-4">Team Communication</h2>
            <p className="text-slate-500">Quick messages or status updates for the ER team.</p>
          </Card>
        </section>
      </div>
      */}
    </div>
  );
} 