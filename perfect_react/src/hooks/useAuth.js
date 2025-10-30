<<<<<<< HEAD
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getCurrentUser,
  clearError 
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state) => state.auth
  );

  const login = useCallback(async (credentials) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const register = useCallback(async (userData) => {
    try {
      await dispatch(registerUser(userData)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const fetchCurrentUser = useCallback(async () => {
    try {
      await dispatch(getCurrentUser()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    clearAuthError,
  };
};
=======
// src/hooks/useAuth.js
import { useState, useEffect, useCallback } from "react";
import { login as doLogin, logout as doLogout } from "../services/authService";
import { getAccessToken } from "../services/httpClient";

export default function useAuthState() {
  const [accessToken, setToken] = useState(() => getAccessToken());
  const [email, setEmail] = useState(null);
  const [role, setRole] = useState(null); // "ROLE_USER" | "ROLE_ADMIN"

  const login = useCallback(async (email, password) => {
    const info = await doLogin(email, password);
    setToken(info.accessToken);
    setEmail(info.email);
    setRole(info.role);
  }, []);

  const logout = useCallback(async () => {
    await doLogout();
    setToken(null);
    setEmail(null);
    setRole(null);
  }, []);

  // khi reload nếu cần có thể decode token để lấy email/role (nếu token có claims),
  // ở đây để trống cho gọn.

  useEffect(() => {
    // có thể gọi getMe() để fill email/role nếu BE có endpoint /api/me
  }, []);

  return { accessToken, email, role, login, logout };
}
>>>>>>> origin/tan
