import React, { useState, useEffect } from 'react';
import Button from '../ui/Button'; // Adjust path as needed

const GENDER_OPTIONS = [
  { value: '', label: 'Select Gender' },
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
  { value: 'PREFER_NOT_TO_SAY', label: 'Prefer not to say' },
];

const LANGUAGE_OPTIONS = [
  { value: '', label: 'Select Language' },
  { value: 'EN', label: 'English' },
  { value: 'ES', label: 'Español' },
  // Add more languages as needed
];

export default function EditPersonalInfoForm({ initialData, onSave, isLoading, formId }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '', // Expects YYYY-MM-DD
    email: '', // Usually not editable or handled with care
    phoneNumber: '',
    address: '',
    gender: '',
    language: '',
    avatarUrl: '' // Simple text input for URL for now
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        // Ensure dateOfBirth is in YYYY-MM-DD string format for input type='date'
        dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth).toISOString().split('T')[0] : '',
        email: initialData.email || '', // Display email, but it won't be updated by current backend logic
        phoneNumber: initialData.phoneNumber || initialData.mobile || '', // patientProfile has phoneNumber, backend User has mobile
        address: initialData.address || '',
        gender: initialData.gender || '',
        language: initialData.language || '',
        avatarUrl: initialData.avatarUrl || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required.';
    // Email validation (though it is not updated by backend)
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid.';
    }
    if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = 'Date of birth is required.';
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
        newErrors.dateOfBirth = 'Date of birth must be YYYY-MM-DD.';
    }
    // Add other validations if necessary
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare data for saving - map field names if frontend and backend differ for some fields
      const dataToSave = {
        name: formData.fullName, // Backend expects 'name' for fullName
        dateOfBirth: formData.dateOfBirth,
        // email: formData.email, // Not sending email as backend doesn't update it
        mobile: formData.phoneNumber, // Backend expects 'mobile' for phoneNumber
        address: formData.address,
        gender: formData.gender,
        language: formData.language,
        avatarUrl: formData.avatarUrl
      };
      onSave(dataToSave);
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-slate-50 text-slate-700 border border-slate-300 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 disabled:bg-slate-200 disabled:text-slate-500";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-600 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} id={formId} className="space-y-4">
      <div>
        <label htmlFor="fullName" className={labelClass}>Full Name</label>
        <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} disabled={isLoading} />
        {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
      </div>
      <div>
        <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth</label>
        <input type="date" name="dateOfBirth" id="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass} disabled={isLoading} />
        {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth}</p>}
      </div>
      <div>
        <label htmlFor="email" className={labelClass}>Email Address (Read-only)</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={inputClass} disabled={true} />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="phoneNumber" className={labelClass}>Phone Number</label>
        <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className={inputClass} disabled={isLoading} />
      </div>
      <div>
        <label htmlFor="address" className={labelClass}>Address</label>
        <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} className={inputClass} disabled={isLoading} />
      </div>
      <div>
        <label htmlFor="gender" className={labelClass}>Gender</label>
        <select name="gender" id="gender" value={formData.gender} onChange={handleChange} className={inputClass} disabled={isLoading}>
          {GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="language" className={labelClass}>Preferred Language</label>
        <select name="language" id="language" value={formData.language} onChange={handleChange} className={inputClass} disabled={isLoading}>
          {LANGUAGE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="avatarUrl" className={labelClass}>Avatar URL</label>
        <input type="url" name="avatarUrl" id="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className={inputClass} placeholder="https://example.com/avatar.jpg" disabled={isLoading} />
      </div>
    </form>
  );
} 