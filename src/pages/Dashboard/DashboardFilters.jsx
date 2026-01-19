import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const handleTypeChange = (selectedType) => {
    onChange({ ...filters, type: selectedType });
  };

  const handleAuditClick = () => {
    navigate("/audit");
  };

  return (
    <div className="dashboard-filters">
      <div className="filter-title">
        <h2>Alla Ärende</h2>
      </div>
      <div className="filter-controls">
        <button className="audit-btn" onClick={handleAuditClick} title="Gå till Audit Log">
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span>Audit Log</span>
        </button>
        <TypeDropdown value={filters.type || "alla"} onChange={handleTypeChange}/>
      </div>
    </div>
  );
}

export default DashboardFilters;
