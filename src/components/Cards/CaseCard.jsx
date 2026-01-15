import React, { useState } from 'react';
import './CaseCard.css';
import SystemAccessList from '../Form/SystemAccessList';

// Mapping av status till svenska labels
const STATUS_LABELS = {
  "in-progress": "Pågående",
  "pending": "Väntar",
  "completed": "Slutförd"
};

// Mapping av typ till svenska labels
const TYPE_LABELS = {
  "onboarding": "Onboarding",
  "offboarding": "Offboarding",
  "alla": "Alla"
};

function CaseCard({
  employee = {
    name: "Anna Svensson",
    department: "IT",
    title: "Systemutvecklare",
    company: "Fantasia",
    startDate: "2023-05-15",
    status: "in-progress",
    type: "onboarding",
    systemAccessCount: 5,
  },
}) {

  /* ================= STATE ================= */
  const [showAccess, setShowAccess] = useState(false);
  const [accesses, setAccesses] = useState([]);

  return (
    <>
      {/* ================= CASE CARD ================= */}
      <div className="case-container">
        <div className="employee case-card">

          {/* ---------- Header ---------- */}
          <div className="case-header">
            <div className="case-subheader">
              <h3>{employee.name}</h3>

              <div className="status">
                <span className={`status-label ${employee.status}`}>
                  {STATUS_LABELS[employee.status] || employee.status}
                </span>
                <span className="status-label type-label">
                  {TYPE_LABELS[employee.type] || employee.type}
                </span>
              </div>
            </div>

            <button
              className="view-case-btn"
              onClick={() => setShowAccess(true)}
            >
              Visa Systemåtkomster
            </button>
          </div>

          {/* ---------- Employee Details ---------- */}
          <div className="employee-details-list">
            <div className="employee-sublist">
              <p>
                <strong>Avdelning:</strong> <span>{employee.department}</span>
              </p>
              <p>
                <strong>Tjänstetitel:</strong> <span>{employee.title}</span>
              </p>
            </div>

            <div className="employee-sublist">
              <p>
                <strong>Företag:</strong> <span>{employee.company}</span>
              </p>
              <p>
                <strong>Startdatum:</strong> <span>{employee.startDate}</span>
              </p>
            </div>
          </div>

          {/* ---------- Summary ---------- */}
          <p>
            <strong>Systemåtkomster:</strong> {employee.systemAccessCount}
          </p>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showAccess && (
        <div
          className="modal-overlay"
          onClick={() => setShowAccess(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            {/* ---------- Modal Header ---------- */}
            <div className="modal-header">
              <h3>Systemåtkomster — {employee.name}</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowAccess(false)}
              >
                <i className="fa-solid fa-x"></i>
              </button>
            </div>

            {/* ---------- Modal Body ---------- */}
            <div className="modal-body">
              <SystemAccessList
                accesses={accesses}
                setAccesses={setAccesses}
              />

              {/* ---------- Modal Footer ---------- */}
              <div className="modal-footer">
                <div className="submit">
                  <button className="submit-btn">
                    Avsluta ärende
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default CaseCard;
