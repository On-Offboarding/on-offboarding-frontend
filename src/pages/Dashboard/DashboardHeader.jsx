import React from "react";
import SearchBar from "../../components/UI/SearchBar";
import "./Dashboard.css";

const TABS = [
  { key: "all", label: "Alla" },
  { key: "pending", label: "Väntande" },
  { key: "in-progress", label: "Pågående" },
  { key: "completed", label: "Klar" }
];

function DashboardHeader({ filters, onChange, statusCounts = {} }) {
  const handleSearchChange = (searchTerm) => {
    onChange({ ...filters, search: searchTerm });
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-tabs">
        {TABS.map(tab => (
          <button 
            key={tab.key}
            className={`tabs-btn ${filters.status === tab.key ? "active" : ""}`}
            onClick={() => onChange({ ...filters, status: tab.key })}
            aria-selected={filters.status === tab.key}
            role="tab"
          >
            <span className="tab-label">{tab.label}</span>
            <span className="tab-count">[{statusCounts[tab.key] || 0}]</span>
          </button>
        ))}
      </div>

      <SearchBar
        value={filters.search}
        onChange={handleSearchChange}
        placeholder="Sök efter anställd..."
      />
    </header>
  );
}

export default DashboardHeader;