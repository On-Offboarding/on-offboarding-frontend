import React, { useEffect, useState } from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/msalConfig";
import { initAuth } from "./auth/bootstrapAuth.js";

function Root() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initAuth().then(() => {
        const accounts = msalInstance.getAllAccounts();
        if(accounts.length > 0)
          navigate("/")
      }); 
      setIsReady(true);
    };

    init();
  }, []);

  if (!isReady) {
    return <div>Loading...</div>; 
  }
  return (
    <MsalProvider instance={msalInstance}>
      <BrowserRouter>
        <App />
    </BrowserRouter>
    </MsalProvider>
  );
}


createRoot(document.getElementById('root')).render(
 <Root /> 
)