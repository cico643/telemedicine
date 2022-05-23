import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  CircularProgress,
  Divider,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React from "react";
import { useUserContext } from "../../context/UserContext";
import PropTypes from "prop-types";

export default function Visits(props) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [allVisits, setAllVisits] = React.useState([]);
  const { user, visits, setVisits } = useUserContext();
  const [selectedTab, setSelectedTab] = React.useState(0);
  const { selectedPatientId } = props;
  let patientId = user.id;
  if (selectedPatientId) {
    patientId = selectedPatientId;
  }

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  //   React.useEffect(() => {
  //     setIsLoading(true);
  //     getSpecificUserVisits(patientId).then((response) => {
  //       setDiagnoses(
  //         response.map(({ id, ...rest }) => {
  //           return rest;
  //         })
  //       );
  //     });
  //     setTimeout(() => {
  //       setIsLoading(false);
  //     }, 300);
  //   }, [setDiagnoses, patientId]);
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
        <Tab label="All Visits" />
        <Tab label="Future Visits" />
        <Tab label="Past Visits" />
      </Tabs>
      <div hidden={selectedTab !== 0}>
        {" "}
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: "#1572A1" }}
          >
            <Typography color="white">
              23 Mayıs 2022 - İstanbul hastanesi
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#9AD0EC" }}>
            <Typography>Clinic: General Surgery</Typography>
            <Typography>Doctor: Anan Baban</Typography>
            <Typography>Hour: 9:00</Typography>
            <Divider></Divider>
            <Typography>Documents: Link1, Link2, Link3</Typography>
            <Typography>Prescription: Link1</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ backgroundColor: "#1572A1" }}
          >
            <Typography color="white">
              24 Mayıs 2022 - İstanbul hastanesi
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ backgroundColor: "#9AD0EC" }}>
            <Typography>Clinic: General Surgery</Typography>
            <Typography>Doctor: Anan Baban</Typography>
            <Typography>Hour: 9:00</Typography>
            <Divider></Divider>
            <Typography>Documents: Link1, Link2, Link3</Typography>
            <Typography>Prescription: Link1</Typography>
          </AccordionDetails>
        </Accordion>
      </div>
      <div hidden={selectedTab !== 1}>Future Visits</div>
      <div hidden={selectedTab !== 2}>Past Visits</div>
    </div>
  );
}
