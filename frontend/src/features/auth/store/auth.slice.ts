import { createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type { Role } from "../types/auth.types";

interface RoleState {
  role: Role | null;
  isAuthenticated: boolean;
}

const initialState: RoleState = {
  role: null,
  isAuthenticated: false,
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<Role>) {
      state.role = action.payload;
      state.isAuthenticated = true;
    },
    clearRole(state) {
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export const roleReducer = roleSlice.reducer;

// Selectors
export const selectRole = (state: { roleReducer: RoleState }) => state.roleReducer.role;
export const selectIsAuthenticated = (state: { roleReducer: RoleState }) => state.roleReducer.isAuthenticated;
