import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContextProvider } from "./common/contexts/app.context";

import "./styles/_app.scss";
import "./styles/_theme-prime.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import ModalMessageComponent from "./common/components/modal-message.component";
import ApplicationProvider from "./application-provider";

import useAppCominicator from "./common/hooks/app-communicator.hook";
import DocumentsRoutes from "./features/documents/documents-routes";
import DocumentsReceived from "./features/documents/pages/documents-received";

import RadicadosTray from "./features/documents/components/radicados-tray/radicados-tray";
import RecipientTray from "./features/documents/components/recipient-tray/recipient-tray";
import RecipientTrayPage from "./features/recipient-tray/recipient-tray.page";

function App() {
	const { publish } = useAppCominicator();
	const HomePage = lazy(() => import("./common/components/home.page"));
	const GeneralConfigurationPage = lazy(
		() =>
			import(
				"./features/general-configuration/pages/general-configuration.page"
			)
	);

	// Effect que comunica la aplicacion actual
	useEffect(() => {
		localStorage.setItem("currentAplication", process.env.aplicationId);
		setTimeout(
			() => publish("currentAplication", process.env.aplicationId),
			500
		);
	}, []);

	return (
		<AppContextProvider>
			<ModalMessageComponent />
			<ApplicationProvider>
				<Router>
					<Suspense fallback={<p>Loading...</p>}>
						<Routes>
							<Route
								path={"/gestion-documental/"}
								element={<HomePage />}
							/>
							;
							<Route
								path={"/gestion-documental/documentos/*"}
								element={<DocumentsRoutes />}
							/>
							<Route
								path={
									"/gestion-documental/administracion/configuracion-general"
								}
								element={<GeneralConfigurationPage />}
							/>
							;
							<Route
								path={
									"/gestion-documental/consultas/historico-destinatarios"
								}
								element={<RecipientTrayPage />}
							/>
							<Route
								path={
									"/gestion-documental/radicacion/documento-recibido"
								}
								element={<DocumentsReceived />}
							/>
							<Route
								path={
									"/gestion-documental/radicacion/bandeja-radicado"
								}
								element={<RadicadosTray />}
							/>
							<Route
								path={
									"/gestion-documental/radicacion/bandeja-destinatarios"
								}
								element={<RecipientTray />}
							/>
						</Routes>
					</Suspense>
				</Router>
			</ApplicationProvider>
		</AppContextProvider>
	);
}

export default React.memo(App);
