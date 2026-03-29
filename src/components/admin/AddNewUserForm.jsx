import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Assuming Button is in ui directory
import { ALL_USER_ROLES } from '../../constants'; // Import from centralized constants

// ROLES should ideally be passed as a prop or imported from a shared constants file
// For this example, we'll redefine it, but ensure it matches AdminUsersPage.jsx or centralize it.
const ALL_ROLES = ['Patient', 'Doctor', 'Nurse', 'Lab Staff', 'Pharmacist', 'Admin'];

// Helper to check if a role is a non-patient role requiring extra details
const isNonPatientProfessional = (role) => {
  return role && role !== 'Patient';
};

export default function AddNewUserForm({ onSave, isLoading, formId }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState(ALL_USER_ROLES[0]); // Default to the first role
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // New state for additional professional details
  const [workArea, setWorkArea] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [clinics, setClinics] = useState('');
  const [hospitals, setHospitals] = useState('');
  const [locations, setLocations] = useState('');
  const [licenseIds, setLicenseIds] = useState('');
  
  const [errors, setErrors] = useState({});

  // Effect to clear professional fields if role is changed to Patient
  useEffect(() => {
    if (role === 'Patient') {
      setWorkArea('');
      setSpecialization('');
      setClinics('');
      setHospitals('');
      setLocations('');
      setLicenseIds('');
    }
  }, [role]);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required.';
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!role) newErrors.role = 'Role is required.';
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
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
      const newUserDetails = { 
        name, 
        email, 
        role, 
        password 
      };
      if (isNonPatientProfessional(role)) {
        newUserDetails.workArea = workArea;
        newUserDetails.specialization = specialization;
        newUserDetails.clinics = clinics;
        newUserDetails.hospitals = hospitals;
        newUserDetails.locations = locations;
        newUserDetails.licenseIds = licenseIds;
      }
      onSave(newUserDetails);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-slate-700 text-slate-200 border border-slate-600 focus:ring-sky-500 focus:border-sky-500 placeholder-slate-500";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} id={formId} className="space-y-4">
      <div>
        <label htmlFor="userName" className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
        <input 
          type="text" 
          id="userName" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="e.g., Dr. John Doe"
          disabled={isLoading}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="userEmail" className="block text-sm font-medium text-slate-300 mb-1">Email Address</label>
        <input 
          type="email" 
          id="userEmail" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="user@example.com"
          disabled={isLoading}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="userRole" className="block text-sm font-medium text-slate-300 mb-1">Role</label>
        <select 
          id="userRole" 
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
          <div><h3 className="text-md font-medium text-slate-400 mb-2">Professional Details (for Non-Patient Roles)</h3></div>
          
          <div>
            <label htmlFor="addUserWorkArea" className="block text-sm font-medium text-slate-300 mb-1">Work Area / Department</label>
            <input 
              type="text" 
              id="addUserWorkArea" 
              value={workArea}
              onChange={(e) => setWorkArea(e.target.value)}
              className={inputClass}
              placeholder="e.g., Cardiology, General Surgery"
              disabled={isLoading}
            />
            {errors.workArea && <p className={errorClass}>{errors.workArea}</p>}
          </div>

          <div>
            <label htmlFor="addUserSpecialization" className="block text-sm font-medium text-slate-300 mb-1">Specialization / Title</label>
            <input 
              type="text" 
              id="addUserSpecialization" 
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className={inputClass}
              placeholder="e.g., Cardiologist, Head Nurse"
              disabled={isLoading}
            />
            {errors.specialization && <p className={errorClass}>{errors.specialization}</p>}
          </div>

          <div>
            <label htmlFor="addUserClinics" className="block text-sm font-medium text-slate-300 mb-1">Affiliated Clinic(s)</label>
            <input 
              type="text" 
              id="addUserClinics" 
              value={clinics}
              onChange={(e) => setClinics(e.target.value)}
              className={inputClass}
              placeholder="e.g., City Clinic (comma-separated)"
              disabled={isLoading}
            />
            {/* Add errors.clinics if validation is added */}
          </div>

          <div>
            <label htmlFor="addUserHospitals" className="block text-sm font-medium text-slate-300 mb-1">Affiliated Hospital(s)</label>
            <input 
              type="text" 
              id="addUserHospitals" 
              value={hospitals}
              onChange={(e) => setHospitals(e.target.value)}
              className={inputClass}
              placeholder="e.g., General Hospital (comma-separated)"
              disabled={isLoading}
            />
            {/* Add errors.hospitals if validation is added */}
          </div>
          
          <div>
            <label htmlFor="addUserLocations" className="block text-sm font-medium text-slate-300 mb-1">Primary Work Location(s)</label>
            <input 
              type="text" 
              id="addUserLocations" 
              value={locations}
              onChange={(e) => setLocations(e.target.value)}
              className={inputClass}
              placeholder="e.g., Main St Office"
              disabled={isLoading}
            />
            {/* Add errors.locations if validation is added */}
          </div>

          <div>
            <label htmlFor="addUserLicenseIds" className="block text-sm font-medium text-slate-300 mb-1">License ID(s)</label>
            <input 
              type="text" 
              id="addUserLicenseIds" 
              value={licenseIds}
              onChange={(e) => setLicenseIds(e.target.value)}
              className={inputClass}
              placeholder="e.g., MD12345 (comma-separated)"
              disabled={isLoading}
            />
            {/* Add errors.licenseIds if validation is added */}
          </div>
        </>
      )}

      <div>
        <label htmlFor="userPassword" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
        <input 
          type="password" 
          id="userPassword" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
          placeholder="Min. 8 characters"
          disabled={isLoading}
        />
        {errors.password && <p className={errorClass}>{errors.password}</p>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1">Confirm Password</label>
        <input 
          type="password" 
          id="confirmPassword" 
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
          placeholder="Re-enter password"
          disabled={isLoading}
        />
        {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword}</p>}
      </div>

      {/* Footer is handled by the Modal component prop */}
      {/* This form will be rendered as children of Modal */}
      {/* The onSave and onCancel will be passed to Modal's footerContent */}
    </form>
  );
} 