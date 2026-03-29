import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CustomButton from '../components/ui/Button';

// Hero section image
const HERO_IMAGE_URL = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80';

// For User Roles section
const userRolesData = [
  { 
    title: 'For Patients', 
    text: 'Access your medical records, book appointments, and track your health progress all in one place.', 
    icon: '👤',
    color: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700'
  },
  { 
    title: 'For Doctors', 
    text: 'Efficiently manage your patients with quick access to medical histories, lab results, and appointment schedules.', 
    icon: '⚕️',
    color: 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700'
  },
  { 
    title: 'For Labs', 
    text: 'Streamline test requests, manage results, and communicate directly with healthcare providers.', 
    icon: '🔬',
    color: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700'
  },
  { 
    title: 'For Admins', 
    text: 'Oversee your facility\'s operations with comprehensive system management and reporting tools.', 
    icon: '🏥',
    color: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
  },
];

// Security badges
const securityFeatures = [
  { title: 'HIPAA Compliant', icon: '🔒', description: 'We adhere to all HIPAA requirements for patient data protection.' },
  { title: 'End-to-End Encryption', icon: '🔐', description: 'All data is encrypted during transmission and storage.' },
  { title: 'Regular Security Audits', icon: '🛡️', description: 'We perform regular security assessments to ensure system integrity.' },
  { title: 'Secure Authentication', icon: '🔑', description: 'Multi-factor authentication and session security measures.' }
];

