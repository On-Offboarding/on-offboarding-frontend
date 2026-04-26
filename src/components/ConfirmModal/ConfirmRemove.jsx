import { useState } from "react";
import "./ConfirmRemove.css";

function ConfirmModal({
  open,
  title = "Bekräfta offboarding",
  message,
  warning,
  confirmLabel = "Ta bort",
  endDate,
  onEndDateChange,
  onConfirm,
  onCancel,
}) {
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  if (!open) return null;

  const isEndDateEmpty = !endDate || endDate.trim() === "";
  const shouldShowError = attemptedSubmit && isEndDateEmpty;

  const handleSubmit = () => {
    if (isEndDateEmpty) {
      setAttemptedSubmit(true);
      return;
    }
    setAttemptedSubmit(false);
    onConfirm?.();
  };

  const handleCancel = () => {
    setAttemptedSubmit(false);
    onCancel?.();
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div id="confirm-modal" className="modal">
        <h3 className="modal-title">{title}</h3>

        {message && <p className="modal-message">{message}</p>}
        {warning && <p className="modal-message">{warning}</p>}

        <div className="modal-actions">
          <div className="modal-end-date">
            <label htmlFor="modal-enddate">Slutdatum</label>
            <input
              id="modal-enddate"
              type="date"
              value={endDate ?? ""}
              onChange={(e) => onEndDateChange?.(e.target.value)}
            />
            {shouldShowError && (
              <p className="validation-error">Slutdatum krävs vid offboarding</p>
            )}
          </div>

          <div className="modal-buttons">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
            >
              Avbryt
            </button>

            <button
              type="button"
              className="remove-btn"
              onClick={handleSubmit}
            >
              <i className="fa-solid fa-user-minus" />
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
