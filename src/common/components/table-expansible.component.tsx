import React, { useEffect, useState } from "react";
import {
	ITableAction,
	ITableElement,
} from "../../common/interfaces/table.interfaces";
import { useWidth } from "../../common/hooks/use-width";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Row } from "primereact/row";
import { DataView } from "primereact/dataview";
import * as Icons from "react-icons/fa";
import * as IconsBI from "react-icons/bi";
import {
	Paginator,
	PaginatorCurrentPageReportOptions,
	PaginatorNextPageLinkOptions,
	PaginatorPageChangeEvent,
	PaginatorPageLinksOptions,
	PaginatorPrevPageLinkOptions,
	PaginatorRowsPerPageDropdownOptions,
	PaginatorTemplateOptions,
} from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";

interface IProps<T> {
	columns: ITableElement<T>[];
	actions?: ITableAction<T>[];
	data?: object[];
	isSelectionMode?: boolean;
	isExpander?: boolean;
	tableTitle?: string;
	renderTitle?: any
}

const TableExpansibleComponent = ({
	columns,
	actions,
	data,
	isSelectionMode,
	isExpander,
	tableTitle,
	renderTitle,
}: IProps<any>): React.JSX.Element => {
	const [first, setFirst] = useState<number>(0);
	const [perPage, setPerPage] = useState<number>(10);
	const [page, setPage] = useState<number>(0);
	const { width } = useWidth();
	const widthColumns = width / ((columns.length + 1) * 2);
	const [expandedRows, setExpandedRows] = useState(null);
	const [expandedRowsMobile, setExpandedRowsMobile] = useState({});
	const allowExpansion = (rowData) => {
		return rowData.childrens?.length > 0;
	};
	function onPageChange(event: PaginatorPageChangeEvent): void {
		setPerPage(event.rows);
		setFirst(event.first);
		setPage(event.page);
	}
	const rowExpansionTemplate = (data) => {
		const rows = data.childrens;
		return (
			<table className="p-datatable-table">
				{rows.map((item) => {
					return (
						<tr key={item} style={{ background: "transparent" }}>
							<td
								style={{
									maxWidth: `50px`,
									minHeight: `50px`,
									width: `50px`,
								}}
							></td>
							{columns.map((column) => {
								const properties = column.fieldName.split(".");
								let field =
									properties.length === 2
										? item[properties[0]][properties[1]]
										: item[properties[0]];
								return (
									<td
										key={item}
										style={{
											maxWidth: `${widthColumns}px`,
											minHeight: `${widthColumns}px`,
											width: `${widthColumns}px`,
										}}
									>
										{" "}
										{column.renderCell
											? column.renderCell(item)
											: field}{" "}
									</td>
								);
							})}
							{actions && (
								<td
									className="spc-table-actions"
									style={{
										minHeight: `${widthColumns}px`,
									}}
								>
									<ActionComponent
										row={item}
										actions={actions}
									/>
								</td>
							)}
						</tr>
					);
				})}
			</table>
		);
	};
	const getExpansible = (item) => {
		if (expandedRowsMobile[`${item.consecutive}`]) {
			return (
				<div
					onClick={() => {
						let _expandedRowsMobile = {};
						_expandedRowsMobile[`${item.consecutive}`] = false;
						setExpandedRowsMobile({
							...expandedRowsMobile,
							..._expandedRowsMobile,
						});
					}}
				>
					<Icons.FaChevronDown />
				</div>
			);
		}
		return (
			<div
				onClick={() => {
					let _expandedRowsMobile = {};
					_expandedRowsMobile[`${item.consecutive}`] = true;
					setExpandedRowsMobile({
						...expandedRowsMobile,
						..._expandedRowsMobile,
					});
				}}
			>
				<Icons.FaChevronRight />
			</div>
		);
	};
	const mobilTemplate = (item) => {
		const childrens = item.childrens;
		return (
			<>
				<div className="card-grid-item">
					<div className="card-header">
						{!item.childrens ? <></> : getExpansible(item)}
						{columns.map((column) => {
							const properties = column.fieldName.split(".");
							let field =
								properties.length === 2
									? item[properties[0]][properties[1]]
									: item[properties[0]];
							return (
								<div
									key={item}
									className="item-value-container"
								>
									<p className="text-black bold">
										{column.header}
									</p>
									<p className="auto-size-column">
										{" "}
										{column.renderCell
											? column.renderCell(item)
											: field}{" "}
									</p>
								</div>
							);
						})}
					</div>
					<div className="card-footer">
						{actions?.map((action) => (
							<div
								key={action.icon}
								onClick={() => action.onClick(item)}
							>
								{getIconElement(action.icon, "src")}
							</div>
						))}
					</div>
				</div>
				{expandedRowsMobile[`${item.consecutive}`] && childrens ? (
					childrens.map((children) => {
						return (
							<div className="card-grid-item" key={children}>
								<div className="card-header">
									{columns.map((column) => {
										const properties =
											column.fieldName.split(".");
										let field =
											properties.length === 2
												? children[properties[0]][
														properties[1]
												  ]
												: children[properties[0]];
										return (
											<div
												key={children}
												className="item-value-container"
											>
												<p className="text-black bold">
													{column.header}
												</p>
												<p>
													{" "}
													{column.renderCell
														? column.renderCell(
																children
														  )
														: field}{" "}
												</p>
											</div>
										);
									})}
								</div>
								<div className="card-footer">
									{actions?.map((action) => (
										<div
											key={action.icon}
											onClick={() => action.onClick(item)}
										>
											{getIconElement(action.icon, "src")}
										</div>
									))}
								</div>
							</div>
						);
					})
				) : (
					<></>
				)}
			</>
		);
	};

//   const [sortField, setSortField] = useState(null);
//   const [sortOrder, setSortOrder] = useState(1);
//   let [orderStatus, setOrderStatus] = useState(false)

//   const customSort = (e) => {
// 	const field = e.sortField;
// 	let order = e.sortOrder;

// 	if (order !== 0) {
// 		order = order === 1 ? -1 : 1;
// 	}

// 	console.log(order)

// 	setSortField(field);
// 	setSortOrder(!orderStatus ? 1 : -1);
// 	setOrderStatus(!orderStatus);
//   };

//   const customSortFunction = (dataToSort) => {
//   const emptyItems = dataToSort.filter((item) => Object.keys(item).length === 0);
//   const nonEmptyItems = dataToSort.filter((item) => Object.keys(item).length > 0);

//   if (sortField && sortOrder !== 0) {
//     nonEmptyItems.sort((a, b) => {
//       const aValue = a[sortField];
//       const bValue = b[sortField];
//       return sortOrder === 1 ? (aValue > bValue ? 1 : -1) : (bValue > aValue ? 1 : -1);
//     });
//   }

//   return [...emptyItems, ...nonEmptyItems];
// };

//   const sortedData = customSortFunction(data);
	return (
		<div
			className="spc-common-table expansible"
			style={{ display: "relative", border: "none" }}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					alignContent: "center",
					justifyContent: "space-between",
					border: "none",
				}}
			>
				<div className="text-black large bold mt-18 ">
					{tableTitle || "Resultados de Búsqueda"}
					{renderTitle ? renderTitle() : null}
				</div>

				<Paginator
					style={{ justifyContent: "flex-end" }}
					className="between"
					template={paginatorHeader}
					// leftContent={width > 830 ? leftContent : null}
					first={first}
					rows={perPage}
					totalRecords={data?.length || 0}
					onPageChange={onPageChange}
				/>
			</div>

			{width > 830 ? (
				<DataTable
					style={{ maxWidth: '100%', width: '100%' }}
					value={data.slice(page * perPage, page * perPage + perPage)}
					// sortField={sortField}
					// sortOrder={sortOrder as any}
					// onSort={customSort}
					expandedRows={expandedRows}
					rowExpansionTemplate={rowExpansionTemplate}
					dataKey="consecutive"
					onRowToggle={(e) => setExpandedRows(e.data)}
					scrollable={true}
					emptyMessage={"No se encontraron resultados"}
				>
					{isSelectionMode && (
						<Column
							selectionMode="single"
							headerStyle={{ width: "3rem" }}
						></Column>
					)}
					{isExpander && (
						<Column
							expander={allowExpansion}
							style={{
								maxWidth: `50px`,
								minHeight: `50px`,
								width: `50px`,
							}}
						/>
					)}

					{columns.map((col) => (
						<Column
							key={col.fieldName}
							field={col.fieldName}
							header={col.header}
							body={col.renderCell}
							sortable={col.sort || false }
							style={{
								minWidth: `150px`,
								minHeight: `${widthColumns}px`,
							}}
						/>
					))}

					{actions && (
						<Column
							style={{
								minHeight: `${widthColumns}px`,
							}}
							className="spc-table-actions"
							header={
								<div>
									<div className="spc-header-title">
										Acciones
									</div>
								</div>
							}
							body={(row) => (
								<ActionComponent row={row} actions={actions} />
							)}
						/>
					)}
				</DataTable>
			) : (
				<DataView
					value={[...data].slice(
						perPage * page,
						perPage * page + perPage
					)}
					itemTemplate={mobilTemplate}
					emptyMessage={"No se encontraron resultados"}
				/>
			)}
			<Paginator
				className="spc-table-paginator"
				template={paginatorFooter}
				first={first}
				rows={perPage}
				totalRecords={data?.length || 0}
				onPageChange={onPageChange}
			/>
		</div>
	);
};

