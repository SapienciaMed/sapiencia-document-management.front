import React, { useContext, useEffect, useState } from "react";
import {
	ButtonComponent,
	FormComponent,
	SelectComponent,
} from "../../../../common/components/Form";
import { Dialog } from "primereact/dialog";
import styles from "./document-received.module.scss";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EDirection } from "../../../../common/constants/input.enum";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { AppContext } from "../../../../common/contexts/app.context";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import { classNames } from "primereact/utils";
import { InputTextNumberComponent } from "../input-text-number";

const CreateEntityForm = ({
	visible,
	onHideCreateForm,
	geographicData,
	chargingNewData,
}) => {
	const [isSaveDisabled, setIsSaveDisabled] = useState(true);
	const [getPais, setGetPais] = useState<IDropdownProps[]>([]);
	const [getDepartamentos, setGetDepartamentos] = useState<IDropdownProps[]>(
		[]
	);
	const [getMunicipios, setGetMunicipios] = useState<IDropdownProps[]>([]);
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);

	useEffect(() => {
		setGetPais(pais());
		setGetDepartamentos(departamentos());
	}, []);

	const schemaFindSender = yup.object({
		ent_tipo_documento: yup.string().required("El campo es obligatorio"),
		ent_numero_identidad: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		ent_nombres: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres")
			.required("El campo es obligatorio"),
		ent_apellidos: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres")
			.required("El campo es obligatorio"),
		ent_razon_social: yup
			.string()
			.max(100, "Solo se permiten 100 caracteres")
			.optional(),
		ent_tipo_entidad: yup.string().required("El campo es obligatorio"),
		ent_abreviatura: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.optional(),
		ent_direccion: yup
			.string()
			.max(200, "Solo se permiten 200 caracteres")
			.required("El campo es obligatorio"),
		ent_email: yup
			.string()
			.email("Ingrese un email válido")
			.max(50, "Solo se permiten 50 caracteres")
			.required("El campo es obligatorio"),
		ent_contacto_uno: yup
			.string()
			.max(15, "Solo se permiten 15 dígitos")
			.optional(),
		ent_contacto_dos: yup
			.string()
			.max(15, "Solo se permiten 15 dígitos")
			.optional(),
		ent_observaciones: yup
			.string()
			.max(100, "Solo se permiten 100 caracteres")
			.optional(),
		ent_pais: yup.string().required("El campo es obligatorio"),
		ent_departamento: yup.string().required("El campo es obligatorio"),
		ent_municipio: yup.string().required("El campo es obligatorio"),
		ent_estado: yup.boolean().optional(),
	});

	const {
		register: registerCreate,
		control: controlCreate,
		getValues: getValuesCreate,
		setValue: setValueCreate,
		reset: resetCreate,
		watch: watchCreate,
		handleSubmit: handleSubmitCreate,
		formState: { errors: errorsCreate, isValid: isValidCreate },
	} = useForm<ISenderCreateForm>({
		resolver: yupResolver(schemaFindSender),
		mode: "onChange",
	});

	useEffect(() => {
		setValueCreate("ent_estado", true);
	}, []);

	useEffect(() => {
		setGetMunicipios(municipios());
	}, [watchCreate("ent_departamento")]);

	useEffect(() => {
		setGetDepartamentos(departamentos());
	}, [watchCreate("ent_pais")]);

	const pais = () => {
		const filterPais = geographicData.filter((item) => {
			return item.lge_agrupador == "PAISES";
		});

		return filterPais.map((item) => {
			return {
				name: item.lge_elemento_descripcion,
				value: item.lge_elemento_codigo,
			};
		});
	};

	const departamentos = () => {
		const filterDepartamentos = geographicData.filter((item) => {
			return item.lge_agrupador == "DEPARTAMENTOS";
		});

		return getValuesCreate("ent_pais") === "COL"
			? filterDepartamentos.map((item) => {
					return {
						name: item.lge_elemento_descripcion,
						value: item.lge_elemento_codigo,
					};
			  })
			: [
					{
						name: "N/A",
						value: "N/A",
					},
			  ];
	};

	const municipios = () => {
		const filterMunicipios = geographicData.filter((item) => {
			return (
				item.lge_agrupador == "MUNICIPIOS" &&
				item.lge_campos_adicionales.departmentId ==
					getValuesCreate("ent_departamento")
			);
		});
		return getValuesCreate("ent_pais") === "COL"
			? filterMunicipios.map((item) => {
					return {
						name: item.lge_elemento_descripcion,
						value: item.lge_elemento_codigo,
					};
			  })
			: [
					{
						name: "N/A",
						value: "N/A",
					},
			  ];
	};

	const onBlurData = () => {
		const idNumber = getValuesCreate("ent_numero_identidad");

		if (idNumber && idNumber.length <= 15) {
			checkIdInDB(idNumber).then(async ({ data, message }: any) => {
				if (data !== null) {
					setIsSaveDisabled(true);
					setMessage({
						title: "Entidad Existente",
						description:
							"Ya existe una entidad con este documento, por favor verifique",
						show: true,
						background: true,
						okTitle: "Aceptar",
						style: "z-index-1200",
						onOk: () => {
							setMessage({});
						},
					});
				} else {
					setIsSaveDisabled(false);
				}
			});
		}
	};

	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/entities/${idNumber}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	useEffect(() => {
		checkIdentityType();
	}, [watchCreate("ent_tipo_documento")]);

	const checkIdentityType = () => {
		if (watchCreate("ent_tipo_documento") == "NIT") {
			setValueCreate("ent_razon_social", "");
			setValueCreate("ent_nombres", "N/A");
			setValueCreate("ent_apellidos", "N/A");
		} else {
			setValueCreate("ent_nombres", " ");
			setValueCreate("ent_apellidos", " ");
			setValueCreate("ent_razon_social", "N/A");
		}
	};

	const getFormErrorMessage = (name) => {
		return errorsCreate[name] ? (
			<small className="p-error">{errorsCreate[name].message}</small>
		) : (
			<small className="p-error">&nbsp;</small>
		);
	};

	const storeEntity = async (data) => {
		const endpoint: string = `/entities`;
		const entityData = await post(`${endpoint}`, data);
		return entityData;
	};

	const onSubmit = async (data) => {
		storeEntity(data).then(async ({ data, message }: any) => {
			if (data !== null) {
				setMessage({
					title: "Entidad creada",
					description: message.success,
					show: true,
					background: true,
					okTitle: "Aceptar",
					style: "z-index-1200",
					onOk: () => {
						chargingNewData(data);
						setMessage({});
						onHideCreateForm(false);
					},
				});
			}
		});
	};

	return (
		<>
			<Dialog
				header="Crear Entidad"
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => onHideCreateForm(true)}
			>
				<div className="card-table shadow-none mt-8">
					<FormComponent action={handleSubmitCreate(onSubmit)}>
						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} mb-20`}
						>
							<Controller
								name="ent_tipo_documento"
								control={controlCreate}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_tipo_documento"
										className="select-basic select-placeholder"
										control={controlCreate}
										errors={errorsCreate}
										label="Tipo"
										classNameLabel="text--black text-required"
										direction={EDirection.column}
										placeholder="Seleccionar"
										data={[
											{
												name: "Cédula de ciudadanía",
												value: "CC",
											},
											{
												name: "Cédula de extranjería",
												value: "CE",
											},
											{
												name: "Tarjeta de identidad",
												value: "TI",
											},
											{ name: "NIT", value: "NIT" },
											{
												name: "Anónimo",
												value: "AN",
											},
										]}
									/>
								)}
							/>

							<InputTextComponent
								idInput="ent_numero_identidad"
								label="N.° documento"
								className="input-basic"
								classNameLabel="text--black text-required"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
								onBlur={onBlurData}
							/>
							{watchCreate("ent_tipo_documento") !== "NIT" && (
								<>
									<InputTextComponent
										idInput="ent_nombres"
										label="Nombres"
										className="input-basic"
										classNameLabel="text--black text-required"
										control={controlCreate}
										errors={errorsCreate}
										disabled={false}
									/>

									<InputTextComponent
										idInput="ent_apellidos"
										label="Apellidos"
										className="input-basic"
										classNameLabel="text--black text-required"
										control={controlCreate}
										errors={errorsCreate}
										disabled={false}
									/>
								</>
							)}
							{watchCreate("ent_tipo_documento") == "NIT" && (
								<InputTextComponent
									idInput="ent_razon_social"
									label="Razon Social"
									className="input-basic"
									classNameLabel="text--black text-required"
									control={controlCreate}
									errors={errorsCreate}
									disabled={false}
								/>
							)}
						</div>

						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} mb-20`}
						>
							<Controller
								name="ent_tipo_entidad"
								control={controlCreate}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_tipo_entidad"
										className="select-basic select-placeholder"
										control={controlCreate}
										errors={errorsCreate}
										label="Tipo Entidad"
										classNameLabel="text--black text-required"
										direction={EDirection.column}
										placeholder="Seleccionar"
										data={[
											{
												name: "Comunidad",
												value: "1",
											},
											{
												name: "Sapiencia",
												value: "2",
											},
										]}
									/>
								)}
							/>
							<InputTextComponent
								idInput="ent_abreviatura"
								label="Descripción Abreviada"
								className="input-basic"
								classNameLabel="text--black"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
							/>
							<InputTextComponent
								idInput="ent_direccion"
								label="Dirección"
								className="input-basic"
								classNameLabel="text--black text-required"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
							/>
							<InputTextComponent
								idInput="ent_email"
								label="Email"
								className="input-basic"
								classNameLabel="text--black text-required"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
							/>
						</div>
						<div
							className={`${styles["document-container"]} ${styles["document-container--col3-1-1-2"]} mb-20`}
						>
							<InputTextNumberComponent
								idInput="ent_contacto_uno"
								label="Contacto 1"
								className="input-basic"
								classNameLabel="text--black"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
								type={"number"}
							/>

							<InputTextNumberComponent
								idInput="ent_contacto_dos"
								label="Contacto 2"
								className="input-basic"
								classNameLabel="text--black"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
								type={"number"}
							/>
							<div className={`${styles["grid"]}`}>
								<InputTextComponent
									idInput="ent_observaciones"
									label="Observaciones"
									className="input-basic"
									classNameLabel="text--black"
									control={controlCreate}
									errors={errorsCreate}
									disabled={false}
								/>
								<div className="font-size-14 text-right">
									<span>Máx. 100 caracteres</span>
								</div>
							</div>
						</div>
						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} mb-20`}
						>
							<Controller
								name="ent_pais"
								control={controlCreate}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_pais"
										className="select-basic select-placeholder"
										control={controlCreate}
										errors={errorsCreate}
										label="País"
										classNameLabel="text--black text-required"
										direction={EDirection.column}
										placeholder="Seleccionar"
										data={getPais || []}
									/>
								)}
							/>
							<Controller
								name="ent_departamento"
								control={controlCreate}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_departamento"
										className="select-basic select-placeholder"
										control={controlCreate}
										errors={errorsCreate}
										label="Departamento"
										classNameLabel="text--black text-required"
										direction={EDirection.column}
										placeholder="Seleccionar"
										data={getDepartamentos || []}
									/>
								)}
							/>
							<Controller
								name="ent_municipio"
								control={controlCreate}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_municipio"
										className="select-basic select-placeholder"
										control={controlCreate}
										errors={errorsCreate}
										label="Municipio"
										classNameLabel="text--black text-required"
										direction={EDirection.column}
										placeholder="Seleccionar"
										data={getMunicipios || []}
									/>
								)}
							/>
						</div>
						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} mb-20`}
						>
							<div className={`flex ${styles["flex-center"]}`}>
								<div className="mr-24 text-main text--black">
									Estado
								</div>
								<div className="mr-8 text-main text--black">
									Inactivo
								</div>
								<Controller
									name="ent_estado"
									control={controlCreate}
									rules={{ required: "Accept is required." }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													"p-error":
														errorsCreate.ent_estado,
												})}
											></label>
											<InputSwitch
												inputId={field.name}
												checked={field.value}
												inputRef={field.ref}
												className={classNames({
													"p-invalid":
														fieldState.error,
												})}
												onChange={(e) =>
													field.onChange(e.value)
												}
											/>
											{getFormErrorMessage(field.name)}
										</>
									)}
								/>
								<div className="ml-8 text-main text--black">
									Activo
								</div>
							</div>
						</div>
						<div
							className={`flex container-docs-received ${styles["flex-center"]}  px-20 py-20 gap-20`}
						>
							<ButtonComponent
								className={`${styles["btn-nobackground"]} hover-three py-12 px-22`}
								value="Cancelar"
								type="button"
								action={() => onHideCreateForm(true)}
								disabled={false}
							/>
							<ButtonComponent
								className="button-main hover-three py-12 px-16 font-size-16"
								value="Guardar"
								type="submit"
								disabled={
									isSaveDisabled == false &&
									isValidCreate == true
										? false
										: true
								}
							/>
						</div>
					</FormComponent>
				</div>
			</Dialog>
		</>
	);
};

export default CreateEntityForm;
