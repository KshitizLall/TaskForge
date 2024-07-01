import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firstName: "",
  lastName: "",
  role: "",
  gender: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { firstName, lastName, role, gender } = action.payload;
      state.firstName = firstName;
      state.lastName = lastName;
      state.role = role;
      state.gender = gender;
    },
    clearUser: (state) => {
      state.firstName = "";
      state.lastName = "";
      state.role = "";
      state.gender = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
