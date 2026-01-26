import { useState } from "react";
import { useFormValidation } from "../../hooks/useFormValidation";
import { formSectionValidationRules } from "../../utils/validators";
import SystemAccessList from "../../components/Form/SystemAccessList";
import "../Form/FormSection.css";



function FormSection() {
  const [accesses, setAccesses] = useState([]);

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

  const handleSubmit = (formData) => {
    console.log('Formulär är giltigt:', formData);
    // Här kan du skicka data till servern
  };

  const { formData, errors, handleChange, handleSubmit: handleFormSubmit } = 
    useFormValidation(initialValues, formSectionValidationRules, handleSubmit);

  return (
    <div className="form-section">
      <form onSubmit={handleFormSubmit}>

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

      </form>
    </div>
  );
}

export default FormSection;
