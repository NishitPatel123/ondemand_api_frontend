import axios from "axios";
import Cookies from "js-cookie";

const BASE = "http://localhost:8000";

// Attach JWT token from cookie to every request automatically
// NOTE: Do NOT set Content-Type here — axios must auto-set it for FormData
// (multipart/form-data with correct boundary) for image uploads to work
axios.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // If sending FormData, delete any manually set Content-Type so axios
  // can set the correct multipart/form-data boundary automatically
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

export const signup = (data) => axios.post(`${BASE}/signup`, data);
export const login = (data) => axios.post(`${BASE}/login`, data);
export const logout = () => axios.get(`${BASE}/logout`);
export const changePassword = (data) => axios.post(`${BASE}/changePassword`, data);
export const sendOTP = (data) => axios.post(`${BASE}/sendOTP`, data);
export const verifyOTP = (data) => axios.post(`${BASE}/verifyOTP`, data);
export const getCategories = () => axios.get(`${BASE}/categories`);
export const getServices = (params) => axios.get(`${BASE}/services`, { params });
export const getServiceDetails = (id) => axios.get(`${BASE}/services/${id}`);
export const getFeedbacks = () => axios.get(`${BASE}/feedbacks`);
export const getProfile = () => axios.get(`${BASE}/user/profile`);
export const updateProfile = (data) => axios.post(`${BASE}/user/updateProfile`, data);
export const bookService = (data) => axios.post(`${BASE}/user/bookService`, data);
export const myBookings = () => axios.get(`${BASE}/user/myBookings`);
export const cancelBooking = (data) => axios.post(`${BASE}/user/cancelBooking`, data);
export const rescheduleBooking = (data) => axios.post(`${BASE}/user/rescheduleBooking`, data);
export const genOrderId = (data) => axios.post(`${BASE}/user/genOrderId`, data);
export const verifyPayment = (data) => axios.post(`${BASE}/user/verifyPayment`, data);
export const addFeedback = (data) => axios.post(`${BASE}/user/addFeedback`, data);
