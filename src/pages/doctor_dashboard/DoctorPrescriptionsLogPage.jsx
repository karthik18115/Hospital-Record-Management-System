import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
// import './DoctorPrescriptionsLogPage.css'; // Remove custom CSS if switching to Tailwind fully
import { getDoctorPrescriptionsLog, updatePrescription } from '../../services/doctorService'; // API service functions
import CustomUICard from '../../components/ui/Card';
import CustomButton from '../../components/ui/Button';
import { DocumentTextIcon, PencilIcon, CheckIcon, XIcon } from '../../components/icons'; // Icons
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import AddPrescriptionModal from '../../components/doctor/AddPrescriptionModal'; // Import the modal

function DoctorPrescriptionsLogPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // State for the modal

  const fetchPrescriptions = () => {
    setIsLoading(true);
    getDoctorPrescriptionsLog()
      .then(data => {
        setPrescriptions(data || []);
        setError(null);
      })
      .catch(err => {
        console.error("Failed to fetch prescriptions:", err);
        setError("Failed to load prescriptions. Please try again.");
        toast.error("Failed to load prescriptions.");
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const startEditing = (prescription) => {
    setEditingId(prescription.id);
    setEditValues({ ...prescription });
  };

  const handleEditChange = (e, field) => {
    setEditValues({ ...editValues, [field]: e.target.value });
  };

  const saveEdit = async () => {
    if (!editingId || !editValues) return;
    // Basic validation (can be expanded)
    if (!editValues.medication || !editValues.dosage) {
        toast.error("Medication and Dosage are required.");
        return;
    }

    try {
      const updatedPrescription = await updatePrescription(editingId, editValues);
      setPrescriptions(prev => 
        prev.map(p => (p.id === editingId ? { ...p, ...updatedPrescription } : p))
      );
      setEditingId(null);
      setEditValues({});
      toast.success('Prescription updated successfully!');
    } catch (err) {
      console.error("Failed to update prescription:", err);
      toast.error("Failed to update prescription. Please try again.");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // Ensure date is treated as UTC to avoid timezone issues if backend stores as LocalDate
    const date = new Date(dateString);
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()).toLocaleDateString();
  };

  const handleAddNewPrescription = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveNewPrescription = async () => {
    try {
      toast.success('Prescription added successfully!');
      setIsAddModalOpen(false);
      // Refresh list or optimistically add
      // For simplicity, re-fetching the list ensures data consistency
      fetchPrescriptions(); 
      // // Optimistic update example:
      // setPrescriptions(prev => [{
      //   ...newPrescription, 
      //   id: newPrescription.uuid, // Assuming backend returns uuid as id or a new uuid
      //   patientName: patients.find(p => p.uuid === prescriptionData.patientUuid)?.fullName || 'N/A' // Need patient name
      // }, ...prev]);
    } catch (err) {
      console.error("Failed to add prescription:", err);
      toast.error(err.response?.data?.message || err.message || 'Failed to add prescription. Please try again.');
      // Do not close modal on error, so user can retry or correct
    }
  };

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  const inputClass = "mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 shadow-sm focus:border-teal-500 focus:ring-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 py-2 px-3 text-sm";
  const labelClass = "block text-xs font-medium text-slate-600 dark:text-slate-300 mb-0.5";

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2 gap-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">Prescriptions Log</h1>
        <CustomButton onClick={handleAddNewPrescription} className="w-full sm:w-auto">
          <DocumentTextIcon className="w-5 h-5 mr-2" /> Add New Prescription
        </CustomButton>
      </div>

      {/* Add Search/Filter bar here if needed */}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
                <CustomUICard key={i} className="dark:bg-slate-800">
                    <div className="p-4 space-y-3">
                        <Skeleton height={20} width="60%" />
                        <Skeleton height={15} width="40%" />
                        <Skeleton count={3} />
                        <div className="flex justify-end space-x-2 mt-3">
                            <Skeleton width={70} height={30} />
                        </div>
                    </div>
                </CustomUICard>
            ))}
        </div>
      ) : prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prescriptions.map(prescription => (
            <CustomUICard key={prescription.id} className="dark:bg-slate-800 dark:border-slate-700 flex flex-col">
              <div className="p-4 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-teal-600 dark:text-teal-400">{editingId === prescription.id ? editValues.patientName : prescription.patientName}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                    {formatDate(editingId === prescription.id ? editValues.prescriptionDate : prescription.prescriptionDate)}
                  </span>
                </div>
                
                {editingId === prescription.id ? (
                  <div className="space-y-3">
                    <div>
                      <label htmlFor={`medication-${prescription.id}`} className={labelClass}>Medication:</label>
                      <input id={`medication-${prescription.id}`} type="text" value={editValues.medication || ''} onChange={(e) => handleEditChange(e, 'medication')} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor={`dosage-${prescription.id}`} className={labelClass}>Dosage:</label>
                      <input id={`dosage-${prescription.id}`} type="text" value={editValues.dosage || ''} onChange={(e) => handleEditChange(e, 'dosage')} className={inputClass} />
                    </div>
                    <div>
                      <label htmlFor={`notes-${prescription.id}`} className={labelClass}>Notes:</label>
                      <textarea id={`notes-${prescription.id}`} value={editValues.notes || ''} onChange={(e) => handleEditChange(e, 'notes')} rows="3" className={inputClass} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    <p><strong className="font-medium text-slate-700 dark:text-slate-200">Medication:</strong> {prescription.medication}</p>
                    <p><strong className="font-medium text-slate-700 dark:text-slate-200">Dosage:</strong> {prescription.dosage}</p>
                    <p><strong className="font-medium text-slate-700 dark:text-slate-200">Notes:</strong> {prescription.notes || 'N/A'}</p>
                  </div>
                )}
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-2">
                {editingId === prescription.id ? (
                  <>
                    <CustomButton variant="ghost_success" size="sm" onClick={saveEdit}><CheckIcon className="w-4 h-4 mr-1" />Save</CustomButton>
                    <CustomButton variant="ghost_danger" size="sm" onClick={cancelEdit}><XIcon className="w-4 h-4 mr-1" />Cancel</CustomButton>
                  </>
                ) : (
                  <CustomButton variant="outline" size="sm" onClick={() => startEditing(prescription)}><PencilIcon className="w-4 h-4 mr-1" />Edit</CustomButton>
                )}
              </div>
            </CustomUICard>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
            <DocumentTextIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No Prescriptions Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">There are no prescriptions logged yet.</p>
        </div>
      )}

      <AddPrescriptionModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSavePrescription={handleSaveNewPrescription}
      />
    </div>
  );
}

export default DoctorPrescriptionsLogPage; 