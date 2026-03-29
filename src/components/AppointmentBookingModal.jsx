import React, { useState, useEffect } from 'react';
import Modal from './ui/Modal'; // Use standard Modal
import Button from './ui/Button'; // Use standard Button
import { toast } from 'react-toastify';

const formatDate = (date) => date.toISOString().split('T')[0];

// Helper function to generate available dates and times for the next 30 days
const generateUpcomingAvailability = () => {
  const availability = {};
  const today = new Date();
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    availability[formatDate(date)] = times;
  }
  return availability;
};

// Static data outside component
const doctorAvailability = generateUpcomingAvailability();
const doctorsData = {
  'Cardiology': [
    { id: 1, name: 'Dr. Emily Carter', availableDates: doctorAvailability },
    { id: 2, name: 'Dr. Ben Stern', availableDates: doctorAvailability }
  ],
  'Dermatology': [
    { id: 3, name: 'Dr. Sarah Lee', availableDates: doctorAvailability },
    { id: 4, name: 'Dr. Anya Sharma', availableDates: doctorAvailability }
  ],
  'General Medicine': [
     { id: 5, name: 'Dr. John Smith', availableDates: doctorAvailability },
     { id: 6, name: 'Dr. Priya Singh', availableDates: doctorAvailability }
  ],
  'Pediatrics': [
      { id: 7, name: 'Dr. Michael Brown', availableDates: doctorAvailability },
      { id: 8, name: 'Dr. Linda White', availableDates: doctorAvailability }
  ],
  'Neurology': [
      { id: 9, name: 'Dr. David Wilson', availableDates: doctorAvailability },
      { id: 10, name: 'Dr. Karen Davis', availableDates: doctorAvailability }
  ]
};

function AppointmentBookingModal({ isOpen, onClose, onBook }) {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false); // To disable button during mock booking

  const departments = Object.keys(doctorsData);

  useEffect(() => {
    if (selectedDepartment) {
      setAvailableDoctors(doctorsData[selectedDepartment] || []);
      setSelectedDoctor('');
      setAvailableTimes([]);
      setSelectedDate(''); // Reset date when department changes
      setSelectedTime('');
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (selectedDate && selectedDoctor) {
      const doctor = availableDoctors.find(doc => doc.name === selectedDoctor);
      
      setAvailableTimes(doctor?.availableDates[selectedDate] || []);
      setSelectedTime(''); // Reset time when date or doctor changes
    } else {
      setAvailableTimes([]); // Clear times if no date/doctor
    }
  }, [selectedDate, selectedDoctor, availableDoctors]);

  const handleBookAppointment = () => {
    if (selectedDate && selectedTime && selectedDepartment && selectedDoctor) {
      setIsProcessing(true);
      // Simulate booking API call
      setTimeout(() => {
        if (onBook) {
          onBook({ date: selectedDate, time: selectedTime, department: selectedDepartment, doctor: selectedDoctor });
        }
        // No need for internal bookingStatus state, toast handled in parent
        setIsProcessing(false);
        onClose(); // Close the modal after successful booking
      }, 1500);
    } else {
      toast.error('Please fill in all fields to book an appointment.');
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-slate-50 text-slate-700 border border-slate-300 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";

  return (
    <Modal 
        isOpen={isOpen} 
        onClose={onClose} 
        title="Book an Appointment"
        // Assuming Modal uses light theme styling or can be adapted
        // Pass footer buttons
        footerContent={(
          <>
            <Button variant="outline" onClick={onClose} disabled={isProcessing}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => handleBookAppointment()} isLoading={isProcessing} disabled={isProcessing}>
              {isProcessing ? 'Booking...' : 'Book Appointment'}
            </Button>
          </>
        )}
    >
        {/* Form Content as Children */}
        <div className="space-y-4">
            {/* Department Selection */}
            <div>
                <label htmlFor="department" className={labelClass}>Department:</label>
                <select
                    id="department"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className={inputClass}
                    required
                >
                    <option value="">Select Department</option>
                    {departments.map(dep => (
                        <option key={dep} value={dep}>{dep}</option>
                    ))}
                </select>
            </div>

            {/* Doctor Selection (conditional) */}
            {selectedDepartment && (
                <div>
                    <label htmlFor="doctor" className={labelClass}>Doctor:</label>
                    <select
                        id="doctor"
                        value={selectedDoctor}
                        onChange={(e) => {
                            const newDoctor = e.target.value;
                            setSelectedDoctor(newDoctor);
                        }}
                        className={inputClass}
                        required
                        disabled={!selectedDepartment || availableDoctors.length === 0}
                    >
                        <option value="">{availableDoctors.length > 0 ? 'Select Doctor' : 'No doctors available'}</option>
                        {availableDoctors.map(doc => (
                            <option key={doc.id} value={doc.name}>{doc.name}</option>
                        ))}
                    </select>
                </div>
            )}

            {/* Date Selection (conditional) */}
            {selectedDoctor && (
                <div>
                    <label htmlFor="date" className={labelClass}>Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={selectedDate}
                        onChange={(e) => {
                            const newDate = e.target.value;
                            setSelectedDate(newDate);
                        }}
                        min={formatDate(new Date())} // Prevent booking past dates
                        className={inputClass}
                        required
                        disabled={!selectedDoctor}
                    />
                </div>
            )}

            {/* Time Selection (conditional) */}
            {selectedDoctor && selectedDate && (
                <div>
                    <label htmlFor="time" className={labelClass}>Time:</label>
                    <select
                        id="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className={inputClass}
                        required
                        disabled={!selectedDate || availableTimes.length === 0}
                    >
                         <option value="">{availableTimes.length > 0 ? 'Select Available Time' : 'No times available on this date'}</option>
                        {availableTimes.map(time => (
                            <option key={time} value={time}>{time}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    </Modal>
  );
}

export default AppointmentBookingModal;