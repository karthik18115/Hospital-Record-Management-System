import React from 'react';
import { usePDF } from '@react-pdf/renderer';
import LabResultPdfDocument from './pdf/LabResultPdfDocument';
import Button from './ui/Button';
import { EyeIcon as ViewIcon } from './icons'; // Use the View icon

const LabReportViewButton = ({ patientData, labReport, className }) => {
  const [instance] = usePDF({ 
    document: <LabResultPdfDocument patientData={patientData} labReport={labReport} /> 
  });

  const handleView = () => {
    if (!instance.loading && instance.blob) {
      const url = URL.createObjectURL(instance.blob);
      window.open(url, '_blank'); // Open in new tab
      // Note: We might not be able to revoke the object URL immediately 
      // if the new tab needs time to load it. 
      // Consider revoking later or letting the browser handle it.
      // URL.revokeObjectURL(url); 
    } else if (instance.error) {
        console.error("Error generating PDF for view:", instance.error);
        alert("Sorry, there was an error generating the PDF for viewing.");
    } else {
        console.log("PDF instance not ready for view (still loading or no blob).");
    }
  };

  return (
    <Button 
      variant="outline" // Keep variant consistent with View action
      size="sm" 
      disabled={instance.loading || !instance.blob} // Disable if loading or blob not ready
      onClick={handleView}
      className={`flex items-center justify-center space-x-1.5 ${className}`}
    >
      <ViewIcon className="w-4 h-4" />
      <span>{instance.loading ? 'Generating...' : 'View'}</span>
    </Button>
  );
};

export default LabReportViewButton; 