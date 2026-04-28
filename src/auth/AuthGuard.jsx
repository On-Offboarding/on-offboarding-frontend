import { Navigate } from "react-router-dom";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { useUser } from "../context/UserContext";
import { hasAnyRole } from "./permissions";

export default function AuthGuard({ children, allowedRoles = [], fallbackPath = "/" }) {
  const isAuthenticated = useIsAuthenticated();
  const { inProgress } = useMsal();
  const currentUser = useUser();

  if (inProgress !== InteractionStatus.None) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasAnyRole(currentUser, allowedRoles)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
}