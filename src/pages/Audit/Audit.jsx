import React, { useEffect, useMemo, useState } from 'react'
import ProfileDropdown from '../../components/ProfileDropdown/ProfileDropdown'
import Pagination from '../../components/UI/Pagination'
import './Audit.css'
import { NavLink, useNavigate } from 'react-router-dom';
import { auditService } from '../../Api';

const formatTimestamp = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleString('sv-SE');
};

const getEntryTitle = (item) => {
  return item?.title || 'Audit-händelse';
};

const getEntryDescription = (item) => {
  return item?.description || 'Ingen beskrivning tillgänglig';
};

const getEntryUser = (item) => {
  return item?.byUser || 'Okänd användare';
};

const getEntryTimestamp = (item) => {
  return item?.time || null;
};

const normalizeAuditEntry = (entry, index) => ({
  id: entry?.id ?? entry?.auditId ?? entry?.logId ?? index,
  title: getEntryTitle(entry),
  description: getEntryDescription(entry),
  user: getEntryUser(entry),
  timestamp: formatTimestamp(getEntryTimestamp(entry)),
});

function Audit() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [auditEntries, setAuditEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const itemsPerPage = 5;

  // Dummy user data 
  const user = {
    name: 'Orlando Laurentius',
    role: 'Chef'
  };

  useEffect(() => {
    const fetchAuditData = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await auditService.getAllAudits();
        const list = Array.isArray(response) ? response : [];
        setAuditEntries(list.map((entry, index) => normalizeAuditEntry(entry, index)));
      } catch (fetchError) {
        console.error('Kunde inte hämta audit-loggar:', fetchError);
        setError('Kunde inte hämta audit-loggar. Försök igen senare.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuditData();
  }, []);

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(auditEntries.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEntries = useMemo(
    () => auditEntries.slice(startIndex, endIndex),
    [auditEntries, startIndex, endIndex]
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* <header className='audit-header'>
        <NavLink to="/Audit" className="audit-link">
          <h1>Audit Trail</h1>
        </NavLink>

        <ProfileDropdown user={user} />
      </header> */}

        <div className='audit-header-content'>
          <button className='back-button' onClick={() => navigate(-1)}>
            <i className="fa-solid fa-chevron-left"></i>
            Tillbaka till dashboard
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
              {isLoading && <p className='audit-message'>Laddar audit-loggar...</p>}
              {!isLoading && error && <p className='audit-message audit-error'>{error}</p>}
              {!isLoading && !error && paginatedEntries.length === 0 && (
                <p className='audit-message'>Inga audit-händelser hittades.</p>
              )}

              {paginatedEntries.map((entry) => (
                <div key={entry.id} className='audit-entry'>
                  <h3 className='entry-title'>{entry.title}</h3>
                  <p className='entry-description'>{entry.description}</p>
                  <div className='entry-meta'>
                    <span className='entry-user'>{entry.user}</span>
                    <span className='entry-timestamp'>• {entry.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {!isLoading && !error && auditEntries.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
              />
            )}
          </section>
        </div>
      </main>
    </>
  )
}

export default Audit