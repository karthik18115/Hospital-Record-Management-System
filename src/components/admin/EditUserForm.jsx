import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { ALL_USER_ROLES } from '../../constants';

// Helper to check if a role is a non-patient role requiring extra details
const isNonPatientProfessional = (role) => {
  return role && role !== 'Patient';
};

export default function EditUserForm({ userToEdit, onSave, isLoading, formId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  // New state for additional professional details
  const [workArea, setWorkArea] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [clinics, setClinics] = useState('');
  const [hospitals, setHospitals] = useState('');
  const [locations, setLocations] = useState('');
  const [licenseIds, setLicenseIds] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || '');
      setEmail(userToEdit.email || '');
      setRole(userToEdit.role || ALL_USER_ROLES[0]);
      // Initialize new fields
      setWorkArea(userToEdit.workArea || '');
      setSpecialization(userToEdit.specialization || '');
      setClinics(userToEdit.clinics || '');
      setHospitals(userToEdit.hospitals || '');
      setLocations(userToEdit.locations || '');
      setLicenseIds(userToEdit.licenseIds || '');
    } else {
      // Reset form if no user is being edited
      setName('');
      setEmail('');
      setRole(ALL_USER_ROLES[0]);
      setWorkArea('');
      setSpecialization('');
      setClinics('');
      setHospitals('');
      setLocations('');
      setLicenseIds('');
    }
  }, [userToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!role) newErrors.role = 'Role is required.';
    // Add validation for new fields if necessary
    if (isNonPatientProfessional(role)) {
      if (!workArea.trim()) newErrors.workArea = 'Work area is required.';
      if (!specialization.trim()) newErrors.specialization = 'Specialization is required.';
      // Add more specific validations for clinics, hospitals, locations, licenseIds if needed
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const updatedUserDetails = { 
        ...userToEdit, 
        name, 
        email, 
        role 
      };
      if (isNonPatientProfessional(role)) {
        updatedUserDetails.workArea = workArea;
        updatedUserDetails.specialization = specialization;
        updatedUserDetails.clinics = clinics;
        updatedUserDetails.hospitals = hospitals;
        updatedUserDetails.locations = locations;
        updatedUserDetails.licenseIds = licenseIds;
      }
      onSave(updatedUserDetails);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-slate-700 text-slate-200 border border-slate-600 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500";
  const errorClass = "text-red-400 text-xs mt-1";

  if (!userToEdit) return null; // Or a loading/placeholder state if preferred

  return (
    <form onSubmit={handleSubmit} id={formId} className="space-y-4">
      <div>
        <label htmlFor="editUserName" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
        <input 
          type="text" 
          id="editUserName" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          disabled={isLoading}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="editUserEmail" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
        <input 
          type="email" 
          id="editUserEmail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          disabled={isLoading}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="editUserRole" className="block text-sm font-medium text-slate-300 mb-1">Role</label>
        <select 
          id="editUserRole" 
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={inputClass}
          disabled={isLoading}
        >
          {ALL_USER_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        {errors.role && <p className={errorClass}>{errors.role}</p>}
      </div>
      
      {/* Conditional fields for non-patient professionals */}
      {isNonPatientProfessional(role) && (
        <>
          <hr className="border-slate-600 my-3"/>
          <div><h3 className="text-md font-medium text-slate-400 mb-2">Professional Details</h3></div>
          
          <div>
            <label htmlFor="editUserWorkArea" className="block text-sm font-medium text-slate-300 mb-1">Work Area / Department</label>
            <input 
              type="text" 
              id="editUserWorkArea" 
              value={workArea}
              onChange={(e) => setWorkArea(e.target.value)}
              className={inputClass}
              placeholder="e.g., Cardiology, General Surgery"
              disabled={isLoading}
            />
            {errors.workArea && <p className={errorClass}>{errors.workArea}</p>}
          </div>

          <div>
            <label htmlFor="editUserSpecialization" className="block text-sm font-medium text-slate-300 mb-1">Specialization / Title</label>
            <input 
              type="text" 
              id="editUserSpecialization" 
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className={inputClass}
              placeholder="e.g., Cardiologist, Head Nurse"
              disabled={isLoading}
            />
            {errors.specialization && <p className={errorClass}>{errors.specialization}</p>}
          </div>

          <div>
            <label htmlFor="editUserClinics" className="block text-sm font-medium text-slate-300 mb-1">Affiliated Clinic(s)</label>
            <input 
              type="text" 
              id="editUserClinics" 
              value={clinics}
              onChange={(e) => setClinics(e.target.value)}
              className={inputClass}
              placeholder="e.g., City Clinic, Healthpoint Center (comma-separated)"
              disabled={isLoading}
            />
            {/* Add errors.clinics if validation is added */}
          </div>

          <div>
            <label htmlFor="editUserHospitals" className="block text-sm font-medium text-slate-300 mb-1">Affiliated Hospital(s)</label>
            <input 
              type="text" 
              id="editUserHospitals" 
              value={hospitals}
              onChange={(e) => setHospitals(e.target.value)}
              className={inputClass}
              placeholder="e.g., General Hospital, St. Luke's (comma-separated)"
              disabled={isLoading}
            />
            {/* Add errors.hospitals if validation is added */}
          </div>
          
          <div>
            <label htmlFor="editUserLocations" className="block text-sm font-medium text-slate-300 mb-1">Primary Work Location(s)</label>
            <input 
              type="text" 
              id="editUserLocations" 
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              className={inputClass}
              placeholder="e.g., Main St Office, Downtown Hospital Campus"
              disabled={isLoading}
            />
            {/* Add errors.locations if validation is added */}
          </div>

          <div>
            <label htmlFor="editUserLicenseIds" className="block text-sm font-medium text-slate-300 mb-1">License ID(s)</label>
            <input 
              type="text" 
              id="editUserLicenseIds" 
              value={licenseIds}
              onChange={(e) => setLicenseIds(e.target.value)}
              className={inputClass}
              placeholder="e.g., MD12345, RN67890 (comma-separated)"
              disabled={isLoading}
            />
            {/* Add errors.licenseIds if validation is added */}
          </div>
        </>
      )}

      {/* Add password change fields here if needed, e.g., conditionally */}
      {/* 
      <hr className="border-slate-600 my-3"/>
      <div><h3 className="text-sm font-medium text-slate-400 mb-1">Change Password (Optional)</h3></div>
      // ... password and confirm password fields ... 
      */}

    </form>
  );
} 