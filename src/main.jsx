import React, { useEffect, useState } from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/msalConfig";
import { initAuth } from "./auth/bootstrapAuth.js";
import { UserContext } from "./context/UserContext.jsx";

function Root() {
  const [isReady, setIsReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const user = await initAuth();
      if (user) setCurrentUser(user);
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
        <UserContext.Provider value={currentUser}>
          <App />
        </UserContext.Provider>
      </BrowserRouter>
    </MsalProvider>
  );
}


createRoot(document.getElementById('root')).render(
 <Root /> 
)