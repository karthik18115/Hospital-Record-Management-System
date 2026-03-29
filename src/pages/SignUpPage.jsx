import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SIGNUP_IMAGE_URL = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80';

function SignUpPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState(''); // For backend errors
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    mobileNumber: '',
    department: '',
    affiliation: '',
    governmentId: '',
    licenseProof: '',
    yearsOfExperience: '',
    gender: '',
    pronoun: '',
    preferredLanguage: 'English',
    twoFaPreference: 'sms',
    // Doctor-specific fields
    medicalCouncilName: '',
    emergencyResponseCapability: false,
    consultationSlots: '',
    // Lab Technician-specific fields
    labType: '',
    certificationsHeld: '',
    shiftTimings: '',
    // Admin-specific fields
    organizationPosition: '',
    jurisdictionScope: '',
    accessLevel: ''
  });
  
  const [documentName, setDocumentName] = useState(''); // Display selected file name

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const validateName = (value) => {
    return !value ? 'Full Name is required' : '';
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email address';
  };

  const validatePassword = (value) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const validateConfirmPassword = (value, password) => {
    if (!value) return 'Please confirm your password';
    if (value !== password) return 'Passwords do not match';
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate the field on change
    if (name === 'fullName') {
      setErrors(prev => ({ ...prev, fullName: validateName(value) }));
    } else if (name === 'email') {
      setErrors(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setErrors(prev => ({ 
        ...prev, 
        password: validatePassword(value),
        // Also validate confirmPassword again if it has a value
        confirmPassword: formData.confirmPassword 
          ? validateConfirmPassword(formData.confirmPassword, value) 
          : prev.confirmPassword
      }));
    } else if (name === 'confirmPassword') {
      setErrors(prev => ({ 
        ...prev, 
        confirmPassword: validateConfirmPassword(value, formData.password) 
      }));
    }
  };

  // Handle file input and read as base64
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    if (file) {
      setDocumentName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setGeneralError(''); // Clear previous general errors
    setSuccessMessage(''); // Clear previous success messages
    
    // Validate all fields
    const newErrors = {
      fullName: validateName(formData.fullName),
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword, formData.password)
    };
    
    setErrors(newErrors);
    
    // Check if there are any errors
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    
    if (!hasErrors) {
      setIsSubmitting(true);
      
      // Prepare data for the backend
      // Remove confirmPassword; include new professional and 2FA fields
      const { ...submissionData } = formData;

      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submissionData),
        });

        const data = await response.json();

        if (response.ok) {
          // Optionally, log the user in directly or show a success message and redirect to login
          setSuccessMessage(data.message || 'Registration successful! You can now log in.');
          // Redirect to login page after a short delay or after user clicks a button
          setTimeout(() => {
            navigate('/login');
          }, 3000); // 3-second delay
        } else {
          // Handle errors from backend (e.g., email already exists, validation errors)
          console.error('Sign up failed:', data);
          if (data.errors) { // Assuming backend might send field-specific errors
            // You could parse data.errors and update the errors state for specific fields
            setGeneralError(data.message || 'Registration failed due to validation errors.');
          } else {
            setGeneralError(data.message || 'Registration failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Network or server error during sign up:', error);
        setGeneralError('Registration failed due to a network or server error. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignUp = () => {
    // Redirect the entire window to the backend OAuth2 endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:8081';
    window.location.href = `${backendUrl}/oauth2/authorization/google`;
  };

  return (
    <div className="fixed inset-0 bg-slate-900 w-full h-full overflow-auto">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={SIGNUP_IMAGE_URL}
          alt="Healthcare technology"
          className="h-full w-full object-cover opacity-60"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/60"></div>
      </div>
      
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-3 bg-slate-900/90 backdrop-blur-sm">
        <Link to="/" className="flex items-center text-white">
          <span className="text-3xl mr-2" role="img" aria-label="medical">🏥</span>
          <span className="text-xl font-bold">MedRec</span>
        </Link>
        
        {/* Right-aligned action buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-white text-sm font-medium">
            <span className="hover:text-teal-300">LOGIN</span>
          </Link>
          <Link to="/signup" className="bg-white text-slate-900 hover:bg-gray-100 py-2 px-4 rounded-md text-sm font-medium">
            SIGN UP
          </Link>
        </div>
      </header>
      
      {/* Signup Content Container */}
      <div className="relative z-10 flex flex-col justify-center items-start min-h-screen px-6 sm:px-12 lg:px-24 pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 w-full gap-12">
          {/* Left Info Section */}
          <div className="flex flex-col justify-center text-white">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Join MedRec Today</h1>
              <p className="text-lg text-slate-200">
                Create your account and get access to secure medical record management tailored to your needs.
              </p>
            </div>
          </div>

          {/* Right Form Section - White Card */}
          <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl">
            {/* Logo header - on mobile and desktop */}
            <div className="flex items-center mb-8">
              <span className="text-3xl mr-2" role="img" aria-label="medical">🏥</span>
              <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">MedRec</h1>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Create your account</h2>
            
            {generalError && (
              <div className="p-3 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-600 dark:text-red-400 rounded-md">
                <p>{generalError}</p>
              </div>
            )}
            {successMessage && (
              <div className="p-3 mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-600 dark:text-green-400 rounded-md">
                <p>{successMessage}</p>
              </div>
            )}
            <form onSubmit={handleSignUp} className="space-y-4 mb-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${ 
                    errors.fullName ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500`}
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${ 
                    errors.email ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${ 
                    errors.password ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500`}
                  placeholder="At least 6 characters"
                />
                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${ 
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500`}
                  placeholder="Re-enter your password"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  I am a:
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200"
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="pharmacy">Pharmacy</option>
                  <option value="admin">Admin</option>
                  <option value="labcenter">Lab Center</option>
                  <option value="emergency">Emergency Doctor</option>
                </select>
              </div>

              {/* Essential and Role-Specific Signup Fields for Non-Patient Roles */}
              {formData.role !== 'patient' && (
                <>
                  {/* Mobile Number */}
                  <div>
                    <label htmlFor="mobileNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number
                    </label>
                    <input
                      id="mobileNumber"
                      name="mobileNumber"
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  {/* Department / Specialization */}
                  <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Department / Specialization
                    </label>
                    <input
                      id="department"
                      name="department"
                      type="text"
                      required
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Cardiology, Pathology..."
                    />
                  </div>

                  {/* Hospital / Lab Affiliation */}
                  <div>
                    <label htmlFor="affiliation" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Hospital / Lab Affiliation
                    </label>
                    <input
                      id="affiliation"
                      name="affiliation"
                      type="text"
                      required
                      value={formData.affiliation}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="Enter your facility name"
                    />
                  </div>

                  {/* Government Issued ID / License Number */}
                  <div>
                    <label htmlFor="governmentId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Government ID / License Number
                    </label>
                    <input
                      id="governmentId"
                      name="governmentId"
                      type="text"
                      required
                      value={formData.governmentId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g., NMC-123456"
                    />
                  </div>

                  {/* Upload License / ID Proof */}
                  <div>
                    <label htmlFor="licenseProof" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Upload License / ID Proof
                    </label>
                    <input
                      id="licenseProof"
                      name="licenseProof"
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={handleFileChange}
                      className="w-full"
                    />
                    {documentName && <p className="mt-1 text-sm text-slate-500">Selected file: {documentName}</p>}
                  </div>

                  {/* Years of Experience */}
                  <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Years of Experience
                    </label>
                    <input
                      id="yearsOfExperience"
                      name="yearsOfExperience"
                      type="number"
                      min="0"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                      placeholder="e.g., 5"
                    />
                  </div>

                  {/* Gender / Pronoun (Optional) */}
                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Gender / Pronoun (Optional)
                    </label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="">Prefer not to specify</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Preferred Language */}
                  <div>
                    <label htmlFor="preferredLanguage" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Preferred Language
                    </label>
                    <select
                      id="preferredLanguage"
                      name="preferredLanguage"
                      value={formData.preferredLanguage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      {/* Add more languages as needed */}
                    </select>
                  </div>

                  {/* 2FA Setup Preference */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      2FA Setup Preference
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="twoFaPreference"
                          value="email"
                          checked={formData.twoFaPreference === 'email'}
                          onChange={handleInputChange}
                          className="form-radio"
                        />
                        <span className="ml-2">Email</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="twoFaPreference"
                          value="sms"
                          checked={formData.twoFaPreference === 'sms'}
                          onChange={handleInputChange}
                          className="form-radio"
                        />
                        <span className="ml-2">SMS</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="twoFaPreference"
                          value="app"
                          checked={formData.twoFaPreference === 'app'}
                          onChange={handleInputChange}
                          className="form-radio"
                        />
                        <span className="ml-2">Authenticator App</span>
                      </label>
                    </div>
                  </div>

                  {/* Role-Specific Additional Fields */}

                  {/* Doctors */}
                  {(formData.role === 'doctor-regular' || formData.role === 'doctor-emergency') && (
                    <>
                      {/* Medical Registration Council Name */}
                      <div>
                        <label htmlFor="medicalCouncilName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Medical Registration Council Name
                        </label>
                        <input
                          id="medicalCouncilName"
                          name="medicalCouncilName"
                          type="text"
                          required
                          value={formData.medicalCouncilName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="e.g., NMC India"
                        />
                      </div>
                      {/* Emergency Response Capability */}
                      {formData.role === 'doctor-emergency' && (
                        <div className="flex items-center">
                          <input
                            id="emergencyResponseCapability"
                            name="emergencyResponseCapability"
                            type="checkbox"
                            checked={formData.emergencyResponseCapability}
                            onChange={e => setFormData(prev => ({ ...prev, emergencyResponseCapability: e.target.checked }))}
                            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                          />
                          <label htmlFor="emergencyResponseCapability" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                            Emergency Response Capability
                          </label>
                        </div>
                      )}
                      {/* Consultation Availability Slots */}
                      <div>
                        <label htmlFor="consultationSlots" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Consultation Availability Slots (Optional)
                        </label>
                        <input
                          id="consultationSlots"
                          name="consultationSlots"
                          type="text"
                          value={formData.consultationSlots}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="e.g., Mon-Fri 9am-5pm"
                        />
                      </div>
                    </>
                  )}

                  {/* Lab Technicians */}
                  {formData.role === 'lab-technician' && (
                    <>
                      {/* Lab Type */}
                      <div>
                        <label htmlFor="labType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Lab Type
                        </label>
                        <select
                          id="labType"
                          name="labType"
                          required
                          value={formData.labType}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="">Select Lab Type</option>
                          <option value="Blood">Blood</option>
                          <option value="Pathology">Pathology</option>
                          <option value="Microbiology">Microbiology</option>
                        </select>
                      </div>
                      {/* Certifications Held */}
                      <div>
                        <label htmlFor="certificationsHeld" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Certifications Held
                        </label>
                        <input
                          id="certificationsHeld"
                          name="certificationsHeld"
                          type="text"
                          value={formData.certificationsHeld}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="Comma separated certifications"
                        />
                      </div>
                      {/* Shift Timings */}
                      <div>
                        <label htmlFor="shiftTimings" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Shift Timings (Optional)
                        </label>
                        <input
                          id="shiftTimings"
                          name="shiftTimings"
                          type="text"
                          value={formData.shiftTimings}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                          placeholder="e.g., Night shift 10pm-6am"
                        />
                      </div>
                    </>
                  )}

                  {/* Admins */}
                  {formData.role === 'admin' && (
                    <>
                      {/* Organization Position/Title */}
                      <div>
                        <label htmlFor="organizationPosition" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Organization Position/Title
                        </label>
                        <input
                          id="organizationPosition"
                          name="organizationPosition"
                          type="text"
                          required
                          value={formData.organizationPosition}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      {/* Jurisdiction Scope */}
                      <div>
                        <label htmlFor="jurisdictionScope" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Jurisdiction Scope
                        </label>
                        <select
                          id="jurisdictionScope"
                          name="jurisdictionScope"
                          required
                          value={formData.jurisdictionScope}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2(border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="Facility-wide">Facility-wide</option>
                          <option value="Departmental only">Departmental only</option>
                        </select>
                      </div>
                      {/* Access Level */}
                      <div>
                        <label htmlFor="accessLevel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Access Level
                        </label>
                        <select
                          id="accessLevel"
                          name="accessLevel"
                          required
                          value={formData.accessLevel}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="Super Admin">Super Admin</option>
                          <option value="Data Admin">Data Admin</option>
                          <option value="IT Admin">IT Admin</option>
                        </select>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || successMessage} // Disable if successful too, until redirect
                  className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-teal-500 ${
                    (isSubmitting || successMessage) ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </button>
              </div>
            </form>

            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                className="w-full flex items-center justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <span className="mr-2">
                  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                    </g>
                  </svg>
                </span>
                Sign up with Google
              </button>
            </div>

            <div className="mt-4 text-left">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 dark:text-teal-400 dark:hover:text-teal-300">
                  Login instead
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage; 