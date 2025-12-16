import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'
import './Nav.css';


function Nav({ isOpen, }) {
  const location = useLocation();
  const showOffboarding = location.pathname.startsWith('/offboarding');

  return (
    <nav className={isOpen ? 'mobile-menu-open' : ''}>
        <NavLink to ="/" className="nav-portal-links">        
        <div className="nav-portal-link">Chef</div>
        </NavLink>   

        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className='nav-icon' ><i className="fa-solid fa-briefcase"></i></span>
            <span className="nav-text">Dashboard</span>
        </NavLink>
            
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} >
            <span className='nav-icon' ><i className="fa-solid fa-circle-user"></i></span>
            <span className="nav-text">On/Offboarding</span>
        </NavLink> 

          {showOffboarding && (
            <NavLink to="/offboarding" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} >
              <span className='nav-icon' ><i className="fa-solid fa-user-minus"></i></span>
              <span className="nav-text">Offboarding</span>
            </NavLink>
          )}
    </nav>

    
  );
}

export default Nav;