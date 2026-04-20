import React from 'react'
import { useFormValidation } from '../../hooks/useFormValidation';
import { loginValidationRules } from '../../utils/validators';
import "../Form/LoginForm.css";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../../auth/msalConfig.js";

function LoginForm() {
  const { instance } = useMsal();
  const initialValues = {
    email: ''
  };

  const handleSubmit = async (formData) => {
    console.log('Formulär är giltigt:', formData);
    await instance.loginRedirect({...loginRequest, redirectStartPage: window.location.pathname});
    // Här kan du skicka data till servern
  };

  const { formData, errors, handleChange, handleSubmit: handleFormSubmit } = 
    useFormValidation(initialValues, loginValidationRules, handleSubmit);

  return (
    <div className="login-form">

      <div className="form-header">
        <h2>Login</h2>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="text" 
            id="email"
            name="email" 
            placeholder="Enter Your email adress"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        {/* <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password"
            name="password" 
            placeholder="Enter Your password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div> */}

        <div className="submit">
          <button id='login-btn' type="submit" className="submit-btn">
            Login with Azure
          </button>
        </div>
        
      </form>


    </div>
  )
}

export default LoginForm