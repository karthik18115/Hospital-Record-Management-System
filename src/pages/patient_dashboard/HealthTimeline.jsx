import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Skeleton from '../../components/ui/Skeleton';
// Import new SVG Icons
import { 
  ClipboardIcon, // For diagnosis
  StethoscopeIcon, // For checkup/followup
  BandageIcon, // For procedure
  PrescriptionIcon, // For medication (reused)
  InformationCircleIcon, // Default (replace InfoIcon emoji)
} from '../../components/icons';
// import './HealthTimeline.css'; // Removed CSS import

export default function HealthTimeline() {
  const [isLoading] = useState(false);

  // Mock data - enhance with more detail or structure if needed
  const timelineEvents = [
    { id: 'ev1', date: '2024-03-10', type: 'diagnosis', title: 'Diagnosed with Hypertension', description: 'Started medication: Lisinopril 10mg daily. Advised lifestyle changes.', doctor: 'Dr. Smith' },
    { id: 'ev2', date: '2024-05-22', type: 'checkup', title: 'Annual Check-up', description: 'Routine blood tests performed, results pending. General health good.', doctor: 'Dr. Lee' },
    { id: 'ev3', date: '2024-06-15', type: 'followup', title: 'Follow-up: Cardiology', description: 'ECG normal, blood pressure controlled on current dosage. Continue medication.', doctor: 'Dr. Carter' },
    { id: 'ev4', date: '2024-07-20', type: 'medication', title: 'Medication Adjusted', description: 'Lisinopril dosage increased to 20mg daily due to elevated readings.', doctor: 'Dr. Smith' },
    { id: 'ev5', date: '2024-01-05', type: 'procedure', title: 'Wisdom Tooth Extraction', description: 'Lower right wisdom tooth extracted under local anesthesia. Prescribed pain relief.', doctor: 'Dr. Davis (Dentist)' },
  ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort newest first

  const getIconForEventType = (type) => {
    const iconProps = { className: 'w-4 h-4 text-white' }; // White icon text
    switch (type) {
      case 'diagnosis': return <ClipboardIcon {...iconProps} />;
      case 'checkup':
      case 'followup': return <StethoscopeIcon {...iconProps} />;
      case 'procedure': return <BandageIcon {...iconProps} />;
      case 'medication': return <PrescriptionIcon {...iconProps} />;
      default: return <InformationCircleIcon {...iconProps} className='w-4 h-4 text-slate-500'/>; // Default icon color
    }
  };

  // Helper to get marker styles based on type
  const getMarkerStyles = (type) => {
    switch (type) {
      case 'diagnosis': return 'bg-red-500'; // Red for diagnosis
      case 'checkup':
      case 'followup': return 'bg-blue-500'; // Blue for checkup/followup
      case 'procedure': return 'bg-purple-500'; // Purple for procedure
      case 'medication': return 'bg-green-500'; // Green for medication
      default: return 'bg-slate-400'; // Grey for default
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Health Timeline</h1>
        <p className="text-lg text-slate-600 mt-1">A chronological view of your significant health events and milestones.</p>
      </header>

      {/* TODO: Add filter controls (e.g., by date range, event type) within a Card */}

      <div className="relative border-l-2 border-slate-300 ml-4 mr-4 sm:mr-0 sm:ml-6">
        {isLoading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="mb-8 ml-10 animate-pulse">
              <div className="absolute -left-[11px] top-1 w-5 h-5 bg-slate-300 rounded-full ring-4 ring-slate-100"></div>
              <Skeleton height={20} width="30%" className="mb-2" />
              <Skeleton height={24} width="60%" className="mb-2" />
              <Skeleton count={2} />
            </div>
          ))
        ) : timelineEvents.length > 0 ? (
          timelineEvents.map((event) => (
            <div key={event.id} className="mb-8 ml-10 relative">
              {/* Timeline Marker - Styled with Tailwind */}
              <span 
                className={`absolute -left-[11px] top-0.5 flex items-center justify-center w-5 h-5 rounded-full ring-4 ring-slate-100 ${getMarkerStyles(event.type)}`}
              >
                {getIconForEventType(event.type)}
              </span>
              
              {/* Timeline Event Card - Styled with Tailwind */}
              <Card className="p-4 border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                <time className="block mb-1.5 text-xs font-medium tracking-wide uppercase text-slate-500">
                  {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <h2 className="text-base font-semibold text-slate-800 mb-0.5">{event.title}</h2>
                {event.doctor && <p className="text-xs text-slate-500 mb-1.5">Provider: {event.doctor}</p>}
                <p className="text-sm text-slate-600 leading-relaxed">{event.description}</p>
              </Card>
            </div>
          ))
        ) : (
          <Card className="ml-10 p-6 text-center border border-slate-200 bg-white">
            <p className="text-slate-500 text-lg">No timeline events available.</p>
          </Card>
        )}
      </div>
    </div>
  );
} 