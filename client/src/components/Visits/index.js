import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { useUserContext } from "../../context/UserContext";
import {
  addDocumentName,
  addDocumentToAppointment,
  addPrescription,
  getSpecificUserVisits,
} from "../../api";

export default function Visits(props) {
  const [selectedAppointment, setSelectedAppointment] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [allVisits, setAllVisits] = React.useState([]);
  const { user } = useUserContext();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { selectedPatientId } = props;
  let patientId = user.id;
  let userType = user.type;
  if (selectedPatientId) {
    userType = "patient";
    patientId = selectedPatientId;
  }

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

  const handleAddPrescription = async (e) => {
    e.preventDefault();
    console.log(e.currentTarget);
    const data = new FormData(e.currentTarget);
    await addPrescription(
      { content: data.get("prescription") },
      selectedAppointment
    );
    setOpen(false);
    await getSpecificUserVisits(userType, patientId).then((response) => {
      setAllVisits(response);
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
                {visit.prescription?.content || (
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Prescription</DialogTitle>
        <DialogContent>
          <DialogContentText>Write a Prescription</DialogContentText>
          <Box
            component="form"
            onSubmit={handleAddPrescription}
            noValidate
            sx={{ paddingTop: "10px" }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="prescription"
              name="prescription"
              label="Prescription"
              type="text"
              fullWidth
              variant="standard"
            />
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
