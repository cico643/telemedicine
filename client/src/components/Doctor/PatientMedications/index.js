import Medications from "../../Medications";

export default function PatientMedications(props) {
  return (
    <Medications selectedPatientId={props.selectedPatientId}></Medications>
  );
}
