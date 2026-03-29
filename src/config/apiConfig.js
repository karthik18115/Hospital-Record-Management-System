const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  endpoints: {
    patient: {
      profile: '/patient/profile',
      appointments: '/appointments',
      records: '/patient/records',
      prescriptions: '/patient/prescriptions',
      messages: '/patient/messages'
    },
    doctor: {
      patientQueue: '/doctor/patient-queue',
      messages: '/doctor/messages',
      prescriptions: '/doctor/prescriptions',
      labResults: '/doctor/lab-results'
    },
    auth: {
      login: '/auth/login',
      signup: '/auth/signup'
    },
    admin: {
      users: '/admin/users',
      logs: '/admin/logs'
    },
    pharmacy: {
      prescriptionsQueue: '/pharmacy/prescriptions-queue',
      dispense: '/pharmacy/dispense'
    },
    labcenter: {
      requests: '/lab/requests',
      results: '/lab/results'
    }
  }
};

export default apiConfig; 