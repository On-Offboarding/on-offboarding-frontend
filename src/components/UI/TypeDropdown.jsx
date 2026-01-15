import { useState } from "react";
import "./TypeDropdown.css";

// Standardalternativ - kan överskrivas av props
const DEFAULT_TYPE_OPTIONS = [
  { value: "alla", label: "Alla" },
  { value: "onboarding", label: "Onboarding" },
  { value: "offboarding", label: "Offboarding" }
];

function TypeDropdown({ 
  value = "alla", 
  onChange, 
  options = DEFAULT_TYPE_OPTIONS 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const selectedLabel = options.find(opt => opt.value === value)?.label;

  return (
    <div className="type-dropdown-wrapper">
      <div className="type-dropdown">
        <button
          className="dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
        >
          <span className="dropdown-text">{selectedLabel}</span>
          <i 
            className={`fa-solid fa-chevron-down dropdown-icon ${isOpen ? "open" : ""}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <ul className="dropdown-Menu" role="listbox">
            {options.map(option => (
              <li key={option.value}>
                <button
                  className={`dropdown-option ${value === option.value ? "selected" : ""}`}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={value === option.value}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TypeDropdown;
