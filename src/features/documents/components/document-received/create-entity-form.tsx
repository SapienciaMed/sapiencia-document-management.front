import React, { useContext, useEffect, useState } from "react";
import {
	ButtonComponent,
	FormComponent,
	InputComponent,
	SelectComponent,
} from "../../../../common/components/Form";
import { Dialog } from "primereact/dialog";
import styles from "./document-received.module.scss";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EDirection } from "../../../../common/constants/input.enum";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { AppContext } from "../../../../common/contexts/app.context";
import useCrudService from "../../../../common/hooks/crud-service.hook";

const CreateEntityForm = ({ visible, onHideCreateForm, geographicData }) => {
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
			.min(3, "El documento debe tener al menos 3 caracteres")
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		ent_nombres: yup
			.string()
			.min(3, "El nombre debe tener al menos 3 caracteres")
			.required("El campo es obligatorio"),
		ent_apellidos: yup
			.string()
			.min(3, "El nombre debe tener al menos 3 caracteres")
			.required("El campo es obligatorio"),
		ent_tipo_entidad: yup.string().required("El campo es obligatorio"),
		ent_descripcion: yup.string().optional(),
		ent_direccion: yup.string().required("El campo es obligatorio"),
		ent_email: yup
			.string()
			.email("Ingrese un email válido")
			.required("El campo es obligatorio"),
		ent_contacto_uno: yup.string().optional(),
		ent_contacto_dos: yup.string().optional(),
		ent_observaciones: yup.string().optional(),
		ent_pais: yup.string().required("El campo es obligatorio"),
		ent_departamento: yup.string().required("El campo es obligatorio"),
		ent_municipio: yup.string().required("El campo es obligatorio"),
		ent_estado: yup.string().optional(),
		ent_abreviatura: yup.string().optional(),
	});

	const {
		register: registerCreate,
		control: controlCreate,
		getValues: getValuesCreate,
		reset: resetCreate,
		watch: watchCreate,

		formState: { errors: errorsCreate, isValid: isValidCreate },
	} = useForm<ISenderCreateForm>({
		resolver: yupResolver(schemaFindSender),
		mode: "onChange",
	});

	useEffect(() => {
		setGetMunicipios(municipios());
	}, [watchCreate("ent_departamento")]);

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

		return filterDepartamentos.map((item) => {
			return {
				name: item.lge_elemento_descripcion,
				value: item.lge_elemento_codigo,
			};
		});
	};

	const municipios = () => {
		const filterMunicipios = geographicData.filter((item) => {
			console.log(item.lge_campos_adicionales.departmentId);
			return (
				item.lge_agrupador == "MUNICIPIOS" &&
				item.lge_campos_adicionales.departmentId ==
					getValuesCreate("ent_departamento")
			);
		});
		return filterMunicipios.map((item) => {
			return {
				name: item.lge_elemento_descripcion,
				value: item.lge_elemento_codigo,
			};
		});
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

	console.log(
		!isValidCreate,
		"isValidCreate",
		isSaveDisabled,
		"isSaveDisabled"
	);
	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/entities/${idNumber}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	return (
		<>
			<Dialog
				header="Crear Entidad"
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => onHideCreateForm()}
			>
				<div className="card-table shadow-none mt-8">
					<FormComponent action={null}>
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
												name: "Cedula de ciudadania",
												value: "CC",
											},
											{
												name: "Cedula de extranjeria",
												value: "CE",
											},
											{
												name: "Tarjeta de identidad",
												value: "TI",
											},
											{ name: "NIT", value: "NIT" },
											{
												name: "Anonimo",
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
												name: "Persona Natural",
												value: "1",
											},
											{
												name: "Persona Jurídica",
												value: "2",
											},
										]}
									/>
								)}
							/>
							<InputTextComponent
								idInput="ent_descripcion"
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
							className={`${styles["document-container"]} ${styles["document-container--col3"]} mb-20`}
						>
							<InputTextComponent
								idInput="ent_contacto_uno"
								label="Contacto 1"
								className="input-basic"
								classNameLabel="text--black"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
							/>

							<InputTextComponent
								idInput="ent_contacto_dos"
								label="Contacto 2"
								className="input-basic"
								classNameLabel="text--black"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
							/>

							<InputTextComponent
								idInput="ent_observaciones"
								label="Observaciones"
								className="input-basic"
								classNameLabel="text--black"
								control={controlCreate}
								errors={errorsCreate}
								disabled={false}
							/>
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
							className={`flex container-docs-received ${styles["flex-center"]}  px-20 py-20 gap-20`}
						>
							<ButtonComponent
								className={`${styles["btn-nobackground"]} hover-three py-12 px-22`}
								value="Cancelar"
								type="button"
								action={() => onHideCreateForm()}
								disabled={false}
							/>
							<ButtonComponent
								className="button-main hover-three py-12 px-16 font-size-16"
								value="Guardar"
								type="button"
								action={null}
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
