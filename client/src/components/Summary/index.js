import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import {
  getSpecificUserDiagnoses,
  getSpecificUserMedications,
  getSpecificUserVisits,
} from "../../api";

export default function Summary({ classes }) {
  const { user } = useUserContext();
  const [lastMedication, setLastMedication] = React.useState(null);
  const [lastDiagnoses, setLastDiagnoses] = React.useState(null);
  const [lastVisit, setLastVisit] = React.useState(null);
  const bodyIndexCalculator = () => {
    const bmi = user.weight / ((user.height / 100) * (user.height / 100));
    return parseFloat(bmi).toFixed(2);
  };
  const bodyIndexText = () => {
    const bmi = bodyIndexCalculator();
    if (bmi > 25) {
      return "You are overWeight";
    } else if (bmi < 24.9 && bmi > 18.5) {
      return "You are in the healthy range";
    } else {
      return "You are underWeight";
    }
  };

  useEffect(() => {
    if (user.type === "patient") {
      getSpecificUserMedications(user.id).then((response) => {
        setLastMedication(response.find((x) => x !== undefined));
      });
      getSpecificUserDiagnoses(user.id).then((response) =>
        setLastDiagnoses(response.find((x) => x !== undefined))
      );
      getSpecificUserVisits(user.type, user.id).then((response) =>
        setLastVisit(response.find((x) => x !== undefined))
      );
    }
  }, [user.id, user.type]);
  return (
    <Grid container spacing={2} alignItems="flex-start">
      <Grid item xs={4}>
        <Card
          sx={{
            maxWidth: 300,
            margin: "auto",
            transition: "0.3s",
            backgroundColor: "#1572A1",
            color: "white",
            boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
            "&:hover": {
              boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
              backgroundColor: "#316B83",
            },
          }}
        >
          <CardMedia sx={{ marginTop: "10px", marginBottom: "5px" }}>
            <Avatar
              sx={{ height: "200px", width: "200px", margin: "auto" }}
              src={user.avatar?.url || ""}
            />
            <div display="flex">
              <Typography variant="h6" textAlign="center">
                {user.name + " " + user.surname}
              </Typography>
            </div>
          </CardMedia>
          <Divider light flexItem />
          <CardContent sx={{ textAlign: "center", padding: 1.5 }}>
            <Grid>
              <Typography variant="body1" textAlign="center">
                Age
              </Typography>
              <Typography
                sx={{ marginTop: "5px" }}
                variant="h4"
                textAlign="center"
              >
                21
              </Typography>
            </Grid>
            <Divider
              sx={{ marginTop: "5px", marginBottom: "5px" }}
              light
              flexItem
            />
            <Grid container>
              <Grid item xs>
                <Grid container justifyContent="Center">
                  <Typography variant="h5" textAlign="center">
                    {user.height}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    textAlign="center"
                    sx={{ lineHeight: "2.5", marginLeft: "2px" }}
                  >
                    cm
                  </Typography>
                </Grid>
                <Typography variant="body1" textAlign="center">
                  Height
                </Typography>
              </Grid>
              <Divider orientation="vertical" light flexItem />
              <Grid item xs>
                <Grid container justifyContent="Center">
                  <Typography variant="h5" textAlign="center">
                    {user.weight}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    component="p"
                    textAlign="center"
                    sx={{ lineHeight: "2.5", marginLeft: "2px" }}
                  >
                    kg
                  </Typography>
                </Grid>

                <Typography variant="body1" textAlign="center">
                  Weight
                </Typography>
              </Grid>
            </Grid>
            <Divider
              sx={{ marginTop: "5px", marginBottom: "5px" }}
              light
              flexItem
            />
            <Grid>
              <Typography variant="body1" textAlign="center">
                Blood Type
              </Typography>
              <Typography
                sx={{ marginTop: "5px" }}
                variant="h4"
                textAlign="center"
              >
                {user.bloodType}
              </Typography>
            </Grid>
            <Divider
              sx={{ marginTop: "5px", marginBottom: "5px" }}
              light
              flexItem
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item container xs={8} spacing={1} alignItems="stretch">
        <Grid item xs={4}>
          <Card
            sx={{
              transition: "0.3s",
              backgroundColor: "#9AD0EC",
              color: "black",
              boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
              "&:hover": {
                boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h5" sx={{ marginBottom: "2px" }}>
                BMI
              </Typography>

              <Grid container>
                <Typography variant="body1">Your Body Index is:</Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    paddingLeft: "5px",
                  }}
                  variant="body1"
                >
                  {bodyIndexCalculator()}
                </Typography>
              </Grid>

              <Divider flexItem sx={{ margin: "2px" }} />
              <Typography sx={{ fontStyle: "italic" }}>
                {bodyIndexText()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card
            sx={{
              transition: "0.3s",
              backgroundColor: "#9AD0EC",
              color: "black",
              boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
              "&:hover": {
                boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
              },
            }}
          >
            <CardContent>
              <Typography variant="h5">Did you know?</Typography>
              <Divider flexItem sx={{ margin: "2px" }} />
              <Typography variant="h6">Interesting Fact:</Typography>
              <Typography variant="body">
                If you were to lay out all of the arteries, capillaries and
                veins in one adult, end-to-end, they would stretch about 60,000
                miles (100,000 kilometers). By comparison, the circumference of
                the Earth is about 25,000 miles (40,000 km). That means a
                person's blood vessels could wrap around the planet
                approximately 2.5 times!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          {user.type === "patient" ? (
            <>
              <Accordion
                sx={{
                  backgroundColor: "#9AD0EC",
                  transition: "0.3s",
                  margin: "5px",
                  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                  "&:hover": {
                    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontStyle: "italic" }}>
                    Last Appointment
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "#FBF8F1" }}>
                  <Typography>
                    {lastVisit
                      ? lastVisit.date +
                        " - " +
                        lastVisit.doctor.department.hospital.name +
                        " - " +
                        lastVisit.doctor.department.name +
                        " - " +
                        lastVisit.doctor.name +
                        " " +
                        lastVisit.doctor.surname
                      : "You don't have any records"}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                sx={{
                  backgroundColor: "#9AD0EC",
                  margin: "5px;",
                  transition: "0.3s",
                  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                  "&:hover": {
                    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontStyle: "italic" }}>
                    Last Medication
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "#FBF8F1" }}>
                  <Typography>
                    {lastMedication
                      ? lastMedication.medication.name +
                        ", Daily dosage: " +
                        lastMedication.dailyDosage
                      : "You don't have any records"}
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                sx={{
                  backgroundColor: "#9AD0EC",
                  margin: "5px",
                  boxShadow: "0 8px 40px -12px rgba(0,0,0,0.3)",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 16px 70px -12.125px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography sx={{ fontStyle: "italic" }}>
                    Last Diagnose
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ backgroundColor: "#FBF8F1" }}>
                  <Typography>
                    {lastDiagnoses
                      ? lastDiagnoses.diagnose.name +
                        " " +
                        (lastDiagnoses.approved
                          ? "is approved by" +
                            " " +
                            lastDiagnoses.doctor.name +
                            " " +
                            lastDiagnoses.doctor.surname
                          : "is not approved")
                      : "You don't have any records"}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
