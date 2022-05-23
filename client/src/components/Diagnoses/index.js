import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";
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
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Select from "@mui/material/Select";
import {
  addNewPatientDiagnose,
  getAllDiagnoses,
  getSpecificUserDiagnoses,
} from "../../api";

export default function Diagnoses(props) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const [isApproveButton, setIsApproveButton] = React.useState(false);

  const [allDiagnoses, setAllDiagnoses] = React.useState([]);

  const [newDiagnose, setNewDiagnose] = React.useState("cancer");
  const [startDate, setStartDate] = React.useState(new Date());

  const columns = [
    "Diagnose Name",
    "Start Date",
    {
      name: "Approval Status",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          return value ? (
            <CheckCircleIcon sx={{ marginLeft: "40px" }} color="success" />
          ) : (
            <CheckCircleIcon sx={{ marginLeft: "40px" }} color="disabled" />
          );
        },
      },
    },
    "Approved By",
  ];
  const { user, diagnoses, setDiagnoses } = useUserContext();
  const { selectedPatientId } = props;
  let patientId = user.id;
  if (selectedPatientId) {
    patientId = selectedPatientId;
  }
  React.useEffect(() => {
    setIsLoading(true);
    getSpecificUserDiagnoses(patientId).then((response) => {
      setDiagnoses(
        response.map(({ id, ...rest }) => {
          ////////////TODO: GOTO DOCTOR PROFILE ON CLICK
          if (rest.doctor) {
            const doctorId = rest.doctor.name;
            delete rest.doctor;
            rest["doctorId"] = doctorId;
          } else {
            delete rest.doctor;
            rest["doctorId"] = "-";
          }
          const diagnoseName = rest.diagnose.name;
          delete rest.diagnose;
          rest["diagnoseName"] = diagnoseName;
          const data = Object.values(rest);
          const lastItem = data.pop();
          data.unshift(lastItem);
          return data;
        })
      );
    });
    getAllDiagnoses().then((response) => {
      setAllDiagnoses(response);
    });
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, [setDiagnoses, patientId]);

  const diagnosesMenuItems = (diagnoses) => {
    return diagnoses.map((diagnose) => {
      return (
        <MenuItem key={diagnose.id} value={diagnose.id}>
          {diagnose.name}
        </MenuItem>
      );
    });
  };

  const handleDiagnoseChange = (event) => {
    setNewDiagnose(event.target.value);
  };

  const handleAddPatientDiagnose = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await addNewPatientDiagnose(patientId, {
      diagnoseId: Number(data.get("diagnoseId")),
      startDate: startDate.toISOString().split("T")[0],
    });
    if (response) {
      ////////////TODO: GOTO DOCTOR PROFILE ON CLICK

      response["doctorId"] = "-";

      delete response.patient;
      delete response.id;
      const diagnoseName = response.diagnose.name;
      delete response.diagnose;
      response["diagnoseName"] = diagnoseName;
      const data = Object.values(response);
      const lastItem = data.pop();
      data.unshift(lastItem);
      setDiagnoses([...diagnoses, data]);
      handleModalClose();
    }
  };

  const options = {
    filterType: "checkbox",
    showResponsive: true,
    onRowSelectionChange: (
      currentRowsSelected,
      AllRowsSelected,
      rowsSelected
    ) => {
      console.log(AllRowsSelected);
      if (rowsSelected.length === 0) {
        setIsApproveButton(false);
      } else {
        setIsApproveButton(true);
      }
    },
    selectableRows: "single",
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
          Add New Diagnose
        </Button>
      </div>
      <MUIDataTable
        title={"Diagnoses"}
        data={diagnoses}
        columns={columns}
        options={options}
      />
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Add New Diagnose</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add the diagnoses that you use for doctors to see.
          </DialogContentText>
          <Box
            component="form"
            onSubmit={handleAddPatientDiagnose}
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
            </LocalizationProvider>
            <FormControl fullWidth sx={{ marginTop: "10px" }}>
              <InputLabel id="relation-select-label">Diagnose</InputLabel>
              <Select
                labelId="relation-select-label"
                id="diagnoseId"
                name="diagnoseId"
                value={newDiagnose}
                label="Diagnose"
                onChange={handleDiagnoseChange}
              >
                {diagnosesMenuItems(allDiagnoses)}
              </Select>
            </FormControl>
            <Button onClick={handleModalClose}>Cancel</Button>
            <Button type="submit">Add</Button>
          </Box>
        </DialogContent>
      </Dialog>
      <Button sx={{ display: `${isApproveButton ? "block" : "none"}` }}>
        Approve
      </Button>
    </>
  );
}
