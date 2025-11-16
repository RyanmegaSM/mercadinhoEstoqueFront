import { useState } from "react";
import { NavLink } from "react-router";
import { Home, Package, ShoppingCart, Users, Menu, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { useAuth } from "@/contexts/auth/use-auth";
import { AccessTypes } from "@/constants/access-types";

const navItems = [
  {
    to: "/",
    label: "Home",
    icon: Home,
    allowedAccess: [
      AccessTypes.ADMIN,
      AccessTypes.MANAGER,
      AccessTypes.EMPLOYEE,
    ],
  },
  {
    to: "/users",
    label: "Usuários",
    icon: Users,
    allowedAccess: [AccessTypes.ADMIN],
  },
  {
    to: "/products",
    label: "Produtos",
    icon: ShoppingCart,
    allowedAccess: [
      AccessTypes.ADMIN,
      AccessTypes.MANAGER,
      AccessTypes.EMPLOYEE,
    ],
  },
  {
    to: "/batches",
    label: "Lotes",
    icon: Package,
    allowedAccess: [
      AccessTypes.ADMIN,
      AccessTypes.MANAGER,
      AccessTypes.EMPLOYEE,
    ],
  },
  {
    to: "/suppliers",
    label: "Fornecedores",
    icon: Users,
    allowedAccess: [
      AccessTypes.ADMIN,
      AccessTypes.MANAGER,
      AccessTypes.EMPLOYEE,
    ],
  },
  {
    to: "/stockMovimentation",
    label: "Movimentações",
    icon: Users,
    allowedAccess: [AccessTypes.ADMIN, AccessTypes.MANAGER],
  },
];

export function Sidebar() {
  const [open, setOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex">
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r transition-all duration-300 flex flex-col",
          open ? "w-64" : "w-0 overflow-hidden"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Mercadinho JS</h1>
          <button
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          {navItems
            .filter((item) =>
              item.allowedAccess.includes(user?.accessType as 1 | 2 | 3)
            )
            .map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
                    isActive && "bg-gray-200 dark:bg-gray-700 font-medium"
                  )
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
        </nav>
      </aside>

      {!open && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      <main
        className={cn(
          "flex-1 transition-all duration-300",
          open ? "ml-64" : "ml-0"
        )}
      ></main>
    </div>
  );
}
