import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TabSwitcher from '../../components/TabSwitcher';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Skeleton from '../../components/ui/Skeleton';
import { PrescriptionIcon, RefillIcon, NotesIcon, DownloadIcon } from '../../components/icons';
import PrescriptionPdfDocument from '../../components/pdf/PrescriptionPdfDocument';
import { toast } from 'react-toastify';

export default function PatientPrescriptions() {
  const [activeTab, setActiveTab] = useState('active');
  const [isLoading] = useState(false); // Set to true for skeleton view

  const tabs = [
    { id: 'active', label: 'Active Prescriptions' },
    { id: 'past', label: 'Past Prescriptions' },
  ];

  // Mock data - Added refillsLeft
  const prescriptions = [
    { id: 1, medication: 'Lisinopril 10mg', dosage: '1 tablet daily', startDate: '2023-01-15', endDate: null, status: 'Active', refillsLeft: 2, doctor: 'Dr. Smith', notes: 'Take with food to avoid stomach upset. Monitor BP.' },
    { id: 2, medication: 'Metformin 500mg', dosage: '1 tablet twice daily', startDate: '2022-11-20', endDate: null, status: 'Active', refillsLeft: 0, doctor: 'Dr. Johnson', notes: 'Take with meals. Monitor blood sugar levels.' },
    { id: 3, medication: 'Ibuprofen 200mg', dosage: '1-2 tabs q6h PRN pain', startDate: '2023-03-10', endDate: '2023-03-17', status: 'Expired', refillsLeft: 0, doctor: 'Dr. Brown', notes: 'Max 6 tabs/day.' },
    { id: 4, medication: 'Amoxicillin 500mg', dosage: '1 capsule TID for 10 days', startDate: '2022-09-05', endDate: '2022-09-15', status: 'Completed', refillsLeft: 0, doctor: 'Dr. Davis', notes: 'Finish entire course.' },
  ].sort((a, b) => {
    if (a.status === 'Active' && b.status !== 'Active') return -1;
    if (a.status !== 'Active' && b.status === 'Active') return 1;
    return new Date(b.startDate) - new Date(a.startDate);
  }); // Sort active first, then by most recent start date

  const filterPrescriptions = () => {
    if (isLoading) return [];
    return prescriptions.filter(p => 
      activeTab === 'active' ? p.status === 'Active' : p.status !== 'Active'
    );
  };

  const getStatusPillClasses = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border border-green-200';
      case 'Expired': return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border border-blue-200';
      default: return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  const handleRequestRefill = (rxId, medicationName) => {
    console.log(`Requesting refill for ${rxId}: ${medicationName}`);
    // TODO: API call to request refill
    toast.success(`Refill requested for ${medicationName}.`);
  };
  
  const handleViewDetails = (prescription) => {
    console.log("Viewing details for:", prescription);
    // TODO: Implement Details Modal
    alert(`Details for ${prescription.medication}:\nDosage: ${prescription.dosage}\nDoctor: ${prescription.doctor}\nNotes: ${prescription.notes || 'None'}`);
  };

  const displayedPrescriptions = filterPrescriptions();

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">My Prescriptions</h1>
        <p className="text-lg text-slate-600 mt-1">View your current and past medication history.</p>
      </header>

      <TabSwitcher tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="space-y-6">
        {isLoading ? (
          Array(2).fill(0).map((_, index) => (
            <Card key={index} className="p-6 border border-slate-200">
              <Skeleton height={24} width="50%" style={{ marginBottom: '0.5rem' }} />
              <Skeleton height={16} width="30%" style={{ marginBottom: '1rem' }} />
              <Skeleton count={3} style={{ marginBottom: '0.25rem' }}/>
              <div className="mt-4 flex justify-end space-x-3">
                <Skeleton height={36} width={100} />
                <Skeleton height={36} width={120} />
              </div>
            </Card>
          ))
        ) : displayedPrescriptions.length > 0 ? (
          displayedPrescriptions.map(rx => (
            <Card key={rx.id} className="p-4 sm:p-6 shadow hover:shadow-md transition-shadow duration-200 border border-slate-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start">
                {/* Left Side: Medication Info */}
                <div className="flex-1 mb-4 sm:mb-0 sm:pr-6">
                  <div className="flex items-start mb-2">
                    <PrescriptionIcon className="w-6 h-6 mr-3 text-teal-600 flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-800">{rx.medication}</h2>
                      <p className="text-sm text-slate-600">Dosage: {rx.dosage}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-1 pl-9">Prescribed by: {rx.doctor}</p>
                  <p className="text-sm text-slate-500 pl-9">
                    Duration: {new Date(rx.startDate).toLocaleDateString()} - {rx.endDate ? new Date(rx.endDate).toLocaleDateString() : 'Ongoing'}
                  </p>
                  {rx.notes && (
                    <p className="text-sm text-slate-700 bg-slate-100 p-3 rounded-lg mt-3 ml-9">Notes: {rx.notes}</p>
                  )}
                </div>
                {/* Right Side: Status & Actions */}
                <div className="flex flex-col items-start sm:items-end flex-shrink-0 w-full sm:w-auto">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${getStatusPillClasses(rx.status)}`}>
                    {rx.status}
                  </span>
                  {rx.status === 'Active' && (
                    <p className="text-xs text-slate-500 mb-3">
                      {rx.refillsLeft > 0 ? `${rx.refillsLeft} refill(s) remaining` : 'No refills remaining'}
                    </p>
                  )}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="w-full sm:w-auto flex items-center justify-center space-x-1" onClick={() => handleViewDetails(rx)}>
                      <NotesIcon className="w-4 h-4"/>
                      <span>Details</span>
                    </Button>
                    <PDFDownloadLink
                      document={<PrescriptionPdfDocument prescription={rx} />}
                      fileName={`Prescription-${rx.medication.replace(/\s+/g, '-')}-${rx.id}.pdf`}
                      className="w-full sm:w-auto"
                    >
                      {({ loading }) => (
                        <Button variant="outline" size="sm" className="w-full flex items-center justify-center space-x-1" disabled={loading}>
                          <DownloadIcon className="w-4 h-4" />
                          <span>{loading ? 'Generating...' : 'Download PDF'}</span>
                        </Button>
                      )}
                    </PDFDownloadLink>
                    {rx.status === 'Active' && rx.refillsLeft > 0 && (
                      <Button variant="primary" size="sm" className="w-full sm:w-auto flex items-center justify-center space-x-1" onClick={() => handleRequestRefill(rx.id, rx.medication)}>
                        <RefillIcon className="w-4 h-4"/>
                        <span>Request Refill</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center border border-slate-200">
            <p className="text-slate-500 text-lg">No {activeTab} prescriptions found.</p>
          </Card>
        )}
      </div>
    </div>
  );
} 