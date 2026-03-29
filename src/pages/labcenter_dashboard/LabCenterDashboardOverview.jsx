import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard_shared/StatsCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { TestTubeIcon, ReportIcon, CogIcon, LabIcon, AlertIcon, NotesIcon } from '../../components/icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Mock data for Lab Center
const mockLabData = {
  pendingTests: { total: 25, urgent: 5, routine: 20 },
  processedToday: { total: 120, criticalPercent: 15 },
  equipmentStatus: { status: 'All Nominal', issues: 0, nextMaintenance: '2024-08-15' },
  urgentQueue: [
    { id: 'T001', patientName: 'Sarah Williams', testType: 'STAT Blood Panel', received: '09:15 AM', priority: 'High' },
    { id: 'T002', patientName: 'Michael Brown', testType: 'CSF Analysis', received: '10:30 AM', priority: 'High' },
    { id: 'T003', patientName: 'Emily Jones', testType: 'Rapid Strep Test', received: '11:00 AM', priority: 'Medium' },
  ],
  recentResults: [
    { id: 'R075', patientName: 'David Lee', testType: 'Lipid Panel', completed: '08:45 AM', status: 'Normal' },
    { id: 'R076', patientName: 'Jessica Miller', testType: 'Thyroid Function', completed: '09:00 AM', status: 'Action Required', details: 'TSH Elevated' },
    { id: 'R077', patientName: 'Robert Garcia', testType: 'CBC', completed: '09:20 AM', status: 'Normal' },
  ],
  labName: 'MedRec Central Labs'
};

export default function LabCenterDashboardOverview() {
  const [data] = useState(mockLabData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const statsCardsData = [
    {
      title: "Pending Tests",
      value: data.pendingTests.total,
      details: `${data.pendingTests.urgent} Urgent / ${data.pendingTests.routine} Routine`,
      icon: <TestTubeIcon />,
      colorTheme: 'teal'
    },
    {
      title: "Results Processed Today",
      value: data.processedToday.total,
      details: `${data.processedToday.criticalPercent}% Critical Results`,
      icon: <ReportIcon />,
      colorTheme: 'teal'
    },
    {
      title: "Equipment Status",
      value: data.equipmentStatus.status,
      details: data.equipmentStatus.issues > 0 ? `${data.equipmentStatus.issues} Issues Reported` : `Next maintenance: ${data.equipmentStatus.nextMaintenance}`,
      icon: <CogIcon />,
      colorTheme: 'blue' // Using blue for a slightly different accent for this card
    },
  ];
  
  const quickActionsData = [
    { label: 'Log New Sample', icon: <LabIcon />, onClick: () => {}, variant: 'primary'},
    { label: 'View Pending Requests', icon: <ReportIcon />, onClick: () => {}, variant: 'secondary'},
    { label: 'Enter Test Results', icon: <NotesIcon />, onClick: () => {}, variant: 'secondary'},
    { label: 'Equipment Log', icon: <CogIcon />, onClick: () => {}, variant: 'secondary'},
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Lab Center Dashboard</h1>
        <p className="text-lg text-slate-600 mt-1">
          {isLoading ? <Skeleton width={250} inline={true} /> : `Welcome to ${data.labName}! Manage lab operations efficiently.`}
        </p>
      </header>

      <section aria-labelledby="lab-summary-title">
        <h2 id="lab-summary-title" className="sr-only">Lab Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCardsData.map(card => (
            <StatsCard 
              key={card.title} 
              title={card.title}
              value={isLoading ? <Skeleton width={50} inline /> : card.value}
              details={isLoading ? <Skeleton width={120} /> : card.details}
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

        <section className="lg:col-span-2" aria-labelledby="urgent-test-queue-title">
          <Card>
            <h2 id="urgent-test-queue-title" className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
              <AlertIcon className="text-red-500" /> <span className="ml-2">Urgent Test Queue</span>
            </h2>
            {isLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, idx) => <Skeleton key={idx} height={50} className="rounded-lg" />)}
              </div>
            ) : (
              <div className="space-y-3">
                {data.urgentQueue.length > 0 ? (
                  data.urgentQueue.map(test => (
                    <div key={test.id} className={`p-3 rounded-md shadow-sm border ${test.priority === 'High' ? 'border-red-300 bg-red-50' : 'border-yellow-300 bg-yellow-50'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">{test.testType} - {test.patientName}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${test.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{test.priority}</span>
                      </div>
                      <p className="text-sm text-slate-500">Received: {test.received}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">No urgent tests in the queue.</p>
                )}
              </div>
            )}
          </Card>
        </section>
      </div>
      
      <section aria-labelledby="recent-results-title">
        <Card>
          <h2 id="recent-results-title" className="text-xl font-semibold text-slate-700 mb-4">Recent Results (Last 24 hours)</h2>
          {isLoading ? (
            <div className="space-y-3">
                {Array(3).fill(0).map((_, idx) => <Skeleton key={idx} height={50} className="rounded-lg" />)}
            </div>
          ) : (
            <div className="overflow-x-auto">
              {data.recentResults.length > 0 ? (
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Test Type</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Completed</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {data.recentResults.map(result => (
                      <tr key={result.id} className={`${result.status === 'Action Required' ? 'bg-yellow-50' : ''}`}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-700">{result.patientName}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-600">{result.testType}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500">{result.completed}</td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            result.status === 'Normal' ? 'bg-green-100 text-green-800' :
                            result.status === 'Action Required' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-slate-100 text-slate-800'
                          }`}>
                            {result.status}
                          </span>
                          {result.details && <p className="text-xs text-yellow-700 mt-0.5">{result.details}</p>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                 <p className="text-slate-500 text-center py-8">No recent results to display.</p>
              )}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
} 