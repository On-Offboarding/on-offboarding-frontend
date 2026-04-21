import CaseCard from "../../components/Cards/CaseCard"
import DashboardHeader from "./DashboardHeader"
import DashboardFilters from "./DashboardFilters"
import Pagination from "../../components/UI/Pagination"
import { useState, useEffect } from "react"
import { caseService, systemAccessService } from "../../Api"
import { normalizeCase, normalizeSystem } from "./caseNormalization"

function Dashboard() {
  const ITEMS_PER_PAGE = 10;
  const isAdmin = true; // TODO: Få från auth context senare

  const [filters, setFilters] = useState({
    status: "all",
    type: "alla",
    search: ""
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [cases, setCases] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hämta cases från API
  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        setError(null);
        const [data, profilesResponse, systemsResponse] = await Promise.all([
          caseService.getAllCases(),
          systemAccessService.getAllProfiles(),
          systemAccessService.getAllSystems(),
        ]);
        setCases(Array.isArray(data) ? data : []);
        setProfiles(Array.isArray(profilesResponse) ? profilesResponse : []);
        setSystems((Array.isArray(systemsResponse) ? systemsResponse : []).map(normalizeSystem));
      } catch (err) {
        console.error('Error fetching cases:', err);
        setError(err.message || 'Fel vid hämtning av ärenden');
        setCases([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  // Normalisera case-data från API
  const normalizedCases = cases.map((caseItem) => normalizeCase(caseItem, profiles, systems));

  // Filtrera cases baserat på status, typ och sökterm
  const filteredCases = normalizedCases.filter(caseItem => {
    const matchesStatus = filters.status === "all" || caseItem.status === filters.status;
    const matchesType = filters.type === "alla" || caseItem.type === filters.type;
    const matchesSearch = !filters.search || (caseItem.name && caseItem.name.toLowerCase().includes(filters.search.toLowerCase()));
    
    return matchesStatus && matchesType && matchesSearch;
  });

  
  const sortedCases = [...filteredCases].sort((a, b) => {
    const aCompleted = a.status === "completed";
    const bCompleted = b.status === "completed";

    if (aCompleted === bCompleted) return 0;
    return aCompleted ? 1 : -1;
  });

  // Beräkna pagination
  const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCases = sortedCases.slice(startIndex, endIndex);

  // Reset till första sidan när filter ändras
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Smooth scroll till toppen av cases (optional)
    document.querySelector('.cases-container')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Handle case status update
  const handleStatusUpdate = (caseId, newStatus) => {
    setCases(cases.map(caseItem => 
      caseItem.id === caseId ? { ...caseItem, status: newStatus } : caseItem
    ));
  };

  // Räkna cases per status
  const statusCounts = {
    all: normalizedCases.length,
    pending: normalizedCases.filter(c => c.status === "pending").length,
    "in-progress": normalizedCases.filter(c => c.status === "in-progress").length,
    completed: normalizedCases.filter(c => c.status === "completed").length
  };

  return (
    <div>
      <h1>Dashboard</h1>

      {loading && (
        <div className="dashboard-loading">
          <p> Laddar ärenden...</p>
        </div>
      )}

      {error && (
        <div className="dashboard-error">
          <p> <strong>Fel: </strong>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="dashboard-error-retry"
          >
            Försök igen
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <DashboardHeader 
            filters={filters} 
            onChange={handleFilterChange}
            statusCounts={statusCounts}
          />
          
          <DashboardFilters 
            filters={filters}
            onChange={handleFilterChange}
          />

          <div className="cases-container">
            {paginatedCases.length > 0 ? (
              paginatedCases.map(caseItem => (
                <CaseCard 
                  key={caseItem.id} 
                  employee={caseItem}
                  onStatusUpdate={handleStatusUpdate}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <p className="no-cases">Inga ärenden hittades</p>
            )}
          </div>

          {/* Pagination */}
          {filteredCases.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard