"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  country?: string;
  phone?: string;
  bio?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    country?: string;
    phone?: string;
  }) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function setAuthCookie(token: string) {
  await fetch("/api/auth/set-cookie", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

async function clearAuthCookie() {
  await fetch("/api/auth/set-cookie", { method: "DELETE" });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && !!token;

  const fetchUser = useCallback(async (authToken: string) => {
    try {
      const response = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await response.json();

      if (data.success) {
        setUser(data.data);
      } else {
        localStorage.removeItem("token");
        await clearAuthCookie();
        setToken(null);
        setUser(null);
      }
    } catch {
      localStorage.removeItem("token");
      await clearAuthCookie();
      setToken(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      setAuthCookie(storedToken);
      fetchUser(storedToken).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!data.success) {
        return { error: data.error };
      }

      const { token: newToken, user: newUser } = data.data;

      // ✅ cookie از login route مستقیم set میشه — نیازی به set-cookie جداگانه نیست
      // ولی localStorage رو هم sync میکنیم برای client-side
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);

      // ✅ FIX: redirect به صفحه قبلی یا dashboard
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get("redirect") || "/dashboard";
      router.push(redirectTo);

      return {};
    } catch {
      return { error: "Network error. Please try again." };
    }
  };

  const register = async (registerData: {
    name: string;
    email: string;
    password: string;
    country?: string;
    phone?: string;
  }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!data.success) {
        return { error: data.error };
      }

      const { token: newToken, user: newUser } = data.data;

      localStorage.setItem("token", newToken);
      await setAuthCookie(newToken);
      setToken(newToken);
      setUser(newUser);

      router.push("/dashboard");
      return {};
    } catch {
      return { error: "Network error. Please try again." };
    }
  };

  const logout = async () => {
    localStorage.removeItem("token");
    await clearAuthCookie();
    setToken(null);
    setUser(null);
    router.push("/");
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
