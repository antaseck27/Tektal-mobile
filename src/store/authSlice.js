import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    updateUser(state, action) {
      state.user = { ...(state.user || {}), ...action.payload };
    },
  },
});

export const { setAuth, clearAuth, updateUser } = authSlice.actions;
export default authSlice.reducer;
