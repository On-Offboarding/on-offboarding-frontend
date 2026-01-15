import CaseCard from "../../components/Cards/CaseCard"
import DashboardHeader from "./DashboardHeader"
import DashboardFilters from "./DashboardFilters"
import Pagination from "../../components/UI/Pagination"
import { useState } from "react"

// Mock data - ersätt med verklig data från API senare
const MOCK_CASES = [
  { id: 1, name: "Anna Svensson", status: "in-progress", type: "onboarding" },
  { id: 2, name: "Markus Larsson", status: "pending", type: "onboarding" },
  { id: 3, name: "Sofia Bergman", status: "completed", type: "offboarding" },
  { id: 4, name: "Erik Johansson", status: "in-progress", type: "onboarding" },
  { id: 5, name: "Lisa Andersson", status: "pending", type: "offboarding" },
  { id: 6, name: "Johan Nilsson", status: "completed", type: "onboarding" },
  { id: 7, name: "Maria Karlsson", status: "in-progress", type: "offboarding" },
  { id: 8, name: "Peter Olsson", status: "pending", type: "onboarding" },
  { id: 9, name: "Eva Persson", status: "completed", type: "offboarding" },
  { id: 10, name: "Karin Svensson", status: "in-progress", type: "onboarding" },
  { id: 11, name: "David Larsson", status: "pending", type: "offboarding" },
  { id: 12, name: "Anna Johansson", status: "completed", type: "onboarding" },
];

function Dashboard() {
  const ITEMS_PER_PAGE = 10;

  const [filters, setFilters] = useState({
    status: "all",
    type: "alla",
    search: ""
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Filtrera cases baserat på status, typ och sökterm
  const filteredCases = MOCK_CASES.filter(caseItem => {
    const matchesStatus = filters.status === "all" || caseItem.status === filters.status;
    const matchesType = filters.type === "alla" || caseItem.type === filters.type;
    const matchesSearch = caseItem.name.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  // Beräkna pagination
  const totalPages = Math.ceil(filteredCases.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedCases = filteredCases.slice(startIndex, endIndex);

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

  // Räkna cases per status
  const statusCounts = {
    all: MOCK_CASES.length,
    pending: MOCK_CASES.filter(c => c.status === "pending").length,
    "in-progress": MOCK_CASES.filter(c => c.status === "in-progress").length,
    completed: MOCK_CASES.filter(c => c.status === "completed").length
  };

  return (
    <div>
      <h1>Dashboard</h1>
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
            <CaseCard key={caseItem.id} employee={caseItem} />
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
    </div>
  )
}

export default Dashboard