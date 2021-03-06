import * as React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Navigator from "../components/Navigator";
import Content from "../components/Content";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import { getSpecificUser } from "../api";
import { useUserContext } from "../context/UserContext";
import { CircularProgress } from "@mui/material";
import Medications from "../components/Medications";
import Relatives from "../components/Relatives";
import Diagnoses from "../components/Diagnoses";
import Summary from "../components/Summary";
import Appointment from "../components/Appointment/Appointment";
import PatientSummary from "../components/Doctor/PatientSummary";
import Patients from "../components/Doctor/Patients";
import PatientDiagnoses from "../components/Doctor/PatientDiagnoses";
import PatientMedications from "../components/Doctor/PatientMedications";
import PatientVisits from "../components/Doctor/PatientVisits";
import Visits from "../components/Visits";
import Colleagues from "../components/Doctor/Colleagues";

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        href="
https://teletip-marmara.netlify.app/"
      >
        TeleTıp-Marmara
      </Link>{" "}
      {new Date().getFullYear()}.
    </Typography>
  );
}

let theme = createTheme({
  palette: {
    primary: {
      light: "#63ccff",
      main: "#009be5",
      dark: "#006db3",
    },
  },
  typography: {
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTab: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});

theme = {
  ...theme,
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#081627",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
        contained: {
          boxShadow: "none",
          "&:active": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          marginLeft: theme.spacing(1),
        },
        indicator: {
          height: 3,
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          backgroundColor: theme.palette.common.white,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          margin: "0 16px",
          minWidth: 0,
          padding: 0,
          [theme.breakpoints.up("md")]: {
            padding: 0,
            minWidth: 0,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 4,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(255,255,255,0.15)",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: "#4fc3f7",
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: 14,
          fontWeight: theme.typography.fontWeightMedium,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: "inherit",
          minWidth: "auto",
          marginRight: theme.spacing(2),
          "& svg": {
            fontSize: 20,
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: 32,
          height: 32,
        },
      },
    },
  },
};

const drawerWidth = 256;

export default function Paperbase() {
  const [selectedPatientId, setSelectedPatientId] = React.useState("");
  const [selectedId, setSelectedId] = React.useState("Summary");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));
  const { user } = useAuth();
  const { setUser } = useUserContext();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const whichContent = () => {
    switch (selectedId) {
      case "Medications":
        return <Medications></Medications>;
      case "Relatives":
        return <Relatives></Relatives>;
      case "Diagnoses":
        return <Diagnoses></Diagnoses>;
      case "Summary":
        return <Summary></Summary>;
      case "Appointment":
        return <Appointment setSelectedId={setSelectedId}></Appointment>;
      case "Visits":
        return <Visits></Visits>;
      case "Colleagues":
        return <Colleagues></Colleagues>;
      case "PatientSummary":
        return (
          <PatientSummary
            selectedPatientId={selectedPatientId}
          ></PatientSummary>
        );
      case "PatientDiagnoses":
        return (
          <PatientDiagnoses
            selectedPatientId={selectedPatientId}
          ></PatientDiagnoses>
        );
      case "PatientMedications":
        return (
          <PatientMedications
            selectedPatientId={selectedPatientId}
          ></PatientMedications>
        );
      case "PatientVisits":
        return (
          <PatientVisits selectedPatientId={selectedPatientId}></PatientVisits>
        );
      case "Patients":
        return (
          <Patients
            setSelectedId={setSelectedId}
            setSelectedPatientId={setSelectedPatientId}
          ></Patients>
        );
      default:
        return <Content></Content>;
    }
  };

  React.useEffect(() => {
    (async () => {
      const data = await getSpecificUser(user.id, user.type);
      setUser(data);
      setLoading(false);
    })();
  }, [user.id, user.type, setUser]);

  return isLoading ? (
    <CircularProgress />
  ) : (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {isSmUp ? null : (
            <Navigator
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              PaperProps={{ style: { width: drawerWidth } }}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
            />
          )}

          <Navigator
            setSelectedId={setSelectedId}
            selectedId={selectedId}
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: "block", xs: "none" } }}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Header
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            onDrawerToggle={handleDrawerToggle}
          />
          <Box
            component="main"
            sx={{
              flex: 1,
              py: 6,
              px: 4,
              bgcolor: "#eaeff1",
            }}
          >
            {whichContent()}
          </Box>
          <Box component="footer" sx={{ p: 2, bgcolor: "#eaeff1" }}>
            <Copyright />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
