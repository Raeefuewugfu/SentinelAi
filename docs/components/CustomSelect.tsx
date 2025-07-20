import React, { useState, useRef, useEffect } from 'react';
import { ChevronUpDownIcon } from './icons';

interface CustomSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  id: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, label, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1.5">{label}</label>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-background text-text-primary text-left border border-surface-2 rounded-lg p-2.5 flex items-center justify-between focus:ring-2 focus:ring-accent focus:border-accent focus:outline-none transition-all duration-200"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <ChevronUpDownIcon className="w-5 h-5 text-text-tertiary" />
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-surface-2 border border-surface-2/50 shadow-lg rounded-md max-h-60 overflow-auto focus:outline-none animate-fade-in-fast"
          tabIndex={-1}
          role="listbox"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className="text-text-primary cursor-pointer select-none relative py-2 px-3 hover:bg-accent/20"
              role="option"
              aria-selected={option.value === value}
            >
              <span className={`block truncate ${option.value === value ? 'font-semibold text-accent' : 'font-normal'}`}>
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
