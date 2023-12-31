import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../contexts/app.context";

const PrivateRoute = ({ element, allowedAction }) => {
  const { authorization, setMessage } = useContext(AppContext);

  if (!authorization?.allowedActions) {
    return <div>Loading...</div>;
  }

  if (
    authorization?.allowedActions?.findIndex((i) => i == allowedAction) >= 0
  ) {
    return element;
  } else {
    setMessage({
      title: "¡Acceso no autorizado!",
      description: "Consulte con el admimistrador del sistema.",
      show: true,
      okTitle: "Aceptar",
      onOk: () => setMessage({}),
      background: true,
    });
    return <Navigate to={"/gestion-documental"} replace />;
  }
};

export default PrivateRoute;
