import { useContext, useEffect, useRef, useState } from "react";
import { ButtonComponent } from "../../../common/components/Form";
import AccordionsComponent from "../../../common/components/accordions.component";
import { IAccordionTemplate } from "../../../common/interfaces/accordions.interfaces";
import RadicadoDetails from "../components/external-documents/radicado-details";
import SenderData from "../components/external-documents/sender-data";
import BasicDocumentInformation from "../components/external-documents/basic-document-information";
import RecipientData from "../components/external-documents/recipient-data";
import AddRecipient from "../components/external-documents/add-recipient";
import Subject from "../components/external-documents/subject";
import OptionalFields from "../components/external-documents/optional-fields";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import "./documents-received.scss";
import MassiveFileUploader from "../components/external-documents/index-file";
import { Dialog } from "primereact/dialog";
import RadicadoSticker from "../components/radicado-sticker";
import useCrudService from "../../../common/hooks/crud-service.hook";
import moment from "moment";
import { AppContext } from "../../../common/contexts/app.context";
import axios from "axios";
import { isEmpty } from "lodash";
import { clip } from "../../../common/components/icons/clip";
import { useForm } from "react-hook-form";

const DocumentsExternal = () => {
	const accordionsComponentRef = useRef(null);
	const [data, setData] = useState<any>({
		prioridad: "2",
		ent_tipo_entidad: "CC",
	});
	const [hideElement, setHideElement] = useState<boolean>(false);
	const [hideButtonsSave, setHideButtonsSave] = useState<boolean>(true);
	const [hideModalIndex, setHideModalIndex] = useState<boolean>(false);
	const [visiblemodal, setVisibleModal] = useState<boolean>(false);
	const [messageFileIndex, setMessageFileIndex] = useState<boolean>(false);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post, put } = useCrudService(baseURL);
	const { authorization } = useContext(AppContext);
	const [filingComplete, setFilingComplete] = useState(false);
	const { setMessage } = useContext(AppContext);
	const [uploadedFiles, setUploadedFiles] = useState([]);
	const [uploadedFile, setUploadedFile] = useState<File | null>(null);
	const [showConfirmation, setShowConfirmation] = useState(false);
	const [confirmed, setConfirmed] = useState(false);
	const { register, control, handleSubmit, setValue } = useForm();

	useEffect(() => {
		if (authorization?.user?.numberDocument) {
			getRadicadoIncompleto();
		}
	}, [authorization?.user?.numberDocument]);

	const getRadicadoIncompleto = () => {
		get(
			`/radicado-details/find-by-create-by/${authorization.user.numberDocument}?tipo=Externo`
		).then((data: any) => {
			if (JSON.stringify(data?.radicado) !== "{}") {
				setData({
					...data,
					radicado: data?.radicado?.DRA_RADICADO,
					radicado_origen:
						Number(data?.radicado?.DRA_RADICADO_ORIGEN) || null,
					radicado_por: data?.radicado?.DRA_RADICADO_POR,
					enviado_por: data?.radicado?.DRA_ID_REMITENTE.trim() || "",
					codigo_asunto: data?.radicado?.DRA_CODIGO_ASUNTO || "",
					tipo: String(data?.radicado?.DRA_TIPO_ASUNTO) || "1",
					prioridad:
						String(data?.radicado?.DRA_PRIORIDAD_ASUNTO) || "1",
					dirigido_a:
						data?.radicado?.DRA_ID_DESTINATARIO.trim() || "",
					copias: data?.copias,
					observaciones: data?.radicado?.DRA_OBSERVACION,
					numero_anexos: data?.radicado?.DRA_NUM_ANEXOS,
					numero_folios: data?.radicado?.DRA_NUM_FOLIOS,
					numero_cajas: data?.radicado?.DRA_NUM_CAJAS,
					dra_tipo_documento_radicado:
						data?.radicado?.DRA_TIPO_DOCUMENTO_RADICADO,
					created_at: data?.radicado?.created_at,
					radicado_por_nombre: data?.radicado?.DRA_NOMBRE_RADICADOR,
					nombre_destinatario:
						data?.radicado?.ENT_TIPO_DOCUMENTO == "NIT"
							? data?.radicado?.ENT_RAZON_SOCIAL
							: `${data?.radicado?.ENT_NOMBRES} ${data?.radicado?.ENT_APELLIDOS}`,
					nombre_asunto: data?.radicado?.INF_NOMBRE_ASUNTO,
				});

				setHideElement(true);
				setHideButtonsSave(false);
			}
		});
	};

	useBreadCrumb({
		isPrimaryPage: true,
		name: "Documento externo",
		url: "/gestion-documental/radicacion/documento-externo",
	});

	const handleSave = () => {
		post(`/radicado-details/create`, {
			DRA_FECHA_RADICADO: moment(new Date())
				.format("YYYY-MM-DD")
				.toString(),
			DRA_TIPO_RADICADO: 3,
			DRA_RADICADO_ORIGEN: data.radicado_origen || "",
			DRA_RADICADO_POR: authorization.user.numberDocument || "",
			DRA_NOMBRE_RADICADOR:
				`${
					authorization.user.names +
					" " +
					authorization.user.lastNames
				}` || "",
			DRA_ID_REMITENTE: data.enviado_por || "",
			DRA_ID_DESTINATARIO: data.dirigido_a || "",
			DRA_CODIGO_ASUNTO: data.codigo_asunto || 1,
			DRA_TIPO_ASUNTO: data.tipo || 1,
			DRA_PRIORIDAD_ASUNTO: data.prioridad || 1,
			DRA_OBSERVACION: data.observaciones || "",
			DRA_NUM_ANEXOS: data.numero_anexos || 0,
			DRA_NUM_FOLIOS: data.numero_folios || 0,
			DRA_NUM_CAJAS: data.numero_cajas || 0,
			DRA_USUARIO: authorization.user.numberDocument || "",
			DRA_TIPO_DOCUMENTO_RADICADO: "Externo",
			DRA_PRIORIDAD: data.prioridad || "",
			DRA_CREADO_POR: authorization.user.numberDocument || "",
			DRA_ESTADO: "INCOMPLETO",
			DRA_MOVIMIENTO: "Asignado",
			copies:
				data?.add_recipient_data?.map((r) => {
					return { RCD_ID_DESTINATARIO: r.USR_NUMERO_DOCUMENTO };
				}) || [],
		}).then(() => {
			getRadicadoIncompleto();
		});
	};

	const getUploadedFile = () => {
		return uploadedFile;
	};

	const handleUpload = (file) => {
		setUploadedFile(file);
		setMessageFileIndex(true);
	};

	const resetForm = () => {
		setData({
			prioridad: "2",
		});
		setHideElement(false);
		setHideButtonsSave(true);
		setHideModalIndex(false);
		setVisibleModal(false);
		setMessageFileIndex(false);
		setUploadedFiles([]);
		setUploadedFile(null);
	};

	const handleEnd = async () => {
		const radicadoId = data.radicado;
		const uploadedFile = getUploadedFile();
		const formData = new FormData();
		console.log("RadicadoID", radicadoId);
		formData.append("uploadedFile", uploadedFile);
		formData.append(
			"DRA_FECHA_RADICADO",
			moment(new Date()).format("YYYY-MM-DD").toString()
		);
		formData.append("DRA_TIPO_RADICADO", "3");
		formData.append("DRA_RADICADO_ORIGEN", data.radicado_origen || "");
		formData.append("DRA_RADICADO_POR", data.radicado_por || "");
		formData.append(
			"DRA_NOMBRE_RADICADOR",
			`${authorization.user.names} ${authorization.user.lastNames}` || ""
		);
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
				formData.append(
					`copies[${index}][RCD_ID_DESTINATARIO]`,
					recipient.ent_numero_identidad || ""
				);
			});
		}

		try {
			const response = await put(
				`${process.env.urlApiDocumentManagement}/api/v1/document-management/radicado-details/complete/${radicadoId}`,
				formData
			);
			setFilingComplete(true);
			setMessage({
				title: "Finalización exitosa",
				description: "El radicado se completó de manera exitosa",
				show: true,
				background: true,
				okTitle: "Aceptar",
				onOk: () => {
					setMessage({});
					resetForm();
				},
			});
			return response;
		} catch (error) {
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
			console.error(
				"Error al marcar el radicado como completado:",
				error
			);
		}
	};

	const onChange = async (newData: any) => {
		try {
			setData(newData);
		} catch (err) {
			console.log(err);
		}
	};

	const handleConfirmationClose = () => {
		setShowConfirmation(false);
	};

	const handleConfirmationAccept = () => {
		window.location.reload();
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
							Documentos externos
						</div>
					</div>
					<h2 className="text--black bold">
						Ficha de radicación de documento externo
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
							className:
								"text-title-modal text--black text-center",
						},
						closeButtonIcon: {
							className: "color--primary close-button-modal",
						},
					}}
				>
					<MassiveFileUploader
						handleUpload={handleUpload}
						messageFileIndex={messageFileIndex}
						setHideModalIndex={setHideModalIndex}
						setMessageFileIndex={setMessageFileIndex}
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
						radicado: `E ${data?.radicado}`,
						fechaRadicado: data?.created_at,
						num_radicado: data?.radicado,
						tipo: data?.nombre_asunto,
						destinatario: data?.nombre_destinatario,
						radicadoPor: data?.radicado_por_nombre,
					}}
					formatCode={"code39"}
					title={"Sticker"}
					visible={visiblemodal}
					onCloseModal={() => {
						setVisibleModal(false);
					}}
				/>
			</div>

			{hideButtonsSave && (
				<>
					<div className="flex container-docs-received justify-content--end px-20 pb-20 gap-20">
						<ButtonComponent
							className="button-main huge hover-three"
							value="Volver a la bandeja"
							type="route"
							url={
								"/gestion-documental/radicacion/bandeja-radicado"
							}
						/>
						<ButtonComponent
							className="button-main huge hover-three buttonThird"
							value="Cancelar"
							type="button"
							action={() => setShowConfirmation(true)}
						/>
						{showConfirmation && (
							<div className="modalMessageOk">
								<div className="containerMessageOk">
									<div>
										<button
											className="closeMessage"
											onClick={handleConfirmationClose}
										>
											X
										</button>
									</div>
									<span className="titleMessage">
										Cancelar acción
									</span>
									<p className="textMessage">
										No se guardará la información. Está
										seguro que desea cancelar?
									</p>
									<div className="confirmation-buttons">
										<button
											className="buttonMessageOk"
											onClick={handleConfirmationAccept}
										>
											Aceptar
										</button>
										<button
											className="buttonMessClose"
											onClick={handleConfirmationClose}
										>
											Cerrar
										</button>
									</div>
								</div>
							</div>
						)}
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
					</div>
				</>
			)}
			{hideElement && (
				<>
					<div className="main-page container-docs-received">
						<div className="card-table shadow-none">
							<div className="title-area">
								<div className="text-black extra-large bold">
									Opciones de respuesta
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
								<button
									className="button-main huge hover-three buttonSecondary buttonClip"
									onClick={() => {
										setHideModalIndex(true);
									}}
								>
									Indexar un nuevo archivo {clip}
								</button>
								<ButtonComponent
									className="button-main huge hover-three"
									value="Generar sticker "
									type="button"
									action={() => {
										setVisibleModal(true);
									}}
								/>
							</div>
						</div>
					</div>

					<div className="flex container-docs-received justify-content--end px-20 pb-20 gap-20">
						<ButtonComponent
							className="button-main huge hover-three"
							value="Volver a la bandeja"
							type="route"
							url={
								"/gestion-documental/radicacion/bandeja-radicado"
							}
						/>

						<ButtonComponent
							className="button-main huge hover-three buttonDisableDM"
							value="Finalizar"
							type="button"
							action={handleEnd}
							disabled={
								(data.tipo_asunto == 2 &&
									!data.radicado_origen) ||
								!data.enviado_por ||
								!data.dirigido_a ||
								!data.tipo ||
								!data.prioridad ||
								!data.codigo_asunto ||
								!data.referencia
							}
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default DocumentsExternal;
