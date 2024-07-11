// src/api.js

import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_LOCAL_HOST;

export const login = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/users/login`,
    formData
  );
  return response.data;
};

export const fetchDashboardOverview = async (token) => {
  const response = await axios.get(`${API_BASE_URL}/api/dashboard/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const registerUser = async (formData) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/users/signup`,
    formData
  );
  return response.data;
};
