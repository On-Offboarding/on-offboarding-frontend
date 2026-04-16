import { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmRemove";


// dataFromApi

const formatDate = (value) => {
  if (!value) return "-";
  return String(value).split("T")[0] || "-";
};

const hasDisplayValue = (value) => {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim();
  return normalized !== "" && normalized !== "-" && normalized.toLowerCase() !== "unknown";
};

function OffboardingCard({
  employee,
  onConfirmOffboarding,
  onError,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [endDate, setEndDate] = useState("");
  const displayName = employee?.name || "-";
  const systemAccessCount = employee?.systemAccessCount ?? 0;

  const detailItems = [
    { label: "Personnummer", value: employee?.personalId },
    { label: "Mobilnummer", value: employee?.phoneNumber },
    { label: "Avdelning", value: employee?.department },
    { label: "Tjänstetitel", value: employee?.title },
    { label: "Företag", value: employee?.company },
    { label: "Startdatum", value: formatDate(employee?.startDate) },
    { label: "Anställningsdag", value: formatDate(employee?.dateOfEmployment) },
  ].filter((item) => hasDisplayValue(item.value));

  const splitIndex = Math.ceil(detailItems.length / 2);
  const leftDetails = detailItems.slice(0, splitIndex);
  const rightDetails = detailItems.slice(splitIndex);

  const handleOpenConfirm = () => setShowConfirm(true);
  const handleCloseConfirm = () => { setShowConfirm(false); setEndDate(""); };

  const handleConfirm = async () => {
    if (!onConfirmOffboarding) {
      handleCloseConfirm();
      return;
    }

    try {
      setIsSubmitting(true);
      await onConfirmOffboarding(employee, endDate || null);
      handleCloseConfirm();
    } catch (error) {
      console.error("Error creating offboarding case:", error);
      if (onError) onError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="case-container">
      <div className="employee">
        <h3>{displayName}</h3>

        <div className="employee-details-list">
          <div className="employee-sublist">
            {leftDetails.map((item) => (
              <p key={`left-${item.label}`}>
                <strong>{item.label}:</strong> <span>{item.value}</span>
              </p>
            ))}
          </div>

          <div className="employee-sublist">
            {rightDetails.map((item) => (
              <p key={`right-${item.label}`}>
                <strong>{item.label}:</strong> <span>{item.value}</span>
              </p>
            ))}
          </div>
        </div>

        <p>
          <strong>Systemåtkomster:</strong> {systemAccessCount}
        </p>
      </div>

      <div className="remove-btn-container">
        <button className="offboarding-action-btn" onClick={handleOpenConfirm} disabled={isSubmitting}>
          <i className="fa-solid fa-user-minus" /> Avsluta
        </button>
      </div>

      <ConfirmModal
        open={showConfirm}
        message={`Är du säker på att du vill skapa ett offboarding-ärende för ${displayName}?`}
        warning="Detta kommer att ta bort personens systemåtkomster."
        confirmLabel={isSubmitting ? "Skapar..." : "Avsluta"}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onConfirm={handleConfirm}
        onCancel={handleCloseConfirm}
      />

    </div>
  );
}

export default OffboardingCard;
