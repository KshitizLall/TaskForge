import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/userSlice";
import themeReducer from "./slice/themeSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
});

export default store;
