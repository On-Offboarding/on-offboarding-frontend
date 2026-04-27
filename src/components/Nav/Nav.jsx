import React from 'react';
import { NavLink, useLocation } from 'react-router-dom'
import './Nav.css';
import { useUser } from '../../context/UserContext';
import { canCreateCases, canViewAudit } from '../../auth/permissions';


function Nav({ isOpen, }) {
  const location = useLocation();
  const currentUser = useUser();
  const showCreateLinks = canCreateCases(currentUser);
  const showAudit = canViewAudit(currentUser);
  const isAuditRoute = location.pathname.startsWith('/audit');
  const isOffboardingRoute = location.pathname.startsWith('/offboarding');

  return (
    <nav className={isOpen ? 'mobile-menu-open' : ''}>
        <NavLink to ="/" className="nav-portal-links">        
        <div className="nav-portal-link">HireFlow</div>
        </NavLink>   

        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className='nav-icon' ><i className="fa-solid fa-briefcase"></i></span>
            <span className="nav-text">Dashboard</span>
        </NavLink>

        {showCreateLinks && (
          <NavLink to="/onboarding" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} >
            <span className='nav-icon' ><i className="fa-solid fa-user-plus"></i></span>
            <span className="nav-text">Onboarding</span>
          </NavLink>
        )}

        {showCreateLinks && isOffboardingRoute && (
          <NavLink to="/offboarding" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} >
              <span className='nav-icon' ><i className="fa-solid fa-user-minus"></i></span>
              <span className="nav-text">Offboarding</span>
            </NavLink>
        )}

        {showAudit && isAuditRoute && (
          <NavLink to="/audit" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
            <span className='nav-icon'><i className="fa-solid fa-clock-rotate-left"></i></span>
            <span className="nav-text">Audit Log</span>
          </NavLink>
        )}
    </nav>

    
  );
}

export default Nav;