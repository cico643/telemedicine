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
import {
  addNewAppointment,
  getAllCitiesAndDistricts,
  getAllClinicsByHospitalId,
  getAllDoctorsByHospitalIdAndClinicId,
  getAllHospitalsByProvinceAndDistrict,
  searchBookedHours,
} from "../../api";
import { useUserContext } from "../../context/UserContext";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function Appointment(props) {
  /////////////////// SELECTED VALUES
  const [selectedCity, setSelectedCity] = React.useState("");
  const [selectedDistrict, setSelectedDistrict] = React.useState("");
  const [selectedHospital, setSelectedHospital] = React.useState("");
  const [selectedClinic, setSelectedClinic] = React.useState("");
  const [selectedDoctor, setSelectedDoctor] = React.useState("");
  const [startDate, setStartDate] = React.useState(new Date());
  const [selectedHour, setSelectedHour] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [bookedHours, setBookedHours] = React.useState([]);
  const { user } = useUserContext();
  const { setSelectedId } = props;

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
  const fetchCities = async () => {
    const data = await getAllCitiesAndDistricts();
    setAllCities(data);
    setIsCitySelectorDisabled(false);
  };

  const fetchDistricts = (cityProvince) => {
    const data = allCities.find((e) => e.province === cityProvince).districts;
    setAllDistricts(data);
    setIsDistrictSelectorDisabled(false);
  };

  const fetchHospitals = (districtName) => {
    getAllHospitalsByProvinceAndDistrict(selectedCity, districtName).then(
      (data) => {
        setAllHospitals(data);
        setIsHospitalSelectorDisabled(false);
      }
    );
  };

  const fetchClinics = (hospitalId) => {
    getAllClinicsByHospitalId(hospitalId).then((data) => {
      setAllClinics(data);
      setIsClinicSelectorDisabled(false);
    });
  };

  const fetchDoctors = (clinicId) => {
    getAllDoctorsByHospitalIdAndClinicId(selectedHospital, clinicId).then(
      (data) => {
        setAllDoctors(data);
        setIsDoctorSelectorDisabled(false);
      }
    );
  };

  ////////////////// MENU ITEM HELPER
  const menuItemHelper = (values) => {
    if (values) {
      return values.map((value) => {
        return <MenuItem value={value.id}>{value.name}</MenuItem>;
      });
    }
    return [];
  };

  const cityItemHelper = (values) => {
    return values.map((value) => {
      return <MenuItem value={value.province}>{value.province}</MenuItem>;
    });
  };

  const districtItemHelper = (values) => {
    return values.map((value) => {
      return <MenuItem value={value}>{value}</MenuItem>;
    });
  };

  const appointmentHoursHelper = (bookedHours) => {
    const times = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
    ];

    return times.map((hour) => {
      if (hour === selectedHour) {
        return (
          <Item sx={{ backgroundColor: "#ff0000", color: "white" }}>
            {hour}
          </Item>
        );
      }
      if (bookedHours.includes(hour)) {
        return (
          <Item sx={{ backgroundColor: "#9A86A4", color: "white" }}>
            {hour}
          </Item>
        );
      }

      return (
        <Item
          sx={{ cursor: "pointer", backgroundColor: "#120a8f", color: "white" }}
          onClick={(e) => {
            setSelectedHour(e.target.textContent);
          }}
        >
          {hour}
        </Item>
      );
    });
  };

  //////////////////////////RETURN
  return (
    <Grid container direction="column" justifyContent="flex-start">
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Select Time</DialogTitle>
        <DialogContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={0.5}>
            {appointmentHoursHelper(bookedHours)}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setModalOpen(false);
              setSelectedHour("");
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              addNewAppointment({
                doctorId: selectedDoctor,
                patientId: user.id,
                date: startDate.toISOString().split("T")[0],
                startHour: selectedHour,
              }).then((data) => {
                setModalOpen(false);
                setSelectedId("Visits");
              });
            }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
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
          {cityItemHelper(allCities)}
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
          {districtItemHelper(allDistricts)}
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
        onClick={() => {
          setModalOpen(true);
          searchBookedHours(
            selectedDoctor,
            startDate.toISOString().split("T")[0]
          ).then((data) => {
            setBookedHours(data);
          });
        }}
      >
        Search
      </Button>
    </Grid>
  );
}
