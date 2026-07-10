import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * UI-only mock auth context.
 * Firebase logic will be wired in later — for now this simulates login/logout
 * state (persisted to localStorage) so the profile dropdown can show the correct
 * menu items across page reloads.
 */

const AuthContext = createContext({
  user: null,
  login: () => {},
  signup: () => {},
  logout: () => {},
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

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = ({ email, name }) => {
    setUser({
      email,
      name: name || email.split("@")[0],
      avatar: null,
      loggedInAt: new Date().toISOString(),
    });
  };

  const signup = ({ email, name }) => login({ email, name });

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
