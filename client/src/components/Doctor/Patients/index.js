import * as React from "react";
import MUIDataTable from "mui-datatables";
import { useUserContext } from "../../../context/UserContext";
import { Button } from "@mui/material";

export default function Patients(props) {
  const { setSelectedId, setSelectedPatientId } = props;
  const columns = ["First Name", "Last Name", "Phone Number", "Profile"];
  const { user, patients, setPatients } = useUserContext();

  React.useEffect(() => {}, [setPatients, user.id]);

  const options = {
    filterType: "checkbox",
  };

  return (
    <>
      <Button
        onClick={() => {
          setSelectedId("PatientSummary");
          setSelectedPatientId(1);
        }}
      >
        {" "}
        profile
      </Button>
      <MUIDataTable
        title={"Patients"}
        data={patients}
        columns={columns}
        options={options}
      />
    </>
  );
}
