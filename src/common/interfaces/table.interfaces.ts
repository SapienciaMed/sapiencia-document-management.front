import { classNames } from "primereact/utils";
export interface ITableElement<T> {
	sort?: boolean;
	header: string;
	fieldName: string;
	required?: boolean;
	dataList?: IListTableElement[];
	renderCell?: (row: T) => JSX.Element;
	width?: string | number;
	sortable?: boolean;
}

export interface ITableElementDial<T> {
	header: string;
	fieldName: string;
	required?: boolean;
	dataList?: IListTableElement[];
	renderCell?: (row: T) => JSX.Element;
	width?: string | number;
	sortable?: boolean;
	filterPlaceholder?: string;
	filter?: boolean;
	filterField?: string;
	showFilterMenu?: boolean;
	filterElement?: (row: T) => JSX.Element;
	style?: object;
	filterMenuStyle?: object;
	className?: string;
}

export interface IListTableElement {
	id: string | number;
	value: string;
}

export interface ITableAction<T> {
	icon?: "Detail" | "Edit" | "Delete" | "Link" | "Pdf" | "";
	onClick: (row: T) => void;
	customName?: string;
	customIcon?: () => JSX.Element;
	hide?: boolean;
}
