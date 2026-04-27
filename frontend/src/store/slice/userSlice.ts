import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
  isEmailVerified: boolean;
  isLoginDialogOpen: boolean;
  isLoggedIn: boolean;
}

const initialState: UserState = {
  user: null,
  isEmailVerified: false,
  isLoginDialogOpen: false,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setEmailVerified: (state, action: PayloadAction<any>) => {
      state.isEmailVerified = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.isEmailVerified = false;
    },
    toggleLoginDialog: (state) => {
      state.isLoginDialogOpen = !state.isLoginDialogOpen;
    },
    authStatus: (state) => {
      state.isLoggedIn = true;
      // state.isLoggedIn = !state.isLoggedIn; // For authentication, this is usually not good design:
      // user could accidentally toggle logout/login
    },
  },
});
// setUser inside the slice is the reducer, but setUser you export from .actions
// is an action creator that triggers that reducer.
export const {
  setUser,
  setEmailVerified,
  logout,
  toggleLoginDialog,
  authStatus,
} = userSlice.actions;
export default userSlice.reducer;
