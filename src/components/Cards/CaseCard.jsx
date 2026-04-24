import React, { useState, useEffect } from 'react';
import './CaseCard.css';
import SystemAccessList from '../Form/SystemAccessList';
import { caseService } from '../../Api';
import { getCompanyValue } from '../../utils/company';
import { useUser } from '../../context/UserContext';


const STATUS_LABELS = {
  "in-progress": "Pågående",
  "pending": "Väntande",
  "completed": "Klar"
};

const STATUS_VALUES = {
  pending: 1,
  "in-progress": 2,
  completed: 3,
};

const TYPE_VALUES = {
  onboarding: 1,
  offboarding: 2,
};

const toTypeEnum = (value, fallbackLabel) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const normalized = String(value || fallbackLabel || '').toLowerCase();
  return TYPE_VALUES[normalized] ?? 1;
};

const TYPE_LABELS = {
  "onboarding": "Onboarding",
  "offboarding": "Offboarding",
  "alla": "Alla"
};

const formatDate = (value) => {
  if (!value) return "-";
  const datePart = String(value).split("T")[0];
  return datePart || "-";
};

const hasDisplayValue = (value) => {
  if (value === null || value === undefined) return false;
  const normalized = String(value).trim();
  return normalized !== "" && normalized !== "-" && normalized.toLowerCase() !== "unknown";
};

const normalizeAccess = (access) => {
  const candidate = access?.systemAccess || access?.system || access;
  const rawId =
    candidate?.id ??
    candidate?.systemAccessId ??
    candidate?.systemId ??
    access?.systemAccessId ??
    access?.systemId ??
    null;
  const name =
    candidate?.name ||
    candidate?.systemName ||
    candidate?.title ||
    access?.name ||
    access?.systemName ||
    "";

  return {
    id: rawId,
    systemAccessId: rawId,
    name,
    status: access?.status ?? 0,
  };
};

const toIsoDateTime = (value) => {
  if (!value) return new Date().toISOString();

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return new Date().toISOString();

  return parsed.toISOString();
};

const toNullableIsoDateTime = (value) => {
  if (!value || value === '-') return null;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toISOString();
};

const toCompanyEnum = (value) => {
  return getCompanyValue(value);
};

const toAccountDto = (access) => {
  const systemAccessId = access?.systemAccessId ?? access?.id ?? access?.systemId ?? null;
  if (systemAccessId === null || systemAccessId === undefined) return null;

  const normalizedId = Number(systemAccessId);

  return {
    systemAccessId: Number.isFinite(normalizedId) ? normalizedId : systemAccessId,
    status: access?.status ?? 0,
  };
};

