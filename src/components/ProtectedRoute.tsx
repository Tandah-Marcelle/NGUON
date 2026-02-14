import { Navigate } from "react-router-dom";
import { authService } from "@/lib/auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
