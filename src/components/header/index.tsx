import { LogOutIcon, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth/use-auth";
import { useThemeContext } from "@/contexts/theme/use-theme-context";

export function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useThemeContext();
  const navigate = useNavigate();

  function createAvatarLetters(username: string) {
    const [name, surname] = username.split(" ");

    if (!surname) {
      const inicials = name[0].toUpperCase();
      return inicials;
    }

    const inicials = `${name[0].toUpperCase()}${surname[0].toUpperCase()}`;
    return inicials;
  }

  return (
    <header className="h-16 border-b bg-white dark:bg-gray-900 px-6 flex items-center justify-end ">
      <div className="flex items-center gap-4">
        <Button
          className="cursor-pointer"
          variant={"ghost"}
          size={"sm"}
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Sun className="h-5 w-5" />
          )}
        </Button>
        
        {user && (
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>

            <Avatar>
              <AvatarFallback>{createAvatarLetters(user.name)}</AvatarFallback>
            </Avatar>

            <Button
              className="cursor-pointer"
              variant={"ghost"}
              size={"sm"}
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOutIcon className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
