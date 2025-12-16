import "./ConfirmRemove.css";

function ConfirmModal({
  open,
  title = "Bekräfta offboarding",
  message,
  warning,
  confirmLabel = "Ta bort",
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <h3 className="modal-title">{title}</h3>

        {message && <p className="modal-message">{message}</p>}
        {warning && <p className="modal-message">{warning}</p>}

        <div className="modal-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
          >
            Avbryt
          </button>

          <button
            type="button"
            className="remove-btn"
            onClick={onConfirm}
          >
            <i className="fa-solid fa-trash-can" />
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
