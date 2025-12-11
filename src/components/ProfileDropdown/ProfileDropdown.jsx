// components/ProfileDropdown/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import './ProfileDropdown.css';

function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Stäng dropdown när man klickar utanför
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Få initialer från namn
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button className="profile-btn"  onClick={toggleDropdown} aria-label="Öppna profilmeny">
        <div className="profile-avatar">
          {getInitials(user.name)}
        </div>
      </button>

        <div className="profile-info-tablet">
          <span className="profile-name">{user.name}</span>
          <span className="profile-role">{user.role}</span>
        </div>


      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="dropdown-avatar">
              {getInitials(user.name)}
            </div>
            <div className="dropdown-info">
              <h3 className="dropdown-name">{user.name}</h3>
              <p className="dropdown-role">{user.role}</p>
            </div>
          </div>

          <div className="dropdown-divider"></div>
          
          <ul className="dropdown-list">
            <li>
              <a href="/login">
                <i className="fa-solid fa-right-from-bracket"></i>
                Logga ut
              </a>
            </li>
          </ul>
          
        </div>

        
      )}
    </div>
  );
}

export default ProfileDropdown;