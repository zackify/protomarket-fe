import React, { useState, useRef, useEffect } from 'react';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  options, 
  selectedValue, 
  onSelect, 
  placeholder = "Select...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === selectedValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <button
        type="button"
        className="relative w-full cursor-pointer rounded-lg bg-gray-800 py-2.5 pl-3 pr-10 text-left text-white shadow-lg ring-1 ring-green-400/20 transition-all duration-200 hover:ring-green-400/40 hover:shadow-green-400/20 focus:outline-none focus:ring-2 focus:ring-green-400/50 font-mono text-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          {selectedOption?.icon && (
            <span className="mr-2 flex-shrink-0">
              {selectedOption.icon}
            </span>
          )}
          <span className="block truncate">
            {selectedOption?.label || placeholder}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            className={`h-4 w-4 text-green-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 py-1 text-base shadow-lg ring-1 ring-green-400/20 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          {options.map((option) => (
            <div
              key={option.value}
              className="relative cursor-pointer select-none py-2.5 pl-3 pr-9 text-white hover:bg-gray-700/50 hover:text-green-400 transition-colors duration-150 font-mono text-sm"
              onClick={() => {
                onSelect(option.value);
                setIsOpen(false);
              }}
            >
              <div className="flex items-center">
                {option.icon && (
                  <span className="mr-2 flex-shrink-0">
                    {option.icon}
                  </span>
                )}
                <span className={`block truncate ${selectedValue === option.value ? 'font-semibold text-green-400' : 'font-normal'}`}>
                  {option.label}
                </span>
              </div>
              {selectedValue === option.value && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-green-400">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};