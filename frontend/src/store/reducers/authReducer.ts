import { AuthReducerStateTypes } from "@/types";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserReducer {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const initialState = {
  user: null,
  token: "",
  listUsers: { users: [] },
} as unknown as AuthReducerStateTypes;

export const AuthSlice = createSlice({
  name: "authUser",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<AuthReducerStateTypes>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null as unknown as UserReducer;
      state.token = "";
    },
  },
});

export const { loginAction, logout } = AuthSlice.actions;

export default AuthSlice.reducer;
