import * as React from "react";
import MUIDataTable from "mui-datatables";
import { useUserContext } from "../../../context/UserContext";
import { Backdrop, CircularProgress, IconButton } from "@mui/material";
import { getSpecificDoctorPatients } from "../../../api";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Patients(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const { setSelectedId, setSelectedPatientId } = props;
  const columns = [
    "First Name",
    "Last Name",
    "Phone Number",
    {
      name: "Profile",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <IconButton
              onClick={(e) => {
                setSelectedPatientId(value);
                setSelectedId("PatientSummary");
              }}
              color="primary"
              aria-label="profile"
              component="span"
            >
              <AccountCircleIcon />
            </IconButton>
          );
        },
      },
    },
  ];
  const { user, patients, setPatients } = useUserContext();

  React.useEffect(() => {
    getSpecificDoctorPatients(user.id).then((data) => {
      setPatients(data.map((e) => Object.values(e)));
      setIsLoading(false);
    });
  }, [setPatients, user.id]);

  const options = {
    filterType: "checkbox",
  };

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
    <>
      <MUIDataTable
        title={"Patients"}
        data={patients}
        columns={columns}
        options={options}
      />
    </>
  );
}
