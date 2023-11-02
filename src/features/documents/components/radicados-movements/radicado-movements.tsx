import React, { useState } from "react";
import {
	ButtonComponent,
	FormComponent,
	InputComponentOriginal,
} from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import styles from "./styles.module.scss";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import TableExpansibleDialComponent from "../../../../common/components/table-expansible-dial.component";
import { MenuItem } from "primereact/menuitem";
import { Tooltip } from "primereact/tooltip";
import * as IconsIo5 from "react-icons/io5";
import * as IconsFi from "react-icons/fi";
import * as IconsBs from "react-icons/bs";
import * as IconsAi from "react-icons/ai";
import SpeedDialCircle from "../../../../common/components/speed-dial";
import { Dialog } from "primereact/dialog";
import ActivateReverseDocuments from "./activate-reverse-documents";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { InputNumberComponent } from "../../../../common/components/Form/input-number.component";
import { InputTextNumberComponent } from "../input-text-number";
import { Link } from "react-router-dom";

const RadicadoMovements = () => {
	const REVERSE = "Reversar";
	const ACTIVATE = "Activar";
	const [movementsList, setMovementsList] = useState<any>([]);
	const [isActivateModal, setIsActivateModal] = useState<boolean>(false);
	const [isReverseModal, setIsReverseModal] = useState<boolean>(false);
	const [typeModal, setTypeModal] = useState<string>("");
	const [dataForModal, setDataForModal] = useState<any>({});
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const columnMovementsTable = [
		{
			fieldName: "dra_radicado",
			header: "N.° Radicado",
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "dra_tipo_radicado",
			header: "Clase",
		},
		{
			fieldName: "dra_tipo_radicado",
			header: "Tipo",
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Fecha",
		},
		{
			fieldName: "rn_radicado_remitente_to_entity.fullName",
			header: "Remitente",
			sortable: true,
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "rn_radicado_destinatario_to_entity.fullName",
			header: "Gestor Actual",
			sortable: true,
			style: { minWidth: "11rem" },
		},
		{
			fieldName: "dra_tipo_asunto",
			header: "Dependencia",
		},
		{
			fieldName: "dra_asunto",
			header: "Fecha de Entrada",
			sortable: true,
		},
		{
			fieldName: "dra_referencia",
			header: "Enviado por",
			sortable: true,
		},
		{
			fieldName: "dra_radicado_origen",
			header: "Fecha de Salida",
			sortable: true,
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Estado",
		},
		{
			fieldName: "dra_prioridad_asunto",
			header: "Asunto",
		},
		{
			fieldName: "tipo_doc",
			header: "Tipo documento",
		},
		{
			fieldName: "ref",
			header: "Referencia",
		},
		,
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
												console.log(
													row.dra_radicado,
													"ver comentario"
												);
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
												setDataForModal({
													dra_tipo_radicado:
														row.dra_tipo_radicado,
													dra_radicado:
														row.dra_radicado,
												});
												setTypeModal(REVERSE);
												setIsActivateModal(true);
											}}
										>
											<IconsFi.FiFile className="button grid-button button-link" />
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
												setDataForModal({
													dra_tipo_radicado:
														row.dra_tipo_radicado,
													dra_radicado:
														row.dra_radicado,
												});
												setTypeModal(ACTIVATE);
												setIsActivateModal(true);
											}}
										>
											<IconsAi.AiOutlineFolderOpen className="button grid-button button-link" />
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

	/**
	 * FUNCTIONS
	 */

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

	const getMovementsByID = async (radicadoId: string) => {
		const endpoint: string = `/radicado-details/find-by-id/${radicadoId}`;
		const dataList = await get(`${endpoint}`);
		setMovementsList(Array.isArray(dataList?.data) ? dataList?.data : []);
	};

	return (
		<>
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
									label="N.° documento"
									className="input-basic"
									classNameLabel="text-black text-required custom-label"
									control={control}
									errors={errors}
									disabled={false}
								/>
							</div>
							<div className="flex flex-column">
								<InputComponentOriginal
									idInput="start"
									typeInput="date"
									className={`input-basic ${styles.inputSize}`}
									register={null}
									label="Fecha de radicación"
									classNameLabel="text-black custom-label"
									direction={EDirection.column}
									errors={null}
								/>
								<InputComponentOriginal
									idInput="start"
									typeInput="date"
									className={`input-basic ${styles.inputSize}`}
									register={null}
									label=" "
									classNameLabel="text-black custom-label"
									direction={EDirection.column}
									errors={null}
								/>
							</div>
							<div
								className="mt-30"
								style={{ alignSelf: "center" }}
							>
								<input type="checkbox" />
							</div>
						</div>
					</div>
					<div
						className="flex gap-20 mt-30"
						style={{ maxWidth: "90%" }}
					>
						<div
							className="text-black font-size-24 pr-40 pl-24"
							style={{ flexBasis: "40%" }}
						>
							Ordenar Resultados por:
						</div>
						<div>
							<InputComponentOriginal
								idInput="days"
								typeInput="number"
								className={`input-basic text-center ${styles.inputSize}`}
								register={null}
								label="Ordenar por"
								classNameLabel="text-black custom-label"
								direction={EDirection.column}
								errors={null}
							/>
						</div>
						<div
							className={`flex gap-20`}
							style={{ alignItems: "flex-end" }}
						>
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
									getMovementsByID(getValues("dra_radicado"))
								}
								disabled={watch("dra_radicado") ? false : true}
							/>
						</div>
					</div>
				</FormComponent>
				{movementsList.length != 0 ? (
					<>
						<div className="spc-common-table expansible card-table">
							<TableExpansibleComponent
								columns={columnMovementsTable}
								data={movementsList}
								tableTitle="Consulta de Movimientos - Resultado"
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
						: "Datos de Devolución"
				}
				onCloseModal={() => {
					setIsActivateModal(false);
				}}
				visible={isActivateModal}
				typeModal={typeModal}
				dataForModal={dataForModal}
			/>
		</>
	);
};

export default RadicadoMovements;
