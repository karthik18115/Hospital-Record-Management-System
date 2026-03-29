import React from 'react';
import { NavLink } from 'react-router-dom';

const BASE_CLASSES = 'rounded-2xl shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 font-semibold tracking-wide flex items-center justify-center space-x-1';

const VARIANTS = {
  primary: 'bg-teal-500 hover:bg-teal-600 text-white focus:ring-teal-500',
  secondary: 'bg-blue-100 hover:bg-blue-200 text-blue-800 focus:ring-blue-500',
  danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  outline: 'bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-teal-500',
  'danger-outline': 'bg-white border border-red-300 hover:bg-red-50 text-red-600 focus:ring-red-500',
  primary_dark: 'bg-sky-500 hover:bg-sky-600 text-white focus:ring-sky-500',
  secondary_dark: 'bg-slate-700 hover:bg-slate-600 text-slate-200 focus:ring-slate-500',
  'danger-outline-dark': 'bg-transparent border border-red-500 hover:bg-red-500/10 text-red-400 focus:ring-red-500 focus:ring-offset-slate-900',
};

const SIZES = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base', // Default
};

export default function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  to = null, // Add 'to' prop for NavLink functionality
  activeClassName = '', // Add activeClassName prop
  ...props 
}) {
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.md;
  
  // isLoading is used by the component logic (e.g., to show spinner or change text) but not passed to DOM button
  // We can also explicitly remove other custom props if needed before spreading `...props`
  const { 
    // exampleProp, // if you had other custom props
    ...restProps // contains all standard HTML attributes like onClick, disabled, etc.
  } = props;

  const buttonClasses = `${BASE_CLASSES} ${variantClass} ${sizeClass} ${className}`;

  // If 'to' prop is provided, render as NavLink
  if (to) {
    return (
      <NavLink 
        to={to}
        className={({ isActive }) => 
          `${buttonClasses} ${isActive ? (activeClassName || 'ring-2 ring-teal-500 ring-offset-1') : ''}`
        }
        {...restProps} // Pass only restProps
      >
        {children}
      </NavLink>
    );
  }

  // Otherwise, render as a standard button
  return (
    <button
      className={buttonClasses}
      {...restProps} // Pass only restProps
      // If you need to conditionally set attributes based on isLoading, do it here explicitly
      // For example, if disabled should also be true when isLoading:
      // disabled={isLoading || props.disabled} 
    >
      {/* Example: Conditionally render spinner based on isLoading */}
      {/* {isLoading && <SpinnerIcon />} */}
      {children}
    </button>
  );
} 