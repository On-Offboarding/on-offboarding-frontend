import React, { useState } from "react";
import ToggleType from "../../components/Form/ToggleType";
import "./Offboarding.css";

function Offboarding() {
  const [type, setType] = useState("offboarding");

  return (
    <>

    
      <div className="page-title">
        <i className="fa-solid fa-user-minus users-icon"></i>
        <h2 className="form-title"> Offboarding - Anställda</h2>
      </div>

      <div className="form-wrapper">
        {/* Toggle */}
        <ToggleType type={type} setType={setType} />
      </div>
    </>

  )
}

export default Offboarding