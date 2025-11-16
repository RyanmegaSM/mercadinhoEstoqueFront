import { Navigate } from "react-router";
import { useAuth } from "@/contexts/auth/use-auth";

interface ProtectedRoutesProps {
  children: React.ReactNode;
}

export function ProtectedRoutes({ children }: ProtectedRoutesProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
