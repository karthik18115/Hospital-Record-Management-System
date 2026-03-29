export const PATIENT_DATA = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  dob: '1985-03-15',
  gender: 'Male',
  address: '123 Main St, Springfield, IL 62704',
  emergencyContact: {
    name: 'Jane Doe',
    relationship: 'Wife',
    phone: '+1 (555) 987-6543',
  },
  healthSummary: {
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    medications: ['Lisinopril 10mg daily', 'Metformin 500mg twice daily'],
  },
};

export const APPOINTMENTS = [
  { id: 1, date: '2023-05-20', time: '10:00 AM', doctor: 'Dr. Smith', department: 'General Medicine', status: 'Confirmed' },
  { id: 2, date: '2023-04-15', time: '11:30 AM', doctor: 'Dr. Johnson', department: 'Cardiology', status: 'Completed' },
  { id: 3, date: '2023-03-10', time: '09:00 AM', doctor: 'Dr. Brown', department: 'Dermatology', status: 'Completed' },
  { id: 4, date: '2023-02-05', time: '02:00 PM', doctor: 'Dr. Davis', department: 'Pediatrics', status: 'Cancelled' },
];

export const MEDICAL_RECORDS = [
  { id: 1, date: '2023-01-15', type: 'Consultation', doctor: 'Dr. Smith', diagnosis: 'Hypertension', notes: 'Prescribed Lisinopril 10mg daily.' },
  { id: 2, date: '2022-11-20', type: 'Lab Test', doctor: 'Dr. Johnson', diagnosis: 'Type 2 Diabetes', notes: 'Blood glucose levels elevated. Started Metformin.' },
  { id: 3, date: '2022-09-10', type: 'Follow-up', doctor: 'Dr. Brown', diagnosis: 'Hypertension', notes: 'Blood pressure stable with current medication.' },
  { id: 4, date: '2022-06-05', type: 'Emergency', doctor: 'Dr. Davis', diagnosis: 'Allergic Reaction', notes: 'Treated for allergic reaction to penicillin.' },
];

export const PRESCRIPTIONS = [
  { id: 1, patientName: 'John Doe', medication: 'Aspirin 81mg', dosage: '1 tablet daily', date: '2023-05-15', notes: 'Take with food.' },
  { id: 2, patientName: 'Jane Smith', medication: 'Lisinopril 10mg', dosage: '1 tablet daily', date: '2023-05-10', notes: 'Monitor blood pressure.' },
  { id: 3, patientName: 'Mike Johnson', medication: 'Metformin 500mg', dosage: '1 tablet twice daily', date: '2023-05-05', notes: 'Take with meals.' },
  { id: 4, patientName: 'Sarah Williams', medication: 'Ibuprofen 200mg', dosage: '1-2 tablets every 6 hours as needed', date: '2023-04-28', notes: 'Do not exceed 6 tablets in 24 hours.' },
  { id: 5, patientName: 'Tom Brown', medication: 'Levothyroxine 50mcg', dosage: '1 tablet daily', date: '2023-04-20', notes: 'Take on an empty stomach.' },
  { id: 6, patientName: 'Lisa Davis', medication: 'Atorvastatin 20mg', dosage: '1 tablet daily at bedtime', date: '2023-04-15', notes: 'Monitor cholesterol levels.' },
];

export const LAB_RESULTS = [
  { id: 1, patientName: 'John Doe', testType: 'Blood Test', date: '2023-05-15', status: 'Normal', details: 'All values within normal range.' },
  { id: 2, patientName: 'Jane Smith', testType: 'Urine Analysis', date: '2023-05-10', status: 'Urgent', details: 'Elevated protein levels, requires immediate attention.' },
  { id: 3, patientName: 'Mike Johnson', testType: 'Cholesterol Panel', date: '2023-05-05', status: 'Abnormal', details: 'High LDL cholesterol, follow-up required.' },
  { id: 4, patientName: 'Sarah Williams', testType: 'Blood Glucose', date: '2023-04-28', status: 'Normal', details: 'Blood sugar levels within target range.' },
  { id: 5, patientName: 'Tom Brown', testType: 'Thyroid Function', date: '2023-04-20', status: 'Abnormal', details: 'TSH levels indicate hypothyroidism.' },
  { id: 6, patientName: 'Lisa Davis', testType: 'Complete Blood Count', date: '2023-04-15', status: 'Urgent', details: 'Low hemoglobin, possible anemia, urgent follow-up needed.' },
];

