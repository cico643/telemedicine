import axios from "axios";

const baseUrl = "http://localhost:5000";

export const SignIn = async (body) => {
  const { data } = await axios.post(`${baseUrl}/auth/signin`, body, {
    withCredentials: true,
  });
  return data;
};

export const SignUp = async (body) => {
  const { data } = await axios.post(`${baseUrl}/auth/signup`, body);

  return data;
};

export const getCurrentUser = async () => {
  const { data } = await axios.get(`${baseUrl}/auth/me`, {
    withCredentials: true,
  });
  return data;
};
