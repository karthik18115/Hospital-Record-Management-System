import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { XIcon } from '../icons';

export default function EditEmergencyContactsForm({ initialContacts, onSave, isLoading, formId }) {
  const [contacts, setContacts] = useState([]);
  
  const [newName, setNewName] = useState('');
  const [newRelationship, setNewRelationship] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialContacts) {
      setContacts([...initialContacts]);
    } else {
      setContacts([]);
    }
  }, [initialContacts]);

  const validateNewContact = () => {
      const newErrors = {};
      if (!newName.trim()) newErrors.newContact = 'Name is required.';
      if (!newRelationship.trim()) newErrors.newContact = 'Relationship is required.';
      if (!newPhone.trim()) {
          newErrors.newContact = 'Phone number is required.';
      } // Add more specific phone validation if needed
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Saving the current list of contacts
    onSave(contacts);
  };

  // Contact Handlers
  const handleAddContact = () => {
    if (!validateNewContact()) return;

    setContacts([...contacts, { 
        id: `new_ec_${Date.now()}`, 
        name: newName, 
        relationship: newRelationship, 
        phone: newPhone 
    }]);
    // Clear input fields
    setNewName('');
    setNewRelationship('');
    setNewPhone('');
    setErrors({});
  };

  const handleRemoveContact = (idToRemove) => {
    setContacts(currentContacts => currentContacts.filter(c => c.id !== idToRemove));
  };

  const inputClass = "w-full px-3 py-1.5 rounded-md bg-slate-50 text-slate-700 border border-slate-300 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 text-sm";
  const errorClass = "text-red-600 text-xs mt-1";
  const subHeaderClass = "text-md font-semibold text-slate-700 mb-2 mt-4";

  return (
    <form onSubmit={handleSubmit} id={formId} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
      <div>
        <h3 className={subHeaderClass}>Current Contacts</h3>
        {contacts.length > 0 ? (
          <ul className="space-y-2 mb-3">
            {contacts.map((contact) => (
              <li key={contact.id} className="flex items-center justify-between p-2 bg-slate-100 rounded-md border border-slate-200">
                <div>
                  <span className="text-sm font-medium text-slate-800">{contact.name}</span>
                  <span className="block text-xs text-slate-500">{contact.relationship} - {contact.phone}</span>
                </div>
                <Button type="button" onClick={() => handleRemoveContact(contact.id)} variant="danger-outline" size="xs" className="!p-1 ml-2">
                  <XIcon className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
            <p className="text-sm text-slate-500 mb-3">No emergency contacts listed.</p>
        )}
      </div>

      <hr className="my-3 border-slate-200"/>

      {/* Add New Contact Section */}
      <div>
        <h3 className={subHeaderClass}>Add New Contact</h3>
        <div className="space-y-3 mb-3">
            <input 
                type="text" 
                placeholder="Full Name" 
                value={newName} 
                onChange={(e) => setNewName(e.target.value)} 
                className={inputClass}
                disabled={isLoading}
            />
            <input 
                type="text" 
                placeholder="Relationship (e.g., Spouse, Friend)" 
                value={newRelationship} 
                onChange={(e) => setNewRelationship(e.target.value)} 
                className={inputClass}
                disabled={isLoading}
            />
            <input 
                type="tel" 
                placeholder="Phone Number" 
                value={newPhone} 
                onChange={(e) => setNewPhone(e.target.value)} 
                className={inputClass}
                disabled={isLoading}
            />
        </div>
        {errors.newContact && <p className={errorClass}>{errors.newContact}</p>}
        <Button type="button" onClick={handleAddContact} variant="secondary" size="sm" disabled={isLoading}>Add Contact</Button>
      </div>

    </form>
  );
} 