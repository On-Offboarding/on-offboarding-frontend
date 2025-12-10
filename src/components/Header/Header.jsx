// Header.jsx
import React, { useState } from 'react';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import Nav from '../Nav/Nav';
import './Header.css';

function Header({ onMenuToggle }) {

    // Dummy user data - ersätt med riktig data från din state/context
  const user = {
    name: 'Orlando Laurentius',
    role: 'Chef'
  };


  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header>
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu" >
          <span><i className="fa-solid fa-bars"></i> </span>
        </button>      
        <ProfileDropdown user={user} />
      </header>

      
      {/* Overlay */}
      {menuOpen && (
        <div className="menu-overlay active" onClick={toggleMenu}>
          <Nav isOpen={menuOpen} onClose={toggleMenu} />
        </div>
      )}
    </>
  );
}

export default Header;