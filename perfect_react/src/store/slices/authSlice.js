// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// [MỚI] Import thêm `register`
import { 
  login as apiLogin, 
  logout as apiLogout,
  register as apiRegister // <-- [MỚI]
} from '../../services/authService.js';
import {
  setAuth,
  clearAuth as clearAuthStorage,
  getAccessToken,
  getEmail,
  getRole,
  getUserId
} from '../../utils/auth.js';

// ==== Thunks ====
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const loginResponse = await apiLogin(email, password);
      if (!loginResponse?.accessToken || !loginResponse?.userId) {
        throw new Error("Thông tin đăng nhập trả về không đầy đủ.");
      }
      return loginResponse; // Trả về { accessToken, email, role, userId }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Login failed';
      return rejectWithValue(msg);
    }
  }
);

// [MỚI] Thêm registerUser thunk
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    // userData dự kiến là { fullName, email, password }
    try {
      // Giả định apiRegister trả về cùng cấu trúc với apiLogin
      // { accessToken, email, role, userId }
      const registerResponse = await apiRegister(userData); 
      if (!registerResponse?.accessToken || !registerResponse?.userId) {
        throw new Error("Thông tin đăng ký trả về không đầy đủ.");
      }
      return registerResponse; // Trả về { accessToken, email, role, userId }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || 'Register failed';
      return rejectWithValue(msg);
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await apiLogout();
    return null;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Logout failed';
    return rejectWithValue(msg);
  }
});

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  const email = getEmail();
  const role = getRole();
  const userId = getUserId();
  const token = getAccessToken();

  if (!email || !token || userId === null) throw new Error('No valid session found');

  return { email, role, userId };
});

// ==== State ban đầu ====
const initialState = {
  user:
    getAccessToken() && getUserId() !== null
      ? { email: getEmail(), role: getRole(), userId: getUserId() }
      : null,
  isAuthenticated: !!getAccessToken(),
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    clearAuth(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      // === LOGIN ===
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const { accessToken, email, role, userId } = action.payload;
        
        setAuth({ accessToken, email, role, userId });
        
        state.user = { email, role, userId };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.user = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      })

      // === REGISTER === (Logic giống hệt Login) // [MỚI]
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        // Đăng ký thành công -> tự động đăng nhập
        const { accessToken, email, role, userId } = action.payload;
        
        setAuth({ accessToken, email, role, userId });
        
        state.user = { email, role, userId };
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Register failed';
        state.user = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      })

      // === LOGOUT ===
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        clearAuthStorage();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || null;
        clearAuthStorage();
      })

      // === GET CURRENT USER (từ storage) ===
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // {email, role, userId}
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
