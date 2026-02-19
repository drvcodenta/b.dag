// AnimatedSelect.js - Custom dropdown with Tailwind animations

import { useState, useRef, useEffect } from 'react';

export const AnimatedSelect = ({ value, onChange, options, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setTimeout(() => setIsOpen(false), 0);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Select Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        className="w-full mt-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none bg-white text-left flex justify-between items-center transition-all hover:border-gray-400"
      >
        <span>{value}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu with Animation */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg overflow-hidden animate-slideDown">
          {options.map((option) => (
            <div
              key={option}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(option);
              }}
              className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                value === option 
                  ? 'bg-blue-50 text-[#6467f1] font-medium' 
                  : 'hover:bg-gray-100'
              }`}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