const leftContent = (
	<p className="header-information text-black bold biggest"></p>
);

const paginatorHeader: PaginatorTemplateOptions = {
	layout: "CurrentPageReport RowsPerPageDropdown",
	CurrentPageReport: (options: PaginatorCurrentPageReportOptions) => {
		return (
			<div className="information">
				<p className="header-information text-black bold big">
					Total de resultados
				</p>
				<p className="header-information text-main bold big">
					{options.totalRecords}
				</p>
			</div>
		);
	},
	RowsPerPageDropdown: (options: PaginatorRowsPerPageDropdownOptions) => {
		const dropdownOptions = [
			{ label: 10, value: 10 },
			{ label: 30, value: 30 },
			{ label: 50, value: 50 },
			{ label: 100, value: 100 },
		];

		return (
			<div className="information">
				<p className="header-information text-black bold big">
					Registros por página{" "}
				</p>
				<Dropdown
					value={options.value}
					className="header-information"
					options={dropdownOptions}
					onChange={options.onChange}
				/>
			</div>
		);
	},
};

const paginatorFooter: PaginatorTemplateOptions = {
	layout: "PrevPageLink PageLinks NextPageLink",
	PrevPageLink: (options: PaginatorPrevPageLinkOptions) => {
		return (
			<button
				type="button"
				className={classNames(options.className, "border-round")}
				onClick={options.onClick}
				disabled={options.disabled}
			>
				<span className="p-3 table-previus"></span>
			</button>
		);
	},
	NextPageLink: (options: PaginatorNextPageLinkOptions) => {
		return (
			<button
				type="button"
				className={classNames(options.className, "border-round")}
				onClick={options.onClick}
				disabled={options.disabled}
			>
				<span className="p-3 table-next"></span>
			</button>
		);
	},
	PageLinks: (options: PaginatorPageLinksOptions) => {
		if (
			(options.view.startPage === options.page &&
				options.view.startPage !== 0) ||
			(options.view.endPage === options.page &&
				options.page + 1 !== options.totalPages)
		) {
			const className = classNames(options.className, {
				"p-disabled": true,
			});

			return (
				<span className={className} style={{ userSelect: "none" }}>
					...
				</span>
			);
		}

		return (
			<button
				type="button"
				className={options.className}
				onClick={options.onClick}
			>
				{options.page + 1}
			</button>
		);
	},
};

const ActionComponent = (props: {
	row: any;
	actions: ITableAction<any>[];
}): React.JSX.Element => {
	console.log(props)
	return (
		<div className="spc-table-action-button">
			{props.actions.map((action) => (
				<div
					key={action.icon}
					onClick={() => action.onClick(props.row)}
				>
					{getIconElement(action.icon, "src")}
					{action?.customIcon ? action?.customIcon() : null}
				</div>
			))}
		</div>
	);
};

// Metodo que retorna el icono o nombre de la accion
function getIconElement(icon: string, element: "name" | "src") {
	switch (icon) {
		case "Detail":
			return element == "name" ? (
				"Detalle"
			) : (
				<Icons.FaEye className="button grid-button button-detail" />
			);
		case "Edit":
			return element == "name" ? (
				"Editar"
			) : (
				<IconsBI.BiPencil className="button grid-button button-edit" />
			);
		case "Delete":
			return element == "name" ? (
				"Eliminar"
			) : (
				<Icons.FaTrashAlt className="button grid-button button-delete" />
			);
		case "Link":
			return element == "name" ? (
				"Vincular"
			) : (
				<Icons.FaLink className="button grid-button button-link" />
			);
		default:
			return "";
	}
}

export default React.memo(TableExpansibleComponent);
