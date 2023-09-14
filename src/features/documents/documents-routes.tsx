import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "../../common/utils/auth-private-guard";

function DocumentsRoutes() {
  const DocumentsPage = lazy(() => import("./pages/documents.page"));

  return (
    <Routes>
      <Route
        path={"/consultar"}
        element={
          <PrivateRoute
            element={<DocumentsPage />}
            allowedAction={"INDICADOR_ACCION_SEGURIDAD"}
          />
        }
      />
    </Routes>
  );
}

export default React.memo(DocumentsRoutes);
