import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Paper,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const apiCities = [
  { id: 1, name: "Adana" },
  { id: 2, name: "Adıyaman" },
  { id: 3, name: "Afyon" },
  { id: 4, name: "Ağrı" },
];

const apiDistricts = [
  { id: 1, sehir_ID: 1, name: "Yüreğir" },
  { id: 2, sehir_ID: 1, name: "Seyhan" },
  { id: 3, sehir_ID: 1, name: "Ceyhan" },
  { id: 4, sehir_ID: 1, name: "Çukurova" },
  { id: 5, sehir_ID: 1, name: "Sarıçam" },
  { id: 6, sehir_ID: 1, name: "Kozan" },
  { id: 7, sehir_ID: 1, name: "Feke" },
  { id: 8, sehir_ID: 2, name: "Besni" },
  { id: 9, sehir_ID: 2, name: "Çelikhan" },
  { id: 10, sehir_ID: 2, name: "Gerger" },
  { id: 11, sehir_ID: 2, name: "Gölbaşı" },
  { id: 12, sehir_ID: 2, name: "Kâhta" },
  { id: 13, sehir_ID: 2, name: "Samsat" },
  { id: 14, sehir_ID: 2, name: "Sincik" },
  { id: 15, sehir_ID: 3, name: "Başmakçı" },
  { id: 16, sehir_ID: 3, name: "Bayat" },
  { id: 17, sehir_ID: 3, name: "Bolvadin" },
  { id: 18, sehir_ID: 3, name: "Çay" },
  { id: 19, sehir_ID: 3, name: "Çobanlar" },
  { id: 20, sehir_ID: 3, name: "Dazkırı" },
  { id: 21, sehir_ID: 4, name: "Diyadin" },
  { id: 22, sehir_ID: 4, name: "Doğubayazıt" },
  { id: 23, sehir_ID: 4, name: "Eleşkirt" },
  { id: 24, sehir_ID: 4, name: "Hamur" },
  { id: 25, sehir_ID: 4, name: "Patnos" },
  { id: 26, sehir_ID: 4, name: "Taşlıçay" },
  { id: 27, sehir_ID: 4, name: "Tutak" },
];

const apiHospitals = [
  { id: 1, name: "Adana Yüreğir Hastanesi", ilce_ID: 1 },
  { id: 8, name: "Özel Adana Yüreğir Hastanesi", ilce_ID: 1 },
  { id: 2, name: "Adana Seyhan Hastanesi", ilce_ID: 2 },
  { id: 3, name: "Adana Ceyhan Hastanesi", ilce_ID: 3 },
  { id: 4, name: "AdıYaman Besni Hastanesi", ilce_ID: 8 },
  { id: 5, name: "Afyon Çelikhan Hastanesi", ilce_ID: 9 },
  { id: 6, name: "Afyon Gerger Hastanesi", ilce_ID: 10 },
  { id: 7, name: "Afyon Başmakçı Hastanesi", ilce_ID: 15 },
];

const apiClinics = [
  { id: 1, name: "General Surgery", hospital_ID: 1 },
  { id: 4, name: "Family Medicine", hospital_ID: 1 },
  { id: 1, name: "General Surgery", hospital_ID: 2 },
  { id: 2, name: "Eye Diseases", hospital_ID: 2 },
  { id: 5, name: "Child Health and Diseases", hospital_ID: 2 },
  { id: 1, name: "General Surgery", hospital_ID: 3 },
  { id: 3, name: "Neurology", hospital_ID: 3 },
  { id: 6, name: "Dentistry", hospital_ID: 3 },
  { id: 2, name: "Eye Diseases", hospital_ID: 5 },
  { id: 1, name: "General Surgery", hospital_ID: 8 },
  { id: 4, name: "Family Medicine", hospital_ID: 8 },
  { id: 2, name: "Eye Diseases", hospital_ID: 8 },
  { id: 5, name: "Child Health and Diseases", hospital_ID: 8 },
];

