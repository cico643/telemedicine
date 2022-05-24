import * as React from "react";
import MUIDataTable from "mui-datatables";
import { useUserContext } from "../../../context/UserContext";
import { Backdrop, CircularProgress } from "@mui/material";
import { getSpecificDoctorColleagues } from "../../../api";

export default function Colleagues(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [colleagues, setColleagues] = React.useState([]);
  const columns = ["First Name", "Last Name", "Phone Number"];
  const { user } = useUserContext();

  React.useEffect(() => {
    getSpecificDoctorColleagues(
      user.department.hospital.id,
      user.department.id
    ).then((data) => {
      setColleagues(
        data
          .filter((e) => e.name !== user.name)
          .map((e) => {
            delete e.address;
            delete e.type;
            delete e.id;
            delete e.email;
            delete e.avatar;
            delete e.department;
            return Object.values(e);
          })
      );
      setIsLoading(false);
    });
  }, [
    setColleagues,
    user.department.id,
    user.department.hospital.id,
    user.name,
  ]);

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
        title={"Colleagues"}
        data={colleagues}
        columns={columns}
        options={options}
      />
    </>
  );
}
