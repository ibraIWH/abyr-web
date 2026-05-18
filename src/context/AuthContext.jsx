import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("abyr_token");
    if (token) {
      api.get("/auth/me")
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem("abyr_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Listen for user updates (e.g., after email verification)
  useEffect(() => {
    const handleUpdate = () => {
      const token = localStorage.getItem("abyr_token");
      if (token) {
        api.get("/auth/me").then(res => setUser(res.data));
      }
    };
    window.addEventListener("userUpdated", handleUpdate);
    return () => window.removeEventListener("userUpdated", handleUpdate);
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("abyr_token", token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, phone) => {
    const res = await api.post("/auth/register", {
      name,
      email,
      password,
      phone: phone || undefined,  // send phone only if provided
    });
    const { token, user: userData } = res.data;
    localStorage.setItem("abyr_token", token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("abyr_token");
    sessionStorage.removeItem("cart");
    setUser(null);
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}