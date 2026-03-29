import React from 'react';
import { usePDF } from '@react-pdf/renderer';
import LabResultPdfDocument from './pdf/LabResultPdfDocument';
import Button from './ui/Button';
import { DownloadIcon } from './icons';

const LabReportDownloadButton = ({ patientData, labReport, className }) => {
  const [instance] = usePDF({ 
    document: <LabResultPdfDocument patientData={patientData} labReport={labReport} /> 
  });

  // Update the instance if the report data changes (optional, depends on exact usage)
  // useEffect(() => {
  //   updateInstance();
  // }, [labReport, patientData, updateInstance]);

  const handleDownload = () => {
    if (!instance.loading && instance.blob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(instance.blob);
      const fileName = `LabReport-${labReport.reportId}-${patientData?.name?.replace(/\s+/g, '_') || 'Patient'}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Clean up blob URL
    } else if (instance.error) {
        console.error("Error generating PDF:", instance.error);
        alert("Sorry, there was an error generating the PDF report.");
    } else {
        // Could trigger updateInstance here if not using useEffect, 
        // but generally loading state should be sufficient
        console.log("PDF instance not ready yet (still loading or no blob).");
    }   
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={instance.loading || !instance.blob} // Disable if loading or blob not ready
      onClick={handleDownload}
      className={`flex items-center justify-center space-x-1.5 ${className}`}
    >
      <DownloadIcon className="w-4 h-4" />
      <span>{instance.loading ? 'Generating PDF...' : 'Download Report'}</span>
    </Button>
  );
};

export default LabReportDownloadButton; 