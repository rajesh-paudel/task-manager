import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "../types/user";
interface AuthState {
  userProfile: UserProfile | null;
  loading: boolean;
}

const initialState: AuthState = {
  userProfile: null,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.userProfile = action.payload;
      state.loading = false;
    },
    clearProfile: (state) => {
      state.userProfile = null;
      state.loading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setProfile, clearProfile, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;
