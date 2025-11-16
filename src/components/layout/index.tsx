import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "@/contexts/auth/use-auth";
import { useEffect } from "react";
import { useTokenExpiration } from "@/hooks/useTokenExpiration";

export function Layout() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { warning } = useTokenExpiration();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex h-screen w-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-800">
          {warning && (
            <div className="fixed bottom-4 right-4 bg-yellow-500 text-white p-3 rounded shadow">
              Sua sessão vai encerrar em 5 minutos
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
