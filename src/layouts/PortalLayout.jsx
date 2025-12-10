import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Nav from "../components/Nav/Nav";

function PortalLayout() {
  return (
    <div className="portal-wrapper">
      <Header />
      <Nav />
      <main>
        <Outlet /> 
      </main>
    </div>
  );
}

export default PortalLayout;
