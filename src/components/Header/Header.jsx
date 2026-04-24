// Header.jsx
import { useState } from 'react';
import ProfileDropdown from '../ProfileDropdown/ProfileDropdown';
import Nav from '../Nav/Nav';
import './Header.css';
import { useUser } from '../../context/UserContext';

function Header() {
  const currentUser = useUser();

  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      <header className='header'>
        <button className="hamburger-btn" onClick={toggleMenu} aria-label="Toggle menu" >
          <span><i className="fa-solid fa-bars"></i> </span>
        </button>      
        <ProfileDropdown user={currentUser} />
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