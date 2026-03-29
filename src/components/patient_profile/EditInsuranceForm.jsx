import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';

export default function EditInsuranceForm({ initialData, onSave, isLoading, formId }) {
  const [formData, setFormData] = useState({
    provider: '',
    policyId: '',
    memberId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        provider: initialData.provider || '',
        policyId: initialData.policyId || '', // In a real app, consider how to handle visibility/editing of full ID
        memberId: initialData.memberId || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.provider.trim()) newErrors.provider = 'Insurance provider is required.';
    if (!formData.policyId.trim()) newErrors.policyId = 'Policy ID is required.';
    if (!formData.memberId.trim()) newErrors.memberId = 'Member ID is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Pass only the core editable fields. Masking is a display concern.
      onSave({ 
        provider: formData.provider,
        policyId: formData.policyId,
        memberId: formData.memberId
      });
    }
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-slate-50 text-slate-700 border border-slate-300 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-600 text-xs mt-1";

  return (
    <form onSubmit={handleSubmit} id={formId} className="space-y-4">
      <div>
        <label htmlFor="provider" className={labelClass}>Insurance Provider</label>
        <input 
          type="text" 
          name="provider"
          id="provider" 
          value={formData.provider}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g., HealthFirst Plus"
          disabled={isLoading}
        />
        {errors.provider && <p className={errorClass}>{errors.provider}</p>}
      </div>
      <div>
        <label htmlFor="policyId" className={labelClass}>Policy ID</label>
        <input 
          type="text" 
          name="policyId"
          id="policyId" 
          value={formData.policyId} 
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g., HF123456789"
          disabled={isLoading}
        />
        {errors.policyId && <p className={errorClass}>{errors.policyId}</p>}
      </div>
      <div>
        <label htmlFor="memberId" className={labelClass}>Member ID</label>
        <input 
          type="text" 
          name="memberId"
          id="memberId" 
          value={formData.memberId}
          onChange={handleChange}
          className={inputClass}
          placeholder="e.g., MEMBERIDXYZ"
          disabled={isLoading}
        />
        {errors.memberId && <p className={errorClass}>{errors.memberId}</p>}
      </div>
    </form>
  );
} 