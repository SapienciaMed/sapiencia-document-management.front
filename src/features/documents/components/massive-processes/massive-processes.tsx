import { TreeNode } from "primereact/treenode";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import React, { useEffect, useState } from "react";
import {
	ButtonComponent,
	InputComponentOriginal,
} from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import TableExpansibleDialComponent from "../../../../common/components/table-expansible-dial.component";
import { FilterMatchMode } from "primereact/api";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import TimeElapsed from "../time-elapsed.component";
import { IoWarningOutline } from "react-icons/io5";
import styles from "./styles.module.scss";

const MassiveProcesses = () => {
	const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
	const [isDisabledSelect, setIsDisabledSelect] = useState<boolean>(true);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [nodes, setNodes] = useState<TreeNode[] | null>(null);
	const [radicadosList, setRadicadosList] = useState<any[]>([]);
	const [dataForModal, setDataForModal] = useState<any>({});
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const [filters, setFilters] = useState({
		dra_radicado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		dra_tipo_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_entrada: { value: null, matchMode: FilterMatchMode.EQUALS },
	});

	const checkAllRowFilterTemplate = () => <input type="checkbox" />;

	const columnMassiveTable = [
		{
			fieldName: "",
			header: "Seleccione",
			style: {
				position: "relative",
			},
			filter: true,
			filterElement: checkAllRowFilterTemplate,
			showFilterMenu: false,
			renderCell: (row) => {
				//TODO: cambiar al original si el documento es vigente ó vencido
				return (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<input
							type="checkbox"
							value={row?.dra_radicado}
							checked={selectedCheckbox == row?.dra_radicado}
							onChange={(e) => {
								const data = {
									dra_radicado: row?.dra_radicado,
									dra_tipo_radicado: row?.dra_tipo_radicado,
									dra_radicado_por: row?.dra_radicado_por,
								};
								return handleCheckboxChange(data, e);
							}}
						/>
					</div>
				);
			},
		},
		{
			fieldName: "dra_radicado",
			header: "N.° Radicado",
			sortable: true,
			style: { minWidth: "12rem" },
		},
		{
			fieldName: "dra_tipo_radicado",
			header: "Origen",
			sortable: true,
			style: { minWidth: "13rem" },
			renderCell: (row) => {
				const texto = radicadoTypesList(row?.dra_tipo_radicado);
				console.log(texto, "TEXTO");
				return texto?.lge_elemento_descripcion || "";
			},
			//filterField: "dra_tipo_radicado",
		},
		{
			fieldName: "dra_radicado_origen",
			header: "Radicado Origen",
			sortable: true,
			style: { minWidth: "15rem" },
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Fecha radicación",
			sortable: true,
			style: { minWidth: "15rem" },
		},
		{
			fieldName: "dra_tipo_asunto",
			header: "Tipo documento",
			sortable: true,
			style: { minWidth: "15rem" },
			renderCell: (row) => {
				//TODO: cambiar al por los verdaderos tipos
				return "Por definir Tipo Doc";
			},
		},
		{
			fieldName: "rn_radicado_remitente_to_entity.fullName",
			header: "Remitente",
			sortable: true,
			style: { minWidth: "10rem" },
		},
		{
			fieldName: "rn_radicado_destinatario_to_entity.fullName",
			header: "Destinatario",
			sortable: true,
			style: { minWidth: "10rem" },
		},
	];

	const nodesOptions = [
		{
			key: "0",
			label: "Gestión",
			data: "gestion",
			icon: "",
			children: [
				{
					key: "asignar",
					label: "Asignar a",
					data: "asignar",
					icon: "",
				},
				{
					key: "devolucion",
					label: "Devolución",
					data: "devolucion",
					icon: "",
				},
				{
					key: "masivos",
					label: "Procesos Masivos",
					data: "masivos",
					icon: "",
				},
			],
		},
	];

	useEffect(() => {
		get(`/generic-list/type-radicado-list`).then((data) => {
			setRadicadoTypes(data);
		});
		setNodes(nodesOptions);
	}, []);

	/**
	 * Functions
	 */

	const radicadoTypesList = (code: string | number) =>
		radicadoTypes.find((item) => {
			return (
				item.lge_agrupador == "TIPOS_RADICADOS" &&
				item.lge_elemento_codigo == code
			);
		});

	const handleCheckboxChange = (data, event) => {
		setDataForModal(data);
		setIsDisabledSelect(false);
		setSelectedNodeKey("");
		setSelectedCheckbox(event.target.value);
		//setIsDisableSendButton(event.target.value ? false : true);
	};

	const getRadicadosByID = async (radicadoId: string) => {
		const endpoint: string = `/radicado-details/massive-by-id/${radicadoId}`;
		const dataList = await get(`${endpoint}`);
		setRadicadosList(Array.isArray(dataList?.data) ? dataList?.data : []);
	};

	const handleKeyPress = (e) => {
		if (
			e.key === "Enter" &&
			(e.target.value !== null || e.target.value !== "")
		) {
			setIsDisabledSelect(true);
			getRadicadosByID(e.target.value);
		}
		if (
			e.key === "Enter" &&
			(e.target.value == null || e.target.value == "")
		) {
			const getRadicadoList = async () => {
				const endpoint: string = `/radicado-details/find-all`;
				const dataList = await get(`${endpoint}`);

				setRadicadosList(
					Array.isArray(dataList?.data) ? dataList?.data : []
				);
			};
			getRadicadoList();
		}
	};

	return (
		<>
			<div className=" full-height main-page container-docs-received">
				<div className="card-table shadow-none">
					<div className="card-table shadow-none">
						<div className="title-area">
							<div className="text-black bold font-size-30 mb-40">
								Bandeja de Radicación
								<div>Procesos masivos de documentos</div>
							</div>
							<div>
								<TreeSelect
									value={selectedNodeKey}
									// onChange={(e: TreeSelectChangeEvent) => {
									// 	setSelectedNodeKey(e.value);
									// 	if (e.value == REVERSE) {
									// 		setTypeModal(REVERSE);
									// 		setIsOpenModal(true);
									// 	}

									// 	if (e.value == ACTIVATE) {
									// 		setTypeModal(ACTIVATE);
									// 		setIsOpenModal(true);
									// 	}
									// }}
									options={nodes}
									className="md:w-20rem w-full"
									placeholder="Seleccionar"
									style={{ width: "16.75rem" }}
									//disabled={isDisabledSelect}
								></TreeSelect>
							</div>
						</div>
						<div className="ml-20 mb-28" style={{ width: "17rem" }}>
							<InputComponentOriginal
								idInput="search"
								typeInput="text"
								className="input-basic background-textArea custom-placeholder"
								label="Buscar documento en la bandeja:"
								classNameLabel="text-black big custom-label"
								direction={EDirection.column}
								placeholder="Buscar"
								onKeyPress={handleKeyPress}
							/>
						</div>
						<TableExpansibleDialComponent
							columns={columnMassiveTable}
							data={radicadosList}
							tableTitle=""
							filters={filters}
							filterDisplay={"row"}
							scrollable={true}
							renderTitle={() => {
								return (
									<div
										style={{
											marginTop: "-40px",
											marginLeft: "20px",
										}}
									>
										<div className="text-black big custom-label">
											Buscar por fecha
										</div>
										<span className="p-input-icon-right">
											<i
												className="pi pi-calendar"
												style={{
													zIndex: "1000",
													color: "#533893",
												}}
											/>
											<Calendar
												style={{ minWidth: "17rem" }}
												inputId="date"
												//value={options.value}
												dateFormat="dd/mm/yy"
												placeholder="DD/MM/AAAA"
												onChange={(e) => {
													const myDate: Date =
														new Date(
															e.value.toString()
														);
													console.log(
														myDate,
														"myDate"
													);
													const date = moment(myDate)
														.format("DD/MM/YYYY")
														.toString();
													return date;
												}}
											/>
										</span>
									</div>
								);
							}}
						/>
					</div>
				</div>
				<div
					className={`mt-22`}
					style={{
						display: "flex",
						justifyContent: "flex-end",
						gap: "2rem",
					}}
				>
					<ButtonComponent
						className={`button-main py-12 px-16 font-size-16`}
						value="Volver a la bandeja"
						type="button"
						action={() => {}}
					/>
					<ButtonComponent
						className={`button-main ${styles.btnPurpleSize} py-12 px-16 font-size-16`}
						value="Buscar"
						type="button"
						action={() => {}}
					/>
				</div>
			</div>
			{/**
			 * Modals
			 * */}
			{/* <ActivateReverseDocuments
				title={
					typeModal == "asignar"
						? "Datos de Asignación"
						: "Datos de Devolución"
				}
				onCloseModal={() => {
					setIsOpenModal(false);
				}}
				visible={isOpenModal}
				typeModal={typeModal}
				dataForModal={dataForModal}
			/> */}
		</>
	);
};

export default MassiveProcesses;
