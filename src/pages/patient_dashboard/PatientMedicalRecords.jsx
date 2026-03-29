import React from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer'; // Restore this import
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { DownloadIcon, HealthIcon, PrescriptionIcon, DocumentTextIcon } from '../../components/icons';
import LabResultPdfDocument from '../../components/pdf/LabResultPdfDocument'; // Restore this import
import usePatientMedicalData from '../../hooks/usePatientMedicalData'; // Import the hook
// Remove LabReportDownloadButton import
// import LabReportDownloadButton from '../../components/LabReportDownloadButton'; 

// Mock data hook (replace with actual fetching logic later)
// const usePatientMedicalData = () => {
//   const [data, setData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setData({
//         // Consistent patient data structure as used by LabResultPdfDocument
//         name: "Ms. Jane Doe (Medical Records)", // Keep distinct for clarity during testing
//         patientId: "P7891011",
//         dateOfBirth: "1985-08-22",
//         gender: "Female", // PDF expects this under patientData directly
//         // Other fields like email can be added if the PDF needs them from patientData root
//
//         allergies: [{id: 'a1', name: "Peanuts", severity: "High"}, {id: 'a2', name: "Penicillin", severity: "Medium"}],
//         chronicConditions: [{id: 'c1', name: "Hypertension"}, {id: 'c2', name: "Asthma (Mild)"}],
//         medications: [
//             {id: 'm1', name: 'Lisinopril 10mg', status: 'Active'},
//             {id: 'm2', name: 'Metformin 500mg', status: 'Active'},
//             {id: 'm3', name: 'Ventolin Inhaler', status: 'Active (As Needed)'}
//         ],
//         immunizations: [
//             {id: 'i1', name: 'Influenza Vaccine', date: '2023-10-15'},
//             {id: 'i2', name: 'COVID-19 Booster (Moderna)', date: '2023-11-01'},
//         ],
//         procedures: [
//             {id: 'p1', name: 'Appendectomy', date: '2015-03-10'},
//         ],
//         // Lab reports using the structure expected by LabResultPdfDocument
//         labReports: [
//           {
//             reportId: "LAB_MR_001",
//             reportName: "Lipid Panel (Medical Records)",
//             collectionDate: "2024-07-15",
//             reportDate: "2024-07-16",
//             orderingPhysician: "Dr. Sarah Miller",
//             performingLab: "City Central Laboratory",
//             specimenType: "Blood, Serum", // Added example
//             status: "Final",
//             tests: [
//               { testId: 'chol', name: 'Cholesterol, Total', value: '220', units: 'mg/dL', referenceRange: '<200', flag: 'High' },
//               { testId: 'ldl', name: 'LDL Cholesterol', value: '140', units: 'mg/dL', referenceRange: '<100', flag: 'High' },
//               { testId: 'hdl', name: 'HDL Cholesterol', value: '55', units: 'mg/dL', referenceRange: '>40', flag: 'Normal' },
//             ],
//             notes: 'Patient shows elevated LDL cholesterol. Lifestyle adjustments recommended.',
//           },
//           {
//             reportId: "LAB_MR_002",
//             reportName: "Thyroid Panel (Medical Records)",
//             collectionDate: "2024-06-10",
//             reportDate: "2024-06-11",
//             orderingPhysician: "Dr. John Davis",
//             performingLab: "Precision Diagnostics Inc.",
//             specimenType: "Blood, Plasma",
//             status: "Final",
//             tests: [
//               { testId: 'tsh', name: 'TSH', value: '2.5', units: 'mIU/L', referenceRange: '0.4 - 4.0', flag: 'Normal' },
//               { testId: 'vitd', name: 'Vitamin D', value: '35', units: 'ng/mL', referenceRange: '30 - 100', flag: 'Normal' },
//             ],
//             notes: 'All results within normal limits.',
//           }
//         ]
//       });
//       setIsLoading(false);
//     }, 1000); // Adjusted delay slightly
//     return () => clearTimeout(timer);
//   }, []);
//
//   return { data, isLoading };
// };

// Helper component for list items
const RecordListItem = ({ children, className }) => (
    <li className={`py-2 border-b border-slate-200 last:border-b-0 text-sm text-slate-700 ${className}`}>{children}</li>
);

