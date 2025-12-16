import { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmRemove";


// dataFromApi

function OffboardingCard({
  employee = {
    name: "Alexander Isak",
    department: "IT",
    title: "Systemutvecklare",
    company: "Fantasia",
    startDate: "2025-12-12",
    systemAccessCount: 0,
  },
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleOpenConfirm = () => setShowConfirm(true);
  const handleCloseConfirm = () => setShowConfirm(false);

  return (
    <div className="case-container">
      <div className="employee">
        <h3>{employee.name}</h3>

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
              <strong>Startdatum:</strong>{" "}
              <span>{employee.startDate}</span>
            </p>
          </div>
        </div>

        <p>
          <strong>Systemåtkomster:</strong> {employee.systemAccessCount}
        </p>
      </div>

      <div className="remove-btn-container">
        <button className="remove-btn" onClick={handleOpenConfirm}>
          <i className="fa-solid fa-trash-can" /> Ta bort
        </button>
      </div>

      <ConfirmModal
        open={showConfirm}
        message={`Är du säker på att du vill skapa ett offboarding-ärende för ${employee.name}?`}
        warning="Detta kommer att ta bort personens systemåtkomster."
        onConfirm={handleCloseConfirm}
        onCancel={handleCloseConfirm}
      />

    </div>
  );
}

export default OffboardingCard;
