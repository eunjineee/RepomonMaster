import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface authStateInterface {
  login: boolean;
}

const initialState: authStateInterface = {
  login: false,
};

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuthLoginState: (state) => {
      state.login = true;
    },
    setAuthLogoutState: (state) => {
      state.login = false;
    },
  },
});

export const { setAuthLoginState, setAuthLogoutState } = authSlice.actions;

export default authSlice.reducer;
