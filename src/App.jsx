
import { Routes, Route, Navigate } from 'react-router-dom'
import PortalLayout from "./layouts/PortalLayout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Onboarding from "./pages/Onboarding/Onboarding.jsx";
import Offboarding from "./pages/Offboarding/Offboarding.jsx";
import Audit from "./pages/Audit/Audit.jsx";
import Login from "./pages/SignIn/Login.jsx";
import "./App.css";
import CenterWrapperLayout from './layouts/CenterWrapperLayout.jsx';
import AuthGuard from "./auth/AuthGuard.jsx";
import { ROLES } from "./auth/permissions";



function App() {
  return (
    <Routes>
       <Route element={<AuthGuard><PortalLayout /></AuthGuard>}>
        <Route
          path="/"
          element={(
            <AuthGuard allowedRoles={[ROLES.ADMIN, ROLES.CHEF]}>
              <Dashboard />
            </AuthGuard>
          )}
        />
        <Route
          path="/onboarding"
          element={(
            <AuthGuard allowedRoles={[ROLES.CHEF]} fallbackPath="/">
              <Onboarding />
            </AuthGuard>
          )}
        />
        <Route
          path="/offboarding"
          element={(
            <AuthGuard allowedRoles={[ROLES.CHEF]} fallbackPath="/">
              <Offboarding />
            </AuthGuard>
          )}
        />
        <Route
          path="/audit"
          element={(
            <AuthGuard allowedRoles={[ROLES.ADMIN]} fallbackPath="/">
              <Audit />
            </AuthGuard>
          )}
        />
      </Route>

      <Route element={<CenterWrapperLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
