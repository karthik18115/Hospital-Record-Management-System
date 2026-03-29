import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CustomButton from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import AddNoteForm from '../../components/doctor/AddNoteForm';
import {
    ArrowLeftIcon, PencilIcon, DocumentPlusIcon, BeakerIcon, // Actions
    UserCircleIcon, // Added for medications, etc.
    BellAlertIcon, ClipboardDocumentListIcon, HeartIcon, // Medical Summary (part of patientDetails)
    DocumentTextIcon, // Clinical Notes icon
    InformationCircleIcon, // For info messages
    XCircleIcon // For error messages
} from '../../components/icons';
import { getPatientProfileForDoctor, addClinicalNoteForPatient } from '../../services/doctorService'; // Added addClinicalNoteForPatient
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { toast } from 'react-toastify';

// Import EHRViewer
import EHRViewer from './components/EHRViewer';
import CustomUICard from '../../components/ui/Card'; // Keep for other cards

// Helper to format DOB for display
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
};

function DoctorViewPatientProfile() {
  const { patientUuid } = useParams();
  const [patientDetails, setPatientDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddNoteModalOpen, setIsAddNoteModalOpen] = useState(false);

  useEffect(() => {
    if (patientUuid) {
      setIsLoading(true);
      getPatientProfileForDoctor(patientUuid)
        .then(data => {
          setPatientDetails(data);
          setError(null);
        })
        .catch(err => {
          console.error("Failed to fetch patient details:", err);
          setError(err.message || 'Could not fetch patient details.');
          toast.error(err.message || 'Could not fetch patient details.');
        })
        .finally(() => setIsLoading(false));
    }
  }, [patientUuid]);

  const handleActionClick = (action) => {
    toast.info(`Action: ${action} clicked for patient ${patientUuid} (Not Implemented Yet)`);
  };

  const handleOpenAddNoteModal = () => setIsAddNoteModalOpen(true);
  const handleCloseNoteModal = () => setIsAddNoteModalOpen(false);

  const handleSaveNote = async (noteContent) => {
    if (!patientUuid || !noteContent.trim()) {
      toast.error("Note content cannot be empty.");
      return;
    }
    try {
      // Assuming noteContent is just the string content for now
      // Backend might expect an object e.g. { content: noteContent, type: 'Clinical' }
      const newNote = await addClinicalNoteForPatient(patientUuid, { content: noteContent });
      toast.success('Clinical note added successfully!');
      handleCloseNoteModal();
      // Optionally, if you display notes on this page, you might want to refresh them here
      // For example: fetchPatientNotes(); 
      console.log("Added note:", newNote);
    } catch (err) {
      console.error("Failed to add clinical note:", err);
      toast.error(err.response?.data?.message || err.message || 'Failed to add note. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 bg-slate-100 dark:bg-slate-900 min-h-screen animate-pulse">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
              <Skeleton height={24} width={150} className="mb-2" />
              <Skeleton height={36} width={250} />
          </div>
          <div className="flex space-x-2">
            <Skeleton height={36} width={96} />
            <Skeleton height={36} width={128} />
            <Skeleton height={36} width={112} />
          </div>
        </header>
        <CustomUICard className="dark:bg-slate-800"><div className="p-6"><Skeleton count={5} style={{ marginBottom: '0.75rem' }}/></div></CustomUICard>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <CustomUICard className="dark:bg-slate-800"><div className="p-6"><Skeleton count={4} style={{ marginBottom: '0.75rem' }}/></div></CustomUICard>
              <CustomUICard className="dark:bg-slate-800"><div className="p-6"><Skeleton count={3} style={{ marginBottom: '0.75rem' }}/></div></CustomUICard>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <CustomUICard className="dark:bg-slate-800"><div className="p-6"><Skeleton count={4} style={{ marginBottom: '0.75rem' }}/></div></CustomUICard>
              <CustomUICard className="dark:bg-slate-800"><div className="p-6"><Skeleton count={3} style={{ marginBottom: '0.75rem' }}/></div></CustomUICard>
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center">
        <CustomUICard className="max-w-lg w-full p-6 shadow-xl dark:bg-slate-800">
            <div className="text-center">
                <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Error Fetching Patient Data</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
                <CustomButton 
                    variant="secondary"
                    to="/app/doctor/overview" 
                    className="flex items-center mx-auto"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </CustomButton>
            </div>
        </CustomUICard>
      </div>
    );
  }

  if (!patientDetails) {
    return (
      <div className="p-4 md:p-6 bg-slate-100 dark:bg-slate-900 min-h-screen flex flex-col items-center justify-center">
         <CustomUICard className="max-w-lg w-full p-6 shadow-xl dark:bg-slate-800">
            <div className="text-center">
                <InformationCircleIcon className="w-16 h-16 text-sky-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Patient Not Found</h2>
                <p className="text-slate-600 dark:text-slate-300 mb-6">The requested patient could not be found or data is unavailable.</p>
                <CustomButton 
                    variant="secondary"
                    to="/app/doctor/overview" 
                    className="flex items-center mx-auto"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </CustomButton>
            </div>
        </CustomUICard>
      </div>
    );
  }

  // Destructure available fields from patientDetails (PatientProfileDto)
  const {
    name,
    dateOfBirth,
    gender,
    email,
    mobile,
    address,
    // language,
    avatarUrl,
    bloodGroup,
    allergies, // This is Set<String>
    chronicConditions, // This is Set<String>
    insuranceProvider,
    insurancePolicyId,
    insuranceMemberId,
    // profileSetupComplete
  } = patientDetails;

  const sectionTitleClass = "text-lg font-semibold text-slate-700 dark:text-slate-200 mb-3 flex items-center justify-between";
  const mutedTextClass = "text-sm text-slate-500 dark:text-slate-400";
  // const valueTextClass = "text-slate-800 dark:text-slate-100";
  const detailItemClass = "py-1";

  // EHRViewer might expect specific structured data. For now, pass what's available from PatientProfileDto.
  const ehrDemographics = {
    contact: { 
        phone: mobile, 
        email: email, 
        address: address // Add address to contact object for EHRViewer
    }, 
    insurance: { 
        provider: insuranceProvider, 
        policyNumber: insurancePolicyId, // Map insurancePolicyId to policyNumber for EHRViewer
        memberId: insuranceMemberId 
    },
    // emergencyContacts: patientDetails.emergencyContacts, // Still not available from PatientProfileDto
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-slate-100 dark:bg-slate-900 min-h-screen">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
            {avatarUrl ? 
                <img src={avatarUrl} alt={`${name} avatar`} className="w-16 h-16 rounded-full mr-4 border-2 border-slate-300 dark:border-slate-600 shadow-sm"/> :
                <div className="w-16 h-16 rounded-full mr-4 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 text-2xl font-semibold">
                    {name ? name.charAt(0).toUpperCase() : <UserCircleIcon className="w-10 h-10"/>}
                </div>
            }
            <div>
                <CustomButton 
                    variant="link" 
                    to="/app/doctor/overview" 
                    className="flex items-center text-sm text-teal-600 dark:text-teal-400 hover:underline mb-1 p-0"
                >
                    <ArrowLeftIcon className="w-4 h-4 mr-1" />
                    Back to Dashboard
                </CustomButton>
                <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">
                    {name || `Patient: ${patientUuid}`}
                </h1>
                {(dateOfBirth || gender) && <p className={`${mutedTextClass} mt-1`}> {dateOfBirth ? `DOB: ${formatDate(dateOfBirth)}` : ''} {gender ? `(${gender})` : ''} </p>}
            </div>
        </div>
        <div className="flex space-x-2 flex-wrap gap-2 sm:gap-0 mt-4 sm:mt-0">
           <CustomButton variant="outline" size="sm" onClick={handleOpenAddNoteModal} className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                <DocumentPlusIcon className="w-4 h-4 mr-1.5"/> Add Note
            </CustomButton>
            <CustomButton variant="outline" size="sm" onClick={() => handleActionClick('New Prescription')} className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                <PencilIcon className="w-4 h-4 mr-1.5"/> New Rx
            </CustomButton>
            <CustomButton variant="outline" size="sm" onClick={() => handleActionClick('Order Lab')} className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                <BeakerIcon className="w-4 h-4 mr-1.5"/> Order Lab
            </CustomButton>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <EHRViewer 
              demographics={ehrDemographics} 
              onEdit={() => handleActionClick('Edit Demographics')} 
            />

            <CustomUICard className="dark:bg-slate-800 dark:border-slate-700">
                 <div className="p-4 sm:p-6">
                    <h2 className={sectionTitleClass}>Medical Summary</h2>
                    <div className="space-y-3">
                        <div className={detailItemClass}>
                            <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center"><BellAlertIcon className="w-4 h-4 mr-1.5 text-red-500 dark:text-red-400"/> Allergies</h3>
                            {allergies && allergies.size > 0 ? (
                                <ul className={`${mutedTextClass} list-disc list-inside ml-1`}>
                                    {Array.from(allergies).map(allergy => <li key={allergy}>{allergy}</li>)}
                                </ul>
                            ) : <p className={mutedTextClass}>None reported</p>}
                        </div>
                         <div className={detailItemClass}>
                            <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center"><ClipboardDocumentListIcon className="w-4 h-4 mr-1.5 text-purple-500 dark:text-purple-400"/> Chronic Conditions</h3>
                            {chronicConditions && chronicConditions.size > 0 ? (
                                <ul className={`${mutedTextClass} list-disc list-inside ml-1`}>
                                    {Array.from(chronicConditions).map(condition => <li key={condition}>{condition}</li>)}
                                </ul>
                            ) : <p className={mutedTextClass}>None reported</p>}
                        </div>
                        {bloodGroup && 
                            <div className={detailItemClass}>
                                <h3 className="text-md font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center"><HeartIcon className="w-4 h-4 mr-1.5 text-pink-500 dark:text-pink-400"/> Blood Group</h3>
                                <p className={mutedTextClass}>{bloodGroup}</p>
                            </div>
                        }
                         {/* Recent Vitals section removed as it's not in PatientProfileDto */}
                    </div>
                </div>
            </CustomUICard>
        </div>

        <div className="lg:col-span-2 space-y-6">
            {/* Sections for Medications, Clinical Notes, Lab Results will show placeholder if data is not in PatientProfileDto */}
            <CustomUICard className="dark:bg-slate-800 dark:border-slate-700">
                 <div className="p-4 sm:p-6">
                    <h2 className={sectionTitleClass}>
                        <span><UserCircleIcon className="w-5 h-5 mr-2 inline-block text-green-500 dark:text-green-400" /> Medications</span>
                         <CustomButton variant="ghost" size="xs" onClick={() => handleActionClick('New Prescription')} className="dark:text-slate-400 dark:hover:bg-slate-700">+ New Rx</CustomButton>
                    </h2>
                    <p className={mutedTextClass}>Medication data not currently available in this view.</p>
                </div>
            </CustomUICard>

            <CustomUICard className="dark:bg-slate-800 dark:border-slate-700">
                 <div className="p-4 sm:p-6">
                    <h2 className={sectionTitleClass}>
                        <span><DocumentTextIcon className="w-5 h-5 mr-2 inline-block text-yellow-500 dark:text-yellow-400"/> Clinical Notes</span>
                         <CustomButton variant="ghost" size="xs" onClick={handleOpenAddNoteModal} className="dark:text-slate-400 dark:hover:bg-slate-700">+ Add Note</CustomButton>
                    </h2>
                    <p className={mutedTextClass}>Clinical notes not currently available in this view.</p>
                 </div>
            </CustomUICard>

            <CustomUICard className="dark:bg-slate-800 dark:border-slate-700">
                 <div className="p-4 sm:p-6">
                     <h2 className={sectionTitleClass}>
                        <span><BeakerIcon className="w-5 h-5 mr-2 inline-block text-indigo-500 dark:text-indigo-400"/> Lab Results</span>
                        <CustomButton variant="ghost" size="xs" onClick={() => handleActionClick('Order Lab')} className="dark:text-slate-400 dark:hover:bg-slate-700">+ Order Lab</CustomButton>
                    </h2>
                    <p className={mutedTextClass}>Lab results not currently available in this view.</p>
                 </div>
            </CustomUICard>
        </div>
      </div>

      {isAddNoteModalOpen && (
        <Modal title="Add Clinical Note" isOpen={isAddNoteModalOpen} onClose={handleCloseNoteModal} size="lg">
          <AddNoteForm 
            patientName={name || 'this patient'}
            onSave={handleSaveNote} 
            onCancel={handleCloseNoteModal} 
           />
        </Modal>
      )}
    </div>
  );
}

export default DoctorViewPatientProfile; 