const apiDoctors = [
  { id: 1, name: "Doktor Adam", clinic_ID: 1, hospital_ID: 1 },
  { id: 2, name: "Doktor Kadın", clinic_ID: 1, hospital_ID: 1 },
  { id: 3, name: "Doktor Tarım", clinic_ID: 4, hospital_ID: 1 },
  { id: 4, name: "Doktor Plak", clinic_ID: 2, hospital_ID: 2 },
  { id: 5, name: "Doktor Top", clinic_ID: 2, hospital_ID: 3 },
  { id: 6, name: "Doktor Kedi", clinic_ID: 3, hospital_ID: 2 },
  { id: 7, name: "Doktor Köpek", clinic_ID: 1, hospital_ID: 8 },
  { id: 8, name: "Doktor At", clinic_ID: 1, hospital_ID: 8 },
  { id: 9, name: "Doktor Terzi", clinic_ID: 5, hospital_ID: 8 },
  { id: 10, name: "Doktor Kör", clinic_ID: 8, hospital_ID: 8 },
];

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Appointment() {
  /////////////////// SELECTED VALUES
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedHospital, setSelectedHospital] = React.useState("");
  const [selectedClinic, setSelectedClinic] = React.useState("");
  const [selectedDoctor, setSelectedDoctor] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [selectedHour, setSelectedHour] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);

  /////////////// ALLL CITIES, DISTRICTS, HOSPITAL, DOCTORS ETC
  const [allCities, setAllCities] = React.useState([]);
  const [allDistricts, setAllDistricts] = React.useState([]);
  const [allHospitals, setAllHospitals] = React.useState([]);
  const [allClinics, setAllClinics] = React.useState([]);
  const [allDoctors, setAllDoctors] = React.useState([]);

  //////////////// IS SELECT DISABLED
  const [isCitySelectorDisabled, setIsCitySelectorDisabled] =
    React.useState(true);
  const [isDistrictSelectorDisabled, setIsDistrictSelectorDisabled] =
    React.useState(true);
  const [isHospitalSelectorDisabled, setIsHospitalSelectorDisabled] =
    React.useState(true);
  const [isClinicSelectorDisabled, setIsClinicSelectorDisabled] =
    React.useState(true);
  const [isDoctorSelectorDisabled, setIsDoctorSelectorDisabled] =
    React.useState(true);

  ////////////// SELECT CHANGE HANDLERS
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    /////// RESET EVERYTHING AFTER
    setSelectedDistrict("");
    setSelectedHospital("");
    setSelectedClinic("");
    setSelectedDoctor("");
    setIsDistrictSelectorDisabled(true);
    setIsHospitalSelectorDisabled(true);
    setIsClinicSelectorDisabled(true);
    setIsDoctorSelectorDisabled(true);
    ////////// FILL DISTRICTS
    fetchDistricts(event.target.value);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    /////// RESET EVERYTHING AFTER
    setSelectedHospital("");
    setSelectedClinic("");
    setSelectedDoctor("");
    setIsHospitalSelectorDisabled(true);
    setIsClinicSelectorDisabled(true);
    setIsDoctorSelectorDisabled(true);
    /////// FILL HOSPITALS
    fetchHospitals(event.target.value);
  };

  const handleHospitalChange = (event) => {
    setSelectedHospital(event.target.value);
    /////// RESET EVERYTHING AFTER
    setSelectedClinic("");
    setSelectedDoctor("");
    setIsClinicSelectorDisabled(true);
    setIsDoctorSelectorDisabled(true);
    /////// FILL CLINICS
    fetchClinics(event.target.value);
  };

  const handleClinicChange = (event) => {
    setSelectedClinic(event.target.value);
    /////// RESET EVERYTHING AFTER
    setSelectedDoctor("");
    setIsDoctorSelectorDisabled(true);
    ////// FILL DOCTORS
    fetchDoctors(event.target.value);
  };

  const handleDoctorChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  React.useEffect(() => {
    fetchCities();
  }, []);

  ///////////// FETCH DATA FROM API
  const fetchCities = () => {
    setTimeout(() => {
      setAllCities(apiCities);
      setIsCitySelectorDisabled(false);
    }, "1000");
  };

  const fetchDistricts = (cityId) => {
    setTimeout(() => {
      setAllDistricts(
        apiDistricts.filter(function (e) {
          return e.sehir_ID === cityId;
        })
      );
      setIsDistrictSelectorDisabled(false);
    }, "1000");
  };

  const fetchHospitals = (districtId) => {
    setTimeout(() => {
      setAllHospitals(
        apiHospitals.filter(function (e) {
          return e.ilce_ID === districtId;
        })
      );
      setIsHospitalSelectorDisabled(false);
    }, "1000");
  };

  const fetchClinics = (hospitalId) => {
    setTimeout(() => {
      setAllClinics(
        apiClinics.filter(function (e) {
          return e.hospital_ID === hospitalId;
        })
      );
      setIsClinicSelectorDisabled(false);
    }, "1000");
  };

  const fetchDoctors = (clinicId) => {
    setTimeout(() => {
      setAllDoctors(
        apiDoctors.filter(function (e) {
          return e.clinic_ID === clinicId && selectedHospital === e.hospital_ID;
        })
      );
      setIsDoctorSelectorDisabled(false);
    }, "1000");
  };

  ////////////////// MENU ITEM HELPER
  const menuItemHelper = (values) => {
    return values.map((value) => {
      return <MenuItem value={value.id}>{value.name}</MenuItem>;
    });
  };

  const appointmentHoursHelper = (appointments) => {
    return;
  };

  //////////////////////////RETURN
  return (
    <Grid container direction="column" justifyContent="flex-start">
      <div style={{ width: "100%" }}>
        <Typography sx={{ fontFamily: "Roboto, sans-serif" }} variant="h4">
          Make An Appointment
        </Typography>
      </div>

      <Divider sx={{ margin: "5px" }} />
      <FormControl fullWidth disabled={isCitySelectorDisabled}>
        <InputLabel id="select-city-label">City</InputLabel>
        <Select
          labelId="select-city-label"
          id="select-city"
          value={selectedCity}
          label="City"
          onChange={handleCityChange}
        >
          {menuItemHelper(allCities)}
        </Select>
      </FormControl>
      <FormControl
        sx={{ marginTop: "10px" }}
        fullWidth
        disabled={isDistrictSelectorDisabled}
      >
        <InputLabel id="select-district-label">District</InputLabel>
        <Select
          labelId="select-district-label"
          id="select-district"
          value={selectedDistrict}
          label="District"
          onChange={handleDistrictChange}
        >
          {menuItemHelper(allDistricts)}
        </Select>
      </FormControl>
      <FormControl
        sx={{ marginTop: "10px" }}
        fullWidth
        disabled={isHospitalSelectorDisabled}
      >
        <InputLabel id="select-hospital-label">Hospital</InputLabel>
        <Select
          labelId="select-hospital-label"
          id="select-hospital"
          value={selectedHospital}
          label="Hospital"
          onChange={handleHospitalChange}
        >
          {menuItemHelper(allHospitals)}
        </Select>
      </FormControl>
      <FormControl
        sx={{ marginTop: "10px" }}
        fullWidth
        disabled={isClinicSelectorDisabled}
      >
        <InputLabel id="select-clinic-label">Clinic</InputLabel>
        <Select
          labelId="select-clinic-label"
          id="select-clinic"
          value={selectedClinic}
          label="Clinic"
          onChange={handleClinicChange}
        >
          {menuItemHelper(allClinics)}
        </Select>
      </FormControl>
      <FormControl
        sx={{ marginTop: "10px" }}
        fullWidth
        disabled={isDoctorSelectorDisabled}
      >
        <InputLabel id="select-doctor-label">Doctor</InputLabel>
        <Select
          labelId="select-doctor-label"
          id="select-doctor"
          value={selectedDoctor}
          label="Doctor"
          onChange={handleDoctorChange}
        >
          {menuItemHelper(allDoctors)}
        </Select>
      </FormControl>
      <FormControl sx={{ marginTop: "10px" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Appointment Date"
            inputFormat="dd/MM/yyyy"
            value={startDate}
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </FormControl>
      <Button
        sx={{ marginTop: "10px" }}
        variant="contained"
        disabled={isDoctorSelectorDisabled}
        onClick={() => setModalOpen(true)}
      >
        Search
      </Button>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Select Time</DialogTitle>
        <DialogContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={0.5}>
            <Item>9:00</Item>
            <Item>10:00</Item>
            <Item>11:00</Item>
            <Item>13:00</Item>
            <Item>14:00</Item>
            <Item>15:00</Item>
            <Item>16:00</Item>
            <Item>17:00</Item>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
