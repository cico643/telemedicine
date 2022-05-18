import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { SignIn } from "../../api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Alert, Fade } from "@mui/material";
import UserTypeSelector from "../UserTypeSelector";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInSide() {
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [error1, setError] = React.useState(false);
  const [userType, setUserType] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await SignIn({
        email: data.get("email"),
        password: data.get("password"),
        type: userType,
      });
      if (response) {
        logIn(response);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setTimeout(() => {
        setError(true);
      }, 100);
      setError(false);
    }
  };

  const leftSide = () => {
    if (userType) {
      return (
        <>
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Fade in={error1}>
              <Alert
                sx={{ display: `${error1 ? "" : "none"}` }}
                severity="error"
              >
                Wrong Parameters
              </Alert>
            </Fade>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#498ffe" }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item sx={{ margin: "auto" }}>
                <Link href="/SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Copyright sx={{ mt: 5 }} />
          </Box>
        </>
      );
    }
    return <UserTypeSelector setUserType={setUserType}></UserTypeSelector>;
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(cover.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          item
          sx={{ boxShadow: "10px 0px 5px lightblue inset" }}
          xs={12}
          sm={8}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {leftSide()}
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
