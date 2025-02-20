import axios from "axios";

const API_BASE = "https://dummyjson.com"; // Replace with your actual API endpoints if available

export const login = async (email: string, password: string) => {
  return await axios.post(`${API_BASE}/auth/login`, { email, password });
};

export const register = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  return await axios.post(`${API_BASE}/users/add`, { name, email, password });
};

export const fetchProfile = async () => {
  const token = localStorage.getItem("token");
  // Simulate profile fetch – include token in headers if needed
  return await axios.get(`${API_BASE}/users/1`, { headers: { Authorization: token } });
};

export const getRideHistory = async () => {
  // Dummy ride history endpoint
  return await axios.get(`${API_BASE}/rides`);
};

export const processPayment = async (paymentInfo: any) => {
  // Dummy payment processing endpoint
  return await axios.post(`${API_BASE}/payments`, paymentInfo);
};

export const submitFeedback = async (feedback: { rating: number; comment: string }) => {
  // Dummy feedback submission endpoint
  return await axios.post(`${API_BASE}/feedback`, feedback);
};

export const getLoyaltyInfo = async () => {
  // Dummy loyalty info endpoint; returns points and discount
  return await axios.get(`${API_BASE}/loyalty`);
};
