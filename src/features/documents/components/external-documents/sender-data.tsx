import React, { useContext, useEffect, useState } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
	InputComponentOriginal,
} from "../../../../common/components/Form";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { AppContext } from "../../../../common/contexts/app.context";
import { InputTextIconComponent } from "../input-text-icon.component";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import { EDirection } from "../../../../common/constants/input.enum";

interface IProps {
	onChange: (data: any) => void;
	data: any;
}

const RecipientData = ({ data, onChange }: IProps) => {
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const apiUrlAuth: string = process.env.urlApiAuth;
	const { get: getApiAuth } = useCrudService(apiUrlAuth);
	const { get } = useCrudService(baseURL);
	const [addressees, setAddressees] = useState<any>([]);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [showSearch, setShowSearch] = useState<boolean>(false);
	const [geographicData, setGeographicData] = useState<any>([]);
	const [getPais, setGetPais] = useState("");
	const [getDepartamento, setGetDepartamento] = useState("");
	const [getMunicipio, setGetMunicipio] = useState("");
	const [dependencies, setDependencies] = useState([]);
	const [charges, setCharges] = useState([]);

	const schema = yup.object({
		dirigido_a: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		nombres_apellidos_destinatario: yup.string(),
		pais_destinatario: yup.string(),
		departamento_destinatario: yup.string(),
		municipio_destinatario: yup.string(),
		search_codigo_usuario: yup.number().transform((value) => Number.isNaN(value) ? null : value ).nullable().max(999999999999999, 'Solo se permiten 15 dígitos'),
		search_nombre_usuario: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres"),
		search_apellido_usuario: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres"),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm<IRecipientDataForm>({
		resolver: yupResolver(schema),
		defaultValues: { ...data },
		mode: "all",
	});

	useEffect(() => {
		get(`/generic-list/geographic-list`).then((g) => {
			setGeographicData(g);
		});

	}, []);

	useEffect(() => {
		if (data && data?.enviado_por && geographicData.length > 0 ) {
			setValue('dirigido_a', data?.dirigido_a)
			onBlurData()
		}
	}, [geographicData])


	const elementoBuscado = (agrupador: string, codigo: string | number) =>
		geographicData.find((item) => {
			return (
				item.lge_agrupador == agrupador &&
				item.lge_elemento_codigo == codigo
			);
		});

	const setSelectedAddressee = (idNumber: string) => {
		if (idNumber && idNumber.length <= 15) {
			checkIdInDB(idNumber).then(async ({ data: payload, message }: any) => {

				if (payload.length > 0) {
					console.log('payload', payload[0])
					const departamentoData = elementoBuscado(
						"DEPARTAMENTOS",
						payload[0]?.USR_CODIGO_DEPARTAMENTO
					);
					
					const paisData = elementoBuscado("PAISES", departamentoData?.lge_campos_adicionales?.countryId);
	
					const municipioData = elementoBuscado(
						"MUNICIPIOS",
						payload[0]?.USR_CODIGO_MUNICIPIO
					);
	
	
					if (payload[0] !== null) {
						setValue("dirigido_a", idNumber);
						setValue(
							"nombres_apellidos_destinatario",
							payload[0]?.USR_NOMBRES + " " + payload[0]?.USR_APELLIDOS
						);
						setGetPais(paisData?.lge_elemento_descripcion || "");
						setGetDepartamento(
							departamentoData?.lge_elemento_descripcion || ""
						);
						setGetMunicipio(
							municipioData?.lge_elemento_descripcion || ""
						);
	
						onChange({
							...data,
							dirigido_a: idNumber,
							nombres_apellidos_destinatario:
								payload[0]?.USR_NOMBRES + " " + payload[0]?.USR_APELLIDOS,
							pais_destinatario:
								paisData?.lge_elemento_descripcion || "",
							departamento_destinatario:
								departamentoData?.lge_elemento_descripcion || "",
							municipio_destinatario:
								municipioData?.lge_elemento_descripcion || "",
						});
				}

				} else {
					setMessage({
						title: "Datos del destinatario",
						description: 'Entidad no encontrada',
						show: true,
						background: true,
						okTitle: "Aceptar",
						onOk: () => {
							setMessage({});
						},
					});
					reset({
						nombres_apellidos_destinatario: "",
						pais_destinatario: "",
						departamento_destinatario: "",
						municipio_destinatario: "",
					});
				}
			});
		}
	};

	const search = async () => {
		const endpoint: string = `/recipient-information/search?nombre=${
			data?.search_nombre_usuario ? `${data?.search_nombre_usuario}` : ""
		}
		&id=${data?.search_codigo_usuario ? `${data?.search_codigo_usuario}` : ""}
		&apellido=${
			data?.search_apellido_usuario
				? `${data?.search_apellido_usuario}`
				: ""
		}`;
		const response: any = await get(`${endpoint}`);
		setAddressees(response?.data);

		if (response?.data?.length <= 0) {
			setMessage({
				title: "Error",
				description: "El destinatario no existe",
				show: true,
				background: true,
				okTitle: "Cerrar",
				onOk: () => {
					setMessage({});
				},
			});
		}
	};

	const handleCheckboxChange = (event) => {
		setSelectedCheckbox(event.target.value);
	};

	const onBlurData = () => {
		const idNumber = getValues("dirigido_a");
		setSelectedAddressee(idNumber);
	};

	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/recipient-information/${idNumber}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	return (
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
							min={15}
							type={"number"}
							handleOnSearch={() => {
								setShowSearch(!showSearch);
								onChange({
									...data,
									search_codigo_usuario: null,
									search_nombre_usuario: "",
									search_apellido_usuario: "",
								});
							}}
						/>
					</div>

					<Controller
						name="nombres_apellidos_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="nombres_apellidos_destinatario"
								idInput="nombres_apellidos_destinatario"
								value={`${field.value || ""}`}
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
						name="pais_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="pais_destinatario"
								idInput="pais_destinatario"
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
						name="departamento_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="departamento_destinatario"
								idInput="departamento_destinatario"
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
						name="municipio_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="municipio_destinatario"
								idInput="municipio_destinatario"
								value={`${getMunicipio || field.value || ""}`}
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

			{showSearch ? (
				<>
					<div
						className="spc-common-table expansible card-table"
						style={{ marginTop: 40, marginBottom: 40 }}
					>
						<h2
							className="biggest bold"
							style={{
								fontSize: 24,
								fontFamily: "Rubik",
								color: "black",
								fontWeight: 500,
							}}
						>
							Parámetros remitente
						</h2>
						<FormComponent action={undefined}>
							<div className="grid-form-1-container">
								<div className="grid-form-4-container">
									<InputComponentOriginal
										idInput="search_codigo_usuario"
										typeInput="number"
										className="input-basic background-textArea"
										register={register}
										label="Usuario"
										classNameLabel="text-black big"
										direction={EDirection.column}
										errors={errors}
										onChange={(e) =>
											onChange({
												...data,
												search_codigo_usuario:
													e.target.value,
											})
										}
									/>

									<InputComponentOriginal
										idInput="search_nombre_usuario"
										typeInput="text"
										className="input-basic background-textArea"
										register={register}
										label="Nombres"
										classNameLabel="text-black big"
										direction={EDirection.column}
										errors={errors}
										onChange={(e) =>
											onChange({
												...data,
												search_nombre_usuario:
													e.target.value,
											})
										}
									/>

									<InputComponentOriginal
										idInput="search_apellido_usuario"
										typeInput="text"
										className="input-basic background-textArea"
										register={register}
										label="Apellidos"
										classNameLabel="text-black big"
										direction={EDirection.column}
										errors={errors}
										onChange={(e) =>
											onChange({
												...data,
												search_apellido_usuario:
													e.target.value,
											})
										}
									/>
								</div>
							</div>
							<div>
								<div
									style={{
										justifyContent: "flex-end",
										display: "flex",
										marginTop: 12,
									}}
								>
									<button
										style={{
											marginRight: 12,
											marginTop: 12,
										}}
										className="cancel-button"
										onClick={(e) => {
											e.preventDefault();
											setAddressees([]);
											setSelectedCheckbox("");
											setShowSearch(false);
											onChange({
												...data,
												search_codigo_usuario: null,
												search_nombre_usuario: "",
												search_apellido_usuario: "",
											});
											setAddressees([]);
											setShowSearch(false);
											setValue(
												"search_codigo_usuario",
												null
											);
											setValue(
												"search_nombre_usuario",
												""
											);
											setValue(
												"search_apellido_usuario",
												""
											);
											onChange({ ...data });
										}}
									>
										Cancelar
									</button>
									<button
										style={{ marginTop: 12 }}
										className={`search-button ${
											(!data?.search_nombre_usuario &&
												!data?.search_codigo_usuario &&
												!data?.search_apellido_usuario) ||
											(errors.search_codigo_usuario ||
											errors.search_nombre_usuario ||
											errors.search_apellido_usuario
												? true
												: false)
												? "search-button-disabled"
												: "cursor-pointer search-button-active"
										}`}
										onClick={(e) => {
											e.preventDefault();
											search();
										}}
										disabled={
											(!data?.search_nombre_usuario &&
												!data?.search_codigo_usuario &&
												!data?.search_apellido_usuario) ||
											(errors.search_codigo_usuario ||
											errors.search_nombre_usuario ||
											errors.search_apellido_usuario
												? true
												: false)
										}
									>
										Buscar
									</button>
								</div>
							</div>
						</FormComponent>
					</div>
					{addressees?.length > 0 ? (
						<div className="card-table">
							<TableExpansibleComponent
								actions={undefined}
								columns={[
									{
										fieldName: "check",
										header: "Seleccione",
										renderCell: (row) => (
											<input
												type="checkbox"
												value={
													row?.USR_NUMERO_DOCUMENTO
												}
												checked={
													selectedCheckbox ==
													row?.USR_NUMERO_DOCUMENTO
												}
												onChange={handleCheckboxChange}
											/>
										),
									},
									{
										fieldName: "USR_NUMERO_DOCUMENTO",
										header: "Usuario",
									},
									{
										fieldName: "inf_nombre_usuario",
										header: "Nombres y apellidos",
										renderCell: (row) => (
											<>
												{row.USR_NOMBRES}{" "}
												{row.USR_APELLIDOS}{" "}
											</>
										),
									},
								]}
								data={addressees}
							/>
							<div
								style={{
									justifyContent: "flex-end",
									display: "flex",
									marginTop: 12,
								}}
							>
								<button
									style={{ marginRight: 12, marginTop: 12 }}
									className="cancel-button"
									onClick={(e) => {
										e.preventDefault();
										setAddressees([]);
										setSelectedCheckbox("");
										setShowSearch(false);
										onChange({
											...data,
											search_codigo_usuario: null,
											search_nombre_usuario: "",
											search_apellido_usuario: "",
										});
										setValue("search_codigo_usuario", null);
										setValue("search_nombre_usuario", "");
										setValue("search_apellido_usuario", "");
									}}
								>
									Cancelar
								</button>
								<button
									style={{ marginTop: 12 }}
									className={`search-button ${
										selectedCheckbox == ""
											? "search-button-disabled"
											: "cursor-pointer search-button-active"
									}`}
									onClick={(e) => {
										e.preventDefault();
										setSelectedAddressee(selectedCheckbox);
										setAddressees([]);
										setShowSearch(false);
										setValue(
											"dirigido_a",
											selectedCheckbox
										);
										onChange({
											...data,
											search_codigo_usuario: null,
											search_nombre_usuario: "",
											search_apellido_usuario: "",
										});
										setValue("search_codigo_usuario", null);
										setValue("search_nombre_usuario", "");
										setValue("search_apellido_usuario", "");
										setSelectedCheckbox("");
									}}
									disabled={selectedCheckbox == ""}
								>
									Aceptar
								</button>
							</div>
						</div>
					) : null}
				</>
			) : null}
		</FormComponent>
	);
};

export default RecipientData;
