import React, { createContext, useContext, useEffect, useState } from "react";
import {
  authStorage,
  fetchCurrentUser,
  fetchGoogleConfig,
  loginUser,
  logoutUser,
  signupUser,
} from "../lib/api";

const AuthContext = createContext({
  user: null,
  loading: true,
  googleAuth: { enabled: false, client_id: null, redirect_uri: null },
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
});

const STORAGE_KEY = "fp-auth-user";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [googleAuth, setGoogleAuth] = useState({
    enabled: false,
    client_id: null,
    redirect_uri: null,
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  useEffect(() => {
    let active = true;

    const bootstrap = async () => {
      try {
        const config = await fetchGoogleConfig();
        if (active) setGoogleAuth(config);
      } catch {
        if (active) {
          setGoogleAuth({
            enabled: false,
            client_id: null,
            redirect_uri: null,
          });
        }
      }

      const token = authStorage.getToken();
      if (!token) {
        if (active) setLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (active) setUser(currentUser);
      } catch {
        authStorage.clearToken();
        if (active) setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    bootstrap();

    return () => {
      active = false;
    };
  }, []);

  const login = async ({ email, password }) => {
    const response = await loginUser({ email, password });
    authStorage.setToken(response.access_token);
    setUser(response.user);
    return response.user;
  };

  const signup = async ({ full_name, email, password }) => {
    const response = await signupUser({ full_name, email, password });
    authStorage.setToken(response.access_token);
    setUser(response.user);
    return response.user;
  };

  const logout = async () => {
    try {
      if (authStorage.getToken()) {
        await logoutUser();
      }
    } catch {
      // Clear local state even if the backend request fails.
    } finally {
      authStorage.clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, googleAuth, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
