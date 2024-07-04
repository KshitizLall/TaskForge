// src/Redux/slice/userSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, fetchDashboardOverview, registerUser } from "../../Utils/api";
import Cookies from "js-cookie";

const initialState = {
  firstName: "",
  lastName: "",
  role: "",
  gender: "",
  overview: null,
  status: "idle",
  error: null,
};

export const loginUser = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await login(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchOverview = createAsyncThunk(
  "user/fetchOverview",
  async (_, { getState, rejectWithValue }) => {
    const token = Cookies.get("token");
    try {
      const data = await fetchDashboardOverview(token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registerNewUser = createAsyncThunk(
  "user/register",
  async (formData, { rejectWithValue }) => {
    try {
      const data = await registerUser(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

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
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { first_name, last_name, role, gender } = action.payload.user;
        state.firstName = first_name;
        state.lastName = last_name;
        state.role = role;
        state.gender = gender;
        Cookies.set("token", action.payload.token, {
          expires: action.meta.arg.rememberMe ? 7 : 1,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchOverview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(registerNewUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerNewUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerNewUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
