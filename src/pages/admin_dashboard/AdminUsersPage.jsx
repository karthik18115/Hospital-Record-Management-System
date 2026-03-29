import React, { useState, useEffect, useRef } from 'react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import AddNewUserForm from '../../components/admin/AddNewUserForm';
import EditUserForm from '../../components/admin/EditUserForm';
import { UsersIcon, AlertIcon, CogIcon } from '../../components/icons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { ALL_USER_ROLES, USER_STATUSES } from '../../constants';

// Mock Data for Users Table
let mockUsers = [
  { id: 'usr_001', name: 'Dr. Alice Smith', email: 'alice.smith@medrec.com', role: 'Doctor', status: 'Active', lastLogin: '2024-07-29 10:15 AM', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 'usr_002', name: 'Bob Johnson', email: 'bob.j@example.com', role: 'Patient', status: 'Active', lastLogin: '2024-07-29 09:30 AM', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { id: 'usr_003', name: 'Carol White', email: 'carol.white@medrec.com', role: 'Nurse', status: 'Active', lastLogin: '2024-07-28 16:45 PM', avatar: 'https://randomuser.me/api/portraits/women/72.jpg' },
  { id: 'usr_004', name: 'David Brown', email: 'david.brown@medrec.com', role: 'Lab Staff', status: 'Inactive', lastLogin: '2024-07-20 11:00 AM', avatar: 'https://randomuser.me/api/portraits/men/76.jpg' },
  { id: 'usr_005', name: 'Eve Green', email: 'eve.green@medrec.com', role: 'Pharmacist', status: 'Active', lastLogin: '2024-07-29 08:20 AM', avatar: 'https://randomuser.me/api/portraits/women/70.jpg' },
  { id: 'usr_006', name: 'Super Admin', email: 'admin@medrec.com', role: 'Admin', status: 'Active', lastLogin: '2024-07-29 12:05 PM', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
  { id: 'usr_007', name: 'John Patient', email: 'john.patient@example.com', role: 'Patient', status: 'Pending', lastLogin: 'N/A', avatar: 'https://randomuser.me/api/portraits/men/79.jpg' },
];

// Use ALL_USER_ROLES for dropdown, add 'All' option for filtering
const FILTER_ROLES = ['All', ...ALL_USER_ROLES];
const FILTER_STATUSES = ['All', ...USER_STATUSES];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [forceRefresh, setForceRefresh] = useState(0);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState(null);

  const addUserFormRef = useRef(null);
  const editUserFormRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filteredUsers = mockUsers;
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (roleFilter !== 'All') {
        filteredUsers = filteredUsers.filter(user => user.role === roleFilter);
      }
      if (statusFilter !== 'All') {
        filteredUsers = filteredUsers.filter(user => user.status === statusFilter);
      }
      setUsers(filteredUsers); // This will now store all filtered users
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, roleFilter, statusFilter, forceRefresh]);

  const openEditUserModal = (userId) => {
    const userToEdit = mockUsers.find(user => user.id === userId);
    if (userToEdit) {
      setCurrentUserToEdit(userToEdit);
      setIsEditUserModalOpen(true);
    } else {
      console.error("User not found for editing");
      // TODO: Show error toast
    }
  };
  const closeEditUserModal = () => {
    setIsEditUserModalOpen(false);
    setCurrentUserToEdit(null);
  };

  const handleSaveUpdatedUser = (updatedUserData) => {
    setIsProcessing(true);
    setTimeout(() => {
      mockUsers = mockUsers.map(user => 
        user.id === updatedUserData.id 
          ? { 
              ...user, // Keep existing fields like avatar, lastLogin that aren't in the form
              ...updatedUserData, // Overwrite with all fields from the form
              status: user.status === 'Pending' ? 'Active' : updatedUserData.status || user.status // Approve if was pending
            }
          : user
      );
      // Trigger filter refresh using explicit forceRefresh counter
      setForceRefresh(prev => prev + 1);
      setIsProcessing(false);
      closeEditUserModal();
      // TODO: Add success toast for user update
    }, 1000);
  };

  const handleToggleUserStatus = (userId) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return;

    let newStatus = user.status;

    if (user.status === 'Pending') {
      if (user.role === 'Patient') {
        newStatus = 'Active';
      } else {
        // For non-patient roles, direct activation from here is discouraged.
        // Admin should use the Edit form to fill details and approve.
        console.warn(`Cannot directly approve non-patient role ${user.role} for user ${userId} without details. Please use Edit.`);
        // Optionally, trigger a toast message here to inform the admin.
        return; // Prevent status change from this button for pending non-patients
      }
    } else if (user.status === 'Active') {
      newStatus = 'Inactive';
    } else if (user.status === 'Inactive') {
      newStatus = 'Active';
    }

    mockUsers = mockUsers.map(u => 
      u.id === userId ? { ...u, status: newStatus } : u
    );
    // Trigger filter refresh using explicit forceRefresh counter
    setForceRefresh(prev => prev + 1);
  };
  
  const openAddUserModal = () => setIsAddUserModalOpen(true);
  const closeAddUserModal = () => setIsAddUserModalOpen(false);

  const handleSaveNewUser = (newUserData) => {
    setIsProcessing(true);
    setTimeout(() => {
      const newUser = {
        // Spread all properties from newUserData, which now includes professional details
        ...newUserData, 
        id: `usr_${String(mockUsers.length + 1).padStart(3, '0')}`,
        // If admin adds user, default to Active unless a status is part of newUserData (it isn't currently)
        status: newUserData.status || 'Active', 
        lastLogin: 'N/A',
        // Keep the avatar generation logic
        avatar: `https://ui-avatars.com/api/?name=${newUserData.name.replace(' ', '+')}&background=random&color=fff`,
      };
      mockUsers = [newUser, ...mockUsers];
      // Trigger filter refresh using explicit forceRefresh counter
      setForceRefresh(prev => prev + 1);
      setIsProcessing(false);
      closeAddUserModal();
      // TODO: Add success toast for user creation
    }, 1000);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 bg-slate-900 text-slate-200 min-h-full">
      <header className="flex justify-between items-center mb-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-100">User Management</h1>
        <Button 
          variant="primary_dark" 
          onClick={openAddUserModal}
        >
          <UsersIcon className="w-5 h-5 mr-2" /> Add New User
        </Button>
      </header>

      {/* Filters and Search Toolbar */}
      <Card className="bg-slate-800 border-slate-700 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <input 
            type="text"
            placeholder="Search by name or email..."
            className="md:col-span-1 w-full px-3 py-2 rounded-md bg-slate-700 text-slate-200 border border-slate-600 focus:ring-sky-500 focus:border-sky-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div>
            <label htmlFor="roleFilter" className="block text-sm font-medium text-slate-400 mb-1">Role</label>
            <select 
              id="roleFilter"
              className="w-full px-3 py-2 rounded-md bg-slate-700 text-slate-200 border border-slate-600 focus:ring-sky-500 focus:border-sky-500"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              {FILTER_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-slate-400 mb-1">Status</label>
            <select 
              id="statusFilter"
              className="w-full px-3 py-2 rounded-md bg-slate-700 text-slate-200 border border-slate-600 focus:ring-sky-500 focus:border-sky-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {FILTER_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-slate-800 border-slate-700 overflow-x-auto">
        {isLoading ? (
          <div className="p-4">
            {Array(5).fill(0).map((_, idx) => <Skeleton key={idx} height={40} className="mb-2 rounded" baseColor="#334155" highlightColor="#475569" />)}
          </div>
        ) : users.length > 0 ? (
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Last Login</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img className="h-10 w-10 rounded-full object-cover" src={user.avatar || `https://ui-avatars.com/api/?name=${user.name.replace(' ', '+')}&background=random`} alt={`${user.name} avatar`} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-slate-200">{user.name}</div>
                        <div className="text-xs text-slate-400">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">{user.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'Active' ? 'bg-green-700 text-green-100' : user.status === 'Inactive' ? 'bg-red-700 text-red-100' : 'bg-yellow-700 text-yellow-100'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">{user.lastLogin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button variant="secondary_dark" size="sm" onClick={() => openEditUserModal(user.id)} title="Edit user details"><CogIcon className="w-4 h-4" /></Button>
                    
                    {(() => {
                      const isPending = user.status === 'Pending';
                      const isActive = user.status === 'Active';
                      const isPatient = user.role === 'Patient';

                      if (isPending) {
                        if (isPatient) {
                          return (
                            <Button 
                              variant="success-outline-dark" // Assuming a success variant exists
                              size="sm" 
                              onClick={() => handleToggleUserStatus(user.id)}
                              title="Approve this patient account"
                            >
                              Approve
                            </Button>
                          );
                        } else {
                          return (
                            <Button 
                              variant="secondary_dark"
                              size="sm" 
                              onClick={() => openEditUserModal(user.id)} // Or handleToggleUserStatus, but it would be blocked
                              disabled // Key change: disable for pending non-patients
                              title="Please use Edit (cog icon) to add professional details and approve this user."
                            >
                              Approve
                            </Button>
                          );
                        }
                      } else if (isActive) {
                        return (
                          <Button 
                            variant="danger-outline-dark" 
                            size="sm" 
                            onClick={() => handleToggleUserStatus(user.id)}
                            title="Deactivate this user account"
                          >
                            Deactivate
                          </Button>
                        );
                      } else { // Inactive
                        return (
                          <Button 
                            variant="success-outline-dark" // Or secondary_dark if success-outline isn't prominent enough for activate
                            size="sm" 
                            onClick={() => handleToggleUserStatus(user.id)}
                            title="Activate this user account"
                          >
                            Activate
                          </Button>
                        );
                      }
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <UsersIcon className="mx-auto h-12 w-12 text-slate-500" />
            <h3 className="mt-2 text-lg font-medium text-slate-300">No users found</h3>
            <p className="mt-1 text-sm text-slate-400">Adjust your search or filter criteria.</p>
          </div>
        )}
      </Card>

      {/* TODO: Pagination Controls */}
      {users.length > 0 && !isLoading && (
        <div className="flex justify-center mt-6">
            <p className="text-sm text-slate-400">Pagination to be implemented here.</p>
        </div>
      )}

      {/* Add New User Modal */}
      <Modal 
        isOpen={isAddUserModalOpen} 
        onClose={closeAddUserModal} 
        title="Add New User"
        footerContent={(
          <>
            <Button variant="secondary_dark" onClick={closeAddUserModal} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="submit" form="add-user-form-id" variant="primary_dark" isLoading={isProcessing} disabled={isProcessing}>
              {isProcessing ? 'Saving...' : 'Save User'}
            </Button>
          </>
        )}
      >
        <AddNewUserForm 
            onSave={handleSaveNewUser} 
            onCancel={closeAddUserModal}
            isLoading={isProcessing} 
            formId="add-user-form-id"
            ref={addUserFormRef}
        />
      </Modal>

      {/* Edit User Modal */}
      {currentUserToEdit && (
        <Modal 
          isOpen={isEditUserModalOpen} 
          onClose={closeEditUserModal} 
          title={`Edit User: ${currentUserToEdit.name}`}
          footerContent={(
            <>
              <Button variant="secondary_dark" onClick={closeEditUserModal} disabled={isProcessing}>
                Cancel
              </Button>
              <Button type="submit" form="edit-user-form-id" variant="primary_dark" isLoading={isProcessing} disabled={isProcessing}>
                {isProcessing ? 'Saving Changes...' : 'Save Changes'}
              </Button>
            </>
          )}
        >
          <EditUserForm 
            userToEdit={currentUserToEdit}
            onSave={handleSaveUpdatedUser} 
            onCancel={closeEditUserModal}
            isLoading={isProcessing} 
            formId="edit-user-form-id"
            ref={editUserFormRef}
          />
        </Modal>
      )}
    </div>
  );
} 