import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  isAuthenticated: false,
  userInfo: {
    userType: "DEFAULT",
    userNickname: "Guest",
    userId: null,
  },
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userInfo = {
        userType: "DEFAULT",
        userNickname: "Guest",
        userId: null,
      };
    },
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
