import { useEffect, useState, forwardRef } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { getFormSectionValidationRules } from "../../utils/validators";
import { COMPANY_OPTIONS, getCompanyValue } from "../../utils/company";
import SystemAccessList from "../../components/Form/SystemAccessList";
import { caseService } from "../../Api";
import "../Form/FormSection.css";
import { useUser } from '../../context/UserContext';

const INITIAL_VALUES = {
  firstname: '',
  lastname: '',
  personalnumber: '',
  mobile: '',
  company: '',
  department: '',
  jobtitle: '',
  startdate: '',
  enddate: '',
  employmentdate: ''
};

const VALID_TYPES = new Set(["onboarding", "offboarding"]);


const FormSection = forwardRef(({ type = "onboarding" }, ref) => {
  const [accesses, setAccesses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const normalizedType = VALID_TYPES.has(type) ? type : "onboarding";

  useEffect(() => {
    if (!successMessage) return undefined;

    const timerId = setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);

    return () => clearTimeout(timerId);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) return undefined;

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, 5000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const typeValue = normalizedType === "offboarding" ? 2 : 1;
  const statusValue = 1;
  const currentUser = useUser();
  const createdByUser = currentUser?.id;

  const normalizeSystemAccessId = (access) => {
    const rawId = access?.id ?? access?.systemAccessId ?? access?.systemId ?? null;
    if (rawId === null || rawId === undefined) return null;

    const rawString = String(rawId).trim();
    if (!rawString) return null;

    const numericId = Number(rawString);
    return Number.isFinite(numericId) ? numericId : rawString;
  };

  const handleSubmit = async (formData) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Match CreateCaseDTO contract from backend.
      const accounts = accesses
        .map(normalizeSystemAccessId)
        .filter((systemAccessId) => systemAccessId !== null)
        .map((systemAccessId) => ({
          systemAccessId,
          status: 0,
        }));

      const isoStartDate = formData.startdate
        ? new Date(`${formData.startdate}T00:00:00`).toISOString()
        : new Date().toISOString();

      const isoEmploymentDate = formData.employmentdate
        ? new Date(`${formData.employmentdate}T00:00:00`).toISOString()
        : new Date().toISOString();

      const isoEndDate = formData.enddate
        ? new Date(`${formData.enddate}T00:00:00`).toISOString()
        : null;

      const casePayload = {
        employee: {
          firstName: formData.firstname.trim(),
          lastName: formData.lastname.trim(),
          title: formData.jobtitle.trim(),
          personalId: formData.personalnumber.trim(),
          phoneNumber: formData.mobile.trim(),
          company: getCompanyValue(formData.company),
          department: formData.department.trim(),
          startDate: isoStartDate,
          endDate: normalizedType === "offboarding" ? isoEndDate : null,
          dateOfEmployment: isoEmploymentDate,
          accounts,
        },
        type: typeValue,
        status: statusValue,
        createdByUser,
      };

      await caseService.createCase(casePayload);
      setSuccessMessage("Ärende skapad framgångsrikt");
      window.scrollTo({ top: 0, behavior: "smooth" });
      
        // Reset form state after successful submit
        setFormData(INITIAL_VALUES);
        setErrors({});
      setAccesses([]);
    } catch {
      setErrorMessage("Kunde inte skapa case");
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    formData,
    errors,
    setFormData,
    setErrors,
    handleChange,
    handleSubmit: handleFormSubmit,
  } = useFormValidation(INITIAL_VALUES, getFormSectionValidationRules(normalizedType), handleSubmit);

  return (
    <div className="form-section">
      {successMessage && (
        <div className="form-alert form-alert-success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="form-alert form-alert-error">
          {errorMessage}
        </div>
      )}

      <form ref={ref} onSubmit={handleFormSubmit}>

        <div className="form-info">

          <div className="form-group">
            <label htmlFor="firstname">Förnamn</label>
            <input 
              type="text" 
              id="firstname"
              name="firstname" 
              placeholder="Förnamn"
              value={formData.firstname}
              onChange={handleChange}
            />
            {errors.firstname && <span className="error-message">{errors.firstname}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Efternamn</label>
            <input 
              type="text" 
              id="lastname"
              name="lastname" 
              placeholder="Efternamn"
              value={formData.lastname}
              onChange={handleChange}
            />
            {errors.lastname && <span className="error-message">{errors.lastname}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="personalnumber">Personnummer</label>
            <input 
              type="text" 
              id="personalnumber"
              name="personalnumber" 
              placeholder="Personnummer"
              value={formData.personalnumber}
              onChange={handleChange}
            />
            {errors.personalnumber && <span className="error-message">{errors.personalnumber}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobilnummer</label>
            <input 
              type="text" 
              id="mobile"
              name="mobile" 
              placeholder="Mobilnummer"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="company">Företag</label>
            <select 
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
            >
              <option value="">Välj företag</option>
              {COMPANY_OPTIONS.map((companyOption) => (
                <option key={companyOption.value} value={companyOption.value}>{companyOption.label}</option>
              ))}
            </select>
            {errors.company && <span className="error-message">{errors.company}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="department">Avdelning</label>
            <input 
              type="text" 
              id="department"
              name="department" 
              placeholder="Avdelning"
              value={formData.department}
              onChange={handleChange}
            />
            {errors.department && <span className="error-message">{errors.department}</span>}
          </div>



          <div className="form-group">
            <label htmlFor="jobtitle">Tjänstetitel</label>
            <input 
              type="text" 
              id="jobtitle"
              name="jobtitle" 
              placeholder="Tjänstetitel"
              value={formData.jobtitle}
              onChange={handleChange}
            />
            {errors.jobtitle && <span className="error-message">{errors.jobtitle}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="startdate">Startdatum</label>
            <input 
              type="date" 
              id="startdate"
              name="startdate" 
              placeholder="Startdatum"
              value={formData.startdate}
              onChange={handleChange}
            />
            {errors.startdate && <span className="error-message">{errors.startdate}</span>}
          </div>

        </div>

        {normalizedType === "offboarding" && (
          <div className="form-group">
            <label htmlFor="enddate">Slutdatum</label>
            <input
              type="date"
              id="enddate"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
            />
            {errors.enddate && <span className="error-message">{errors.enddate}</span>}
          </div>
        )}

        <div className="form-group form-group--half">
          <label htmlFor="employmentdate">Anställningsdag</label>
          <input 
            type="date" 
            id="employmentdate"
            name="employmentdate" 
            placeholder="Anställningsdag"
            value={formData.employmentdate}
            onChange={handleChange}
          />
          {errors.employmentdate && <span className="error-message">{errors.employmentdate}</span>}
        </div>
        
        <SystemAccessList accesses={accesses} setAccesses={setAccesses} />

        <div className="submit">
          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Skickar ärenden..." : "Skicka ärende"}
          </button>
        </div>
      </form>
    </div>
  );
});

FormSection.displayName = 'FormSection';

export default FormSection;
