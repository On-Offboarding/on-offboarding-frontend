
import { Routes, Route } from 'react-router-dom'
import Dashboard from "./pages/Dashboard.jsx";
import Onboarding from "./pages/Onboarding.jsx";
import Offboarding from "./pages/Offboarding.jsx";
import Audit from "./pages/Audit.jsx";
import "./App.css";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/offboarding" element={<Offboarding />} />
      <Route path="/audit" element={<Audit />} />
    </Routes>
  );
}

export default App;