export const PATIENT_QUEUE = [
  { id: 1, name: 'John Doe', age: 38, condition: 'Chest Pain', priority: 'High', waitTime: '15 min', vitals: { heartRate: 95, bloodPressure: '140/90', temperature: 98.6 } },
  { id: 2, name: 'Jane Smith', age: 29, condition: 'Fever', priority: 'Medium', waitTime: '30 min', vitals: { heartRate: 80, bloodPressure: '120/80', temperature: 100.2 } },
  { id: 3, name: 'Mike Johnson', age: 45, condition: 'Routine Checkup', priority: 'Low', waitTime: '45 min', vitals: { heartRate: 72, bloodPressure: '118/78', temperature: 98.4 } },
  { id: 4, name: 'Sarah Williams', age: 62, condition: 'Shortness of Breath', priority: 'High', waitTime: '10 min', vitals: { heartRate: 102, bloodPressure: '150/95', temperature: 98.7 } },
  { id: 5, name: 'Tom Brown', age: 33, condition: 'Back Pain', priority: 'Medium', waitTime: '25 min', vitals: { heartRate: 78, bloodPressure: '125/82', temperature: 98.5 } },
];

export const MESSAGES_DATA = {
  contacts: [
    { id: 1, name: 'Dr. Smith', role: 'Doctor', lastMessage: 'I have reviewed your latest lab results.', timestamp: '2023-05-15T10:30:00', unread: true },
    { id: 2, name: 'Jane Doe', role: 'Patient', lastMessage: 'When will my prescription be ready?', timestamp: '2023-05-14T14:22:00', unread: false },
    { id: 3, name: 'Dr. Johnson', role: 'Doctor', lastMessage: 'Please come in for a follow-up.', timestamp: '2023-05-12T09:15:00', unread: false },
    { id: 4, name: 'Mike Brown', role: 'Patient', lastMessage: 'Thank you for the advice.', timestamp: '2023-05-10T16:45:00', unread: false },
  ],
  conversations: {
    1: [
      { sender: 'Dr. Smith', content: 'I have reviewed your latest lab results.', timestamp: '2023-05-15T10:30:00', isSent: false },
      { sender: 'You', content: 'What did you find?', timestamp: '2023-05-15T10:32:00', isSent: true },
      { sender: 'Dr. Smith', content: 'Everything looks normal, but let\'s discuss in detail.', timestamp: '2023-05-15T10:35:00', isSent: false },
    ],
    2: [
      { sender: 'Jane Doe', content: 'When will my prescription be ready?', timestamp: '2023-05-14T14:22:00', isSent: false },
      { sender: 'You', content: 'It should be ready by tomorrow afternoon.', timestamp: '2023-05-14T14:25:00', isSent: true },
    ],
    3: [
      { sender: 'Dr. Johnson', content: 'Please come in for a follow-up.', timestamp: '2023-05-12T09:15:00', isSent: false },
      { sender: 'You', content: 'I\'ll schedule an appointment for next week.', timestamp: '2023-05-12T09:20:00', isSent: true },
    ],
    4: [
      { sender: 'Mike Brown', content: 'Thank you for the advice.', timestamp: '2023-05-10T16:45:00', isSent: false },
      { sender: 'You', content: 'You\'re welcome! Let me know if you have any questions.', timestamp: '2023-05-10T16:50:00', isSent: true },
    ],
  },
};

export const HEALTH_RISK_TRENDS = [
  { date: '2023-01-01', riskScore: 30 },
  { date: '2023-02-01', riskScore: 35 },
  { date: '2023-03-01', riskScore: 40 },
  { date: '2023-04-01', riskScore: 45 },
  { date: '2023-05-01', riskScore: 50 },
]; 