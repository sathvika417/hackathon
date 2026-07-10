import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const fetchOccupations = async () => {
  const { data } = await axios.get(`${API}/occupations`);
  return data;
};

export const predictAutomation = async (payload) => {
  const { data } = await axios.post(`${API}/predict`, payload);
  return data;
};
