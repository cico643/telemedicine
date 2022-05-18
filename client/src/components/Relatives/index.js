import { Button } from "@mui/material";
import * as React from "react";
import { useUserContext } from "../../context/UserContext";
import MUIDataTable from "mui-datatables";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Relatives() {
  const [openModal, setOpenModal] = React.useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const columns = ["First Name", "Last Name", "Phone Number", "Relation"];
  const { user } = useUserContext();
  const relativesWithoutId = user.relatives.map(({ id, relation, ...rest }) => {
    relation = relation.charAt(0).toUpperCase() + relation.slice(1);
    return Object.values({ ...rest, relation });
  });

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
          Add New Relative
        </Button>
      </div>
      <MUIDataTable
        title={"Relatives"}
        data={relativesWithoutId}
        columns={columns}
        options={options}
      />
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </>
  );
}
