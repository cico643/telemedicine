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

export const addNewRelative = async (id, body) => {
  const { data } = await axios.post(`${baseUrl}/users/${id}/relatives`, body, {
    withCredentials: true,
  });
  return data;
};

export const getSpecificUserRelatives = async (id) => {
  const { data } = await axios.get(`${baseUrl}/users/${id}/relatives`, {
    withCredentials: true,
  });
  return data;
};

export const getSpecificUserMedications = async (id) => {
  const { data } = await axios.get(
    `${baseUrl}/users/${id}/patient-medications`,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const addNewPatientMedication = async (id, body) => {
  const { data } = await axios.post(
    `${baseUrl}/users/${id}/patient-medications`,
    body,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const getAllMedications = async () => {
  const { data } = await axios.get(`${baseUrl}/medications`, {
    withCredentials: true,
  });
  return data;
};
