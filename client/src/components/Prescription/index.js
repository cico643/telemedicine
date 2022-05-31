import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { getPrescriptionById } from "../../api";
import { useNavigate } from "react-router-dom";

export default function Prescription(props) {
  const id = props.id;

  const [data, setData] = React.useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getPrescriptionById(id)
      .then((response) => {
        setData(response);
      })
      .catch((err) => navigate("/"));
  }, [id, navigate]);

  return data ? (
    <div>
      {" "}
      {data.prescriptionMedications.map((medication) => {
        return (
          <>
            <Typography>{medication.medication.name}</Typography>
            <Typography>{medication.signatura}</Typography>
          </>
        );
      })}
    </div>
  ) : (
    "Loading"
  );
}
