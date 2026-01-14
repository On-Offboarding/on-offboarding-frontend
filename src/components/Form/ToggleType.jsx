import { useNavigate } from "react-router-dom";

function ToggleType({ type, setType }) {
  const navigate = useNavigate();

  const handleSet = (value) => {
    setType(value);
    if (value === "offboarding") {
      navigate("/offboarding");
    }
    if (value === "onboarding") {
      navigate("/onboarding");
    }
  };

  return (

    <>
        <div className="toggle-title">
          <h3>Typ av ärende</h3>
        </div>
        
      <div className="toggle-wrapper">
        <button
          className={`toggle-btn ${type === "onboarding" ? "active" : ""}`}
          onClick={() => handleSet("onboarding")}
        >
          <i class="fa-solid fa-user-plus user-plus"></i> Onboarding
        </button>

        <button
          className={`toggle-btn offboarding-btn ${type === "offboarding" ? "active" : ""}`}
          onClick={() => handleSet("offboarding")}
        > <i class="fa-solid fa-user-minus users-icon"></i> Offboarding
        </button>
      </div>
    
    </>
  );
}

export default ToggleType;
