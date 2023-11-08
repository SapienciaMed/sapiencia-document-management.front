import { TreeNode } from "primereact/treenode";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import React, { useContext, useEffect, useState } from "react";
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
import styles from "./styles.module.scss";
import { AppContext } from "../../../../common/contexts/app.context";
import useBreadCrumb from "../../../../common/hooks/bread-crumb.hook";

const MassiveProcesses = () => {
	const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
	const [isDisabledSelect, setIsDisabledSelect] = useState<boolean>(true);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
	const [nodes, setNodes] = useState<TreeNode[] | null>(null);
	const [radicadosList, setRadicadosList] = useState<any[]>([]);
	const [dataForModal, setDataForModal] = useState<any>({});
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);
	const [searchParam, setSearchParam] = useState<any>("");
	const [calendarDate, setCalendarDate] = useState<any>(null);
	const { authorization, setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);

	useBreadCrumb({ isPrimaryPage: true, name: "Procesos masivos de documentos", url: "/gestion-documental/gestion/procesos-masivos" });

	const [filters, setFilters] = useState({
		dra_radicado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		dra_tipo_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_entrada: { value: null, matchMode: FilterMatchMode.EQUALS },
	});

	//const checkAllRowFilterTemplate = () => <input type="checkbox" />;
	const checkAllRowFilterTemplate = () => (
		<input
			type="checkbox"
			checked={selectedCheckboxes.length === radicadosList.length}
			onChange={handleSelectAll}
		/>
	);

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
							checked={selectedCheckboxes.includes(
								row?.dra_radicado
							)}
							onChange={() =>
								handleCheckboxChange(row?.dra_radicado)
							}
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

	const handleCheckboxChange = (value) => {
		const updatedCheckboxes = [...selectedCheckboxes];
		if (updatedCheckboxes.includes(value)) {
			updatedCheckboxes.splice(updatedCheckboxes.indexOf(value), 1);
		} else {
			updatedCheckboxes.push(value);
		}
		setSelectedCheckboxes(updatedCheckboxes);
		setIsDisabledSelect(updatedCheckboxes.length === 0);
		setSelectedNodeKey("");
	};

	const handleSelectAll = () => {
		if (selectedCheckboxes.length === radicadosList.length) {
			setSelectedCheckboxes([]);
			setIsDisabledSelect(true);
		} else {
			const allRadicados = radicadosList.map((row) => row?.dra_radicado);
			setSelectedCheckboxes(allRadicados);
			setIsDisabledSelect(false);
		}
	};

	const handleSendSelected = async () => {
		const selectedData = radicadosList.filter((row) =>
			selectedCheckboxes.includes(row.dra_radicado)
		);

		// Extrae los valores de 'dra_radicado' de los elementos seleccionados.
		const selectedRadicados = selectedData.map((item) => item.dra_radicado);
		// Convierte los valores en una cadena separada por comas.
		//const selectedRadicadosString = selectedRadicados.join(", ");
		// Extrae y formatea los valores de 'dra_radicado' en cadena con comillas.
		const selectedRadicadosString = selectedData
			.map((item) => `"${item.dra_radicado}"`)
			.join(", ");

		//Solicitud Post
		//console.log(selectedRadicadosString, "SELECTEDDATA");
		await storeMassive(selectedRadicadosString);

		//Mensaje de Exito
		setMessage({
			title: "Evacuación exitosa",
			description: "La información ha sido evacuada exitosamente",
			show: true,
			background: true,
			okTitle: "Aceptar",
			style: "z-index-2300",
			onOk: () => {
				setMessage({});
				//Llamar tabla
				!calendarDate
					? getRadicadosByID(searchParam)
					: getRadicadosByDate(searchParam);
			},
		});
	};

	const storeMassive = async (data) => {
		const endpoint: string = `/gestion/processes-massive`;
		const entityData = await post(`${endpoint}`, {
			data: data,
			dra_usuario: authorization?.user?.numberDocument,
		});
		return entityData;
	};

	const radicadoTypesList = (code: string | number) =>
		radicadoTypes.find((item) => {
			return (
				item.lge_agrupador == "TIPOS_RADICADOS" &&
				item.lge_elemento_codigo == code
			);
		});

	// const handleCheckboxChange = (data, event) => {
	// 	setDataForModal(data);
	// 	setIsDisabledSelect(false);
	// 	setSelectedNodeKey("");
	// 	setSelectedCheckbox(event.target.value);
	// 	//setIsDisableSendButton(event.target.value ? false : true);
	// };

	const getRadicadosByID = async (radicadoId: string) => {
		const endpoint: string = `/radicado-details/massive-by-id/${radicadoId}`;
		const dataList = await get(`${endpoint}`);
		setRadicadosList(Array.isArray(dataList?.data) ? dataList?.data : []);
	};

	const getRadicadosByDate = async (date: string) => {
		console.log(date, "FECHA");
		const endpoint: string = `/radicado-details/massive-by-date/${date}`;
		const dataList = await get(`${endpoint}`);
		setRadicadosList(Array.isArray(dataList?.data) ? dataList?.data : []);
	};

	const handleKeyPress = (e) => {
		if (
			e.key === "Enter" &&
			(e.target.value !== null || e.target.value !== "")
		) {
			setSearchParam(e.target.value);
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

	const handleFindByDate = (date) => {
		if (date) {
			setSearchParam(date);
			setIsDisabledSelect(true);
			getRadicadosByDate(date);
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
													const date = moment(myDate)
														.format("YYYY-MM-DD")
														.toString();
													setCalendarDate(date);
													handleFindByDate(date);
												}}
												//onSelect={}
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
						value="Evacuar"
						type="button"
						action={handleSendSelected}
						disabled={isDisabledSelect}
					/>
				</div>
			</div>
		</>
	);
};

export default MassiveProcesses;
