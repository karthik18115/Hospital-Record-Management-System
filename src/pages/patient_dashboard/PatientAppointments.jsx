import React, { useState } from 'react';
import AppointmentBookingModal from '../../components/AppointmentBookingModal';
import TabSwitcher from '../../components/TabSwitcher';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { CalendarIcon, PlusIcon } from '../../components/icons';
import { useAppointments } from '../../context/AppointmentContext';

export default function PatientAppointments() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { appointments, handleBookAppointment } = useAppointments();

  const localHandleBookAppointment = (appointmentDetails) => {
    handleBookAppointment(appointmentDetails);
    setIsModalOpen(false);
  };

  const tabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'all', label: 'All Appointments' },
  ];

  const filteredAppointments = () => {
    const now = new Date();
    switch (activeTab) {
      case 'upcoming':
        return appointments.filter(app => new Date(app.date) >= now && app.status !== 'Cancelled' && app.status !== 'Completed').sort((a,b) => new Date(a.date) - new Date(b.date));
      case 'past':
        return appointments.filter(app => new Date(app.date) < now || app.status === 'Completed' || app.status === 'Cancelled').sort((a,b) => new Date(b.date) - new Date(a.date));
      default: // 'all'
        return [...appointments].sort((a,b) => new Date(b.date) - new Date(a.date));
    }
  };

  const getStatusPillClasses = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-teal-100 text-teal-800 border border-teal-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">My Appointments</h1>
          <p className="text-lg text-slate-600 mt-1">View, manage, or schedule your medical appointments.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} className="mt-4 sm:mt-0 flex items-center space-x-2">
          <PlusIcon className="w-5 h-5" /> 
          <span>Book New Appointment</span>
        </Button>
      </header>

      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        {filteredAppointments().length > 0 ? (
          filteredAppointments().map(appt => (
            <Card key={appt.id} className="p-4 sm:p-6 shadow hover:shadow-md transition-shadow duration-200 border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="mb-4 sm:mb-0 flex-grow mr-4">
                  <div className="flex items-center text-sm text-slate-500 mb-1">
                    <CalendarIcon className="w-4 h-4 mr-2" /> 
                    <span>{new Date(appt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} at {appt.time}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{appt.department}</h2>
                  <p className="text-sm sm:text-base text-slate-600">with {appt.doctor}</p>
                  <p className="text-xs text-slate-500 mt-1">Type: {appt.type}</p>
                </div>
                <div className="flex flex-col items-start sm:items-end flex-shrink-0">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusPillClasses(appt.status)}`}>
                    {appt.status}
                  </span>
                  {appt.status === 'Confirmed' && new Date(appt.date) >= new Date() && (
                    <div className="mt-4 flex space-x-2">
                      <Button variant="secondary" size="sm" onClick={() => alert(`Reschedule: ${appt.id} - NI`)}>Reschedule</Button>
                      <Button variant="danger-outline" size="sm" onClick={() => alert(`Cancel: ${appt.id} - NI`)}>Cancel</Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center border border-slate-200">
            <p className="text-slate-500 text-lg">
              {activeTab === 'upcoming' ? 'You have no upcoming appointments.' : 
               activeTab === 'past' ? 'You have no past appointments.' : 
               'You have no appointments in this view.'}
            </p>
            <Button variant="primary" className="mt-4" onClick={() => setIsModalOpen(true)}>
              Book an Appointment
            </Button>
          </Card>
        )}
      </div>

      <AppointmentBookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onBook={localHandleBookAppointment}
      />
    </div>
  );
} 