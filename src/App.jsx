
import { Routes, Route } from 'react-router-dom'
import PortalLayout from "./layouts/PortalLayout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Onboarding from "./pages/Onboarding/Onboarding.jsx";
import Offboarding from "./pages/Offboarding/Offboarding.jsx";
import Audit from "./pages/Audit/Audit.jsx";
import Login from "./pages/SignIn/Login.jsx";
import "./App.css";
import CenterWrapperLayout from './layouts/CenterWrapperLayout.jsx';
import AuthGuard from "./auth/AuthGuard.jsx";



function App() {
  return (
    <Routes>
       <Route element={<AuthGuard><PortalLayout /></AuthGuard>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/offboarding" element={<Offboarding />} />
        <Route path="/audit" element={<Audit />} />
      </Route>

      <Route element={<CenterWrapperLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
