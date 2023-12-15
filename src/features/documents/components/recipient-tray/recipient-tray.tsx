import React, { useContext, useEffect, useState } from "react";
import SpeedDialCircle from "../../../../common/components/speed-dial";
import TableExpansibleDialComponent from "../../../../common/components/table-expansible-dial.component";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Dropdown } from "primereact/dropdown";
import useCrudService from "../../../../common/hooks/crud-service.hook";
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
import { AppContext } from "../../../../common/contexts/app.context";
import { TreeNode } from "primereact/treenode";
import { TreeSelect, TreeSelectChangeEvent } from "primereact/treeselect";
import ActivateReverseDocuments from "../radicados-movements/activate-reverse-documents";
import useBreadCrumb from "../../../../common/hooks/bread-crumb.hook";

const RecipientTray = () => {
	const REVERSE = "devolucion";
	const ACTIVATE = "asignar";
	const { authorization, setMessage } = useContext(AppContext);
	const [typeModal, setTypeModal] = useState<string>("");
	const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
	const [nodes, setNodes] = useState<TreeNode[] | null>(null);
	const [selectedNodeKey, setSelectedNodeKey] = useState<any>(null);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [isDisabledSelect, setIsDisabledSelect] = useState<boolean>(true);
	const [dataForModal, setDataForModal] = useState<any>({});
	const [radicadosList, setRadicadosList] = useState<any>([]);
	const [searchParam, setSearchParam] = useState<string>(null);
	const [filters, setFilters] = useState({
		dra_radicado: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
		dra_tipo_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_radicado: { value: null, matchMode: FilterMatchMode.EQUALS },
		dra_fecha_entrada: { value: null, matchMode: FilterMatchMode.EQUALS },
	});
	const COLORS = ["", "#FFCC00", "#00CC00", "#CC0000"];
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);

	useBreadCrumb({
		isPrimaryPage: true,
		name: "Bandeja de Destinatarios",
		url: "/gestion-documental/radicacion/bandeja-destinatarios",
	});

	useEffect(() => {
		const listAuthActions = authorization.allowedActions;

		const endpoint: string = listAuthActions.includes("ADM_ROL")
			? `/radicado-details/find-all-pending?numberDocument=${authorization.user.numberDocument}&role=ADM_ROL`
			: `/radicado-details/find-all-pending?numberDocument=${authorization.user.numberDocument}`;

		const getRadicadoList = async () => {
			const dataList = await get(`${endpoint}`);
			setRadicadosList(
				Array.isArray(dataList?.data) ? dataList?.data : []
			);
		};
		get(`/generic-list/type-radicado-list`).then((data) => {
			setRadicadoTypes(data);
		});
		getRadicadoList();
	}, []);

	const getRadicadosByID = async (radicadoId: string) => {
		setSearchParam(radicadoId);
		const listAuthActions = authorization.allowedActions;
		const endpoint: string = listAuthActions.includes("ADM_ROL")
			? `/radicado-details/find-by-id/${radicadoId}?numberDocument=${authorization.user.numberDocument}&role=ADM_ROL`
			: `/radicado-details/find-by-id/${radicadoId}?numberDocument=${authorization.user.numberDocument}`;
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
			getRadicadoList();
		}
	};

	const statusRowFilterTemplate = (options) => {
		return (
			<Dropdown
				value={options.value}
				options={radicadoTypes}
				onChange={(e) => {
					return options.filterApplyCallback(e.value);
				}}
				//itemTemplate={statusItemTemplate}
				placeholder="Seleccionar"
				className="p-column-filter"
				showClear={true}
				style={{ minWidth: "12rem" }}
				optionLabel="lge_elemento_descripcion"
				optionValue="lge_elemento_codigo"
				dropdownIcon={
					<IconsIo5.IoChevronDown style={{ color: "#533893" }} />
				}
			/>
		);
	};

	const dateRowFilterTemplate = (options) => {
		return (
			<>
				<span className="p-input-icon-right">
					<i
						className="pi pi-calendar"
						style={{ zIndex: "1000", color: "#533893" }}
					/>
					<Calendar
						style={{ minWidth: "10rem" }}
						inputId="date"
						//value={options.value}
						dateFormat="dd/mm/yy"
						placeholder="DD/MM/AAAA"
						onChange={(e) => {
							const myDate: Date = new Date(e.value.toString());

							const date = moment(myDate)
								.format("DD/MM/YYYY")
								.toString();
							return options.filterApplyCallback(date);
						}}
					/>
				</span>
			</>
		);
	};

	const handleCheckboxChange = (data, event) => {
		setDataForModal(data);
		setIsDisabledSelect(false);
		setSelectedNodeKey("");
		setSelectedCheckbox(event.target.value);
		//setIsDisableSendButton(event.target.value ? false : true);
	};

	const columnSenderTable = [
		{
			fieldName: "",
			header: "Seleccione",
			style: {
				position: "relative",
			},
			renderCell: (row) => {
				//TODO: cambiar al original si el documento es vigente ó vencido
				let color = "";
				switch (row?.dra_estado) {
					case "documentos_vencidos_sin_tramitar":
						color = "circle--red";
						break;
					case "documentos_proximos_a_vencerse":
						color = "circle--orange";
						break;
					case "documentos_a_tramitar_prontamente":
						color = "circle--yellow";
						break;
					default:
						color = "circle--green";
						break;
				}
				return (
					<div
						className={`circle ${color}`}
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
								const texto = radicadoTypesList(
									row?.dra_tipo_radicado
								);
								const data = {
									dra_radicado: row?.dra_radicado,
									dra_tipo_radicado:
										texto?.lge_elemento_descripcion,
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
			//filterPlaceholder: "Radicado",
			//filter: true,
			//filterField: "dra_radicado",
			//showFilterMenu: false,
			style: { minWidth: "12rem" },
		},
		{
			fieldName: "",
			header: "Clase",
			renderCell: (row) => {
				const text =
					authorization.user?.numberDocument ==
					row.dra_id_destinatario
						? "Original"
						: "Copia";
				return text;
			},
			style: { minWidth: "9rem" },
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
			filterMenuStyle: { width: "14rem" },
			//filterField: "dra_tipo_radicado",
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Fecha radicación",
			sortable: true,
			filter: true,
			filterElement: dateRowFilterTemplate,
			showFilterMenu: false,
			style: { minWidth: "15rem" },
		},
		{
			fieldName: "dra_fecha_evacuacion_entrada",
			header: "Fecha Entrada",
			sortable: true,
			filter: true,
			filterElement: dateRowFilterTemplate,
			showFilterMenu: false,
			filterPlaceholder: "DD/MM/AAAA",
			style: { minWidth: "15rem" },
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
			fieldName: "rn_radicado_to_subjectDocument.rta_descripcion",
			header: "Tipo de documento",
			sortable: true,
			style: { minWidth: "6rem" },
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
					key: "evacuacion",
					label: "Evacuar",
					data: "evacuacion",
					icon: "",
				},
			],
		},
	];

	useEffect(() => {
		setNodes(nodesOptions);
	}, []);

	const radicadoTypesList = (code: string | number) =>
		radicadoTypes.find((item) => {
			return (
				item.lge_agrupador == "TIPOS_RADICADOS" &&
				item.lge_elemento_codigo == code
			);
		});

	const getRadicadoList = async () => {
		const listAuthActions = authorization.allowedActions;

		const endpoint: string = listAuthActions.includes("ADM_ROL")
			? `/radicado-details/find-all-pending?numberDocument=${authorization.user.numberDocument}&role=ADM_ROL`
			: `/radicado-details/find-all-pending?numberDocument=${authorization.user.numberDocument}`;
		const dataList = await get(`${endpoint}`);

		setRadicadosList(Array.isArray(dataList?.data) ? dataList?.data : []);
	};

	const onClickEvacuation = async () => {
		//Solicitud Post
		await storeMassive(dataForModal.dra_radicado)
			.then((response) => {
				if (searchParam) {
					getRadicadosByID(searchParam);
					setSelectedCheckbox("");
					setSearchParam(null);
				} else {
					getRadicadoList();
					setSelectedCheckbox("");
				}
				//Mensaje de Éxito
				setMessage({
					title: "Evacuación exitosa",
					description: "La información ha sido evacuada exitosamente",
					show: true,
					background: true,
					okTitle: "Aceptar",
					onOk: () => {
						setMessage({});
					},
				});
			})
			.catch((error) => {
				console.error(error);
				setMessage({
					title: "Error",
					description: "Hubo un error al evacuar el radicado",
					show: true,
					background: true,
					okTitle: "Aceptar",
					onOk: () => {
						setMessage({});
					},
				});
			});

		//Actualizar Tabla después de evacuar.
	};

	const storeMassive = async (data) => {
		const endpoint: string = `/gestion/processes-massive`;
		const entityData = await post(`${endpoint}`, {
			data: data,
			dra_usuario: authorization?.user?.numberDocument,
		});
		return entityData;
	};

	return (
		<>
			<div className=" full-height main-page container-docs-received">
				<div className="card-table shadow-none">
					<div className="card-table shadow-none">
						<div className="title-area">
							<div className="text-black bold font-size-30 mb-40">
								Bandeja de Destinatarios
							</div>
							<div>
								<TreeSelect
									value={selectedNodeKey}
									onChange={(e: TreeSelectChangeEvent) => {
										setSelectedNodeKey(e.value);
										if (e.value == REVERSE) {
											setTypeModal(REVERSE);
											setIsOpenModal(true);
										}

										if (e.value == ACTIVATE) {
											setTypeModal(ACTIVATE);
											setIsOpenModal(true);
										}

										if (e.value == "evacuacion") {
											onClickEvacuation();
										}
									}}
									options={nodes}
									className="md:w-20rem w-full"
									placeholder="Seleccionar"
									style={{ width: "16.75rem" }}
									disabled={isDisabledSelect}
								></TreeSelect>
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
			<ActivateReverseDocuments
				title={
					typeModal == "asignar"
						? "Datos de Asignación"
						: "Datos de Devolución"
				}
				onCloseModal={() => {
					setIsOpenModal(false);
					if (searchParam) {
						getRadicadosByID(searchParam);
					} else {
						getRadicadoList();
					}
				}}
				visible={isOpenModal}
				typeModal={typeModal}
				dataForModal={dataForModal}
			/>
		</>
	);
};

export default RecipientTray;
