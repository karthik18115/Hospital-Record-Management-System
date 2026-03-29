import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/useAuth';
import EmergencyContactDisplay from '../../components/dashboard_shared/EmergencyContactDisplay';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import EditPersonalInfoForm from '../../components/patient_profile/EditPersonalInfoForm';
import EditMedicalInfoForm from '../../components/patient_profile/EditMedicalInfoForm';
import EditInsuranceForm from '../../components/patient_profile/EditInsuranceForm';
import EditEmergencyContactsForm from '../../components/patient_profile/EditEmergencyContactsForm';
import { CogIcon } from '../../components/icons';
import { toast } from 'react-toastify';

export default function PatientProfile() {
  const { getToken } = useAuth();
  const [userProfile, setUserProfile] = useState({
    avatarUrl: '',
    fullName: "",
    email: "",
    dateOfBirth: null,
    phoneNumber: "",
    address: "",
    bloodGroup: "",
    allergies: [],
    chronicConditions: [],
    insurance: { 
        provider: "", 
        policyId: "", 
        maskedPolicyId: "",
        memberId: "" 
    },
    profileSetupComplete: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [emergencyContacts, setEmergencyContacts] = useState([]);

  const [isPersonalInfoModalOpen, setIsPersonalInfoModalOpen] = useState(false);
  const [isMedicalInfoModalOpen, setIsMedicalInfoModalOpen] = useState(false);
  const [isInsuranceModalOpen, setIsInsuranceModalOpen] = useState(false);
  const [isEmergencyContactsModalOpen, setIsEmergencyContactsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const personalInfoFormRef = useRef(null);
  const medicalInfoFormRef = useRef(null);
  const insuranceFormRef = useRef(null);
  const emergencyContactsFormRef = useRef(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = getToken();
      if (!token) {
        setError('Not authenticated');
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/patients/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch profile data: ${response.statusText}`);
        }
        const data = await response.json();
        setUserProfile({
          avatarUrl: data.avatarUrl || '',
          fullName: data.name || '',
          email: data.email || '',
          dateOfBirth: data.dateOfBirth,
          phoneNumber: data.mobile || '',
          address: data.address || '',
          bloodGroup: data.bloodGroup || '',
          allergies: data.allergies || [],
          chronicConditions: data.chronicConditions || [],
          insurance: {
            provider: data.insuranceProvider || '',
            policyId: data.insurancePolicyId || '',
            maskedPolicyId: data.insurancePolicyId ? `********${data.insurancePolicyId.slice(-4)}` : '',
            memberId: data.insuranceMemberId || ''
          },
          profileSetupComplete: data.profileSetupComplete || false
        });
      } catch (err) {
        setError(err.message);
        toast.error(`Error fetching profile: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [getToken]);

  const renderDetailItem = (label, value) => (
    <div key={label} className="grid grid-cols-3 gap-2 py-2 border-b border-slate-200 last:border-b-0">
      <dt className="col-span-1 font-semibold text-slate-600 tracking-wide">{label}</dt>
      <dd className="col-span-2 text-slate-800">{value instanceof Function ? value() : value}</dd>
    </div>
  );
  
  const openPersonalInfoModal = () => setIsPersonalInfoModalOpen(true);
  const closePersonalInfoModal = () => setIsPersonalInfoModalOpen(false);
  const handleSavePersonalInfo = async (formData) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication session expired. Please log in again.');
      return;
    }
    setIsProcessing(true);
    try {
      const response = await fetch('/api/patients/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
        throw new Error(errorData.message || `Failed to save personal info: ${response.statusText}`);
      }
      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      toast.success('Personal information updated successfully!');
      closePersonalInfoModal();
    } catch (err) {
      toast.error(`Error saving personal info: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const openMedicalInfoModal = () => setIsMedicalInfoModalOpen(true);
  const closeMedicalInfoModal = () => setIsMedicalInfoModalOpen(false);
  const handleSaveMedicalInfo = async (formData) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication session expired. Please log in again.');
      return;
    }
    setIsProcessing(true);
    try {
      const payload = {
        ...userProfile,
        bloodGroup: formData.bloodGroup,
        allergies: formData.allergies.map(a => typeof a === 'string' ? a : a.name),
        chronicConditions: formData.chronicConditions.map(c => typeof c === 'string' ? c : c.name),
      };
      const response = await fetch('/api/patients/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to save medical info');
      }
      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      toast.success('Medical information updated successfully!');
      closeMedicalInfoModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const openInsuranceModal = () => setIsInsuranceModalOpen(true);
  const closeInsuranceModal = () => setIsInsuranceModalOpen(false);
  const handleSaveInsuranceInfo = async (formData) => {
    const token = getToken();
    if (!token) {
      toast.error('Authentication session expired. Please log in again.');
      return;
    }
    setIsProcessing(true);
    try {
      const payload = {
        ...userProfile,
        insuranceProvider: formData.provider,
        insurancePolicyId: formData.policyId,
        insuranceMemberId: formData.memberId,
      };
      const response = await fetch('/api/patients/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error('Failed to save insurance info');
      }
      const updatedProfile = await response.json();
      setUserProfile(updatedProfile);
      toast.success('Insurance details updated successfully!');
      closeInsuranceModal();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const openEmergencyContactsModal = () => setIsEmergencyContactsModalOpen(true);
  const closeEmergencyContactsModal = () => setIsEmergencyContactsModalOpen(false);
  const handleSaveEmergencyContacts = (updatedContacts) => {
    console.log("Saving Emergency Contacts (Mock):", updatedContacts);
    setIsProcessing(true);
    setTimeout(() => {
      setEmergencyContacts(updatedContacts);
      setIsProcessing(false);
      closeEmergencyContactsModal();
      toast.success('Emergency contacts updated (mock save)!');
    }, 1000);
  };

  if (isLoading) {
    return <div className="p-6 text-center text-slate-600">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div className="flex items-center mb-4 sm:mb-0">
            <img src={userProfile.avatarUrl} alt={`${userProfile.fullName} avatar`} className="w-20 h-20 rounded-full mr-6 border-2 border-slate-300 shadow-sm"/>
            <div>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-800">My Profile</h1>
                <p className="text-lg text-slate-600 mt-1">View and manage your personal, medical, and insurance information.</p>
            </div>
        </div>
        <Button variant="primary" onClick={openPersonalInfoModal} className="mt-4 sm:mt-0 flex items-center space-x-2">
          <CogIcon className="w-5 h-5" />
          <span>Edit Full Profile</span>
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Personal Information Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-700 tracking-wide">Personal Information</h2>
            <Button variant="secondary" size="sm" onClick={openPersonalInfoModal} className="flex items-center space-x-1">
              <CogIcon className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </div>
          <dl className="space-y-1">
            {renderDetailItem("Full Name", userProfile.fullName)}
            {renderDetailItem("Date of Birth", userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth).toLocaleDateString() : 'N/A')}
            {renderDetailItem("Email Address", userProfile.email)}
            {renderDetailItem("Phone Number", userProfile.phoneNumber)}
            {renderDetailItem("Address", userProfile.address)}
          </dl>
        </Card>

        {/* Medical Information Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-700 tracking-wide">Medical Information</h2>
            <Button variant="secondary" size="sm" onClick={openMedicalInfoModal} className="flex items-center space-x-1">
              <CogIcon className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </div>
          <dl className="space-y-1 mb-4">
            {renderDetailItem("Blood Group", userProfile.bloodGroup || "N/A")}
          </dl>
          
          <h3 className="text-lg font-semibold text-slate-700 mb-2">Allergies</h3>
          {userProfile.allergies && userProfile.allergies.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {userProfile.allergies.map((a, index) => (
                <li key={`allergy-${index}`} className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-sm bg-blue-100 text-blue-700 border border-blue-200`}>{typeof a === 'string' ? a : a.name} {typeof a !== 'string' && a.severity ? `(${a.severity})` : ''}</li>
              ))}
            </ul>
          ) : <p className="text-slate-500">No allergies listed.</p>}

          <h3 className="text-lg font-semibold text-slate-700 mt-6 mb-2">Chronic Conditions</h3>
          {userProfile.chronicConditions && userProfile.chronicConditions.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {userProfile.chronicConditions.map((c, index) => (
                <li key={`condition-${index}`} className={`px-3 py-1.5 rounded-full text-xs font-medium bg-slate-200 text-slate-700 border border-slate-300 shadow-sm`}>{typeof c === 'string' ? c : c.name}</li>
              ))}
            </ul>
          ) : <p className="text-slate-500">No chronic conditions listed.</p>}
        </Card>

        {/* Insurance Details Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-700 tracking-wide">Insurance Details</h2>
            <Button variant="secondary" size="sm" onClick={openInsuranceModal} className="flex items-center space-x-1">
              <CogIcon className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </div>
          <dl className="space-y-1">
            {renderDetailItem("Provider", userProfile.insurance?.provider || 'N/A')}
            {renderDetailItem("Policy ID", 
              () => (
                <span className="flex items-center">
                  {userProfile.insurance?.maskedPolicyId || 'N/A'}
                  {userProfile.insurance?.policyId && 
                    <Button variant="outline" size="xs" className="ml-2 text-xs !p-1" onClick={() => alert('Toggle visibility NI')}>(Show)</Button>
                  }
                </span>
              )
            )}
            {renderDetailItem("Member ID", userProfile.insurance?.memberId || 'N/A')}
          </dl>
        </Card>

        {/* Emergency Contacts Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-700 tracking-wide">Emergency Contacts</h2>
            <Button variant="secondary" size="sm" onClick={openEmergencyContactsModal} className="flex items-center space-x-1">
              <CogIcon className="w-4 h-4" />
              <span>Edit</span>
            </Button>
          </div>
          <EmergencyContactDisplay contacts={emergencyContacts} />
        </Card>
      </div>

      {/* Modals ... ensure these are outside the grid but inside the main div */}
      <Modal 
        isOpen={isPersonalInfoModalOpen} 
        onClose={closePersonalInfoModal} 
        title="Edit Personal Information"
        footerContent={(
          <>
            <Button variant="outline" onClick={closePersonalInfoModal} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="edit-personal-info-form" 
              variant="primary" 
              isLoading={isProcessing} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      >
        <EditPersonalInfoForm 
            initialData={userProfile} 
            onSave={handleSavePersonalInfo} 
            onCancel={closePersonalInfoModal} 
            isLoading={isProcessing} 
            formId="edit-personal-info-form"
            ref={personalInfoFormRef}
        />
      </Modal>

      <Modal 
        isOpen={isMedicalInfoModalOpen} 
        onClose={closeMedicalInfoModal} 
        title="Edit Medical Information"
        footerContent={(
          <>
            <Button variant="outline" onClick={closeMedicalInfoModal} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="edit-medical-info-form" 
              variant="primary" 
              isLoading={isProcessing} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      >
        <EditMedicalInfoForm 
            initialData={userProfile} // Pass relevant parts for medical info
            onSave={handleSaveMedicalInfo} 
            onCancel={closeMedicalInfoModal} 
            isLoading={isProcessing} 
            formId="edit-medical-info-form"
            ref={medicalInfoFormRef}
        />
      </Modal>

      <Modal 
        isOpen={isInsuranceModalOpen} 
        onClose={closeInsuranceModal} 
        title="Edit Insurance Information"
        footerContent={(
          <>
            <Button variant="outline" onClick={closeInsuranceModal} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="edit-insurance-form" 
              variant="primary" 
              isLoading={isProcessing} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      >
        <EditInsuranceForm 
            initialData={userProfile.insurance} // Pass insurance object
            onSave={handleSaveInsuranceInfo} 
            onCancel={closeInsuranceModal} 
            isLoading={isProcessing} 
            formId="edit-insurance-form"
            ref={insuranceFormRef}
        />
      </Modal>

      <Modal 
        isOpen={isEmergencyContactsModalOpen} 
        onClose={closeEmergencyContactsModal} 
        title="Edit Emergency Contacts"
        footerContent={(
          <>
            <Button variant="outline" onClick={closeEmergencyContactsModal} disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="edit-emergency-contacts-form" 
              variant="primary" 
              isLoading={isProcessing} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Saving...' : 'Save Changes'}
            </Button>
          </>
        )}
      >
        <EditEmergencyContactsForm 
            initialContacts={emergencyContacts} 
            onSave={handleSaveEmergencyContacts} 
            onCancel={closeEmergencyContactsModal} 
            isLoading={isProcessing} 
            formId="edit-emergency-contacts-form"
            ref={emergencyContactsFormRef}
        />
      </Modal>
    </div>
  );
}
