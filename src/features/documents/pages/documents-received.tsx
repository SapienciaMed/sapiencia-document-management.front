import { useRef } from "react";
import { ButtonComponent } from "../../../common/components/Form";
import AccordionsComponent from "../../../common/components/accordions.component";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import RadicadoDetails from "../components/document-received/radicado-details";
import SenderData from "../components/document-received/sender-data";
import BasicDocumentInformation from "../components/document-received/basic-document-information";
import RecipientData from "../components/document-received/recipient-data";
import AddRecipient from "../components/document-received/add-recipient";
import Subject from "../components/document-received/subject";
import OptionalFields from "../components/document-received/optional-fields";
const DocumentsReceived = () => {
	const accordionsComponentRef = useRef(null);
	const accordionsData: IAccordionTemplate[] = [
		{
			id: 1,
			name: "Datos del radicado",
			content: <RadicadoDetails />,
			disabled: false,
		},
		{
			id: 2,
			name: "Datos remitente",
			content: <SenderData />,
			disabled: false,
		},
		{
			id: 3,
			name: "Información básica del documento",
			content: <BasicDocumentInformation />,
			disabled: false,
		},
		{
			id: 4,
			name: "Datos del destinatario",
			content: <RecipientData />,
			disabled: false,
		},
		{
			id: 5,
			name: "Adicionar destinatario para envío de copia",
			content: <AddRecipient />,
			disabled: false,
		},
		,
		{
			id: 6,
			name: "Asunto",
			content: <Subject />,
			disabled: false,
		},
		,
		{
			id: 7,
			name: "Campos Adicionales",
			content: <OptionalFields />,
			disabled: false,
		},
	];
	return (
		<div className="crud-page full-height">
			<div className="main-page full-height">
				<div className="card-table">
					<div className="title-area">
						<div className="text-black extra-large bold">
							Documentos recibidos
						</div>
					</div>
					<div className="text-black large bold">
						Ficha de radicación de documento recibido
					</div>

					<AccordionsComponent
						data={accordionsData}
						ref={accordionsComponentRef}
					/>

					<div className="projects-footer-mobile mobile">
						<div className="save-temp">
							<ButtonComponent
								className="button-main huge hover-three button-save"
								value="Guardar temporalmente"
								type="button"
								action={null}
							/>
						</div>

						<div className="mobile-actions">
							<span
								className="bold text-center button"
								onClick={null}
							>
								Cancelar
							</span>
							<ButtonComponent
								value={"Continuar"}
								className="button-main huge hover-three"
								type="button"
								action={null}
								disabled={null}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="container-button-bot space-between">
				<ButtonComponent
					className="button-main huge hover-three"
					value="Guardar temporalmente"
					type="button"
					action={null}
				/>

				<div className="buttons-bot">
					<span className="bold text-center button" onClick={null}>
						Cancelar
					</span>
					<ButtonComponent
						className={`button-main ${
							null ? "extra_extra_large" : "huge"
						} hover-three button-save`}
						value={null || "Continuar"}
						type="button"
						action={null || (() => {})}
						disabled={null}
					/>
				</div>
			</div>
		</div>
	);
};

export default DocumentsReceived;
