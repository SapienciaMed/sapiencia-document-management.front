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
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import "./documents-received.scss";
import MassiveFileUploader from "../components/document-received/index-file";
import { Dialog } from "primereact/dialog";
import RadicadoSticker from "../components/radicado-sticker";

const DocumentsReceived = () => {
	const accordionsComponentRef = useRef(null);
	const [data, setData] = useState<any>({ prioridad: "2" });
	const [hideElement, setHideElement] = useState<boolean>(false);
	const [hideButtonsSave, setHideButtonsSave] = useState<boolean>(true);
	const [hideModalIndex, setHideModalIndex] = useState<boolean>(false);
	const [visiblemodal, setVisibleModal] = useState<boolean>(false);

	useBreadCrumb({ isPrimaryPage: true, name: "Documento recibido", url: "/gestion-documental/radicacion/documento-recibido" });

	const handleSave = () => {
		setHideElement(true);
		setHideButtonsSave(false);
	}


	const onChange = async (newData: any) => {
		try {
			setData(newData);
		} catch (err) {
			console.log(err);
		}
	};

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
			content: <SenderData data={data} onChange={onChange} />,
			disabled: false,
		},
		{
			id: 3,
			name: "Información básica del documento",
			content: (
				<BasicDocumentInformation data={data} onChange={onChange} />
			),
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
			content: <AddRecipient data={data} onChange={onChange} />,
			disabled: false,
		},
		{
			id: 6,
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
			<div>
				<Dialog
					visible={hideModalIndex}
					style={{ width: "100%", maxWidth: "690px" }}
					header="Indexar archivo"
					onHide={() => setHideModalIndex(false)}
					pt={{
						headerTitle: {
							className: "text-title-modal text--black text-center",
						},
						closeButtonIcon: {
							className: "color--primary close-button-modal",
						},
					}}>
					<MassiveFileUploader
						handleUpload={() => { }}
					/>
					<div className="mt-10 flex flex-center">
					<ButtonComponent
						className={`button-main buttonTop py-12 px-16 font-size-16`}
						value="Cancelar"
						type="button"
						action={() => setHideModalIndex(false)}
						disabled={false}
					/>
				</div>
				</Dialog>
			</div>
			<div>
				<RadicadoSticker
					data={{
						radicado: "123456789",
						fechaRadicado: "04/10/2023 11:00:00",
						tipo: "Recibido",
						destinatario: "Francisco Gaviria R",
						radicadoPor: "Juan Perez J",
					}}
					formatCode={"code39"}
					title={"Sticker"}
					visible={visiblemodal}
					onCloseModal={() => { setVisibleModal(false) }}
				/>
			</div>

			{hideButtonsSave && <><div className="flex container-docs-received justify-content--end px-20 pb-20 gap-20">

				<ButtonComponent
					className="button-main huge hover-three"
					value="Volver a la bandeja"
					type="route"
					url={"/gestion-documental/radicacion/bandeja-radicado"}
				/>
				<ButtonComponent
					className="button-main huge hover-three buttonThird"
					value="Cancelar"
					type="button"
					action={null}
				/>
				<ButtonComponent
					className="button-main huge hover-three buttonDisableDM"
					value="Guardar y continuar"
					type="button"
					action={handleSave}
				//disabled={true}
				/>
			</div></>}
			{hideElement && <><div className="main-page container-docs-received">
				<div className="card-table shadow-none">
					<div className="title-area">
						<div className="text-black extra-large bold">
							Asunto
						</div>
					</div>
					<Subject data={data} onChange={onChange} />
				</div>
			</div>
				<div className="main-page container-docs-received">
					<div className="card-table shadow-none">
						<div className="title-area-second">
							<div className="text-black extra-large bold center-txt">
								Indexar un nuevo archivo
							</div>
						</div>
						<div className="buttonContent">
							<ButtonComponent
								className="button-main huge hover-three buttonSecondary"
								value="Indexar un nuevo archivo"
								type="button"
								action={() => { setHideModalIndex(true) }}
							/>
							<ButtonComponent
								className="button-main huge hover-three"
								value="Generar sticker "
								type="button"
								action={() => { setVisibleModal(true) }}
							/>
						</div>
					</div>
				</div>

				<div className="flex container-docs-received justify-content--end px-20 pb-20 gap-20">
					<ButtonComponent
						className="button-main huge hover-three"
						value="Volver a la bandeja"
						type="route"
						url={"/gestion-documental/radicacion/bandeja-radicado"}
					/>

					<ButtonComponent
						className="button-main huge hover-three buttonDisableDM"
						value="Finalizar"
						type="button"
						action={null}
						disabled={true}
					/>
				</div></>}
		</div>
	);
};

export default DocumentsReceived;
