import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tab,
  Tabs,
  TextField,
  Typography
} from "@mui/material";
import QRCode from "qrcode.react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useUserContext } from "../../context/UserContext";
import {
  addDocumentName,
  addDocumentToAppointment,
  addPrescription,
  getAllMedications,
  getSpecificUserVisits
} from "../../api";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export default function Visits(props) {
  const [selectedAppointment, setSelectedAppointment] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [allVisits, setAllVisits] = React.useState([]);
  const [allMedications, setAllMedications] = React.useState([]);
  const { user } = useUserContext();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const navigate = useNavigate();
  const { selectedPatientId } = props;
  let patientId = user.id;
  let userType = user.type;
  if (selectedPatientId) {
    userType = "patient";
    patientId = selectedPatientId;
  }

  const [inputFields, setInputFields] = React.useState([
    { id: uuidv4(), medicationId: "", signatura: "" }
  ]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleAddDocument = async ({ target }) => {
    let data = new FormData();
    data.append("file", target.files[0]);
    const response = await addDocumentName(
      { name: target.files[0].name },
      Number(target.id.charAt(target.id.length - 1))
    );
    await addDocumentToAppointment(
      data,
      Number(target.id.charAt(target.id.length - 1)),
      response.id
    );
    await getSpecificUserVisits(userType, patientId).then((response) => {
      setAllVisits(response);
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const medicationMenuItems = (medications) => {
    return medications.map((medication) => {
      return (
        <MenuItem key={medication.id} value={medication.id}>
          {medication.name}
        </MenuItem>
      );
    });
  };

  const handleChangeInput = (event, id) => {
    const newInputFields = inputFields.map((i) => {
      if (id === i.id) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
  };

  const handleRemoveFields = (id) => {
    const values = [...inputFields];
    values.splice(
      values.findIndex((value) => value.id === id),
      1
    );
    setInputFields(values);
  };

  const handleAddFields = () => {
    setInputFields([
      ...inputFields,
      { id: uuidv4(), medicationId: "", signatura: "" }
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addPrescription(
      {
        prescriptionMedications: inputFields.map((inputField) => {
          delete inputField.id;
          return inputField;
        })
      },
      selectedAppointment
    ).then((response) => {
      console.log(response);
      setInputFields([{ id: uuidv4(), medicationId: "", signatura: "" }]);
      handleClose();
      getSpecificUserVisits(userType, patientId).then((response) => {
        setAllVisits(response);
      });
    });
  };

  const todaysVisitsHelper = () => {
    return allVisits
      .filter((visit) => visit.date === new Date().toISOString().split("T")[0])
      .map((visit) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#1572A1" }}
            >
              <Typography color="white">
                {visit.date} - {visit.doctor.department.hospital.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#9AD0EC" }}>
              <Typography>Clinic: {visit.doctor.department.name}</Typography>
              <Typography>
                Doctor: {visit.doctor.name + " " + visit.doctor.surname}
              </Typography>
              <Typography>Hour: {visit.startHour}</Typography>
              <Divider></Divider>
              <Typography>
                Documents:{" "}
                {visit.documents.map((document) => {
                  return (
                    <a href={document.image?.url || ""}>{document.name}</a>
                  );
                })}
                <label
                  htmlFor={`document-button-file${visit.id}`}
                  style={{ cursor: "pointer" }}
                >
                  <IconButton color="primary" component="span">
                    <AddBoxIcon fontSize="small" />
                  </IconButton>
                  <input
                    accept="image/*"
                    id={`document-button-file${visit.id}`}
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleAddDocument}
                  />
                </label>
              </Typography>
              <Typography>
                Prescription:{" "}
                {visit.prescription ? (
                  <QRCode
                    value={`https://teletip-marmara.netlify.app/prescription/${visit.prescription.id}`}
                  />
                ) : (
                  <IconButton
                    onClick={(e) => {
                      setSelectedAppointment(visit.id);

                      setOpen(true);
                    }}
                    id={`prescription${visit.id}`}
                    color="primary"
                    component="span"
                  >
                    <AddBoxIcon fontSize="small" />
                  </IconButton>
                )}
              </Typography>

              <Button
                sx={{ marginLeft: "80%" }}
                variant="contained"
                disabled={
                  !(
                    visit.startHour.slice(0, 2) <= moment().hours() &&
                    moment().hours() < Number(visit.startHour.slice(0, 2)) + 1
                  )
                }
                onClick={(e) => navigate(`/live/${visit.id}`)}
              >
                Attend Live Meeting
              </Button>
            </AccordionDetails>
          </Accordion>
        );
      });
  };

  const pastVisitsHelper = () => {
    return allVisits
      .filter((visit) => visit.date < new Date().toISOString().split("T")[0])
      .map((visit) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#1572A1" }}
            >
              <Typography color="white">
                {visit.date} - {visit.doctor.department.hospital.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#9AD0EC" }}>
              <Typography>Clinic: {visit.doctor.department.name}</Typography>
              <Typography>
                Doctor: {visit.doctor.name + " " + visit.doctor.surname}
              </Typography>
              <Typography>Hour: {visit.startHour}</Typography>
              <Divider></Divider>
              <Typography>
                Documents:{" "}
                {visit.documents.map((document) => (
                  <a href={document.image?.url || ""}>{document.name}</a>
                ))}
              </Typography>
              <Typography>
                Prescription: {visit.prescription?.content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      });
  };

  const futureVisitsHelper = () => {
    return allVisits
      .filter((visit) => visit.date > new Date().toISOString().split("T")[0])
      .map((visit) => {
        return (
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#1572A1" }}
            >
              <Typography color="white">
                {visit.date} - {visit.doctor.department.hospital.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#9AD0EC" }}>
              <Typography>Clinic: {visit.doctor.department.name}</Typography>
              <Typography>
                Doctor: {visit.doctor.name + " " + visit.doctor.surname}
              </Typography>
              <Typography>Hour: {visit.startHour}</Typography>
              <Divider></Divider>
              <Typography>
                Documents:{" "}
                {visit.documents.map((document) => (
                  <a href={document.image?.url || ""}>{document.name}</a>
                ))}
              </Typography>
              <Typography>
                Prescription: {visit.prescription?.content}
              </Typography>
            </AccordionDetails>
          </Accordion>
        );
      });
  };

  React.useEffect(() => {
    setIsLoading(true);
    getSpecificUserVisits(userType, patientId).then((response) => {
      setAllVisits(response);
    });
    getAllMedications().then((response) => {
      setAllMedications(response);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [setAllVisits, patientId, userType]);
  return isLoading ? (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  ) : (
    <div>
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        aria-label="basic tabs example"
      >
        <Tab label="Today's Visits" />
        <Tab label="Future Visits" />
        <Tab label="Past Visits" />
      </Tabs>

      <div hidden={selectedTab !== 0}>{todaysVisitsHelper()}</div>
      <div hidden={selectedTab !== 1}>{futureVisitsHelper()}</div>
      <div hidden={selectedTab !== 2}>{pastVisitsHelper()}</div>
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Add a Prescription</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            {inputFields.map((inputField) => {
              return (
                <div key={inputField.id}>
                  <InputLabel id={`medication-select-label${inputField.id}`}>
                    Medication
                  </InputLabel>
                  <FormControl fullWidth>
                    <Select
                      labelId={`medication-select-label${inputField.id}`}
                      id="medicationId"
                      name="medicationId"
                      value={inputField.medicationId}
                      label="Medication"
                      onChange={(event) =>
                        handleChangeInput(event, inputField.id)
                      }
                    >
                      {medicationMenuItems(allMedications)}
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    sx={{ marginTop: "10px" }}
                    name="signatura"
                    label="Signatura"
                    variant="filled"
                    value={inputField.signatura}
                    onChange={(event) =>
                      handleChangeInput(event, inputField.id)
                    }
                  ></TextField>
                  <IconButton
                    disabled={inputFields.length === 1}
                    onClick={() => handleRemoveFields(inputField.id)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={handleAddFields}>
                    <AddIcon />
                  </IconButton>
                  <Divider sx={{ marginTop: "10px", marginBottom: "10px" }} />
                </div>
              );
            })}
            <Button
              sx={{ marginTop: "10px" }}
              variant="contained"
              color="primary"
              type="submit"
              onClick={handleSubmit}
            >
              Send
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
