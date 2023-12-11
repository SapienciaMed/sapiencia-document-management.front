import React, { useContext, useEffect, useState } from "react";
import {
	FormComponent,
	InputComponent,
	InputComponentOriginal,
	SelectComponent,
} from "../../../../common/components/Form";
import styles from "./document-received.module.scss";
import { EDirection } from "../../../../common/constants/input.enum";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import { IoWarningOutline } from "react-icons/io5";
import { AppContext } from "../../../../common/contexts/app.context";
import { InputTextIconComponent } from "../input-text-icon.component";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";

interface IProps {
	onChange: (data: any) => void;
	data: any;
}
const BasicDocumentInformation = ({ data, onChange }: IProps) => {
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);
	const COLORS = ["", "#FFCC00", "#00CC00", "#CC0000"];
	const [subjets, setSubjets] = useState<any>([]);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [showSearch, setShowSearch] = useState<boolean>(false);
	const [documentSubject, setDocumentSubject] = useState<any>([]);
	const [documents, setDocuments] = useState<any>([]);

	const schema = yup.object({
		codigo_asunto: yup
			.string()
			.required("El campo es obligatorio")
			.max(15, "Solo permiten 10 dígitos"),
		nombre_asunto: yup.string().required(),
		tiempo_respuesta: yup.string().required(),
		unidad: yup.string().required(),
		tipo: yup.string().required("El campo es obligatorio"),
		prioridad: yup.string().required("El campo es obligatorio"),
		search_codigo_asunto: yup
			.number()
			.transform((value) => (Number.isNaN(value) ? null : value))
			.nullable()
			.max(999999999999999, "Solo se permiten 15 dígitos"),
		search_nombre_asunto: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres"),
	});

	const {
		register,
		control,
		setValue: subjectSetValue,
		getValues,
		watch,
		reset,
		formState: { errors },
	} = useForm<IBasicDocumentInformationForm>({
		resolver: yupResolver(schema),
		defaultValues: { ...data },
		mode: "all",
	});

	useEffect(() => {
		if (data && data?.enviado_por) {
			onBlurData();
		}
	}, []);

	useEffect(() => {
		if (Array.isArray(documents) && documents.length > 0) {
			setDocumentSubject(documents);
			onChange({
				...data,
				documents: documents,
			});
		}
	}, [data?.codigo_asunto, documents]);

	const onBlurData = async () => {
		const idAsunto = getValues("codigo_asunto");
		if (!idAsunto) {
			reset();
		}

		if (data?.codigo_asunto || idAsunto) {
			setDocuments(await getDocumentsSubjects(idAsunto));
		}
		setSelectedSubject(idAsunto, true);
		onChange({
			...data,
			codigo_asunto: idAsunto,
		});
	};

	const setSelectedSubject = (idAsunto: string, setDefaults?: boolean) => {
		if (idAsunto) {
			checkIdInDB(idAsunto).then(
				async ({ data: response, message }: any) => {
					if (Array.isArray(response) && response.length > 0) {
						subjectSetValue(
							"nombre_asunto",
							response[0].ras_nombre_asunto
						);
						subjectSetValue(
							"tiempo_respuesta",
							response[0].ras_tiempo_respuesta
						);
						subjectSetValue("unidad", response[0].ras_unidad);
						subjectSetValue("codigo_asunto", idAsunto);

						if (setDefaults) {
							subjectSetValue("tipo", data?.tipo);
							subjectSetValue("prioridad", data?.prioridad);

							onChange({
								...data,
								nombre_asunto: response[0].ras_nombre_asunto,
								tiempo_respuesta:
									response[0].ras_tiempo_respuesta,
								unidad: response[0].ras_unidad,
								codigo_asunto: idAsunto,
								tipo: data?.tipo,
								prioridad: data?.prioridad,
							});
						} else {
							subjectSetValue("tipo", "");
							onChange({
								...data,
								nombre_asunto: response[0].ras_nombre_asunto,
								tiempo_respuesta:
									response[0].ras_tiempo_respuesta,
								unidad: response[0].ras_unidad,
								codigo_asunto: idAsunto,
								tipo: "",
							});
						}
					} else {
						setMessage({
							title: "Información básica del documento",
							description: "Código de asunto no existe",
							show: true,
							background: true,
							okTitle: "Aceptar",
							onOk: () => {
								setMessage({});
							},
						});
					}
				}
			);
		}
	};

	/**
	 * Función que obtiene los datos del asunto
	 * @param idAsunto
	 * @returns
	 */
	const checkIdInDB = async (idAsunto: string) => {
		const endpoint: string = `/subject/subject/${idAsunto}`;
		const data = await get(`${endpoint}`);
		setDocumentSubject(await getDocumentsSubjects(idAsunto));
		return data;
	};

	/**
	 * Función que carga Select para tipo asunto
	 * @param idAsunto
	 * @returns
	 */
	const getDocumentsSubjects = async (idAsunto: string) => {
		const endpoint: string = `/subject/${idAsunto}/document`;
		const data = await get(`${endpoint}`);
		const dataDocument: any = data.data;
		const documents = dataDocument.map((item) => ({
			value: item.rn_document_type.rta_id,
			name: item.rn_document_type.rta_descripcion,
		}));
		return documents || [];
	};

	const search = async () => {
		const endpoint: string = `/basic-document/search?nombre=${
			data?.search_nombre_asunto ? `${data?.search_nombre_asunto}` : ""
		}&codigo=${
			data?.search_codigo_asunto ? `${data?.search_codigo_asunto}` : ""
		}`;
		const response: any = await get(`${endpoint}`);
		setSubjets(response?.data);
		setSelectedCheckbox("");

		if (response?.data?.length <= 0) {
			setMessage({
				title: "Error",
				description: "El código de asunto no exite",
				show: true,
				background: true,
				okTitle: "Cerrar",
				onOk: () => {
					setMessage({});
				},
			});
		}
	};

	const handleCheckboxChange = (event) => {
		setSelectedCheckbox(event.target.value);
	};

	return (
		<FormComponent action={undefined}>
			<div
				className={`${styles["document-container"]} ${styles["document-container--col4"]}`}
			>
				<div>
					<InputTextIconComponent
						idInput="codigo_asunto"
						control={control}
						label="Código asunto"
						className="input-basic"
						classNameLabel="text--black text-required"
						errors={errors}
						disabled={false}
						onBlur={onBlurData}
						max={12}
						type="number"
						handleOnSearch={() => {
							setShowSearch(!showSearch);
							onChange({
								...data,
								search_codigo_asunto: null,
								search_nombre_asunto: "",
							});
						}}
					/>
				</div>

				<Controller
					name="nombre_asunto"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="nombre_asunto"
							idInput="nombre_asunto"
							value={`${field.value || ""}`}
							label="Nombre asunto"
							className="input-basic"
							classNameLabel="text--black"
							typeInput={"text"}
							register={register}
							onChange={null}
							errors={errors}
							disabled={true}
						/>
					)}
				/>

				<Controller
					name="tiempo_respuesta"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="tiempo_respuesta"
							idInput="tiempo_respuesta"
							value={`${field.value || ""}`}
							label="Tiempo de respuesta"
							className="input-basic"
							classNameLabel="text--black "
							typeInput={"text"}
							register={register}
							onChange={null}
							errors={errors}
							disabled={true}
						/>
					)}
				/>

				<Controller
					name="unidad"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="unidad"
							idInput="unidad"
							value={`${field.value || ""}`}
							label="Unidad"
							className="input-basic"
							classNameLabel="text--black "
							typeInput={"text"}
							register={register}
							onChange={null}
							errors={errors}
							disabled={true}
						/>
					)}
				/>

				<Controller
					name="tipo"
					control={control}
					render={({ field }) => {
						if (field.value !== data.tipo) {
							onChange({
								...data,
								tipo: field.value || null,
							});
							data.tipo = field.value;
						}

						return (
							<SelectComponent
								idInput="tipo"
								className="select-basic select-placeholder"
								control={control}
								errors={errors}
								label="Tipo"
								classNameLabel="text--black text-required"
								direction={EDirection.column}
								placeholder="Seleccionar"
								data={data?.documents || documentSubject}
							/>
						);
					}}
				/>

				<Controller
					name="prioridad"
					control={control}
					render={({ field }) => {
						if (field.value !== data.prioridad) {
							onChange({
								...data,
								prioridad: field.value || null,
							});
							data.prioridad = field.value;
						}

						return (
							<SelectComponent
								idInput="prioridad"
								className="select-basic"
								control={control}
								errors={errors}
								label="Prioridad"
								classNameLabel="text--black text-required"
								direction={EDirection.column}
								placeholder="Seleccionar"
								data={[
									{ name: "Baja", value: "1" },
									{ name: "Normal", value: "2" },
									{ name: "Alta", value: "3" },
								]}
							/>
						);
					}}
				/>
				<div className={`${styles["button-wrapper"]}`}>
					<div className={`${styles["button-item"]}`}></div>
					<IoWarningOutline
						color={COLORS[watch("prioridad")]}
						size={60}
					/>
				</div>
			</div>

			{showSearch ? (
				<>
					<div
						className="spc-common-table expansible card-table"
						style={{ marginTop: 40, marginBottom: 40 }}
					>
						<h2
							className="biggest bold"
							style={{
								fontSize: 24,
								fontFamily: "Rubik",
								color: "black",
								fontWeight: 500,
							}}
						>
							Parámetros asunto
						</h2>
						<FormComponent action={undefined}>
							<div className="grid-form-2-container">
								<div className="grid-form-2-container">
									<InputComponentOriginal
										idInput="search_codigo_asunto"
										typeInput="number"
										className="input-basic background-textArea"
										register={register}
										label="Código"
										classNameLabel="text-black big"
										direction={EDirection.column}
										errors={errors}
										onChange={(e) =>
											onChange({
												...data,
												search_codigo_asunto:
													e.target.value,
											})
										}
									/>

									<InputComponentOriginal
										idInput="search_nombre_asunto"
										typeInput="text"
										className="input-basic background-textArea"
										register={register}
										label="Nombre"
										classNameLabel="text-black big"
										direction={EDirection.column}
										errors={errors}
										onChange={(e) =>
											onChange({
												...data,
												search_nombre_asunto:
													e.target.value,
											})
										}
									/>
								</div>

								<div
									style={{
										justifyContent: "flex-end",
										display: "flex",
										marginTop: 12,
									}}
								>
									<button
										style={{
											marginRight: 12,
											marginTop: 12,
										}}
										className="cancel-button"
										onClick={(e) => {
											e.preventDefault();
											setSubjets([]);
											setSelectedCheckbox("");
											setShowSearch(false);
											setSelectedSubject("");
											setSubjets([]);
											setShowSearch(false);
											subjectSetValue(
												"search_codigo_asunto",
												null
											);
											subjectSetValue(
												"search_nombre_asunto",
												""
											);
										}}
									>
										Cancelar
									</button>
									<button
										style={{ marginTop: 12 }}
										className={`search-button ${
											(!data?.search_nombre_asunto &&
												!data?.search_codigo_asunto) ||
											(errors.search_codigo_asunto ||
											errors.search_nombre_asunto
												? true
												: false)
												? "search-button-disabled"
												: "cursor-pointer search-button-active"
										}`}
										onClick={(e) => {
											e.preventDefault();
											search();
										}}
										disabled={
											(!data?.search_nombre_asunto &&
												!data?.search_codigo_asunto) ||
											(errors.search_codigo_asunto ||
											errors.search_nombre_asunto
												? true
												: false)
										}
									>
										Buscar
									</button>
								</div>
							</div>
						</FormComponent>
					</div>
					{subjets?.length > 0 ? (
						<div
							className="card-table"
							style={{ borderRadius: 20 }}
						>
							<TableExpansibleComponent
								actions={undefined}
								columns={[
									{
										fieldName: "check",
										header: "Seleccione",
										renderCell: (row) => {
											return (
												<input
													type="checkbox"
													value={row?.ras_id}
													checked={
														selectedCheckbox ==
														row?.ras_id
													}
													onChange={
														handleCheckboxChange
													}
												/>
											);
										},
									},
									{
										fieldName: "ras_id",
										header: "Código",
									},
									{
										fieldName: "ras_nombre_asunto",
										header: "Nombre",
									},
									{
										fieldName: "ras_tiempo_respuesta",
										header: "Tiempo respuesta",
									},
									{
										fieldName: "ras_unidad",
										header: "Unidad",
									},
								]}
								data={subjets}
							/>
							<div
								style={{
									justifyContent: "flex-end",
									display: "flex",
									marginTop: 12,
								}}
							>
								<button
									style={{ marginRight: 12, marginTop: 12 }}
									className="cancel-button"
									onClick={(e) => {
										e.preventDefault();
										setSubjets([]);
										setShowSearch(false);
										setSelectedCheckbox("");
										subjectSetValue(
											"search_codigo_asunto",
											null
										);
										subjectSetValue(
											"search_nombre_asunto",
											""
										);
									}}
								>
									Cancelar
								</button>
								<button
									style={{ marginTop: 12 }}
									className={`search-button ${
										selectedCheckbox == ""
											? "search-button-disabled"
											: "cursor-pointer search-button-active"
									}`}
									onClick={(e) => {
										e.preventDefault();
										setSelectedSubject(selectedCheckbox);
										setSubjets([]);
										setShowSearch(false);
										subjectSetValue(
											"codigo_asunto",
											selectedCheckbox
										);
										subjectSetValue(
											"search_codigo_asunto",
											null
										);
										subjectSetValue(
											"search_nombre_asunto",
											""
										);
										// onChange({ ...data, tipo: "" })
										// setValue("tipo", "");
										setSelectedCheckbox("");
									}}
									disabled={selectedCheckbox == ""}
								>
									Aceptar
								</button>
							</div>
						</div>
					) : null}
				</>
			) : null}
		</FormComponent>
	);
};

export default BasicDocumentInformation;
