// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   isAuthenticated: false,
//   user: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     setAuth(state, action) {
//       state.isAuthenticated = true;
//       state.user = action.payload;
//     },
//     clearAuth(state) {
//       state.isAuthenticated = false;
//       state.user = null;
//     },
//   },
// });

// export const { setAuth, clearAuth } = authSlice.actions;
// export default authSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  role: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthStart(state) {
      state.loading = true;
      state.error = null;
    },
    setAuth(state, action) {
      const user = action.payload || null;
      state.isAuthenticated = !!user;
      state.user = user;
      state.role = user?.role || null;
      state.loading = false;
      state.error = null;
    },
    setAuthError(state, action) {
      state.loading = false;
      state.error = action.payload || "Erreur d'authentification";
    },
    updateUser(state, action) {
      if (!state.user) return;
      state.user = { ...state.user, ...action.payload };
      state.role = state.user?.role || null;
    },
    clearAuth(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.role = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setAuthStart, setAuth, setAuthError, updateUser, clearAuth } =
  authSlice.actions;

export default authSlice.reducer;
