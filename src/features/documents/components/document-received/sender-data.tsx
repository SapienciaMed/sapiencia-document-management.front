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

const SenderData = () => {
	const [deleteInputs, setDeleteInputs] = useState<boolean>(false);
	const [geographicData, setGeographicData] = useState<any>([]);
	const [getNombreEntidad, setGetNombreEntidad] = useState("");
	const [getPais, setGetPais] = useState("");
	const [getDepartamento, setGetDepartamento] = useState("");
	const [getMunicipio, setGetMunicipio] = useState("");
	const [isDisableSendButton, setIsDisableSendButton] = useState(true);
	const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [isVisibleSearchForm, setIsVisibleSearchForm] =
		useState<boolean>(false);
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);
	const [findSenderData, setFindSenderData] = useState<any>([]);

	const columnSenderTable = [
		{
			fieldName: "check",
			header: "Seleccione",
			renderCell: (row) => {
				return (
					<input
						type="checkbox"
						value={row?.usr_numero_identidad}
						checked={selectedCheckbox == row?.usr_numero_identidad}
						onChange={handleCheckboxChange}
					/>
				);
			},
		},
		{
			fieldName: "usr_numero_identidad",
			header: "Doc. Identidad",
		},
		{
			fieldName: "fullName",
			header: "Nombre entidad",
			renderCell: (row) => {
				if (selectedCheckbox == row?.usr_numero_identidad) {
					setGetNombreEntidad(row?.fullName);
				}
				return row?.fullName || "";
			},
		},
		{
			fieldName: "usr_pais",
			header: "Pais",
			renderCell: (row) => {
				const texto = elementoBuscado("PAISES", row?.usr_pais);
				if (selectedCheckbox == row?.usr_numero_identidad) {
					setGetPais(texto?.lge_elemento_descripcion || "");
				}
				return texto?.lge_elemento_descripcion || "";
			},
		},
		{
			fieldName: "usr_departamento",
			header: "Departamento",
			renderCell: (row) => {
				const texto = elementoBuscado(
					"DEPARTAMENTOS",
					row?.usr_departamento
				);
				if (selectedCheckbox == row?.usr_numero_identidad) {
					setGetDepartamento(texto?.lge_elemento_descripcion || "");
				}
				return texto?.lge_elemento_descripcion || "";
			},
		},
		{
			fieldName: "usr_municipio",
			header: "Municipio",
			renderCell: (row) => {
				const texto = elementoBuscado("MUNICIPIOS", row?.usr_municipio);
				if (selectedCheckbox == row?.usr_numero_identidad) {
					setGetMunicipio(texto?.lge_elemento_descripcion || "");
				}
				return texto?.lge_elemento_descripcion || "";
			},
		},
		{
			fieldName: "usr_direccion",
			header: "Direccion",
		},
		{
			fieldName: "abreviatura",
			header: "Abreviatura",
		},
	];

	useEffect(() => {
		get(`/geographic-list`).then((data) => {
			setGeographicData(data);
		});
	}, []);

	useEffect(() => {
		setGetNombreEntidad("");
		setGetPais("");
		setGetDepartamento("");
		setGetMunicipio("");
		setDeleteInputs(false);
	}, [deleteInputs]);

	const elementoBuscado = (agrupador: string, codigo: string | number) =>
		geographicData.find((item) => {
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
	});

	// Verifica si el array no contiene valores indefinidos
	//const hasUndefinedValues = watchSearchInputs.every((x) => x === undefined);

	const onBlurData = () => {
		const idNumber = getValues("enviado_por");

		if (idNumber && idNumber.length <= 15) {
			checkIdInDB(idNumber).then(async ({ data, message }: any) => {
				const paisData = elementoBuscado("PAISES", data?.usr_pais);
				const departamentoData = elementoBuscado(
					"DEPARTAMENTOS",
					data?.usr_departamento
				);
				const municipioData = elementoBuscado(
					"MUNICIPIOS",
					data?.usr_municipio
				);
				if (data !== null) {
					setValue(
						"nombres_apellidos",
						data?.usr_nombre + " " + data?.usr_apellidos
					);
					setGetPais(paisData?.lge_elemento_descripcion || "");
					setGetDepartamento(
						departamentoData?.lge_elemento_descripcion || ""
					);
					setGetMunicipio(
						municipioData?.lge_elemento_descripcion || ""
					);
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
				}
			});
		}
	};

	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/sender-information/${idNumber}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	const findSenderInformation = async (findData) => {
		const endpoint: string = `/sender-information/find`;
		setFindSenderData(await post(`${endpoint}`, findData));
		setIsVisibleTable(true);
	};

	// const hasData = () => {
	// 	console.log(findSenderData, "findSenderData");
	// 	if (findSenderData.length == 0) {
	// 		setMessage({
	// 			title: "Datos del remitente",
	// 			description: "El remitente no existe",
	// 			show: true,
	// 			background: true,
	// 			okTitle: "Aceptar",
	// 			onOk: () => {
	// 				setMessage({});
	// 			},
	// 		});
	// 	}
	// };

	const handleClickHideForm = () => {
		setIsVisibleSearchForm(!isVisibleSearchForm);
		setIsVisibleTable(false);
	};

	const onclickSenderIdValue = () => {
		setValue("enviado_por", selectedCheckbox);
		setFocus("enviado_por");
		setIsVisibleSearchForm(!isVisibleSearchForm);
		setIsVisibleTable(false);
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
								errors={errors}
								disabled={false}
								onBlur={onBlurData}
								max={12}
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
									value={`${getPais || ""}`}
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
									value={`${getDepartamento || ""}`}
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
									value={`${getMunicipio || ""}`}
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
						actions={undefined}
						columns={columnSenderTable}
						data={findSenderData}
					/>

					<div className="flex container-docs-received justify-content--end px-20 py-20 gap-20">
						<ButtonComponent
							className={`${styles["btn-blackborder"]} hover-three py-12 px-22`}
							value="Aceptar"
							type="button"
							action={onclickSenderIdValue}
							disabled={isDisableSendButton}
						/>
						<ButtonComponent
							className="button-main hover-three py-12 px-16 font-size-16"
							value="Crear Entidad"
							type="button"
							action={null}
							disabled={false}
						/>
					</div>
				</div>
			)}
		</>
	);
};

export default SenderData;
