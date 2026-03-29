import React, { useState, useEffect } from 'react';
import DataTable from '../../components/DataTable';
import './styles/DoctorLabResultsPage.css';

// Sample lab results data - in a real app, this would come from an API
const labResults = [
  { id: 1, patientName: 'John Doe', testType: 'Blood Test', date: '2023-05-15', status: 'Normal', details: 'All values within normal range.' },
  { id: 2, patientName: 'Jane Smith', testType: 'Urine Analysis', date: '2023-05-10', status: 'Urgent', details: 'Elevated protein levels, requires immediate attention.' },
  { id: 3, patientName: 'Mike Johnson', testType: 'Cholesterol Panel', date: '2023-05-05', status: 'Abnormal', details: 'High LDL cholesterol, follow-up required.' },
  { id: 4, patientName: 'Sarah Williams', testType: 'Blood Glucose', date: '2023-04-28', status: 'Normal', details: 'Blood sugar levels within target range.' },
  { id: 5, patientName: 'Tom Brown', testType: 'Thyroid Function', date: '2023-04-20', status: 'Abnormal', details: 'TSH levels indicate hypothyroidism.' },
  { id: 6, patientName: 'Lisa Davis', testType: 'Complete Blood Count', date: '2023-04-15', status: 'Urgent', details: 'Low hemoglobin, possible anemia, urgent follow-up needed.' }
];

function DoctorLabResultsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [patientFilter, setPatientFilter] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);

  // Unique values for filters
  const patients = [...new Set(labResults.map(result => result.patientName))];
  const testTypes = [...new Set(labResults.map(result => result.testType))];

  useEffect(() => {
    let results = [...labResults];
    if (searchTerm) {
      results = results.filter(result => 
        result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        result.testType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (dateFilter) {
      results = results.filter(result => result.date === dateFilter);
    }
    if (patientFilter) {
      results = results.filter(result => result.patientName === patientFilter);
    }
    if (testTypeFilter) {
      results = results.filter(result => result.testType === testTypeFilter);
    }
    setFilteredResults(results);
  }, [searchTerm, dateFilter, patientFilter, testTypeFilter]);

  const columns = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'testType', label: 'Test Type' },
    { key: 'date', label: 'Date' },
    { key: 'status', label: 'Status' },
    { key: 'details', label: 'Details' },
  ];

  return (
    <div className="doctor-lab-results-page">
      <h2>Lab Results</h2>
      <div className="filters-container">
        <div className="search-filter">
          <input 
            type="text" 
            placeholder="Search by patient or test..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="dateFilter">Date:</label>
          <input 
            type="date" 
            id="dateFilter" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="patientFilter">Patient:</label>
          <select 
            id="patientFilter" 
            value={patientFilter} 
            onChange={(e) => setPatientFilter(e.target.value)}
          >
            <option value="">All Patients</option>
            {patients.map(patient => (
              <option key={patient} value={patient}>{patient}</option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="testTypeFilter">Test Type:</label>
          <select 
            id="testTypeFilter" 
            value={testTypeFilter} 
            onChange={(e) => setTestTypeFilter(e.target.value)}
          >
            <option value="">All Test Types</option>
            {testTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
      <DataTable 
        data={filteredResults} 
        columns={columns} 
        initialSortColumn="date" 
        initialSortDirection="desc" 
        itemsPerPage={5} 
      />
    </div>
  );
}

export default DoctorLabResultsPage; 