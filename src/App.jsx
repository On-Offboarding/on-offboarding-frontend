
import { Routes, Route } from 'react-router-dom'
import PortalLayout from "./layouts/PortalLayout.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Onboarding from "./pages/Onboarding/Onboarding.jsx";
import Offboarding from "./pages/Offboarding/Offboarding.jsx";
import Audit from "./pages/Audit.jsx";
import Login from "./pages/Login.jsx";
import "./App.css";



function App() {
  return (
    <Routes>
      <Route element={<PortalLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/offboarding" element={<Offboarding />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/audit" element={<Audit />} />
    </Routes>
  );
}

export default App;
