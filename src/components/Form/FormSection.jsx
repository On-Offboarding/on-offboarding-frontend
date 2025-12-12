function FormSection() {
  return (
    <div className="form-section">


      <form action="">

        <div className="form-info">

          <div className="form-group">
            <label htmlFor="firstname">Förnamn</label>
            <input type="text" name="firstname" placeholder="Förnamn" />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Efternamn</label>
            <input type="text" name="lastname" placeholder="Efternamn" />
          </div>

          <div className="form-group">
            <label htmlFor="personalnumber">Personnummer</label>
            <input type="text" name="personalnumber" placeholder="Personnummer" />
          </div>

          <div className="form-group">
            <label htmlFor="mobile">Mobilnummer</label>
            <input type="number" name="mobile" placeholder="Mobilnummer" />
          </div>

          <div className="form-group">
            <label htmlFor="company">Företag</label>
            <select name="company">
              <option>Välj företag</option>
              <option>Finansia</option>
              <option>Agency</option>
            </select>      
          </div>

          <div className="form-group">
            <label htmlFor="department">Avdelning</label>
            <input type="text" name="department" placeholder="Avdelning" />
          </div>



          <div className="form-group">
            <label htmlFor="jobtitle">Tjänstetitel</label>
            <input type="text" name="jobtitle" placeholder="Tjänstetitel" />
          </div>

          <div className="form-group">
            <label htmlFor="startdate">Startdatum</label>
            <input type="date" name="startdate" placeholder="Startdatum" />
          </div>

        </div>

        <div className="form-group">
          <label htmlFor="employmentdate">Anställningsdag</label>
          <input type="date" name="employmentdate" placeholder="Anställningsdag" />
        </div>
        
      </form>
    </div>
  );
}

export default FormSection;
