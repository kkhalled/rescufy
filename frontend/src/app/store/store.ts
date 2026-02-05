import { roleReducer } from "@/features/auth/store/auth.slice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    roleReducer,
  },
});
