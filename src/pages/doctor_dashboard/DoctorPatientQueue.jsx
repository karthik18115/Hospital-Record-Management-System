import React, { useState, useEffect } from 'react';
import PatientDetailPreviewPanel from '../../components/dashboard_shared/PatientDetailPreviewPanel';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CustomButton from '../../components/ui/Button';
import CustomUICard from '../../components/ui/Card';
import { SearchIcon, FilterIcon as ActualFilterIcon, AdjustmentsHorizontalIcon, ChevronDownIcon, EyeIcon } from '../../components/icons';
import { getDoctorQueue } from '../../services/doctorService';

const priorities = ['All', 'Critical', 'Urgent', 'Stable'];
const statuses = ['All', 'Waiting for Triage', 'With Triage Nurse', 'Awaiting MD', 'Treatment in Progress', 'Ready for Discharge'];

const getPriorityStyles = (priority) => {
  switch (priority) {
    case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-700/70 dark:text-red-200';
    case 'Urgent': return 'bg-orange-100 text-orange-800 dark:bg-orange-700/70 dark:text-orange-200';
    case 'Stable': return 'bg-blue-100 text-blue-800 dark:bg-blue-700/70 dark:text-blue-200';
    default: return 'bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-slate-200';
  }
};

function DoctorPatientQueue() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatientForPreview, setSelectedPatientForPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('admissionTime');
  const [sortOrder] = useState('asc');

  useEffect(() => {
    setIsLoading(true);
    getDoctorQueue()
      .then(data => {
        setPatients(data);
        setFilteredPatients(data);
      })
      .catch(err => console.error('Failed to fetch patient queue:', err))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let currentPatients = [...patients];
    if (searchTerm) {
      currentPatients = currentPatients.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.condition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedPriority !== 'All') {
      currentPatients = currentPatients.filter(p => p.priority === selectedPriority);
    }
    if (selectedStatus !== 'All') {
      currentPatients = currentPatients.filter(p => p.status === selectedStatus);
    }

    currentPatients.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'admissionTime') {
        valA = new Date(a.admissionTime).getTime();
        valB = new Date(b.admissionTime).getTime();
      } else if (sortBy === 'priority') {
        const priorityOrder = { 'Critical': 1, 'Urgent': 2, 'Stable': 3 };
        valA = priorityOrder[a.priority] || 99;
        valB = priorityOrder[b.priority] || 99;
      } else if (sortBy === 'waitTime') {
        valA = parseInt(a.waitTime) * (a.waitTime.includes('hr') ? 60 : 1);
        valB = parseInt(b.waitTime) * (b.waitTime.includes('hr') ? 60 : 1);
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    
    setTimeout(() => {
        setFilteredPatients(currentPatients);
        setIsLoading(false);
    }, 300);

  }, [searchTerm, selectedPriority, selectedStatus, sortBy, sortOrder, patients]);

  const handlePatientSelect = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    setSelectedPatientForPreview(patient);
  };

  const closePatientPreview = () => {
    setSelectedPatientForPreview(null);
  };

  const inputClass = "px-3 py-2 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 dark:placeholder-slate-500";
  const selectClass = `${inputClass} appearance-none`;

  return (
    <div className="p-4 md:p-6 space-y-6">
      <header className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-2">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-100">Patient Queue</h1>
      </header>

      <CustomUICard className="dark:bg-slate-800 dark:border-slate-700">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 items-end">
            <div className="relative">
              <label htmlFor="searchPatients" className="sr-only">Search Patients</label>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input 
                type="text" 
                id="searchPatients"
                placeholder="Search by name, ID, condition..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${inputClass} pl-10 w-full`}
              />
            </div>
            <div>
                <label htmlFor="filterPriority" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Priority</label>
                <div className="relative">
                    <select id="filterPriority" value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className={`${selectClass} w-full`}>
                        {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/>
                </div>
            </div>
            <div>
                <label htmlFor="filterStatus" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Status</label>
                <div className="relative">
                    <select id="filterStatus" value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className={`${selectClass} w-full`}>
                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                     <ChevronDownIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/>
                </div>
            </div>
            <div>
                <label htmlFor="sortBy" className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Sort By</label>
                 <div className="relative">
                    <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} className={`${selectClass} w-full`}>
                        <option value="admissionTime">Admission Time</option>
                        <option value="priority">Priority</option>
                        <option value="waitTime">Wait Time</option>
                        <option value="name">Name</option>
                    </select>
                    <ChevronDownIcon className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"/>
                </div>
            </div>
          </div>

          {isLoading ? (
             <div className="text-center py-10">
                <div role="status" className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-teal-500 motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="text-slate-500 dark:text-slate-400 mt-2">Loading patients...</p>
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-10">
              <ActualFilterIcon className="w-16 h-16 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No Patients Found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Try adjusting your search or filter criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                <thead className="text-xs text-slate-700 dark:text-slate-300 uppercase bg-slate-50 dark:bg-slate-700">
                  <tr>
                    <th scope="col" className="px-6 py-3">Patient</th>
                    <th scope="col" className="px-6 py-3">Age/Gender</th>
                    <th scope="col" className="px-6 py-3">Condition</th>
                    <th scope="col" className="px-6 py-3">Priority</th>
                    <th scope="col" className="px-6 py-3">Wait Time</th>
                    <th scope="col" className="px-6 py-3">Current Status</th>
                    <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                        {patient.name}
                        <div className="text-xs text-slate-500 dark:text-slate-400">ID: {patient.id}</div>
                      </td>
                      <td className="px-6 py-4">{patient.age} / {patient.gender.charAt(0)}</td>
                      <td className="px-6 py-4">{patient.condition}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityStyles(patient.priority)}`}>
                          {patient.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">{patient.waitTime}</td>
                      <td className="px-6 py-4 text-xs">{patient.status}</td>
                      <td className="px-6 py-4 text-right">
                        <CustomButton variant="outline" size="xs" onClick={() => handlePatientSelect(patient.id)} className="dark:border-teal-500 dark:text-teal-400 dark:hover:bg-teal-700/50">
                          <EyeIcon className="w-4 h-4 mr-1"/> View
                        </CustomButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CustomUICard>
      
      {selectedPatientForPreview && (
        <PatientDetailPreviewPanel 
          patient={selectedPatientForPreview} 
          onClose={closePatientPreview} 
        />
      )}
    </div>
  );
}

export default DoctorPatientQueue; 