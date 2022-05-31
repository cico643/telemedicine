import { useParams } from "react-router-dom";
import Live from "../components/Live";

export default function LivePage() {
  const { id } = useParams();
  return <Live id={id}></Live>;
}
