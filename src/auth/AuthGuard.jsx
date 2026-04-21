import { Navigate } from "react-router-dom";
import { useIsAuthenticated } from "@azure/msal-react";

export default function AuthGuard({ children }) {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}