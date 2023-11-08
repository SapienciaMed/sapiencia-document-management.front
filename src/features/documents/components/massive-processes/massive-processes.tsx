import { TreeNode } from "primereact/treenode";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import React, { useEffect, useState } from "react";
import { InputComponentOriginal } from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import TableExpansibleDialComponent from "../../../../common/components/table-expansible-dial.component";
import { FilterMatchMode } from "primereact/api";

const MassiveProcesses = () => {
	const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
	const [isDisabledSelect, setIsDisabledSelect] = useState<boolean>(true);
	const [nodes, setNodes] = useState<TreeNode[] | null>(null);
	const [radicadosList, setRadicadosList] = useState<any[]>([]);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const [filters, setFilters] = useState({
		dra_radicado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		dra_tipo_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_entrada: { value: null, matchMode: FilterMatchMode.EQUALS },
	});

	const columnMassiveTable = [
		// {
		// 	fieldName: "",
		// 	header: "Seleccione",
		// 	style: {
		// 		position: "relative",
		// 	},
		// 	renderCell: (row) => {
		// 		//TODO: cambiar al original si el documento es vigente ó vencido
		// 		return (
		// 			<div
		// 				className={`circle ${
		// 					row?.dra_prioridad_asunto == 1
		// 						? "circle--orange"
		// 						: "circle--green"
		// 				}`}
		// 				style={{
		// 					display: "flex",
		// 					alignItems: "center",
		// 					justifyContent: "center",
		// 				}}
		// 			>
		// 				<input
		// 					type="checkbox"
		// 					value={row?.dra_radicado}
		// 					checked={selectedCheckbox == row?.dra_radicado}
		// 					onChange={(e) => {
		// 						const data = {
		// 							dra_radicado: row?.dra_radicado,
		// 							dra_tipo_radicado: row?.dra_tipo_radicado,
		// 							dra_radicado_por: row?.dra_radicado_por,
		// 						};
		// 						return handleCheckboxChange(data, e);
		// 					}}
		// 				/>
		// 			</div>
		// 		);
		// 	},
		// },
		// {
		// 	fieldName: "dra_radicado",
		// 	header: "N.° Radicado",
		// 	sortable: true,
		// 	//filterPlaceholder: "Radicado",
		// 	//filter: true,
		// 	//filterField: "dra_radicado",
		// 	//showFilterMenu: false,
		// 	style: { minWidth: "12rem" },
		// },
		// {
		// 	fieldName: "dra_tipo_radicado",
		// 	header: "Origen",
		// 	sortable: true,
		// 	filter: true,
		// 	filterElement: statusRowFilterTemplate,
		// 	showFilterMenu: false,
		// 	style: { minWidth: "13rem" },
		// 	renderCell: (row) => {
		// 		const texto = radicadoTypesList(row?.dra_tipo_radicado);
		// 		return texto?.lge_elemento_descripcion || "";
		// 	},
		// 	filterMenuStyle: { width: "14rem" },
		// 	//filterField: "dra_tipo_radicado",
		// },
		// {
		// 	fieldName: "dra_radicado_origen",
		// 	header: "Fecha radicación",
		// 	sortable: true,
		// 	filter: true,
		// 	filterElement: dateRowFilterTemplate,
		// 	showFilterMenu: false,
		// 	style: { minWidth: "15rem" },
		// },
		// {
		// 	fieldName: "dra_fecha_radicado",
		// 	header: "Fecha radicación",
		// 	sortable: true,
		// 	filter: true,
		// 	filterElement: dateRowFilterTemplate,
		// 	showFilterMenu: false,
		// 	style: { minWidth: "15rem" },
		// },
		// {
		// 	fieldName: "dra_fecha_entrada",
		// 	header: "Fecha Entrada",
		// 	sortable: true,
		// 	filter: true,
		// 	filterElement: dateRowFilterTemplate,
		// 	showFilterMenu: false,
		// 	filterPlaceholder: "DD/MM/AAAA",
		// 	style: { minWidth: "15rem" },
		// },
		// {
		// 	fieldName: "rn_radicado_remitente_to_entity.fullName",
		// 	header: "Remitente",
		// 	sortable: true,
		// 	style: { minWidth: "10rem" },
		// },
		// {
		// 	fieldName: "rn_radicado_destinatario_to_entity.fullName",
		// 	header: "Destinatario",
		// 	sortable: true,
		// 	style: { minWidth: "10rem" },
		// },
		// {
		// 	fieldName: "dra_tipo_asunto",
		// 	header: "Tipo de documento",
		// 	sortable: true,
		// 	style: { minWidth: "6rem" },
		// 	renderCell: (row) => {
		// 		//TODO: cambiar al por los verdaderos tipos
		// 		return "Tipo 1";
		// 	},
		// },
		// {
		// 	fieldName: "dra_referencia",
		// 	header: "Referencia",
		// 	sortable: true,
		// },
		// {
		// 	fieldName: "dra_radicado_origen",
		// 	header: "Radicado Origen",
		// 	sortable: true,
		// },
		// {
		// 	fieldName: "dra_fecha_radicado",
		// 	header: "Tiempo",
		// 	style: { minWidth: "8rem" },
		// 	renderCell: (row) => {
		// 		const dateRadicado = moment(
		// 			row?.dra_fecha_radicado,
		// 			"DD/MM/YYYY"
		// 		);
		// 		return <TimeElapsed fecha={dateRadicado} />;
		// 	},
		// },
		// {
		// 	fieldName: "dra_prioridad_asunto",
		// 	header: "Prioridad",
		// 	sortable: true,
		// 	renderCell: (row) => {
		// 		return (
		// 			<IoWarningOutline
		// 				color={COLORS[row.dra_prioridad_asunto]}
		// 				size={35}
		// 			/>
		// 		);
		// 	},
		// },
		// {
		// 	fieldName: "check",
		// 	header: "Acciones",
		// 	style: { minWidth: "16rem" },
		// 	renderCell: (row) => {
		// 		return <SpeedDialCircle dialItems={items} />;
		// 	},
		// },
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
		setNodes(nodesOptions);
	}, []);

	/**
	 * Functions
	 */

	const getRadicadosByID = async (radicadoId: string) => {
		const endpoint: string = `/radicado-details/find-by-id/${radicadoId}`;
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
						<div style={{ width: "17rem" }}>
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
								);
							}}
						/>
					</div>
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
