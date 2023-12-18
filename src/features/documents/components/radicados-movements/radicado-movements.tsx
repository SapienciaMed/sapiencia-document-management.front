import React, { useContext, useEffect, useState } from "react";
import {
	ButtonComponent,
	FormComponent,
} from "../../../../common/components/Form";
import styles from "./styles.module.scss";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import TableExpansibleDialComponent from "../../../../common/components/table-expansible-dial.component";
import { Tooltip } from "primereact/tooltip";
import * as IconsFi from "react-icons/fi";
import * as IconsBs from "react-icons/bs";
import * as IconsAi from "react-icons/ai";
import SpeedDialCircle from "../../../../common/components/speed-dial";
import { ProgressBar } from 'primereact/progressbar';
import ActivateReverseDocuments from "./activate-reverse-documents";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { Link } from "react-router-dom";
import useBreadCrumb from "../../../../common/hooks/bread-crumb.hook";
import { FilterMatchMode } from "primereact/api";
import CommentsById from "./comments";
import { AppContext } from "../../../../common/contexts/app.context";
import moment from "moment";

const RadicadoMovements = () => {
	const REVERSE = "Reversar";
	const ACTIVATE = "Activar";
	const EVACUADO = "Evacuado";
	const PENDIENTE = "Pendiente";
	const [movementsList, setMovementsList] = useState<any>([]);
	const [isActivateModal, setIsActivateModal] = useState<boolean>(false);
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);
	const [isActivateModalComment, setIsActivateModalComment] =
		useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<string>("");
	const [dataForModal, setDataForModal] = useState<any>({});
	const { authorization } = useContext(AppContext);
	const [isPqrsdf, setIsPqrsdf] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [filters, setFilters] = useState({
		dra_radicado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		dra_tipo_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_entrada: { value: null, matchMode: FilterMatchMode.EQUALS },
	});
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const AtentionCitizenBaseURL: string = process.env.urlApiAtentionCitizen;
	const { get } = useCrudService(baseURL);
	const { post } = useCrudService(AtentionCitizenBaseURL);
	useBreadCrumb({
		isPrimaryPage: true,
		name: "Consulta de Movimientos - Parámetros",
		url: "/gestion-documental/consultas/movimientos",
	});

	const columnMovementsTable = [
		{
			fieldName: "dra_radicado",
			header: "N.° Radicado",
			sortable: true,
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "",
			header: "Clase",
			sortable: true,
			renderCell: (row) => "Original",
		},
		{
			fieldName: "dra_tipo_radicado",
			header: "Tipo",
			renderCell: (row) => {
				const texto = typeRadicadoName(row?.dra_tipo_radicado);
				return texto?.lge_elemento_descripcion || "";
			},
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Fecha de Radicado",
		},
		{
			fieldName: "rn_radicado_remitente_to_entity.fullName",
			header: "Remitente",
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "rn_radicado_destinatario_to_entity.fullName",
			header: "Gestor Actual",
			sortable: true,
			style: { minWidth: "11rem" },
		},
		{
			fieldName: "dependencia",
			header: "Dependencia",
			renderCell: (row) => "Dependencia 1",
		},
		{
			fieldName: "dra_fecha_evacuacion_entrada",
			header: "Fecha de Entrada",
			sortable: true,
		},
		{
			fieldName: "dra_nombre_radicador",
			header: "Enviado por",
			sortable: true,
		},
		{
			fieldName: "dra_fecha_evacuacion_salida",
			header: "Fecha de Salida",
			sortable: true,
		},
		{
			fieldName: "dra_estado_radicado",
			header: "Estado",
			sortable: true,
		},
		{
			fieldName: "rn_radicado_to_subject.ras_nombre_asunto",
			header: "Asunto",
		},
		{
			fieldName: "rn_radicado_to_subjectDocument.rta_descripcion",
			header: "Tipo documento",
		},
		{
			fieldName: "dra_referencia",
			header: "Referencia",
		},
		{
			fieldName: "check",
			header: "Acciones",
			style: { minWidth: "16rem" },
			renderCell: (row) => {
				return (
					<SpeedDialCircle
						dialItems={[
							{
								label: "Ver Comentario",
								template: () => (
									<>
										<Tooltip target=".ver-comentario" />
										<a
											href="#"
											role="menuitem"
											className="p-speeddial-action ver-comentario"
											data-pr-tooltip="Ver comentario"
											onClick={() => {
												setDataForModal({
													dra_radicado:
														row?.dra_radicado,
												});
												setIsActivateModalComment(true);
											}}
										>
											<IconsBs.BsChat className="button grid-button button-link" />
										</a>
									</>
								),
							},
							{
								label: "Reversar Documento",
								template: () => (
									<>
										<Tooltip target=".reversar-documento" />
										<a
											href="#"
											role="menuitem"
											className="p-speeddial-action reversar-documento"
											data-pr-tooltip="Reversar Documento"
											onClick={() => {
												const texto = typeRadicadoName(
													row?.dra_tipo_radicado
												);

												if (
													row.dra_estado_radicado !=
													EVACUADO
												) {
													setDataForModal({
														dra_tipo_radicado:
															texto?.lge_elemento_descripcion,
														dra_radicado:
															row?.dra_radicado,
														dra_radicado_por:
															row?.dra_radicado_por,
													});
													setTypeModal(REVERSE);
													setIsActivateModal(true);
												}
											}}
										>
											<IconsFi.FiFile
												className={`button grid-button button-link ${
													row.dra_estado_radicado ==
													EVACUADO
														? "p-disabled"
														: ""
												}`}
											/>
										</a>
									</>
								),
							},
							{
								label: "Activar documento",
								template: () => (
									<>
										<Tooltip target=".activar-documento" />
										<a
											href="#"
											role="menuitem"
											className="p-speeddial-action activar-documento"
											data-pr-tooltip="Activar documento"
											onClick={() => {
												const texto = typeRadicadoName(
													row?.dra_tipo_radicado
												);
												if (
													row.dra_estado_radicado ==
													EVACUADO
												) {
													setDataForModal({
														dra_tipo_radicado:
															texto?.lge_elemento_descripcion,
														dra_radicado:
															row?.dra_radicado,
													});
													setTypeModal(ACTIVATE);
													setIsActivateModal(true);
												}
											}}
										>
											<IconsAi.AiOutlinePoweroff
												className={`button grid-button button-link ${
													row.dra_estado_radicado ==
													EVACUADO
														? styles.activateGreen
														: "p-disabled"
												}`}
											/>
										</a>
									</>
								),
							},
						]}
						key={row.dra_radicado}
					/>
				);
			},
		},
	];

	const columnMovementsTablePqrsdf = [
		{
			fieldName: "filingNumber",
			header: "N.° Radicado",
			sortable: true,
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "",
			header: "Clase",
			sortable: true,
			renderCell: (row) => "Original",
		},
		{
			fieldName: "",
			header: "Tipo",
			renderCell: (row) => "Recibido",
		},
		{
			fieldName: "createdAt",
			header: "Fecha de Radicado",
			renderCell: (row) => moment(row?.createdAt).format('DD/MM/YYYY HH:mm:ss')
		},
		{
			fieldName: "",
			header: "Remitente",
			renderCell: (row) => {
				return row?.person?.firstName + " " + row?.person?.firstSurname},
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "",
			header: "Gestor Actual",
			sortable: true,
			renderCell: (row) => { return row?.responsible?.user?.names ? row?.responsible?.user?.names + " " + row?.responsible?.user?.lastNames : ""},
			style: { minWidth: "11rem" },
		},
		{
			fieldName: "",
			header: "Dependencia",
			renderCell: (row) => row?.responsible?.workEntityType?.dependence?.dep_descripcion,
		},
		{
			fieldName: "createdAt",
			header: "Fecha de Entrada",
			sortable: true,
			renderCell: (row) => moment(row?.createdAt).format('DD/MM/YYYY HH:mm:ss')
		},
		{
			fieldName: "",
			header: "Enviado por",
			sortable: true,
			renderCell: (row) => "N/A",
		},
		{
			fieldName: "closedAt ",
			header: "Fecha de Salida",
			sortable: true,
			renderCell: (row) => !row?.closedAt ? "" : moment(row?.closedAt).format('DD/MM/YYYY HH:mm:ss')
		},
		{
			fieldName: "status.lep_estado",
			header: "Estado",
			sortable: true,
		},
		{
			fieldName: "requestSubject.aso_asunto",
			header: "Asunto",
		},
		{
			fieldName: "requestType.tso_description",
			header: "Tipo documento",
		},
		{
			fieldName: "",
			header: "Referencia",
			renderCell: (row) => row?.description.length > 1000 ? row?.description.substring(0, 1000) + '...' : row?.description,
		}];

	/**
	 * FUNCTIONS
	 */

	useEffect(() => {
		if (movementsList.length != 0) {
			get(`/generic-list/type-radicado-list`).then((data) => {
				setRadicadoTypes(data);
			});
		}
	}, [movementsList]);

	const typeRadicadoName = (code: string | number) =>
		radicadoTypes.find((item) => {
			return (
				item.lge_agrupador == "TIPOS_RADICADOS" &&
				item.lge_elemento_codigo == code
			);
		});

	const schema = yup.object({
		dra_radicado: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
	});

	const {
		register,
		control,
		getValues,
		watch,
		formState: { errors },
	} = useForm<IMovementsDataForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const searchCitizenAttentionPqrsdf = (citizenData) => {
		const endpoint: string = `/api/v1/pqrsdf/get-paginated`;
		setLoading(true);
		return post(`${endpoint}`, citizenData);
	  };
	
	  const searchPqrsdf = (pqrsdf: object) => {
		searchCitizenAttentionPqrsdf(pqrsdf)
		.then((dataPqrsdf: any) => {
			if (Array.isArray(dataPqrsdf?.data?.array) && dataPqrsdf?.data?.array.length > 0) {
				setLoading(false)
		  		setIsPqrsdf(true);
		  		setMovementsList(dataPqrsdf?.data?.array);
			} else { 
				setLoading(false);
				console.log("El radicado no existe")
			}
		})
		.catch((error) => {
			setLoading(false);
		  console.error(error);
		});
	  }


	const getMovementsByID = async (radicadoId: string) => {
		const listAuthActions = authorization.allowedActions;
		const endpoint: string = listAuthActions.includes("ADM_ROL")
			? `/radicado-details/find-by-id/${radicadoId}?numberDocument=${authorization.user.numberDocument}&role=ADM_ROL`
			: `/radicado-details/find-by-id/${radicadoId}?numberDocument=${authorization.user.numberDocument}`;
		const dataList = await get(`${endpoint}`);

		if (Array.isArray(dataList?.data) && dataList.data.length > 0) {
			setIsPqrsdf(false);
			setMovementsList(dataList?.data);
		} else {
			//Busca el radicado en Pqrsdf si no existe
			searchPqrsdf({
				page: 1,
				perPage: 20,
				filingNumber: radicadoId
			  });
		}
		
	};

	return (
		<>
			<div className="custom-mw" style={{ margin: "0 auto" }}>
				{/* <div className=" full-height container-docs-received"> */}
				<div className="spc-common-table expansible card-table mt-40 mx-24">
					<div className="mb-22 text-black  font-size-28">
						Consulta de Movimientos - Parámetros
					</div>
					<FormComponent action={undefined}>
						<div className="spc-common-table expansible card-table">
							<div
								className="flex gap-20"
								style={{ maxWidth: "90%" }}
							>
								<div
									className="text-black font-size-24 pr-40 mt-20"
									style={{ flexBasis: "40%" }}
								>
									Datos documentos:
								</div>
								<div>
									<InputTextComponent
										idInput="dra_radicado"
										label="N.° Radicado"
										className="input-basic"
										classNameLabel="text-black custom-label text-required"
										control={control}
										errors={errors}
										disabled={false}
									/>
								</div>
								<div
									className="flex gap-20 mt-30"
									style={{
										maxWidth: "80%",
										justifyContent: "flex-end",
									}}
								>
									<div className={`flex gap-20`}>
										{!watch("dra_radicado") && (
											<Link
												className={`${styles.btnPurpleBorderLink} ${styles.btnSizeBorder} hover-three py-12 px-16`}
												to={
													"/gestion-documental/radicacion/bandeja-radicado"
												}
											>
												Volver a la Bandeja
											</Link>
										)}

										<ButtonComponent
											className={`button-main ${styles.btnPurpleSize} py-12 px-16 font-size-16`}
											value="Buscar"
											type="button"
											action={() =>
												getMovementsByID(
													getValues("dra_radicado")
												)
											}
											disabled={
												watch("dra_radicado")
													? false
													: true
											}
										/>
									</div>
								</div>
							</div>
						</div>
					</FormComponent>
					{loading ? <ProgressBar mode="indeterminate" style={{ height: '6px' }}></ProgressBar> : ""}
					{movementsList.length != 0 ? (
						<>
							<div className="spc-common-table expansible card-table">
								<TableExpansibleDialComponent
									columns={isPqrsdf ? columnMovementsTablePqrsdf : columnMovementsTable}
									data={movementsList}
									tableTitle="Consulta de Movimientos - Resultado"
									//filters={filters}
									scrollable={true}
									//style={{ maxWidth: "100%", width: "100%" }}
								/>
							</div>
							<div
								className={`flex gap-20`}
								style={{ justifyContent: "flex-end" }}
							>
								<Link
									className={`${styles.btnPurpleBorderLink} ${styles.btnSizeBorder} hover-three py-12 px-16`}
									to={
										"/gestion-documental/radicacion/bandeja-radicado"
									}
								>
									Volver a la Bandeja
								</Link>
							</div>
						</>
					) : (
						<></>
					)}
				</div>
				{/**
				 * Modals
				 * */}
				<ActivateReverseDocuments
					title={
						typeModal == ACTIVATE
							? "Datos de Activación"
							: "Datos de Activación"
					}
					onCloseModal={() => {
						setIsActivateModal(false);
						getMovementsByID(getValues("dra_radicado")); //TODO: refactor this
					}}
					visible={isActivateModal}
					typeModal={typeModal}
					dataForModal={dataForModal}
				/>
				<CommentsById
					title="Comentarios"
					onCloseModal={() => {
						setIsActivateModalComment(false);
					}}
					visible={isActivateModalComment}
					radicado={dataForModal.dra_radicado}
				/>
			</div>
		</>
	);
};

export default RadicadoMovements;
