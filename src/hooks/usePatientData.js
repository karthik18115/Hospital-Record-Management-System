import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth'; // Assuming AuthContext provides getToken()

// --- MOCK DATA --- 
const MOCK_PATIENT_DATA = {
  name: "Johnathan Mock Doe",
  dateOfBirth: "1980-05-15", // Added for demographic info in PDF
  patientId: "PID789012",   // Added for demographic info in PDF
  email: "john.mock@example.com",
  pendingTests: 1, // Adjusted as we now have a completed one
  recentActivity: 'Lab results received for Blood Panel',
  healthRiskScores: [75, 78, 76, 80, 79],
  healthRiskDates: ['2024-04-01', '2024-05-01', '2024-06-01', '2024-07-01', '2024-08-01'],
  activePrescriptions: [{ id: 'rx1', name: 'Lisinopril 10mg', dosage: '10mg', frequency: 'Once Daily'}],
  recentActivities: [
    {id: 'act2', type: 'Lab Result', description: 'Blood Panel results are in.', date: '2024-08-10'},
    {id: 'act1', type: 'Appointment', description: 'Appointment scheduled with Dr. Smith', date: '2024-08-05'}
  ],
  emergencyContacts: [{id: 'ec1', name: 'Jane Mock Doe', relationship: 'Spouse', phone: '555-000-1111'}],
  labReports: [
    {
      reportId: "LABRPT001",
      reportName: "Comprehensive Metabolic Panel",
      collectionDate: "2024-08-09",
      reportDate: "2024-08-10",
      orderingPhysician: "Dr. Emily Carter",
      performingLab: "MedRec Central Lab",
      status: "Final",
      tests: [
        { testId: "GLU", name: "Glucose", value: "95", units: "mg/dL", referenceRange: "70-100", flag: "Normal" },
        { testId: "BUN", name: "Blood Urea Nitrogen", value: "15", units: "mg/dL", referenceRange: "7-20", flag: "Normal" },
        { testId: "CREA", name: "Creatinine", value: "1.1", units: "mg/dL", referenceRange: "0.6-1.2", flag: "Normal" },
        { testId: "NA", name: "Sodium", value: "140", units: "mEq/L", referenceRange: "135-145", flag: "Normal" },
        { testId: "K", name: "Potassium", value: "3.9", units: "mEq/L", referenceRange: "3.5-5.0", flag: "Normal" },
        { testId: "CL", name: "Chloride", value: "102", units: "mEq/L", referenceRange: "98-107", flag: "Normal" },
        { testId: "CO2", name: "Carbon Dioxide", value: "25", units: "mEq/L", referenceRange: "23-30", flag: "Normal" },
        { testId: "ALB", name: "Albumin", value: "4.5", units: "g/dL", referenceRange: "3.5-5.0", flag: "Normal" },
        { testId: "TP", name: "Total Protein", value: "7.0", units: "g/dL", referenceRange: "6.0-8.0", flag: "Normal" },
        { testId: "ALT", name: "Alanine Aminotransferase", value: "30", units: "U/L", referenceRange: "10-40", flag: "Normal" },
        { testId: "AST", name: "Aspartate Aminotransferase", value: "25", units: "U/L", referenceRange: "10-35", flag: "Normal" },
        { testId: "BILI", name: "Bilirubin, Total", value: "0.8", units: "mg/dL", referenceRange: "0.2-1.2", flag: "Normal" },
      ],
      notes: "All results within normal limits. Patient fasting status confirmed."
    }
    // Add more sample lab reports if needed
  ]
};
// --- END MOCK DATA ---

function usePatientData() {
  const [patientData, setPatientData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getToken } = useAuth(); // Or however you access the token

  useEffect(() => {
    const fetchPatientData = async () => {
      setIsLoading(true);
      setError(null);
      const token = getToken();

      if (!token) {
        setError('No authentication token found. Please log in.');
        setIsLoading(false);
        setPatientData(null); // Clear any stale data
        return;
      }

      try {
        const response = await fetch('/api/patients/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
             setError('Unauthorized. Please log in again.');
          } else {
            const errorData = await response.json().catch(() => ({ message: 'Failed to fetch patient data' }));
            setError(errorData.message || `HTTP error! status: ${response.status}`);
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Map the DTO to the structure expected by PatientDashboardOverview if necessary
        // For now, assume the DTO structure is close enough or PatientDashboardOverview can adapt.
        setPatientData(data);

      } catch (err) {
        console.error("Error fetching patient data:", err);
        // setError(err.message || 'An unexpected error occurred'); // Already set in most cases
        if (!error) { // if error wasn't set by response status check
            setError(err.message || 'An unexpected error occurred while fetching data.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [getToken, error]); // Add error to dependency array to avoid potential infinite loops if setError causes re-render

  return { patientData, isLoading, error };
}

export default usePatientData; 