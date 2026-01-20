import React, { useState } from 'react'
import ProfileDropdown from '../../components/ProfileDropdown/ProfileDropdown'
import Pagination from '../../components/UI/Pagination'
import './Audit.css'
import Nav from '../../components/Nav/Nav';
import { NavLink, useNavigate } from 'react-router-dom';

function Audit() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Dummy user data - ersätt med riktig data från din state/context
  const user = {
    name: 'Orlando Laurentius',
    role: 'Chef'
  };

  // Dummy audit trail data - ersätt med riktig data från din API
  const auditEntries = [
    {
      id: 1,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-08 08:56:43'
    },
    {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
        {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
        {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
        {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
        {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },    {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
        {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
        {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
        {
      id: 2,
      title: 'Offboarding skapad',
      description: 'Offboarding för Abdifatah Mahdi skapad',
      user: 'chef@fnansia.se',
      timestamp: '2025-12-04 12:35:22'
    },
  ];

  // Pagination logic
  const totalPages = Math.ceil(auditEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = auditEntries.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className='audit-header'>
        <NavLink to="/Audit" className="audit-link">
          <h1>Audit Trail</h1>
        </NavLink>

        <ProfileDropdown user={user} />
      </header>

        <div className='audit-header-content'>
          <button className='back-button' onClick={() => navigate(-1)}>
            <i class="fa-solid fa-chevron-left"></i>
            Tillbaka till årenden
          </button>
        </div>

      <main className='audit-main'>
        <div className='audit-container'>

          <section className='audit-section'>
            <div className='audit-title-group'>
              <h1 className='audit-title'>⏱ Audit Trail</h1>
              <p className='audit-subtitle'>Historik över alla händelser i systemet</p>
            </div>

            <div className='audit-entries'>
              {paginatedEntries.map((entry) => (
                <div key={entry.id} className='audit-entry'>
                  <h3 className='entry-title'>{entry.title}</h3>
                  <p className='entry-description'>{entry.description}</p>
                  <div className='entry-meta'>
                    <span className='entry-user'>Av: {entry.user}</span>
                    <span className='entry-timestamp'>• {entry.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
            />
          </section>
        </div>
      </main>
    </>
  )
}

export default Audit