// Testimonials data
const testimonials = [
  {
    id: 1,
    quote: "MedRec has transformed how we manage patient records. It's intuitive and saves us hours each day.",
    author: "Dr. Sarah Johnson",
    role: "Cardiologist, Memorial Hospital",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    quote: "As a patient, I love being able to access my medical history and prescriptions instantly. Great service!",
    author: "Michael Chen",
    role: "Patient",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  {
    id: 3,
    quote: "The lab management features have streamlined our workflow and reduced errors. Highly recommended.",
    author: "Dr. Emily Rodriguez",
    role: "Lab Director, City Medical Center",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

// Helper function to determine dashboard route based on user role
// const getDashboardRoute = (role) => {
//   switch (role?.toLowerCase()) {
//     case 'admin':
//       return '/admin/overview';
//     case 'patient':
//       return '/app/patient/dashboard';
//     case 'doctor':
//       return '/app/doctor/dashboard';
//     case 'pharmacy':
//       return '/app/pharmacy/dashboard';
//     case 'labcenter':
//       return '/app/labcenter/dashboard';
//     case 'emergency':
//       return '/app/emergency/dashboard';
//     default:
//       return '/';
//   }
// };

export default function UniversalHome() {
  // const navigate = useNavigate();
  // const token = localStorage.getItem('authToken');
  // const role = localStorage.getItem('userRole');
  // const isLoggedIn = !!token && !!role;
  
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    facility: ''
  });

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setContactForm({ name: '', email: '', message: '', facility: '' });
  };

  const nextTestimonial = () => {
    setCurrentTestimonial(current => 
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(current => 
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };
  
  const inputClass = "w-full px-3 py-2 rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 focus:ring-teal-500 focus:border-teal-500 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-slate-800 shadow sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
        <Link to="/" className="text-2xl font-bold text-teal-600 dark:text-teal-400 flex items-center">
          <span className="mr-2">🏥</span> MedRec
        </Link>
        <nav className="space-x-6">
          <CustomButton to="/login" variant="ghost">Login</CustomButton>
          <CustomButton to="/signup" variant="primary">Sign Up</CustomButton>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 bg-gradient-to-r from-teal-50 to-white dark:from-slate-800 dark:to-slate-800/80">
        <div className="max-w-xl mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            Access Your Health Records Anywhere, Anytime
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Your secure, modern, and user-friendly platform for managing medical records, appointments, and more.
          </p>
          <div className="space-x-4">
            <CustomButton to="/login" variant="primary" size="lg">Login</CustomButton>
            <CustomButton to="/signup" variant="outline" size="lg">Sign Up</CustomButton>
          </div>
        </div>
        <img src={HERO_IMAGE_URL} alt="MedRec Hero" className="rounded-xl shadow-lg w-full max-w-md" />
      </section>

      {/* For Different Users Section */}
      <section className="px-8 py-12 bg-white dark:bg-slate-800">
        <h2 className="text-3xl font-bold text-center text-teal-700 dark:text-teal-400 mb-10">
          Tailored For Everyone in Healthcare
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {userRolesData.map((role, idx) => (
            <div 
              key={idx} 
              className={`rounded-lg shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow border ${role.color}`}
            >
              <span className="text-4xl mb-4" role="img" aria-label={role.title}>{role.icon}</span>
              <h3 className={`text-xl font-semibold mb-2 ${role.color.includes('text-blue') ? 'text-blue-800 dark:text-blue-300' : role.color.includes('text-teal') ? 'text-teal-800 dark:text-teal-300' : role.color.includes('text-purple') ? 'text-purple-800 dark:text-purple-300' : 'text-amber-800 dark:text-amber-300'}`}>{role.title}</h3>
              <p className="text-slate-600 dark:text-slate-400">{role.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Security & Compliance Section */}
      <section className="px-8 py-12 bg-slate-50 dark:bg-slate-900">
        <h2 className="text-3xl font-bold text-center text-teal-700 dark:text-teal-400 mb-4">
          Security & Compliance
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10">
          At MedRec, your data security is our top priority. We implement industry-leading security measures to protect your information.
        </p>
        <div className="flex flex-wrap justify-center gap-6">
          {securityFeatures.map((feature, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 flex items-start space-x-4 max-w-xs border border-slate-200 dark:border-slate-700">
              <div className="text-2xl" role="img" aria-label={feature.title}>{feature.icon}</div>
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-8 py-16 bg-white dark:bg-slate-800">
        <h2 className="text-3xl font-bold text-center text-teal-700 dark:text-teal-400 mb-10">
          What Our Users Say
        </h2>
        <div className="max-w-4xl mx-auto relative">
          <div className="relative bg-gradient-to-r from-teal-50 to-blue-50 dark:from-slate-700 dark:to-slate-700/80 rounded-xl p-8 shadow-md border border-slate-200 dark:border-slate-600">
            <div className="text-5xl text-teal-200 dark:text-slate-600 absolute top-4 left-4 opacity-50">"</div>
            <div className="flex flex-col items-center">
              <p className="text-lg text-slate-700 dark:text-slate-200 italic mb-6 z-10 text-center">
                {testimonials[currentTestimonial].quote}
              </p>
              <div className="flex items-center">
                <img 
                  src={testimonials[currentTestimonial].avatar} 
                  alt={testimonials[currentTestimonial].author}
                  className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-teal-200 dark:border-teal-600"
                />
                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                    {testimonials[currentTestimonial].author}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {testimonials[currentTestimonial].role}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button 
              onClick={prevTestimonial}
              className="bg-white dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 p-2 rounded-full shadow-md hover:bg-teal-50 transition-colors border border-slate-200 dark:border-slate-600"
              aria-label="Previous testimonial"
            >
              {/* SVG for left arrow */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={nextTestimonial}
              className="bg-white dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 p-2 rounded-full shadow-md hover:bg-teal-50 transition-colors border border-slate-200 dark:border-slate-600"
              aria-label="Next testimonial"
            >
              {/* SVG for right arrow */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="px-8 py-16 bg-slate-50 dark:bg-slate-900">
        <h2 className="text-3xl font-bold text-center text-teal-700 dark:text-teal-400 mb-4">
          Get In Touch
        </h2>
        <p className="text-center text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-10">
          Have questions or want to learn more about MedRec? Fill out the form below and we'll get back to you.
        </p>
        <form onSubmit={handleContactSubmit} className="max-w-xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="contact-name" className={labelClass}>Full Name</label>
              <input type="text" id="contact-name" name="name" value={contactForm.name} onChange={handleContactFormChange} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="contact-email" className={labelClass}>Email Address</label>
              <input type="email" id="contact-email" name="email" value={contactForm.email} onChange={handleContactFormChange} required className={inputClass} />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="contact-facility" className={labelClass}>Facility/Organization (Optional)</label>
            <input type="text" id="contact-facility" name="facility" value={contactForm.facility} onChange={handleContactFormChange} className={inputClass} />
          </div>
          <div className="mb-6">
            <label htmlFor="contact-message" className={labelClass}>Message</label>
            <textarea id="contact-message" name="message" rows="4" value={contactForm.message} onChange={handleContactFormChange} required className={`${inputClass} h-auto`}></textarea>
          </div>
          <CustomButton type="submit" variant="primary" className="w-full">Send Message</CustomButton>
        </form>
      </section>

      {/* Footer */}
      <footer className="px-8 py-10 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">MedRec</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Securely manage your health records with ease. Our platform is designed for patients, doctors, and healthcare facilities.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400">About Us</Link></li>
              <li><Link to="/features" className="text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400">Features</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400">Contact</Link></li>
              <li><Link to="/privacy" className="text-sm text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">Contact Us</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">123 Health St, MedCity, MC 54321</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Email: support@medrec.com</p>
            <p className="text-sm text-slate-600 dark:text-slate-300">Phone: (123) 456-7890</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">&copy; {new Date().getFullYear()} MedRec. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 