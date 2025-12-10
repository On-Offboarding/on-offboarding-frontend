import React from 'react';
import { NavLink } from 'react-router-dom'
import './Nav.css';


function Nav({ isOpen, onClose }) {
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
    </nav>
  );
}

export default Nav;