import { useEffect, useState, forwardRef } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { formSectionValidationRules } from "../../utils/validators";
import SystemAccessList from "../../components/Form/SystemAccessList";
import { caseService } from "../../Api";
import "../Form/FormSection.css";



const FormSection = forwardRef(({ type = "onboarding" }, ref) => {
  const [accesses, setAccesses] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const typeValue = type === "offboarding" ? 2 : 1;
  const statusValue = 1;
  const createdByUser = 0;

  const companyMap = {
    finansia: 1,
    agency: 2,
  };

  const initialValues = {
    firstname: '',
    lastname: '',
    personalnumber: '',
    mobile: '',
    company: '',
    department: '',
    jobtitle: '',
    startdate: '',
    employmentdate: ''
  };

  const {
    formData,
    errors,
    setFormData,
    setErrors,
    handleChange,
    handleSubmit: handleFormSubmit,
  } = useFormValidation(initialValues, formSectionValidationRules, handleSubmit);

  const normalizeSystemAccessId = (access) => {
    const rawId = access?.id ?? access?.systemAccessId ?? access?.systemId ?? null;
    if (rawId === null || rawId === undefined) return null;

    const rawString = String(rawId).trim();
    if (!rawString) return null;

    const numericId = Number(rawString);
    return Number.isFinite(numericId) ? numericId : rawString;
  };

  async function handleSubmit(formData) {
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

      const casePayload = {
        employee: {
          firstName: formData.firstname.trim(),
          lastName: formData.lastname.trim(),
          title: formData.jobtitle.trim(),
          personalId: formData.personalnumber.trim(),
          phoneNumber: formData.mobile.trim(),
          company: companyMap[formData.company] ?? 0,
          department: formData.department.trim(),
          startDate: isoStartDate,
          endDate: type === "offboarding" ? isoEmploymentDate : null,
          dateOfEmployment: isoEmploymentDate,
          accounts,
        },
        type: typeValue,
        status: statusValue,
        createdByUser,
      };

      console.log('Sending payload:', casePayload);

      await caseService.createCase(casePayload);
      setSuccessMessage("Ärende skapad framgångsrikt");
      window.scrollTo({ top: 0, behavior: "smooth" });
      
        // Reset form state after successful submit
        setFormData(initialValues);
        setErrors({});
      setAccesses([]);
    } catch (error) {
      console.error('Error creating case:', error);
      console.error('Response data:', error.data);
      
      // Format validation errors from backend
      if (error.data?.errors) {
        const fieldErrors = Object.entries(error.data.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        console.error('Field validation errors:', fieldErrors);
      }

      setErrorMessage("Kunde inte skapa case");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="form-section">
      {successMessage && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
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
              <option value="finansia">Finansia</option>
              <option value="agency">Agency</option>
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

        <div className="form-group">
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
            {isSubmitting ? "⏳ Skickar ärenden..." : "Skicka ärende"}
          </button>
        </div>
      </form>
    </div>
  );
});

FormSection.displayName = 'FormSection';

export default FormSection;
