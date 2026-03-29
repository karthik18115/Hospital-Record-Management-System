import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { XIcon, PlusIcon } from '../icons'; // Assuming PlusIcon exists or can be added

const ALLERGY_SEVERITIES = ['Mild', 'Medium', 'High', 'Unknown'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];

export default function EditMedicalInfoForm({ initialData, onSave, isLoading, formId }) {
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState([]); // Will store { id: string, name: string, severity: string }
  const [chronicConditions, setChronicConditions] = useState([]); // Will store { id: string, name: string }
  
  const [newAllergyName, setNewAllergyName] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState(ALLERGY_SEVERITIES[0]);
  const [newConditionName, setNewConditionName] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setBloodGroup(initialData.bloodGroup || BLOOD_GROUPS[BLOOD_GROUPS.length -1]);
      // Backend sends Set<String> for allergies and chronicConditions.
      // Form internally uses objects for list keys and additional info like severity.
      setAllergies(initialData.allergies?.map((name, index) => ({ 
        id: `initial_a_${index}_${Date.now()}`,
        name,
        severity: 'Unknown' // Default severity, as backend only stores names
      })) || []);
      setChronicConditions(initialData.chronicConditions?.map((name, index) => ({ 
        id: `initial_c_${index}_${Date.now()}`,
        name 
      })) || []);
    }
  }, [initialData]);

  const validateForm = () => {
    const newErrors = {};
    if (!bloodGroup) newErrors.bloodGroup = 'Blood group is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Extract just the names for saving, as backend expects Set<String>
      const allergiesToSave = allergies.map(a => a.name);
      const conditionsToSave = chronicConditions.map(c => c.name);
      onSave({ 
        bloodGroup, 
        allergies: allergiesToSave, 
        chronicConditions: conditionsToSave 
      });
    }
  };

  // Allergy Handlers
  const handleAddAllergy = () => {
    if (newAllergyName.trim() === '') {
      setErrors(prev => ({...prev, newAllergy: 'Allergy name cannot be empty.'}));
      return;
    }
    // Use a more robust ID if these items were to be individually editable later from backend
    setAllergies([...allergies, { id: `form_a_${Date.now()}_${Math.random()}`.replace('.',''), name: newAllergyName, severity: newAllergySeverity }]);
    setNewAllergyName('');
    setNewAllergySeverity(ALLERGY_SEVERITIES[0]);
    setErrors(prev => ({...prev, newAllergy: null}));
  };
  const handleRemoveAllergy = (idToRemove) => {
    setAllergies(allergies.filter(a => a.id !== idToRemove));
  };

  // Condition Handlers
  const handleAddCondition = () => {
    if (newConditionName.trim() === '') {
        setErrors(prev => ({...prev, newCondition: 'Condition name cannot be empty.'}));
        return;
    }
    setChronicConditions([...chronicConditions, { id: `form_c_${Date.now()}_${Math.random()}`.replace('.',''), name: newConditionName }]);
    setNewConditionName('');
    setErrors(prev => ({...prev, newCondition: null}));
  };
  const handleRemoveCondition = (idToRemove) => {
    // Ensure correct state name if it was 'conditions' previously
    setChronicConditions(prevConditions => prevConditions.filter(c => c.id !== idToRemove)); 
  };

  const inputClass = "w-full px-3 py-2 rounded-md bg-slate-50 text-slate-700 border border-slate-300 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400";
  const listInputClass = "flex-grow px-3 py-1.5 rounded-md bg-slate-50 text-slate-700 border border-slate-300 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 text-sm";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const errorClass = "text-red-600 text-xs mt-1";
  const subHeaderClass = "text-md font-semibold text-slate-700 mb-2 mt-4";

  return (
    <form onSubmit={handleSubmit} id={formId} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div>
        <label htmlFor="bloodGroup" className={labelClass}>Blood Group</label>
        <select 
            name="bloodGroup" 
            id="bloodGroup" 
            value={bloodGroup} 
            onChange={(e) => setBloodGroup(e.target.value)} 
            className={inputClass}
            disabled={isLoading}
        >
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
        </select>
        {errors.bloodGroup && <p className={errorClass}>{errors.bloodGroup}</p>}
      </div>

      <hr className="my-3 border-slate-200"/>
      
      {/* Allergies Section */}
      <div>
        <h3 className={subHeaderClass}>Allergies</h3>
        {allergies.length > 0 && (
          <ul className="space-y-2 mb-3">
            {allergies.map((allergy) => (
              <li key={allergy.id} className="flex items-center justify-between p-2 bg-slate-100 rounded-md border border-slate-200">
                <span className="text-sm text-slate-700">{allergy.name} <span className="text-xs text-slate-500">({allergy.severity})</span></span>
                <Button type="button" onClick={() => handleRemoveAllergy(allergy.id)} variant="danger-outline" size="xs" className="!p-1">
                  <XIcon className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-start gap-2">
          <input 
            type="text" 
            placeholder="Allergy Name" 
            value={newAllergyName} 
            onChange={(e) => setNewAllergyName(e.target.value)} 
            className={listInputClass}
            disabled={isLoading}
          />
          <select 
            value={newAllergySeverity} 
            onChange={(e) => setNewAllergySeverity(e.target.value)} 
            className={`${listInputClass} w-auto`}
            disabled={isLoading}
          >
            {ALLERGY_SEVERITIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <Button type="button" onClick={handleAddAllergy} variant="secondary" size="sm" className="!px-3 !py-1.5 whitespace-nowrap" disabled={isLoading}>Add Allergy</Button>
        </div>
        {errors.newAllergy && <p className={errorClass}>{errors.newAllergy}</p>}
      </div>

      <hr className="my-3 border-slate-200"/>

      {/* Chronic Conditions Section */}
      <div>
        <h3 className={subHeaderClass}>Chronic Conditions</h3>
        {chronicConditions.length > 0 && (
          <ul className="space-y-2 mb-3">
            {chronicConditions.map((condition) => (
              <li key={condition.id} className="flex items-center justify-between p-2 bg-slate-100 rounded-md border border-slate-200">
                <span className="text-sm text-slate-700">{condition.name}</span>
                <Button type="button" onClick={() => handleRemoveCondition(condition.id)} variant="danger-outline" size="xs" className="!p-1">
                  <XIcon className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-start gap-2">
          <input 
            type="text" 
            placeholder="Condition Name" 
            value={newConditionName} 
            onChange={(e) => setNewConditionName(e.target.value)} 
            className={listInputClass}
            disabled={isLoading}
          />
          <Button type="button" onClick={handleAddCondition} variant="secondary" size="sm" className="!px-3 !py-1.5 whitespace-nowrap" disabled={isLoading}>Add Condition</Button>
        </div>
        {errors.newCondition && <p className={errorClass}>{errors.newCondition}</p>}
      </div>
    </form>
  );
} 