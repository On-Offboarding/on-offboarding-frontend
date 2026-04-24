import "../Form/LoginForm.css";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../auth/msalConfig.js";

function LoginForm() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect({ ...loginRequest, redirectStartPage: '/' });
  };

  return (
    <div className="login-form">
      <div className="form-header">
        <h2>Login</h2>
      </div>
      <div className="submit">
        <button id="login-btn" className="submit-btn" onClick={handleLogin}>
          Login with Azure
        </button>
      </div>
    </div>
  );
}

export default LoginForm;
