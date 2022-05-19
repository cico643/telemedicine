import { Box, Button, FormControl, InputLabel } from "@mui/material";
import * as React from "react";
import { useUserContext } from "../../context/UserContext";
import MUIDataTable from "mui-datatables";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { addNewPatientMedication, getSpecificUserMedications } from "../../api";

export default function Medications() {
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [relationType, setRelationType] = React.useState("mother");
  const columns = ["Medication Name", "Daily Dosage", "Start Date", "End Date"];
  const { user, medications, setMedications } = useUserContext();

  React.useEffect(() => {
    getSpecificUserMedications(user.id).then((response) => {
      setMedications(
        response.map(({ id, ...rest }) => {
          const medicationName = rest.medication.name;
          delete rest.medication;
          rest["medicationName"] = medicationName;
          if (rest["endDate"] === null) {
            rest["endDate"] = "-";
          }
          const data = Object.values(rest);
          const lastItem = data.pop();
          data.unshift(lastItem);
          return data;
        })
      );
    });
  }, [setMedications, user.id]);

  const handleRelationChange = (event) => {
    setRelationType(event.target.value);
  };

  // const handleAddRelative = async (event) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   const response = await addNewRelative(user.id, {
  //     name: data.get("name"),
  //     surname: data.get("surname"),
  //     relation: data.get("relation"),
  //     phoneNumber: data.get("phoneNumber"),
  //   });
  //   if (response) {
  //     delete response.patient;
  //     delete response.id;
  //     setMedication([...relatives, Object.values(response)]);
  //     handleModalClose();
  //   }
  // };

  const options = {
    filterType: "checkbox",
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Button
          onClick={handleModalOpen}
          sx={{ position: "right" }}
          variant="contained"
        >
          Add New Medication
        </Button>
      </div>
      <MUIDataTable
        title={"Medications"}
        data={medications}
        columns={columns}
        options={options}
      />
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Add New Medications</DialogTitle>
        <DialogContent>
          <DialogContentText>
            As the person to be called in an emergency, information is provided
            in line with the consent given by your patient.
          </DialogContentText>
          <Box component="form" noValidate>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="surname"
              name="surname"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
            />
            <TextField
              margin="dense"
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="standard"
            />
            <FormControl fullWidth sx={{ marginTop: "10px" }}>
              <InputLabel id="relation-select-label">Relation</InputLabel>
              <Select
                labelId="relation-select-label"
                id="relation"
                name="relation"
                value={relationType}
                label="Relation"
                onChange={handleRelationChange}
              >
                <MenuItem value={"mother"}>Mother</MenuItem>
                <MenuItem value={"father"}>Father</MenuItem>
                <MenuItem value={"sister"}>Sister</MenuItem>
                <MenuItem value={"brother"}>Brother</MenuItem>
                <MenuItem value={"aunt"}>Aunt</MenuItem>
                <MenuItem value={"uncle"}>Uncle</MenuItem>
                <MenuItem value={"cousin"}>Cousin</MenuItem>
                <MenuItem value={"friend"}>Friend</MenuItem>
              </Select>
            </FormControl>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
