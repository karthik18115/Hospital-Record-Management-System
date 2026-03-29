import React, { useState, useEffect } from 'react';
import CustomUICard from '../../components/ui/Card';
import CustomButton from '../../components/ui/Button';
import { CalendarIcon, PatientsIcon, NotesIcon, XCircleIcon } from '../../components/icons';
import { getDoctorDashboard, getDoctorPatientsList, addPatientByDoctor, postDoctorAppointment } from '../../services/doctorService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Import the new components
import StatsSummary from './components/StatsSummary';
import QuickActions from './components/QuickActions';
import AddPatientModal from '../../components/doctor/AddPatientModal';
import ScheduleAppointmentModal from './components/ScheduleAppointmentModal';

function DoctorDashboardOverview() {
  const [dashboardData, setDashboardData] = useState(null);
  const [patients, setPatients] = useState([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [dashboardError, setDashboardError] = useState(null);
  const [patientsError, setPatientsError] = useState(null);
  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  useEffect(() => {
    setIsLoadingDashboard(true);
    getDoctorDashboard()
      .then(res => setDashboardData(res))
      .catch(err => {
        setDashboardError(err.message || 'Failed to load dashboard data.');
        toast.error(err.message || 'Failed to load dashboard data.');
      })
      .finally(() => setIsLoadingDashboard(false));
  }, []);

  useEffect(() => {
    setIsLoadingPatients(true);
    getDoctorPatientsList()
      .then(data => setPatients(data))
      .catch(err => {
        setPatientsError(err.message || 'Failed to load patient list.');
        toast.error(err.message || 'Failed to load patient list.');
      })
      .finally(() => setIsLoadingPatients(false));
  }, []);

  // Prepare stats for StatsSummary
  const summaryStats = [
    {
      title: "Today's Appointments",
      value: dashboardData?.todayAppointments || 0,
      details: <>{dashboardData?.todayCompleted || 0} Completed <span className="mx-1">•</span> {dashboardData?.todayPending || 0} Pending</>,
      colorTheme: "blue",
      icon: <CalendarIcon className="w-6 h-6" />
    },
    {
      title: "Total Patients (This Week)",
      value: `${dashboardData?.weekTotalPatients || 0} Patients`,
      details: <>{dashboardData?.weekNoShow || 0} No-shows</>,
      colorTheme: "teal",
      icon: <PatientsIcon className="w-6 h-6" />
    }
  ];

  const appointments = dashboardData?.upcomingAppointments || [];
  const recentPatientsFromDashboard = dashboardData?.recentPatients || [];

  const handleAddPatient = () => {
    setIsAddPatientModalOpen(true);
  };
  const handleSchedule = () => {
    setIsScheduleModalOpen(true);
  };

  const handleSaveNewPatient = async (newPatientData) => {
    try {
      const registeredPatient = await addPatientByDoctor(newPatientData);
      toast.success("Patient added successfully!");
      setPatients(prev => [registeredPatient, ...prev]);
      setIsAddPatientModalOpen(false);
    } catch (error) {
      console.error("Failed to add patient:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to add patient.");
    }
  };

  const handleSaveNewAppointment = async (appointmentData) => {
    try {
      const newAppointment = await postDoctorAppointment(appointmentData);
      toast.success('Appointment scheduled successfully!');
      setIsScheduleModalOpen(false);
      console.log('New appointment:', newAppointment);
    } catch (error) {
      console.error("Failed to schedule appointment:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to schedule appointment. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
  };

  // const isLoading = isLoadingDashboard || isLoadingPatients;

  if (dashboardError && patientsError) {
    return (
        <div className="p-6 bg-red-50 border border-red-300 rounded-md shadow-sm m-4">
            <div className="flex items-center text-red-700">
                <XCircleIcon className="w-6 h-6 mr-2" />
                <h2 className="text-xl font-semibold">Error Loading Dashboard</h2>
            </div>
            <p className="text-red-600 mt-2">Could not load dashboard overview and patient list. Please try again later.</p>
            <p className="text-xs text-red-500 mt-1">Details: {dashboardError} & {patientsError}</p>
        </div>
    );
  }
  
  if (isLoadingDashboard && !dashboardData) {
    return (
        <div className="space-y-8 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Skeleton height={120} count={2} className="md:col-span-1" />
                <Skeleton height={120} className="md:col-span-1" />
            </div>
            <Skeleton height={200} />
            <Skeleton height={150} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Skeleton height={150} />
                <Skeleton height={150} />
            </div>
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsSummary stats={summaryStats} isLoading={isLoadingDashboard} className="md:col-span-2" />
        <CustomUICard className="md:col-span-1 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-slate-700 dark:to-slate-800 border-l-4 border-sky-500 dark:border-sky-400">
          <div className="p-4 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-medium text-sky-800 dark:text-sky-300 mb-2">Quick Actions</h3>
              <QuickActions onAddPatient={handleAddPatient} onSchedule={handleSchedule} isLoading={isLoadingDashboard} />
            </div>
          </div>
        </CustomUICard>
      </div>

      {/* Add Patient Modal */}
      {isAddPatientModalOpen && (
        <AddPatientModal
          isOpen={isAddPatientModalOpen}
          onClose={() => setIsAddPatientModalOpen(false)}
          onSavePatient={handleSaveNewPatient}
        />
      )}

      {/* Schedule Appointment Modal */}
      {isScheduleModalOpen && (
        <ScheduleAppointmentModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onSaveAppointment={handleSaveNewAppointment}
          patients={patients}
        />
      )}

      <CustomUICard className="overflow-x-auto border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <PatientsIcon className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" /> All Patients
          </h3>
        </div>
        <div className="p-0">
          {isLoadingPatients && !patientsError && patients.length === 0 ? (
            <div className="p-4">
              {[...Array(5)].map((_, i) => <Skeleton key={i} height={48} className="mb-0 leading-none" />)} 
            </div>
          ) : patientsError ? (
            <div className="p-6 text-center text-red-600 dark:text-red-400">
              <p><XCircleIcon className="w-8 h-8 inline mr-2" /></p>
              <p className="font-semibold">Failed to load patient list.</p>
              <p className="text-sm">{patientsError}</p>
            </div>
          ) : patients.length > 0 ? (
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-600">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Name</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden sm:table-cell">Email</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden md:table-cell">Date of Birth</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider hidden lg:table-cell">Gender</th>
                  <th scope="col" className="px-4 py-3 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-600">
                {patients.map(patient => (
                  <tr key={patient.uuid} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">
                      {patient.name || 'N/A'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 hidden sm:table-cell">{patient.email || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 hidden md:table-cell">{formatDate(patient.dateOfBirth)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300 hidden lg:table-cell">{patient.gender || 'N/A'}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <Link 
                        to={`/app/doctor/patient/${patient.uuid}`}
                        className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium py-1 px-2 rounded hover:bg-teal-50 dark:hover:bg-slate-700"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">No patients found.</p>
          )}
        </div>
        { (patients.length > 0 && !isLoadingPatients && !patientsError) &&
          <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-2 text-right border-t border-slate-200 dark:border-slate-600">
            <CustomButton variant="link" size="sm" className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300" to="/app/doctor/queue">
              Manage Patient Queue &rarr;
            </CustomButton>
          </div>
        }
      </CustomUICard>

      <CustomUICard className="overflow-hidden border border-blue-100 dark:border-slate-700 shadow-sm">
        <div className="bg-blue-50 dark:bg-slate-800/50 px-4 py-3 border-b border-blue-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" /> Today's Schedule
          </h3>
        </div>
        <div className="p-4">
        {isLoadingDashboard ? <div className="p-4"><Skeleton count={3} height={40} className="mb-1"/></div> : appointments.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {appointments.map(appt => (
                <div key={appt.uuid || appt.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-100">{appt.patientName || `Appointment ${appt.uuid?.substring(0,8)}`}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{appt.department || 'General'} • {new Date(appt.appointmentDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      appt.status === 'Confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-300' : 
                      appt.status === 'Checked In' ? 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-300' : 
                      'bg-amber-100 text-amber-800 dark:bg-amber-900/70 dark:text-amber-300'
                    }`}>
                      {appt.status || 'Pending'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">No appointments scheduled for today.</p>
          )}
        </div>
        { (appointments.length > 0 && !isLoadingDashboard && !dashboardError) &&
          <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-2 text-right border-t border-blue-100 dark:border-slate-700">
            <CustomButton variant="link" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" to="/app/doctor/appointments">
              View Full Schedule &rarr;
            </CustomButton>
          </div>
        }
      </CustomUICard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CustomUICard className="border border-green-100 dark:border-slate-700 shadow-sm">
          <div className="bg-green-50 dark:bg-slate-800/50 px-4 py-3 border-b border-green-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center">
              <PatientsIcon className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" /> Recent Patients (from Dashboard API)
            </h3>
          </div>
          <div className="p-4">
            {isLoadingDashboard ? <div className="p-4"><Skeleton count={2} height={50} className="my-1" /></div> : recentPatientsFromDashboard.length > 0 ? (
              <ul className="space-y-3">
                {recentPatientsFromDashboard.map(patient => (
                  <li key={patient.id} className="p-3 bg-green-50 dark:bg-slate-700/70 rounded-md border-l-4 border-green-500">
                    <div className="flex justify-between">
                      <p className="font-medium text-slate-800 dark:text-slate-100">{patient.name}, {patient.age}</p>
                      <span className="text-xs text-green-700 dark:text-green-400">Last visit: {formatDate(patient.lastVisit)}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{patient.condition}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">No recent patients reported by dashboard API.</p>
            )}
          </div>
          { (recentPatientsFromDashboard.length > 0 && !isLoadingDashboard && !dashboardError) &&
            <div className="bg-green-50 dark:bg-slate-700/50 px-4 py-2 text-right border-t border-green-100 dark:border-slate-700">
              <CustomButton variant="link" size="sm" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" to="/app/doctor/queue">
                View Patient Queue &rarr;
              </CustomButton>
            </div>
          }
        </CustomUICard>

        <CustomUICard className="border border-amber-100 dark:border-slate-700 shadow-sm">
           <div className="bg-amber-50 dark:bg-slate-800/50 px-4 py-3 border-b border-amber-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 flex items-center">
              <NotesIcon className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-400" /> Personal Notes
            </h3>
          </div>
          <div className="p-4">
            { isLoadingDashboard ? <div className="p-4"><Skeleton count={2} height={40} className="my-1" /></div> : (<div className="space-y-2">
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border-l-4 border-yellow-400 dark:border-yellow-600">
                <p className="text-sm text-slate-700 dark:text-slate-200">Follow up with John Doe about lab results</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md border-l-4 border-blue-400 dark:border-blue-600">
                <p className="text-sm text-slate-700 dark:text-slate-200">Research new treatment options for Patient #2468</p>
              </div>
            </div>)}
            <div className="mt-4">
              <CustomButton variant="outline" size="sm" className="text-amber-700 border-amber-400 hover:bg-amber-50 dark:text-amber-300 dark:border-amber-500 dark:hover:bg-slate-700 w-full" onClick={() => toast.info("Add New Note Clicked (Not Implemented)")}>
                + Add New Note
              </CustomButton>
            </div>
          </div>
        </CustomUICard>
      </div>
    </div>
  );
}

export default DoctorDashboardOverview; 