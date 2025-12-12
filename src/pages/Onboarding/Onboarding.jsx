import React, { useState } from "react";
import ToggleType from "../../components/Form/ToggleType";
import FormSection from "../../components/Form/FormSection";
import SystemAccessList from "../../components/Form/SystemAccessList";
import "./Onboarding.css";


function Onboarding() {
  const [type, setType] = useState("onboarding");
    const [accesses, setAccesses] = useState([]);
  return (
    <>
      <div className="page-title">
        <i className="fa-solid fa-user-plus"></i>
        <h2 className="form-title"> Skapa nytt ärende</h2>
      </div>

      <div className="form-wrapper">
        
        <ToggleType type={type} setType={setType} />
        <FormSection type={type} />
        <SystemAccessList accesses={accesses} setAccesses={setAccesses} />
      </div>

    
    </>

  );
}

export default Onboarding;