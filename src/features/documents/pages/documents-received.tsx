import { useContext, useEffect, useRef, useState } from "react";
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
import useCrudService from "../../../common/hooks/crud-service.hook";
import moment from "moment";
import { AppContext } from "../../../common/contexts/app.context";
import axios from "axios";
import { isEmpty } from 'lodash'; 
const DocumentsReceived = () => {
	const accordionsComponentRef = useRef(null);
	const [data, setData] = useState<any>({
		prioridad: "2"
	});
	const [hideElement, setHideElement] = useState<boolean>(false);
	const [hideButtonsSave, setHideButtonsSave] = useState<boolean>(true);
	const [hideModalIndex, setHideModalIndex] = useState<boolean>(false);
	const [visiblemodal, setVisibleModal] = useState<boolean>(false);
	const baseURL: string =
	process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);
	const { authorization } = useContext(AppContext);
	const [filingComplete, setFilingComplete] = useState(false);
	const { setMessage } = useContext(AppContext);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);

	useEffect(() => {
		getRadicadoIncompleto();
	}, [])

	const getRadicadoIncompleto = () => {
		get(`/radicado-details/find-by-create-by/${JSON.parse(localStorage.getItem('credentials'))?.numberDocument}`).then((data: any) => {
			if (JSON.stringify(data?.radicado) !== '{}') {
				setData({
					...data,
					radicado: data?.radicado?.DRA_RADICADO,
					radicado_origen: Number(data?.radicado?.DRA_RADICADO_ORIGEN) || 0,
					radicado_por: data?.radicado?.DRA_RADICADO_POR,
					enviado_por: data?.radicado?.DRA_ID_REMITENTE.trim() || '',
					codigo_asunto: data?.radicado?.DRA_CODIGO_ASUNTO || '',
					tipo: String(data?.radicado?.DRA_TIPO_ASUNTO) || '1',
					prioridad: String(data?.radicado?.DRA_PRIORIDAD_ASUNTO) || '1',
					dirigido_a: data?.radicado?.DRA_ID_DESTINATARIO.trim() || '',
					copias: data?.copias,
					observaciones: data?.radicado?.DRA_OBSERVACION,
					numero_anexos: data?.radicado?.DRA_NUM_ANEXOS,
					numero_folios: data?.radicado?.DRA_NUM_FOLIOS,
					numero_cajas: data?.radicado?.DRA_NUM_CAJAS,
				})

				setHideElement(true);
				setHideButtonsSave(false);
			}
		});
	}

	useBreadCrumb({ isPrimaryPage: true, name: "Documento recibido", url: "/gestion-documental/radicacion/documento-recibido" });

	const handleSave = () => {
		post(`/radicado-details/create`, {
			"DRA_FECHA_RADICADO": moment(new Date()).format("YYYY-MM-DD").toString() ,
			"DRA_TIPO_RADICADO": 1,
			"DRA_RADICADO_ORIGEN": data.radicado_origen || '',
			"DRA_RADICADO_POR": data.radicado_por || '',
			"DRA_NOMBRE_RADICADOR": `${ authorization.user.names + " " + authorization.user.lastNames }` || '',
			"DRA_ID_REMITENTE": data.enviado_por || '',
			"DRA_ID_DESTINATARIO": data.dirigido_a || '',
			"DRA_CODIGO_ASUNTO": data.codigo_asunto || 1,
			"DRA_TIPO_ASUNTO": 1,
			"DRA_PRIORIDAD_ASUNTO": 1,
			"DRA_OBSERVACION": data.observaciones || '',
			"DRA_NUM_ANEXOS": data.numero_anexos || 0,
			"DRA_NUM_FOLIOS": data.numero_folios || 0,
			"DRA_NUM_CAJAS": data.numero_cajas || 0,
			"DRA_USUARIO": authorization.user.numberDocument || '',
			"DRA_TIPO_DOCUMENTO_RADICADO": "Recibido",
			"DRA_PRIORIDAD": data.prioridad || '',
			"DRA_CREADO_POR": authorization.user.numberDocument || '',
			"DRA_ESTADO": "INCOMPLETO",
			"copies": data?.add_recipient_data?.map((r) => { return {RCD_ID_DESTINATARIO: r.ent_numero_identidad} }) || []
		}).then(() => {
			getRadicadoIncompleto()
		});
	}

	const getUploadedFile = () => {
		return uploadedFile;
	  };

	const handleUpload = (file) => {

		setUploadedFile(file);
	  
		setMessage({
		  title: "Éxito",
		  description: `Archivo adjunto: ${file.name}`,
		  show: true,
		  background: true,
		  okTitle: "Aceptar",
		  onOk: () => {
			setMessage({});
		  },
		});
	  };

	  const handleEnd = () => {
		const radicadoId = data.radicado;
		const uploadedFile = getUploadedFile();
		const formData = new FormData();
	  
		formData.append("uploadedFile", uploadedFile);
		formData.append("DRA_FECHA_RADICADO", moment(new Date()).format("YYYY-MM-DD").toString());
		formData.append("DRA_TIPO_RADICADO", "1");
		formData.append("DRA_RADICADO_ORIGEN", data.radicado_origen || "");
		formData.append("DRA_RADICADO_POR", data.radicado_por || "");
		formData.append("DRA_NOMBRE_RADICADOR", `${authorization.user.names} ${authorization.user.lastNames}` || "");
		formData.append("DRA_ID_REMITENTE", data.enviado_por || "");
		formData.append("DRA_CODIGO_ASUNTO", data.codigo_asunto || "1");
		formData.append("DRA_TIPO_ASUNTO", "1");
		formData.append("DRA_PRIORIDAD_ASUNTO", "1");
		formData.append("DRA_ID_DESTINATARIO", data.dirigido_a || "");
		formData.append("DRA_OBSERVACION", data.observaciones || "");
		formData.append("DRA_NUM_ANEXOS", data.numero_anexos || "0");
		formData.append("DRA_NUM_FOLIOS", data.numero_folios || "0");
		formData.append("DRA_NUM_CAJAS", data.numero_cajas || "0");
		formData.append("DRA_PRIORIDAD", data.prioridad || "");
		formData.append("DRA_ESTADO", "COMPLETO");
	  
		// Adjuntar datos de copias si están disponibles
		if (data?.add_recipient_data?.length > 0) {
		  data.add_recipient_data.forEach((recipient, index) => {
			formData.append(`copies[${index}][RCD_ID_DESTINATARIO]`, recipient.ent_numero_identidad || "");
		  });
		}
	  
		axios.put(`/radicado-details/complete/${radicadoId}`, formData)
		  .then(() => {
			setFilingComplete(true);
			setMessage({
			  title: "Finalización exitosa",
			  description: "El radicado se completó de manera exitosa",
			  show: true,
			  background: true,
			  okTitle: "Aceptar",
			  onOk: () => {
				setMessage({});
			  },
			});
		  })
		  .catch(error => {
			setFilingComplete(true);
			setMessage({
			  title: "Error",
			  description: "El radicado no se ha completado",
			  show: true,
			  background: true,
			  okTitle: "Aceptar",
			  onOk: () => {
				setMessage({});
			  },
			});
			console.error('Error al marcar el radicado como completado:', error);
		  });
	  };	  

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
			content: <OptionalFields data={data} onChange={onChange} />,
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
						handleUpload={handleUpload}
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
						radicado: data.radicado,
						fechaRadicado: data.fecha_origen,
						tipo: "Recibido",
						destinatario: data.dirigido_a,
						radicadoPor: data.radicado_por,
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
					disabled={
						isEmpty(data.enviado_por) ||
						isEmpty(data.dirigido_a) ||
						isEmpty(data.codigo_asunto) ||
						isEmpty(data.tipo) ||
						isEmpty(data.prioridad)
					}
					action={handleSave}
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
						action={handleEnd}
						disabled={!filingComplete}
					/>
				</div></>}
		</div>
	);
};

export default DocumentsReceived;
