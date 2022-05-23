import Diagnoses from "../../Diagnoses";

export default function PatientDiagnoses(props) {
  return <Diagnoses selectedPatientId={props.selectedPatientId}></Diagnoses>;
}
