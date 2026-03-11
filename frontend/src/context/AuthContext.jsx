import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getMe, login as loginApi, register as registerApi } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("campushub_token");
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        setUser(res.user);
      } catch (_err) {
        localStorage.removeItem("campushub_token");
        localStorage.removeItem("campushub_user");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = async (payload) => {
    const res = await loginApi(payload);
    localStorage.setItem("campushub_token", res.token);
    localStorage.setItem("campushub_user", JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const register = async (payload) => {
    const res = await registerApi(payload);
    localStorage.setItem("campushub_token", res.token);
    localStorage.setItem("campushub_user", JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("campushub_token");
    localStorage.removeItem("campushub_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
