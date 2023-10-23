import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import SpeedDialCircle from "../../../../common/components/speed-dial";
import TableExpansibleDialComponent from "../../../../common/components/table-expansible-dial.component";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { IoWarningOutline } from "react-icons/io5";
import moment from "moment";
import TimeElapsed from "../time-elapsed.component";
import { MenuItem } from "primereact/menuitem";
import * as IconsIo5 from "react-icons/io5";
import * as IconsFi from "react-icons/fi";
import * as IconsBs from "react-icons/bs";
import * as IconsAi from "react-icons/ai";
import { Tooltip } from "primereact/tooltip";
import { InputComponentOriginal } from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";

const RadicadosTray = () => {
	const [radicadosList, setRadicadosList] = useState<any>([]);
	const [filters, setFilters] = useState({
		global: { value: null, matchMode: FilterMatchMode.CONTAINS },
		dra_radicado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		dra_tipo_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
	});
	const COLORS = ["", "#FFCC00", "#00CC00", "#CC0000"];

	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);
	const [statuses] = useState([
		"Recibido",
		"2",
		"new",
		"negotiation",
		"renewal",
	]);

	useEffect(() => {
		const getAnswerDocumentByID = async () => {
			const endpoint: string = `/radicado-details/find-all`;
			const dataList = await get(`${endpoint}`);
			setRadicadosList(dataList?.data);
		};
		get(`/generic-list/type-radicado-list`).then((data) => {
			setRadicadoTypes(data);
		});
		getAnswerDocumentByID();
	}, []);

	const getAnswerDocumentByID = async (radicadoId: string, type: string) => {
		const endpoint: string = `/answer-document/${radicadoId}/type/${type}`;
		const dataList = await get(`${endpoint}`);
		setRadicadosList(dataList.data);
	};

	const statusRowFilterTemplate = (options) => {
		console.log(options, radicadoTypes, "options");
		return (
			<Dropdown
				value={options.value}
				options={radicadoTypes}
				onChange={(e) => {
					console.log(e.value, "eeee");
					return options.filterApplyCallback(e.value);
				}}
				//itemTemplate={statusItemTemplate}
				placeholder="Seleccionar"
				className="p-column-filter"
				showClear
				style={{ minWidth: "12rem" }}
				optionLabel="lge_elemento_descripcion"
				optionValue="lge_elemento_codigo"
			/>
		);
	};

	const dateRowFilterTemplate = (options) => {
		console.log(options, "options");
		return (
			<>
				<span className="p-input-icon-right">
					<i className="pi pi-calendar" />
					<InputText
						value={options.value}
						onChange={(e) => {
							console.log(e.currentTarget.value, "eeee");
							return options.filterApplyCallback(
								e.currentTarget.value
							);
						}}
					/>
				</span>
				{/* <span className="p-float-label">
					<Calendar
						inputId="date"
						value={options.value}
						dateFormat="dd/mm/yy"
						onChange={(e) => {
							console.log(e.value, "eeee");
							return options.filterApplyCallback(e.value);
						}}
					/>
					<label htmlFor="date">DD/MM/AAAA</label>
				</span> */}
				{/* <Dropdown
					value={options.value}
					options={statuses}
					onChange={(e) => {
						console.log(e.value, "eeee");
						return options.filterApplyCallback(e.value);
					}}
					//itemTemplate={statusItemTemplate}
					placeholder="Seleccionar"
					className="p-column-filter"
					showClear
					style={{ minWidth: "12rem" }}
				/> */}
			</>
		);
	};

	const columnSenderTable = [
		{
			fieldName: "dra_radicado",
			header: "N.° Radicado",
			sortable: true,
			filterPlaceholder: "Radicado",
			filter: true,
			filterField: "dra_radicado",
			showFilterMenu: false,
			style: { minWidth: "12rem" },
		},
		{
			fieldName: "dra_tipo_radicado",
			header: "Origen",
			sortable: true,
			filter: true,
			filterElement: statusRowFilterTemplate,
			showFilterMenu: false,
			style: { minWidth: "13rem" },
			renderCell: (row) => {
				const texto = radicadoTypesList(row?.dra_tipo_radicado);
				return texto?.lge_elemento_descripcion || "";
			},
			//filterField: radicadoTypes,
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Fecha",
			sortable: true,
			filter: true,
			filterElement: dateRowFilterTemplate,
			//filterField: "dra_fecha_radicado",
			showFilterMenu: false,
			filterPlaceholder: "DD/MM/AAAA",
			style: { minWidth: "13rem" },
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
		{
			fieldName: "dra_tipo_asunto",
			header: "Tipo Asunto",
			sortable: true,
			style: { minWidth: "6rem" },
		},
		{
			fieldName: "dra_asunto",
			header: "Asunto",
			sortable: true,
		},
		{
			fieldName: "dra_referencia",
			header: "Referencia",
			sortable: true,
		},
		{
			fieldName: "dra_radicado_origen",
			header: "Radicado Origen",
			sortable: true,
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Tiempo",
			style: { minWidth: "8rem" },
			renderCell: (row) => {
				const dateRadicado = moment(
					row?.dra_fecha_radicado,
					"DD/MM/YYYY"
				);
				console.log(dateRadicado.isValid(), "dateRadicado");
				return <TimeElapsed fecha={dateRadicado} />;
			},
		},
		{
			fieldName: "dra_prioridad_asunto",
			header: "Prioridad",
			sortable: true,
			renderCell: (row) => {
				return (
					<IoWarningOutline
						color={COLORS[row.dra_prioridad_asunto]}
						size={35}
					/>
				);
			},
		},
		{
			fieldName: "check",
			header: "Acciones",
			style: { minWidth: "16rem" },
			renderCell: (row) => {
				return <SpeedDialCircle dialItems={items} />;
			},
		},
	];

	const items: MenuItem[] = [
		{
			label: "Ver Imagen",
			template: () => (
				<>
					<Tooltip target=".ver-imagen" />
					<a
						href="#"
						role="menuitem"
						className="p-speeddial-action ver-imagen"
						data-pr-tooltip="Ver imagen"
					>
						<IconsIo5.IoImageOutline className="button grid-button button-link" />
					</a>
				</>
			),
		},
		{
			label: "Ver anexo",
			template: () => (
				<>
					<Tooltip target=".ver-anexo" />
					<a
						href="#"
						role="menuitem"
						className="p-speeddial-action ver-anexo"
						data-pr-tooltip="Ver anexo"
					>
						<IconsFi.FiPaperclip className="button grid-button button-link" />
					</a>
				</>
			),
		},
		{
			label: "Firma",
			template: () => (
				<>
					<Tooltip target=".firma" />
					<a
						href="#"
						role="menuitem"
						className="p-speeddial-action firma"
						data-pr-tooltip="Firma"
					>
						<IconsFi.FiEdit className="button grid-button button-link" />
					</a>
				</>
			),
		},
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
					>
						<IconsBs.BsChat className="button grid-button button-link" />
					</a>
				</>
			),
		},
		{
			label: "Ver expediente",
			template: () => (
				<>
					<Tooltip target=".ver-expediente" />
					<a
						href="#"
						role="menuitem"
						className="p-speeddial-action ver-expediente"
						data-pr-tooltip="Ver expediente"
					>
						<IconsFi.FiFile className="button grid-button button-link" />
					</a>
				</>
			),
		},
		{
			label: "Ver Todo",
			template: () => (
				<>
					<Tooltip target=".ver-todo" />
					<a
						href="#"
						role="menuitem"
						className="p-speeddial-action ver-todo"
						data-pr-tooltip="Ver todo"
					>
						<IconsAi.AiOutlineFolderOpen className="button grid-button button-link" />
					</a>
				</>
			),
		},
		{
			label: "Movimientos",
			template: () => (
				<>
					<Tooltip target=".movimientos" />
					<a
						href="#"
						role="menuitem"
						className="p-speeddial-action movimientos"
						data-pr-tooltip="Movimientos"
					>
						<IconsBs.BsArrowLeftRight className="button grid-button button-link" />
					</a>
				</>
			),
		},
	];

	const radicadoTypesList = (code: string | number) =>
		radicadoTypes.find((item) => {
			return (
				item.lge_agrupador == "TIPOS_RADICADOS" &&
				item.lge_elemento_codigo == code
			);
		});

	return (
		<>
			<div className=" full-height main-page container-docs-received">
				<div className="card-table shadow-none">
					<div className="card-table shadow-none">
						<div className="title-area">
							<div className="text-black bold font-size-30 mb-40">
								Bandeja de Radicados
							</div>
						</div>
						<TableExpansibleDialComponent
							columns={columnSenderTable}
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
											onChange={(e) =>
												console.log(e.target.value)
											}
										/>
									</div>
								);
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default RadicadosTray;
