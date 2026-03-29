import React, { useState, useEffect } from 'react';
import StatsCard from '../../components/dashboard_shared/StatsCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { PrescriptionIcon, MedicineIcon, InventoryIcon, AlertIcon, NotesIcon, RefillIcon } from '../../components/icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Mock data for Pharmacy
const mockPharmacyData = {
  toFill: { total: 18, new: 7, refills: 11 },
  dispensedToday: { total: 85, highAlert: 3 },
  inventoryStatus: { status: 'Stock Levels OK', lowStockCount: 2, expiringCount: 5 },
  prescriptionQueue: [
    { id: 'P001', patientName: 'Alice Johnson', medication: 'Lisinopril 10mg', type: 'New', received: '09:30 AM' },
    { id: 'P002', patientName: 'Robert Davis', medication: 'Metformin 500mg', type: 'Refill', received: '10:00 AM' },
    { id: 'P003', patientName: 'Linda Wilson', medication: 'Atorvastatin 20mg', type: 'New', received: '10:15 AM', priority: 'Urgent' },
  ],
  lowStockItems: [
    { id: 'M015', name: 'Amoxicillin 250mg/5ml Susp', currentStock: 5, reorderLevel: 10, supplier: 'PharmaCo' },
    { id: 'M022', name: 'Ozempic 1mg Pen', currentStock: 2, reorderLevel: 5, supplier: 'MediSupply' },
  ],
  expiringSoonItems: [
    { id: 'M008', name: 'Ventolin Inhaler', expiryDate: '2024-08-31', quantity: 12 },
    { id: 'M030', name: 'EpiPen Auto-Injector', expiryDate: '2024-09-15', quantity: 3 },
  ],
  pharmacyName: 'MedRec Pharmacy Services'
};

export default function PharmacyDashboardOverview() {
  const [data] = useState(mockPharmacyData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const statsCardsData = [
    {
      title: "Prescriptions to Fill",
      value: data.toFill.total,
      details: `${data.toFill.new} New / ${data.toFill.refills} Refills`,
      icon: <PrescriptionIcon />,
      colorTheme: 'purple'
    },
    {
      title: "Dispensed Today",
      value: data.dispensedToday.total,
      details: `${data.dispensedToday.highAlert} High-Alert Meds`,
      icon: <MedicineIcon />,
      colorTheme: 'purple'
    },
    {
      title: "Inventory Status",
      value: data.inventoryStatus.status,
      details: `${data.inventoryStatus.lowStockCount} Low Stock / ${data.inventoryStatus.expiringCount} Expiring Soon`,
      icon: <InventoryIcon />,
      colorTheme: 'blue' // Different accent
    },
  ];

  const quickActionsData = [
    { label: 'Verify Prescription', icon: <NotesIcon />, onClick: () => {}, variant: 'primary'},
    { label: 'Process Refills', icon: <RefillIcon />, onClick: () => {}, variant: 'secondary'},
    { label: 'Drug Interactions', icon: <AlertIcon />, onClick: () => {}, variant: 'secondary'},
    { label: 'Manage Inventory', icon: <InventoryIcon />, onClick: () => {}, variant: 'secondary'},
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8 bg-slate-100 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-800">Pharmacy Dashboard</h1>
        <p className="text-lg text-slate-600 mt-1">
          {isLoading ? <Skeleton width={250} inline={true} /> : `Welcome to ${data.pharmacyName}! Serving patient needs.`}
        </p>
      </header>

      <section aria-labelledby="pharmacy-summary-title">
        <h2 id="pharmacy-summary-title" className="sr-only">Pharmacy Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCardsData.map(card => (
            <StatsCard 
              key={card.title} 
              title={card.title}
              value={isLoading ? <Skeleton width={50} inline /> : card.value}
              details={isLoading ? <Skeleton width={120} /> : card.details}
              icon={card.icon}
              colorTheme={card.colorTheme}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1" aria-labelledby="quick-actions-title">
          <Card>
            <h2 id="quick-actions-title" className="text-xl font-semibold text-slate-700 mb-4">Quick Actions</h2>
            {isLoading ? (
              Array(quickActionsData.length).fill(0).map((_, idx) => <Skeleton key={idx} height={40} className="mb-2 rounded-lg" />)
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {quickActionsData.map(({ label, icon, onClick, variant }) => (
                  <Button
                    key={label}
                    variant={variant || 'secondary'}
                    onClick={onClick}
                    className="flex flex-col items-center justify-center h-28 text-center p-2 space-y-1 text-sm"
                  >
                    {icon}
                    <span className="font-semibold tracking-wide">{label}</span>
                  </Button>
                ))}
              </div>
            )}
          </Card>
        </section>

        <section className="lg:col-span-2" aria-labelledby="prescription-queue-title">
          <Card>
            <h2 id="prescription-queue-title" className="text-xl font-semibold text-slate-700 mb-4 flex items-center">
             <PrescriptionIcon className="text-purple-600"/> <span className="ml-2">Prescription Queue</span>
            </h2>
            {isLoading ? (
              <div className="space-y-3"> {Array(3).fill(0).map((_, idx) => <Skeleton key={idx} height={50} className="rounded-lg" />)} </div>
            ) : (
              <div className="space-y-3">
                {data.prescriptionQueue.length > 0 ? (
                  data.prescriptionQueue.map(rx => (
                    <div key={rx.id} className={`p-3 rounded-md shadow-sm border ${rx.priority === 'Urgent' ? 'border-red-300 bg-red-50' : 'border-slate-200'}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-slate-700">{rx.medication} - {rx.patientName}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rx.type === 'New' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{rx.type}</span>
                      </div>
                      <p className="text-sm text-slate-500">Received: {rx.received} {rx.priority === 'Urgent' && <span className='ml-2 text-red-600 font-semibold'>URGENT</span>}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-center py-4">Prescription queue is clear.</p>
                )}
              </div>
            )}
          </Card>
        </section>
      </div>
      
      <section aria-labelledby="inventory-alerts-title">
        <Card>
          <h2 id="inventory-alerts-title" className="text-xl font-semibold text-slate-700 mb-4">Inventory Alerts</h2>
          {isLoading ? (
             <div className="space-y-3"> {Array(2).fill(0).map((_, idx) => <Skeleton key={idx} height={70} className="rounded-lg" />)} </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-md font-semibold text-slate-600 mb-2">Low Stock Items</h3>
                {data.lowStockItems.length > 0 ? (
                  <ul className="divide-y divide-slate-200">
                    {data.lowStockItems.map(item => (
                      <li key={item.id} className="py-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-red-600 font-medium">{item.name}</span>
                          <span className="text-sm text-red-500">Stock: {item.currentStock} (Min: {item.reorderLevel})</span>
                        </div>
                        <p className="text-xs text-slate-500">Supplier: {item.supplier}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm py-3">No low stock items.</p>
                )}
              </div>
              <div>
                <h3 className="text-md font-semibold text-slate-600 mb-2">Expiring Soon</h3>
                {data.expiringSoonItems.length > 0 ? (
                   <ul className="divide-y divide-slate-200">
                    {data.expiringSoonItems.map(item => (
                      <li key={item.id} className="py-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-orange-600 font-medium">{item.name}</span>
                          <span className="text-sm text-orange-500">Expires: {item.expiryDate}</span>
                        </div>
                        <p className="text-xs text-slate-500">Quantity: {item.quantity}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 text-sm py-3">No items expiring soon.</p>
                )}
              </div>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
} 