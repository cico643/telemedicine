import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { useUserContext } from "../../context/UserContext";
import { getSpecificUserVisits } from "../../api";

export default function Visits(props) {
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
                {visit.documents.map((document) => (
                  <link src={document.images.url}>{document.name}</link>
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
                  <link src={document.images.url}>{document.name}</link>
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
                  <link src={document.images.url}>{document.name}</link>
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
      setAllVisits(
        response.map(({ id, ...rest }) => {
          return rest;
        })
      );
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
    </div>
  );
}
