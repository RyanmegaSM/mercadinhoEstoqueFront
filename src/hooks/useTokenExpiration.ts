import { TOKEN_EXP, TOKEN_KEY } from "@/constants/storage-keys";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export function useTokenExpiration() {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);

  useEffect(() => {
    const expiration = localStorage.getItem(TOKEN_EXP);
    if (!expiration) return;

    const expirationMs = parseInt(expiration, 10) * 1000;
    const now = Date.now();

    const timeLeft = expirationMs - now;

    if (timeLeft <= 0) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXP);
      navigate("/login");
      return;
    }

    const warningTimeout = setTimeout(() => {
      setWarning(true);
    }, Math.max(timeLeft - 5 * 60 * 1000, 0));

    const logoutTimeout = setTimeout(() => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXP);
      navigate("/login");
    }, timeLeft);

    return () => {
      clearInterval(warningTimeout);
      clearInterval(logoutTimeout);
    };
  }, [navigate]);

  return { warning };
}
