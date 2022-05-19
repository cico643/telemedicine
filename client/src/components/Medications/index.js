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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Select from "@mui/material/Select";
import {
  addNewPatientMedication,
  getSpecificUserMedications,
  getAllMedications,
} from "../../api";

export default function Medications() {
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const [allMedications, setAllMedications] = React.useState([]);

  const [newMedication, setNewMedication] = React.useState("Aferin+");
  const [startDate, setStartDate] = React.useState(new Date());
  const [endDate, setEndDate] = React.useState(new Date());

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
    getAllMedications().then((response) => {
      setAllMedications(response);
    });
  }, [setMedications, user.id]);

  const medicationMenuItems = (medications) => {
    return medications.map((medication) => {
      return <MenuItem value={medication.id}>{medication.name}</MenuItem>;
    });
  };

  const handleMedicationChange = (event) => {
    setNewMedication(event.target.value);
  };

  const handleAddPatientMedication = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await addNewPatientMedication(user.id, {
      medicationId: Number(data.get("medicationId")),
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      dailyDosage: Number(data.get("dailyDosage")),
    });
    if (response) {
      delete response.patient;
      delete response.id;
      const medicationName = response.medication.name;
      delete response.medication;
      response["medicationName"] = medicationName;
      if (response["endDate"] === null) {
        response["endDate"] = "-";
      }
      const data = Object.values(response);
      const lastItem = data.pop();
      data.unshift(lastItem);
      setMedications([...medications, data]);
      handleModalClose();
    }
  };

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
            Add the medications that you use for doctors to see.
          </DialogContentText>
          <Box
            component="form"
            onSubmit={handleAddPatientMedication}
            noValidate
            sx={{ paddingTop: "10px" }}
          >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                inputFormat="dd/MM/yyyy"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
              <DatePicker
                label="End Date"
                inputFormat="dd/MM/yyyy"
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            <TextField
              autoFocus
              margin="dense"
              id="dailyDosage"
              name="dailyDosage"
              label="Daily Dosage"
              type="number"
              fullWidth
              variant="standard"
            />
            <FormControl fullWidth sx={{ marginTop: "10px" }}>
              <InputLabel id="relation-select-label">Medication</InputLabel>
              <Select
                labelId="relation-select-label"
                id="medicationId"
                name="medicationId"
                value={newMedication}
                label="Relation"
                onChange={handleMedicationChange}
              >
                {medicationMenuItems(allMedications)}
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