function CaseCard({
  employee,
  onStatusUpdate,
}) {

  /* ================= STATE ================= */
  const currentUser = useUser();
  const [showAccess, setShowAccess] = useState(false);
  const [accesses, setAccesses] = useState([]);
  const [localStatus, setLocalStatus] = useState(employee?.status || 'pending');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const displayName = employee?.name || '-';
  const displayType = employee?.type || '-';
  const systemAccessCount = employee?.systemAccessCount ?? 0;

  const detailItems = [
    { label: "Personnummer", value: employee?.personalId },
    { label: "Mobilnummer", value: employee?.phoneNumber },
    { label: "Avdelning", value: employee?.department },
    { label: "Tjänstetitel", value: employee?.title },
    { label: "Företag", value: employee?.company },
    { label: "Startdatum", value: formatDate(employee?.startDate) },
    { label: "Slutdatum", value: formatDate(employee?.endDate) },
    { label: "Anställningsdag", value: formatDate(employee?.dateOfEmployment) },
  ].filter((item) => hasDisplayValue(item.value));

  const splitIndex = Math.ceil(detailItems.length / 2);
  const leftDetails = detailItems.slice(0, splitIndex);
  const rightDetails = detailItems.slice(splitIndex);

  useEffect(() => {
    setLocalStatus(employee?.status || 'pending');
  }, [employee?.status]);

  useEffect(() => {
    const employeeAccesses = Array.isArray(employee?.accounts)
      ? employee.accounts.map(normalizeAccess).filter((access) => access.id != null || Boolean(access.name))
      : [];

    setAccesses(employeeAccesses);
  }, [employee?.accounts]);

  const updateCaseStatus = async (nextStatus) => {
    if (!employee?.id) return;

    try {
      setIsUpdating(true);
      setActionError(null);

      const fullCase = await caseService.getCaseById(employee.id);
      const sourceCase = fullCase || {};
      const sourceEmployee = sourceCase?.employee || employee?.employee || {};
      const personalId = (sourceEmployee.personalId ?? employee.personalId ?? '').trim();
      const createdByUser = currentUser?.id;

      if (!personalId) {
        setActionError('PersonalId saknas för ärendet och kan inte uppdateras.');
        return false;
      }

      const caseDto = {
        id: Number(employee.id),
        employee: {
          id: Number(sourceEmployee.id ?? employee.employeeId ?? employee.id ?? 0),
          firstName: sourceEmployee.firstName ?? sourceCase.firstName ?? employee.firstName ?? '',
          lastName: sourceEmployee.lastName ?? sourceCase.lastName ?? employee.lastName ?? '',
          title: sourceEmployee.title ?? sourceCase.title ?? employee.title ?? '',
          personalId,
          phoneNumber: sourceEmployee.phoneNumber ?? sourceCase.phoneNumber ?? employee.phoneNumber ?? '',
          company: toCompanyEnum(sourceEmployee.company ?? employee.company),
          department: sourceEmployee.department ?? employee.department ?? '',
          startDate: toIsoDateTime(sourceEmployee.startDate ?? employee.startDate),
          endDate: toNullableIsoDateTime(sourceEmployee.endDate ?? employee.endDate),
          dateOfEmployment: toIsoDateTime(sourceEmployee.dateOfEmployment ?? employee.dateOfEmployment),
          accounts: (Array.isArray(sourceEmployee.accounts) ? sourceEmployee.accounts : accesses)
            .map(toAccountDto)
            .filter((account) => account !== null),
        },
        type: toTypeEnum(sourceCase.type ?? employee.type, displayType),
        status: STATUS_VALUES[nextStatus],
        createdByUser,
      };

      await caseService.updateCase(employee.id, caseDto);
      setLocalStatus(nextStatus);
      if (onStatusUpdate) {
        onStatusUpdate(employee.id, nextStatus);
      }
      return true;
    } catch (error) {
      console.error('Error updating case status:', error);
      console.error('Validation details:', error?.data);
      setActionError(error.message || 'Fel vid uppdatering av ärendet');
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExport = async () => {
    if (!employee?.id) return;
    try {
      setIsExporting(true);
      await caseService.exportCaseToPdf(employee.id);
    } catch {
      setActionError('Fel vid export av PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleShowAccess = () => {
    setShowAccess(true);
  };

  const handleCloseCase = async () => {
    const updated = await updateCaseStatus('completed');
    if (updated) {
      setShowAccess(false);
    }
  };

  return (
    <>
      {/* ================= CASE CARD ================= */}
      <div className="case-container">
        <div className="employee case-card">

          {/* ---------- Header ---------- */}
          <div className="case-header">
            <div className="case-subheader">
              <div className="name-export">
                <h3>{displayName}</h3>
                <div className="export">
                  <button className='export-btn' onClick={handleExport} disabled={isExporting}>
                    <i className="fa-solid fa-file-export"></i>
                    <span>{isExporting ? 'Exporterar...' : 'Exportera'}</span>
                  </button>
                </div>

              </div>

              <div className="status">
                <span className={`status-label ${localStatus}`}>
                  {STATUS_LABELS[localStatus] || localStatus}
                </span>
                <span className="status-label type-label">
                  {TYPE_LABELS[displayType] || displayType}
                </span>
              </div>

            </div>

          </div>

          {actionError && (
            <div className="case-error">
              <strong>⚠️</strong> {actionError}
            </div>
          )}

          {/* ---------- Employee Details ---------- */}
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

          {/* ---------- Summary ---------- */}
          <p>
            <strong>Systemåtkomster:</strong> {systemAccessCount}
          </p>

          <div className="case-actions">
            <button
              className="view-case-btn"
              onClick={handleShowAccess}
            >
              Visa Systemåtkomster
            </button>
          </div>
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
              <h3>Systemåtkomster — {displayName}</h3>
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
                initialSelectedProfile={employee?.selectedProfile?.raw || employee?.selectedProfile || null}
              />

              {/* ---------- Modal Footer ---------- */}
              <div className="modal-footer">
                <div className="submit">
                  <button 
                    className="submit-btn" 
                    type='button'
                    onClick={handleCloseCase}
                    disabled={isUpdating}
                  >
                    {isUpdating ? '⏳ Uppdaterar...' : 'Uppdatera ärende'}
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
