import { createContext, useContext } from 'react';

export const AppointmentContext = createContext(null);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined || context === null) {
    throw new Error('useAppointments must be used within an AppointmentContext provider');
  }
  return context;
};
