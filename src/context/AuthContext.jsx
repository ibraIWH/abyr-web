import { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check if token exists and fetch user
  useEffect(() => {
    const token = localStorage.getItem("abyr_token");
    if (token) {
      // Fetch user profile
      api.get("/auth/me")
        .then(res => setUser(res.data))
        .catch(() => {
          // Token invalid or expired
          localStorage.removeItem("abyr_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("abyr_token", token);
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem("abyr_token", token);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("abyr_token");
    sessionStorage.removeItem("cart");     // clear cart on logout
    setUser(null);
    window.dispatchEvent(new Event("cartUpdated"));
    window.location.href = "/";           // full reload to reset everything
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