import { useState, useEffect, useCallback } from "react";

import { getToken, signIn, signOut } from "@/services/auth/auth-service";
import type { User } from "@/interfaces/user";
import { AuthContext } from "./auth-context";
import { decodeToken } from "@/helpers/decode-token-helper";
import { TOKEN_EXP } from "@/constants/storage-keys";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const decoded = decodeToken(token);
      setUser({
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
        accessType: decoded.accessType,
      });
      localStorage.setItem(TOKEN_EXP, decoded.exp);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await signIn(email, password);
    setUser({
      id: user.id,
      email: user.email,
      name: user.name,
      accessType: user.accessType,
    });
  }, []);

  const logout = useCallback(() => {
    signOut();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