export default function PatientMedicalRecords() {
  const { data, isLoading } = usePatientMedicalData();

  // Remove the test blob/URL generation
  // const testFileBlob = new Blob(["This is a test download file."], { type: 'text/plain' });
  // const testFileUrl = URL.createObjectURL(testFileBlob);

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Medical Records Summary</h1>
          <p className="text-lg text-slate-600 mt-1">An overview of your key medical information.</p>
        </div>
        <Button 
          variant="primary" 
          // Re-enable original alert or implement actual summary download later
          onClick={() => alert('Download Summary PDF - NI')} 
          className="mt-4 sm:mt-0 flex items-center space-x-2"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Download Summary</span>
        </Button>
        {/* Remove the test link */}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

        {/* Allergies Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Allergies</h2>
          {isLoading ? <Skeleton count={3} height={20} /> : data?.allergies?.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {data.allergies.map(a => (
                <li key={a.id} className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${a.severity === 'High' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>{a.name} ({a.severity})</li>
              ))}
            </ul>
          ) : <p className="text-slate-500">No allergies recorded.</p>}
        </Card>

        {/* Chronic Conditions Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Chronic Conditions</h2>
          {isLoading ? <Skeleton count={2} height={20} /> : data?.chronicConditions?.length > 0 ? (
             <ul className="flex flex-wrap gap-2">
              {data.chronicConditions.map(c => (
                <li key={c.id} className={`px-3 py-1.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700 border border-slate-300 shadow-sm`}>{c.name}</li>
              ))}
            </ul>
          ) : <p className="text-slate-500">No chronic conditions recorded.</p>}
        </Card>

        {/* Medications Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Current Medications</h2>
          {isLoading ? <Skeleton count={3} height={20} /> : data?.medications?.length > 0 ? (
            <ul className="space-y-1">
              {data.medications.map(med => (
                <RecordListItem key={med.id}>
                  <PrescriptionIcon className="w-4 h-4 inline-block mr-2 text-teal-600" /> {med.name} <span className="text-xs text-slate-500">({med.status})</span>
                </RecordListItem>
              ))}
              {/* Link to full prescription list */} 
              <li className="pt-2">
                <Button to="../prescriptions" variant="outline" size="sm">View All Prescriptions</Button>
              </li>
            </ul>
          ) : <p className="text-slate-500">No active medications recorded.</p>}
        </Card>

        {/* Immunizations Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Immunization History</h2>
          {isLoading ? <Skeleton count={3} height={20} /> : data?.immunizations?.length > 0 ? (
            <ul className="space-y-1">
              {data.immunizations.sort((a, b) => new Date(b.date) - new Date(a.date)).map(imm => (
                <RecordListItem key={imm.id}>
                  <HealthIcon className="w-4 h-4 inline-block mr-2 text-blue-600" /> {imm.name} - {new Date(imm.date).toLocaleDateString()}
                </RecordListItem>
              ))}
            </ul>
          ) : <p className="text-slate-500">No immunization records found.</p>}
        </Card>

        {/* Procedures Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Procedures & Surgeries</h2>
          {isLoading ? <Skeleton count={2} height={20} /> : data?.procedures?.length > 0 ? (
            <ul className="space-y-1">
              {data.procedures.sort((a, b) => new Date(b.date) - new Date(a.date)).map(proc => (
                <RecordListItem key={proc.id}>
                  {proc.name} - {new Date(proc.date).toLocaleDateString()}
                </RecordListItem>
              ))}
            </ul>
          ) : <p className="text-slate-500">No past procedures recorded.</p>}
        </Card>

        {/* Recent Lab Results Summary Card */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-700 mb-4">Recent Lab Reports</h2>
          {isLoading ? <Skeleton count={2} height={40} /> : data?.labReports?.length > 0 ? (
            <ul className="space-y-3">
              {data.labReports.map(report => (
                <RecordListItem key={report.reportId} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <div className="flex items-center">
                        <DocumentTextIcon className="w-5 h-5 mr-2 text-indigo-600 flex-shrink-0" />
                        <span className="font-medium text-slate-800">Report ID: {report.reportId}</span>
                    </div>
                    <p className="text-xs text-slate-500 ml-7">
                        Date: {new Date(report.reportDate).toLocaleDateString()} - Lab: {report.performingLab}
                    </p>
                    <p className={`text-xs ml-7 font-semibold ${report.status === 'Final' ? 'text-green-600' : 'text-red-600'}`}>
                        Status: {report.status}
                    </p>
                  </div>
                  {/* Restore PDFDownloadLink with simple div child */}
                  <PDFDownloadLink
                    document={<LabResultPdfDocument patientData={data} labReport={report} />}
                    fileName={`LabReport-${report.reportId}-${data?.name?.replace(/\s+/g, '_') || 'Patient'}.pdf`}
                    className="mt-2 sm:mt-0 sm:ml-4 w-full sm:w-auto flex-shrink-0"
                  >
                    {({ loading: pdfLoading }) => {
                      // console.log(`PDFLink for ${report.reportId}: loading=${pdfLoading}, url=${url}, error=${pdfError}, blob size=${blob?.size}`);
                      return (
                        <div 
                          className={`inline-block px-3 py-1.5 border rounded-md text-sm text-center cursor-pointer 
                                      ${pdfLoading ? 'bg-slate-200 text-slate-500' : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'}`}
                          // Add title attribute for better accessibility/tooltip
                          title={pdfLoading ? 'Generating PDF...' : `Download report ${report.reportId}`}
                        >
                          <DownloadIcon className="w-4 h-4 inline-block mr-1.5 align-text-bottom" />
                          {pdfLoading ? 'Generating...' : 'Download Report'}
                        </div>
                      );
                    }}
                  </PDFDownloadLink>
                </RecordListItem>
              ))}
               <li className="pt-3">
                <Button to="../documents" variant="outline" size="sm">View All Documents/Labs</Button>
              </li>
            </ul>
          ) : <p className="text-slate-500">No recent lab reports available.</p>}
        </Card>

      </div>
    </div>
  );
  
  // Remove the useEffect for testFileUrl cleanup
} 