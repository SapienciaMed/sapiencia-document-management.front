import { useRef, useState } from "react";
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
	const [data, setData] = useState<any>({})

	const onChange = async (newData: any) => {
        try {
			console.log(newData)
            setData(newData);
        } catch (err) {
            console.log(err);
        }
    }

	const accordionsData: IAccordionTemplate[] = [
		{
			id: 1,
			name: "Datos del radicado",
			content: <RadicadoDetails data={data} onChange={onChange} />,
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
			content: <BasicDocumentInformation data={data} onChange={onChange} />,
			disabled: false,
		},
		{
			id: 4,
			name: "Datos del destinatario",
			content: <RecipientData data={data} onChange={onChange} />,
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
			content: <Subject data={data} onChange={onChange} />,
			disabled: false,
		},
		,
		{
			id: 7,
			name: "Campos Opcionales",
			content: <OptionalFields />,
			disabled: false,
		},
	];
	return (
		<div className="crud-page full-height recived-documents">
			<div className="main-page container-docs-received">
				<div className="card-table shadow-none">
					<div className="title-area">
						<div className="text-black extra-large bold">
							Documentos recibidos
						</div>
					</div>
					<h2 className="text--black bold">
						Ficha de radicación de documento recibido
					</h2>

					<AccordionsComponent
						data={accordionsData}
						ref={accordionsComponentRef}
					/>
				</div>
			</div>
			<div className="flex container-docs-received justify-content--end px-20 pb-20 gap-20">
				<ButtonComponent
					className="button-main huge hover-three"
					value="Volver a la bandeja"
					type="button"
					action={null}
				/>

				<ButtonComponent
					className="button-main huge hover-three"
					value="Guardar"
					type="button"
					action={null}
					disabled={true}
				/>
			</div>
		</div>
	);
};

export default DocumentsReceived;
