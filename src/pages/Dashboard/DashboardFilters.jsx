import TypeDropdown from "../../components/UI/TypeDropdown";
import "./Dashboard.css";

/**
 * DashboardFilters - Filtreringskomponent för dashboard
 * 
 * Props:
 * - filters: { type: string, ... } - Nuvarande filtervärden
 * - onChange: (updatedFilters) => void - Callback när filter ändras
 */
function DashboardFilters({ filters, onChange }) {
  const handleTypeChange = (selectedType) => {
    onChange({ ...filters, type: selectedType });
  };

  return (
    <div className="dashboard-filters">
      <div className="filter-title">
        <h2>Alla Ärende</h2>
      </div>
      <TypeDropdown value={filters.type || "alla"} onChange={handleTypeChange}/>
    </div>
  );
}

export default DashboardFilters;
