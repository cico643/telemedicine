import { useParams } from "react-router-dom";
import Prescription from "../components/Prescription";

export default function PrescriptionPage() {
  const { id } = useParams();
  return <Prescription id={id}></Prescription>;
}
