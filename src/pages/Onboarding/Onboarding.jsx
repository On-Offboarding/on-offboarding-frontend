import React, { useState } from "react";
import ToggleType from "../../components/Form/ToggleType";
import FormSection from "../../components/Form/FormSection";

import "./Onboarding.css";


function Onboarding() {
  const [type, setType] = useState("onboarding");
  return (
    <>
      <div className="page-title">
        <i className="fa-solid fa-user-plus"></i>
        <h2 className="form-title"> Skapa nytt ärende</h2>
      </div>

      <div className="form-wrapper">
        
        <ToggleType type={type} setType={setType} />
        <FormSection type={type} />
      

        <div className="submit">
          <button className="submit-btn">Skicka ärende</button>
        </div>
      </div>

    
    </>

  );
}

export default Onboarding;