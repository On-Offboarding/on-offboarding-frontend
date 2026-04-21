import { Navigate } from "react-router-dom";
import { msalInstance } from "./msalConfig";

export default function AuthGuard({ children }) {
  const account = msalInstance.getActiveAccount();

  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return children;
}