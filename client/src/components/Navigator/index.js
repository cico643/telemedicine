import * as React from "react";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import MedicationIcon from "@mui/icons-material/Medication";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import SickIcon from "@mui/icons-material/Sick";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import CallIcon from "@mui/icons-material/Call";
import { useAuth } from "../../context/AuthContext";

const patientCategories = [
  {
    id: "Profile",
    children: [
      {
        id: "Summary",
        icon: <AccountBoxIcon />,
      },
      { id: "Medications", icon: <MedicationIcon /> },
      { id: "Diagnoses", icon: <SickIcon /> },
      { id: "Visits", icon: <CalendarTodayIcon /> },
      { id: "Relatives", icon: <PeopleIcon /> },
    ],
  },
  {
    id: "Actions",
    children: [
      { id: "Appointment", icon: <CalendarTodayIcon /> },
      { id: "Informing Relatives", icon: <CallIcon /> },
      { id: "Sensor Data", icon: <MonitorHeartIcon /> },
    ],
  },
];
const doctorCategories = [
  {
    id: "Profile",
    children: [
      {
        id: "Summary",
        icon: <AccountBoxIcon />,
      },
      { id: "Patients", icon: <PeopleIcon /> },
      { id: "Colleagues", icon: <SickIcon /> },
      { id: "Appointments", icon: <CalendarTodayIcon /> },
    ],
  },
  {
    id: "Actions",
    children: [
      { id: "Appointment", icon: <CalendarTodayIcon /> },
      { id: "Informing Relatives", icon: <CallIcon /> },
      { id: "Sensor Data", icon: <MonitorHeartIcon /> },
    ],
  },
];

const item = {
  py: "2px",
  px: 3,
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover, &:focus": {
    bgcolor: "rgba(255, 255, 255, 0.08)",
  },
};

const itemCategory = {
  boxShadow: "0 -1px 0 rgb(255,255,255,0.1) inset",
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { setSelectedId, selectedId, ...other } = props;
  const { user } = useAuth();
  let categories = patientCategories;
  if (user.type === "doctor") {
    categories = doctorCategories;
  }

  const activeNavItem = (id) => {
    setSelectedId(id);
  };

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem
          sx={{ ...item, ...itemCategory, fontSize: 22, color: "#fff" }}
        >
          Telemedicine
        </ListItem>
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText>Home Page</ListItemText>
        </ListItem>
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: "#101F33" }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: "#fff" }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton
                  selected={selectedId === childId}
                  sx={item}
                  onClick={() => activeNavItem(childId)}
                >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}

            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}
