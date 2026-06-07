import { createContext, useContext, useState } from "react";
import { getUsers, saveSession, clearSession, addUser, updateUser, addLog } from "../services/localStorageService";

const AuthContext = createContext();

const ADMIN = { id: "admin-1", username: "admin", password: "admin123", role: "admin", name: "Administrator", email: "admin@examportal.com" };

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { const s = localStorage.getItem("ep_session"); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  const register = (data) => {
    const users = getUsers();
    if (users.find(u => u.username === data.username)) return { ok: false, error: "Username already exists" };
    if (users.find(u => u.email === data.email)) return { ok: false, error: "Email already registered" };
    const newUser = { ...data, id: `u-${Date.now()}`, role: "student", joinedAt: new Date().toISOString() };
    addUser(newUser);
    addLog(`New student registered: ${data.name}`, "👤");
    return { ok: true };
  };

  const login = (username, password) => {
    if (username === ADMIN.username && password === ADMIN.password) {
      const { password: _, ...safe } = ADMIN;
      setUser(safe); saveSession(safe);
      addLog("Admin logged in", "🔐");
      return { ok: true, role: "admin" };
    }
    const found = getUsers().find(u => u.username === username && u.password === password);
    if (found) {
      const { password: _, ...safe } = found;
      setUser(safe); saveSession(safe);
      addLog(`Student logged in: ${found.name}`, "🔑");
      return { ok: true, role: "student" };
    }
    return { ok: false, error: "Invalid username or password" };
  };

  const logout = () => { setUser(null); clearSession(); };

  const updateProfile = (data) => {
    const updated = { ...user, ...data };
    setUser(updated); saveSession(updated);
    if (user.role === "student") updateUser(user.id, data);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile, isAdmin: user?.role === "admin", isStudent: user?.role === "student" }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
