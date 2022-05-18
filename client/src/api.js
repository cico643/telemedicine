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

export const SignOut = async () => {
  await axios.post(`${baseUrl}/auth/signout`, {}, { withCredentials: true });
};

export const getCurrentUser = async () => {
  const { data } = await axios.get(`${baseUrl}/auth/me`, {
    withCredentials: true,
  });
  return data;
};

export const getSpecificUser = async (id, type) => {
  const { data } = await axios.get(`${baseUrl}/users/${id}?type=${type}`, {
    withCredentials: true,
  });
  return data;
};
