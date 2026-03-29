import { useState, useEffect } from 'react';

// --- MOCK DATA --- 
const MOCK_APPOINTMENTS = [
  { id: 'appt1', date: '2024-09-15', time: '10:00 AM', doctor: 'Dr. Emily Carter', specialty: 'Cardiology', status: 'Confirmed' },
  { id: 'appt2', date: '2024-09-20', time: '02:30 PM', doctor: 'Dr. John Smith', specialty: 'General Checkup', status: 'Confirmed' },
];
// --- END MOCK DATA ---

function useAppointments() {
  const [appointments, setAppointments] = useState(null); // Initialize to null
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
     // Simulate fetching data
    const fetchAppointments = () => {
      setIsLoading(true);
      setError(null);
      // Simulate API call delay
      setTimeout(() => {
        try {
          // Use mock data instead of fetch
          setAppointments(MOCK_APPOINTMENTS);
          setIsLoading(false);
        } catch {
          setError('Failed to process mock appointment data'); // Should not happen with static mock data
          setIsLoading(false);
        }
      }, 600); // 600ms delay
    };

    fetchAppointments();
  }, []);

  return { appointments, isLoading, error };
}

export default useAppointments; 