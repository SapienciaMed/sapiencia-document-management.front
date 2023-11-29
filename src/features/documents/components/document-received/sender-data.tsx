import React, { useContext, useEffect, useState } from "react";
import styles from "./document-received.module.scss";
import {
	ButtonComponent,
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppContext } from "../../../../common/contexts/app.context";
import { InputTextIconComponent } from "../input-text-icon.component";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import SearchSenderForm from "./search-sender-form";
import CreateEntityForm from "./create-entity-form";
import EditEntityForm from "./edit-entity-form";
import { ITableAction } from "../../../../common/interfaces/table.interfaces";

interface IProps {
	onChange: (data: any) => void;
	data: any;
}

const SenderData = ({ data: allData, onChange }: IProps) => {
	const [refreshTableId, setRefreshTableId] =
		useState<ISenderCreateForm>(null);
	const [deleteInputs, setDeleteInputs] = useState<boolean>(false);
	const [geographicData, setGeographicData] = useState<any>([]);
	const [typeEntityData, setTypeEntityData] = useState<any>([]);
	const [getNombreEntidad, setGetNombreEntidad] = useState("");
	const [getPais, setGetPais] = useState("");
	const [getDepartamento, setGetDepartamento] = useState("");
	const [getMunicipio, setGetMunicipio] = useState("");
	const [isDisableSendButton, setIsDisableSendButton] = useState(true);
	const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [visibleCreateForm, setVisibleCreateForm] = useState<boolean>(false);
	const [isVisibleSearchForm, setIsVisibleSearchForm] =
		useState<boolean>(false);
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);
	const [findSenderData, setFindSenderData] = useState<any>([]);
	const [editData, setEditData] = useState<any>([]);
	const [visibleEditForm, setVisibleEditForm] = useState<boolean>(false);
	const [dataLoaded, setDataLoaded] = useState(false);

	const EntitySearchActions: ITableAction<any>[] = [
		{
			icon: "Edit",
			onClick: (row) => {
				setEditData(row);
				setVisibleEditForm(true);
			},
		},
	];

	useEffect(() => {
		if (refreshTableId?.ent_numero_identidad) {
			const updateData = async () => {
				await findSenderInformation({
					doc_identidad: refreshTableId?.ent_numero_identidad,
				});
				setRefreshTableId(null);
			};
			updateData();
		}
	}, [refreshTableId, findSenderData]);

	useEffect(() => {
		get(`/generic-list/geographic-list`).then((data) => {
			setGeographicData(data);
		});
		get(`/generic-list/type-entity-list`).then((data) => {
			setTypeEntityData(data);
		});
	}, []);

	useEffect(() => {
		if (
			allData &&
			allData?.enviado_por &&
			geographicData.length > 0 &&
			typeEntityData.length > 0
		) {
			setValue("enviado_por", allData?.enviado_por);
			onBlurData();
		}
		if (
			allData &&
			allData?.enviado_por &&
			geographicData.length > 0 &&
			typeEntityData.length > 0
		  ) {
			setValue("enviado_por", allData?.enviado_por);
			onBlurData();
			setDataLoaded(true);
		  }
	}, [geographicData, typeEntityData]);

	useEffect(() => {
		setGetNombreEntidad("");
		setGetPais("");
		setGetDepartamento("");
		setGetMunicipio("");
		setDeleteInputs(false);
	}, [deleteInputs]);

	const elementoBuscado = (
		agrupador: string,
		codigo: string | number,
		data?: any[]
	) => {
		return (data ? data : geographicData).find((item) => {
			return (
				item.lge_agrupador == agrupador &&
				item.lge_elemento_codigo == codigo
			);
		});
	};

	const tipoEntidad = (agrupador: string, codigo: string | number) =>
		typeEntityData.find((item) => {
			return (
				item.lge_agrupador == agrupador &&
				item.lge_elemento_codigo == codigo
			);
		});

	const handleCheckboxChange = (event) => {
		setSelectedCheckbox(event.target.value);
		setIsDisableSendButton(event.target.value ? false : true);
	};

	const schema = yup.object({
		enviado_por: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		nombres_apellidos: yup.string().required(),
		pais: yup.string().required(),
		departamento: yup.string().required(),
		municipio: yup.string().required(),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		setFocus,
		reset,
		watch,
		formState: { errors },
	} = useForm<ISenderDataForm>({
		resolver: yupResolver(schema),
		mode: "all",
		defaultValues: { ...allData },
	});

	// Verifica si el array no contiene valores indefinidos
	//const hasUndefinedValues = watchSearchInputs.every((x) => x === undefined);

	const setAllData = (data) => {
		//ToDO: Se puede Optimizar
		const paisData = elementoBuscado("PAISES", data?.ent_pais);
		const departamentoData = elementoBuscado(
			"DEPARTAMENTOS",
			data?.ent_departamento
		);
		const municipioData = elementoBuscado(
			"MUNICIPIOS",
			data?.ent_municipio
		);
		setValue("nombres_apellidos", data?.fullName);

		onChange({
			...allData,
			enviado_por: data?.ent_numero_identidad,
			nombres_apellidos: data?.fullName,
			pais: paisData?.lge_elemento_descripcion,
			departamento: departamentoData?.lge_elemento_descripcion,
			municipio: municipioData?.lge_elemento_descripcion,
		});
	};

	const handleEnvioPorChange = (event) => {
		const inputValue = event.target.value;
		if (!inputValue) {
		  setGetNombreEntidad("");
		  setGetPais("");
		  setGetDepartamento("");
		  setGetMunicipio("");
		  setValue("nombres_apellidos", "");
		}
	  };

	const onBlurData = () => {
		const idNumber = getValues("enviado_por");

		if (idNumber && idNumber.length <= 15) {
			checkIdInDB(idNumber).then(async ({ data, message }: any) => {
				const paisData = elementoBuscado("PAISES", data?.ent_pais);
				const departamentoData = elementoBuscado(
					"DEPARTAMENTOS",
					data?.ent_departamento
				);
				const municipioData = elementoBuscado(
					"MUNICIPIOS",
					data?.ent_municipio
				);
				if (data !== null) {
					console.log("data", data);
					setValue(
						"nombres_apellidos",
						data?.ent_nombres + " " + data?.ent_apellidos
					);
					setGetPais(paisData?.lge_elemento_descripcion || "");
					setGetDepartamento(
						departamentoData?.lge_elemento_descripcion || ""
					);
					setGetMunicipio(
						municipioData?.lge_elemento_descripcion || ""
					);
					setAllData(data);
					setDataLoaded(true);
				} else {
					setMessage({
						title: "Datos del remitente",
						description: message.error,
						show: true,
						background: true,
						okTitle: "Aceptar",
						onOk: () => {
							setMessage({});
						},
					});
					reset({
						nombres_apellidos: "",
						pais: "",
						departamento: "",
						municipio: "",
					});
					setDeleteInputs(true);
					setDataLoaded(false);
				}
			});
		}
	};

	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/entities/${idNumber}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	const findSenderInformation = async (findData) => {
		const endpoint: string = `/entities/find`;
		setFindSenderData(await post(`${endpoint}`, findData));
		setIsVisibleTable(true);
	};

	const refreshTable = (data) => {
		setRefreshTableId(data);
	};

	const handleClickHideForm = () => {
		setIsVisibleSearchForm(!isVisibleSearchForm);
		setIsVisibleTable(false);
		setSelectedCheckbox("");
		setIsDisableSendButton(true);
	};

	const onclickSenderIdValue = () => {
		setValue("enviado_por", selectedCheckbox);
		setSelectedCheckbox("");
		setGetDepartamento("");
		setGetMunicipio("");
		onBlurData();
		setFocus("enviado_por");
		setIsVisibleSearchForm(!isVisibleSearchForm);
		setIsVisibleTable(false);
		setIsDisableSendButton(true);
	};

	const handleHideEntityForm = (isModalOption) => {
		if (isModalOption) {
			setMessage({
				title: "Cancelar acción",
				description:
					"¿Desea cancelar la acción?, no se guardarán los datos",
				show: true,
				background: true,
				okTitle: "Continuar",
				cancelTitle: "Cancelar",
				style: "z-index-1200",
				onOk: () => {
					setMessage({});
				},
				onCancel: () => {
					setMessage({});
					setVisibleCreateForm(false);
					setVisibleEditForm(false);
				},
			});
		} else {
			setVisibleCreateForm(false);
			setVisibleEditForm(false);
		}
	};

	const chargingNewData = (data) => {
		const paisData = elementoBuscado("PAISES", data?.ent_pais);
		const departamentoData = elementoBuscado(
			"DEPARTAMENTOS",
			data?.ent_departamento
		);
		const municipioData = elementoBuscado(
			"MUNICIPIOS",
			data?.ent_municipio
		);
		setValue("enviado_por", data.ent_numero_identidad);
		//setValue("nombres_apellidos", data.fullName);
		setGetNombreEntidad(data.fullName);
		setGetPais(paisData?.lge_elemento_descripcion || "");
		setGetDepartamento(departamentoData?.lge_elemento_descripcion || "");
		setGetMunicipio(municipioData?.lge_elemento_descripcion || "");
	};

	return (
		<>
			<FormComponent action={null}>
				<div className="">
					<div
						className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
					>
						<div>
							<InputTextIconComponent
								idInput="enviado_por"
								control={control}
								label="Enviado por"
								className="input-basic"
								classNameLabel="text--black text-required"
								errors={dataLoaded ? {} : errors}
								disabled={false}
								onBlur={onBlurData}
								max={12}
								onChange={handleEnvioPorChange}
								iconAction={handleClickHideForm}
							/>
						</div>

						<Controller
							name="nombres_apellidos"
							control={control}
							render={({ field }) => (
								<InputComponent
									id="nombres_apellidos"
									idInput="nombres_apellidos"
									value={`${
										getNombreEntidad || field.value || ""
									}`}
									label="Nombres y apellidos"
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
					</div>
					<div
						className={`${styles["document-container"]} ${styles["document-container--col4"]}`}
					>
						<Controller
							name="pais"
							control={control}
							render={({ field }) => (
								<InputComponent
									id="pais"
									idInput="pais"
									value={`${getPais || field.value || ""}`}
									label="País"
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
							name="departamento"
							control={control}
							render={({ field }) => (
								<InputComponent
									id="departamento"
									idInput="departamento"
									value={`${
										getDepartamento || field.value || ""
									}`}
									label="Departamento"
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
							name="municipio"
							control={control}
							render={({ field }) => (
								<InputComponent
									id="municipio"
									idInput="municipio"
									value={`${
										getMunicipio || field.value || ""
									}`}
									label="Municipio"
									className="input-basic"
									classNameLabel="text--black"
									typeInput={"texto"}
									register={register}
									onChange={null}
									errors={errors}
									disabled={true}
								/>
							)}
						/>
					</div>
				</div>
			</FormComponent>
			{isVisibleSearchForm && (
				<SearchSenderForm
					searchData={findSenderInformation}
					onClickHideForm={handleClickHideForm}
				/>
			)}
			{isVisibleTable && (
				<div className="card-table shadow-none mt-20">
					{/* Expansible Table */}
					<TableExpansibleComponent
						columns={[
							{
								fieldName: "check",
								header: "Seleccione",
								renderCell: (row) => {
									return (
										<input
											type="checkbox"
											value={row?.ent_numero_identidad}
											checked={
												selectedCheckbox ==
												row?.ent_numero_identidad
											}
											onChange={handleCheckboxChange}
										/>
									);
								},
							},
							{
								fieldName: "ent_numero_identidad",
								header: "Doc. Identidad",
							},
							{
								fieldName: "fullName",
								header: "Nombre entidad",
								renderCell: (row) => {
									// if (selectedCheckbox == row?.ent_numero_identidad) {
									// 	setGetNombreEntidad(row?.fullName);
									// }
									return row?.fullName || "";
								},
							},
							{
								fieldName: "ent_pais",
								header: "País",
								renderCell: (row) => {
									const texto = elementoBuscado(
										"PAISES",
										row?.ent_pais
									);
									// if (selectedCheckbox == row?.ent_numero_identidad) {
									// 	setGetPais(texto?.lge_elemento_descripcion || "");
									// }
									return (
										texto?.lge_elemento_descripcion || ""
									);
								},
							},
							{
								fieldName: "ent_departamento",
								header: "Departamento",
								renderCell: (row) => {
									const texto = elementoBuscado(
										"DEPARTAMENTOS",
										row?.ent_departamento
									);
									// if (selectedCheckbox == row?.ent_numero_identidad) {
									// 	setGetDepartamento(texto?.lge_elemento_descripcion || "");
									// }
									return (
										texto?.lge_elemento_descripcion || ""
									);
								},
							},
							{
								fieldName: "ent_municipio",
								header: "Municipio",
								renderCell: (row) => {
									const texto = elementoBuscado(
										"MUNICIPIOS",
										row?.ent_municipio
									);
									// if (selectedCheckbox == row?.ent_numero_identidad) {
									// 	setGetMunicipio(texto?.lge_elemento_descripcion || "");
									// }
									return (
										texto?.lge_elemento_descripcion || ""
									);
								},
							},
							{
								fieldName: "ent_direccion",
								header: "Dirección",
							},
							{
								fieldName: "ent_abreviatura",
								header: "Abreviatura",
							},
							{
								fieldName: "ent_tipo_entidad",
								header: "Tipo entidad",
								renderCell: (row) => {
									const texto = tipoEntidad(
										"TIPOS_ENTIDAD",
										row?.ent_tipo_entidad
									);
									return (
										texto?.lge_elemento_descripcion || ""
									);
								},
							},
						]}
						data={findSenderData}
						actions={EntitySearchActions}
					/>

					<div className="flex container-docs-received justify-content--end px-20 py-20 gap-20">
						<ButtonComponent
							className={`${
								isDisableSendButton
									? styles["btn-blackborder"] +
									  " text--black hover-three py-12 px-22"
									: "button-main hover-three py-12 px-16 font-size-16"
							} `}
							value="Aceptar"
							type="button"
							action={onclickSenderIdValue}
							disabled={isDisableSendButton}
						/>
						<ButtonComponent
							className="button-main hover-three py-12 px-16 font-size-16"
							value="Crear Entidad"
							type="button"
							action={() => setVisibleCreateForm(true)}
							disabled={false}
						/>
					</div>
				</div>
			)}
			{visibleCreateForm && (
				<CreateEntityForm
					visible={visibleCreateForm}
					onHideCreateForm={handleHideEntityForm}
					geographicData={geographicData}
					chargingNewData={chargingNewData}
				/>
			)}

			{visibleEditForm && (
				<EditEntityForm
					visible={visibleEditForm}
					onHideEditForm={handleHideEntityForm}
					geographicData={geographicData}
					editData={editData}
					refreshTable={refreshTable}
				/>
			)}
		</>
	);
};

export default SenderData;
