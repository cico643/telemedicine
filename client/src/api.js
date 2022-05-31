import axios from "axios";

const baseUrl = "http://localhost:5000";

////////////////////////              AUTH

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

////////////////////////              RELATIVES

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

////////////////////////              MEDICATIONS

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

////////////////////////              DIAGNOSES

export const getSpecificUserDiagnoses = async (id) => {
  const { data } = await axios.get(`${baseUrl}/users/${id}/patient-diagnoses`, {
    withCredentials: true,
  });
  return data;
};

export const addNewPatientDiagnose = async (id, body, type) => {
  const { data } = await axios.post(
    `${baseUrl}/users/${id}/patient-diagnoses?type=${type}`,
    body,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const getAllDiagnoses = async () => {
  const { data } = await axios.get(`${baseUrl}/diagnoses`, {
    withCredentials: true,
  });
  return data;
};

////////////////////////              AVATAR

export const changeYourAvatar = async (body) => {
  const { data } = await axios.post(`${baseUrl}/users/avatar`, body, {
    withCredentials: true,
    headers: {
      accept: "application/json",
      "Accept-Language": "en-US,en;q=0.8",
      "Content-Type": `multipart/form-data; boundary=${body._boundary}`,
    },
  });
  return data;
};

export const deleteYourPreviousAvatar = async () => {
  const { data } = await axios.delete(`${baseUrl}/users/avatar`, {
    withCredentials: true,
  });
  return data;
};

//////////// Book an Appointment
export const getAllCitiesAndDistricts = async () => {
  const { data } = await axios.get(`${baseUrl}/cities`, {
    withCredentials: true,
  });
  return data;
};

export const getAllHospitalsByProvinceAndDistrict = async (
  province,
  district
) => {
  const { data } = await axios.get(
    `${baseUrl}/hospitals/search?province=${province}&district=${district}`,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const getAllClinicsByHospitalId = async (hospitalId) => {
  const { data } = await axios.get(
    `${baseUrl}/hospitals/${hospitalId}/departments`,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const getAllDoctorsByHospitalIdAndClinicId = async (
  hospitalId,
  clinicId
) => {
  const { data } = await axios.get(
    `${baseUrl}/hospitals/${hospitalId}/departments/${clinicId}/doctors`,
    {
      withCredentials: true,
    }
  );
  return data;
};

export const searchBookedHours = async (doctorId, date) => {
  const { data } = await axios.get(
    `${baseUrl}/appointments/search/doctor?doctorId=${doctorId}&date=${date}`,
    {
      withCredentials: true,
    }
  );
  return data.map((hour) => {
    return hour.slice(0, -3);
  });
};

export const addNewAppointment = async (body) => {
  const { data } = await axios.post(`${baseUrl}/appointments/`, body, {
    withCredentials: true,
  });
  return data;
};

export const getSpecificUserVisits = async (userType, userId) => {
  const { data } = await axios.get(
    `${baseUrl}/appointments/search?type=${userType}&id=${userId}`,
    { withCredentials: true }
  );
  return data;
};

/////////////// Doctor Patients
export const getSpecificDoctorPatients = async (doctorId) => {
  const { data } = await axios.get(
    `${baseUrl}/appointments/search/patient?doctorId=${doctorId}`,
    { withCredentials: true }
  );
  return data;
};

/////////////// Doctor colleagues
export const getSpecificDoctorColleagues = async (hospitalId, departmentId) => {
  const { data } = await axios.get(
    `${baseUrl}/hospitals/${hospitalId}/departments/${departmentId}/doctors`,
    { withCredentials: true }
  );
  return data;
};

///////////// Doctor Approve diagnose

export const approveDiagnose = async (patientId, diagnoseId) => {
  const { data } = await axios.put(
    `${baseUrl}/users/${patientId}/patient-diagnoses/${diagnoseId}/approval-status`,
    {},
    { withCredentials: true }
  );
  return data;
};

export const addDocumentName = async (body, appointmentId) => {
  const { data } = await axios.post(
    `${baseUrl}/appointments/${appointmentId}/documents`,
    body,
    { withCredentials: true }
  );
  return data;
};

export const addDocumentToAppointment = async (
  body,
  appointmentId,
  documentId
) => {
  const { data } = await axios.put(
    `${baseUrl}/appointments/${appointmentId}/documents/${documentId}`,
    body,
    { withCredentials: true }
  );
  return data;
};

export const addPrescription = async (body, appointmentId) => {
  const { data } = await axios.post(
    `${baseUrl}/appointments/${appointmentId}/prescriptions`,
    body,
    { withCredentials: true }
  );
  return data;
};

export const getPrescriptionById = async (prescriptionId) => {
  let data;
  try {
    data = await axios.get(
      `${baseUrl}/appointments/prescriptions/${prescriptionId}`
    );
  } catch (err) {
    throw new Error(err);
  }
  return data.data;
};
