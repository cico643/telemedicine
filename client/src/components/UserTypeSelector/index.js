import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Container } from "@mui/material";

export default function UserTypeSelector(props) {
  const Publicurl = window.location.origin;
  return (
    <Container maxwidth="sm">
      <Typography variant="h4" component="div" gutterBottom>
        Choose an account
      </Typography>
      <Card
        onClick={(e) => props.setUserType("doctor")}
        fullWidth
        sx={{
          display: "flex",
          border: "2px solid rgba(0, 0, 0, 0.2)",
          borderRadius: "%20",
          "&:hover": {
            border: "2px solid rgba(102, 51, 153, 1)",
            cursor: "pointer",
          },
        }}
      >
        <div
          style={{
            borderRadius: "50%",
            border: "1px solid rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50px",
            height: "50px",
            margin: "25px 5px 0px 20px",
            backgroundColor: "#E8EAF6",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 30, height: 30 }}
            image={`${Publicurl}/doctor.png`}
            alt="Doctor"
          />
        </div>
        <div>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography gutterBottom variant="h6" component="div">
              Doctor Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For Doctors that can operate along with their patients
            </Typography>
          </CardContent>
        </div>
      </Card>
      <Card
        onClick={(e) => props.setUserType("patient")}
        fullWidth
        sx={{
          display: "flex",
          border: "2px solid rgba(0, 0, 0, 0.2)",
          borderRadius: "%20",
          marginTop: "10px",
          "&:hover": {
            border: "2px solid rgba(102, 51, 153, 1)",
            cursor: "pointer",
          },
        }}
      >
        <div
          style={{
            borderRadius: "50%",
            border: "1px solid rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "50px",
            height: "50px",
            margin: "25px 5px 0px 20px",
            backgroundColor: "#E8EAF6",
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 30, height: 30 }}
            image={`${Publicurl}/patient.png`}
            alt="Patient"
          />
        </div>
        <div>
          <CardContent sx={{ flex: "1 0 auto" }}>
            <Typography gutterBottom variant="h6" component="div">
              Patient Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For Patients that can operate along with their doctors
            </Typography>
          </CardContent>
        </div>
      </Card>
    </Container>
  );
}
