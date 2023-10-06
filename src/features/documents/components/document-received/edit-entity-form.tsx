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

type IProps = {
	visible: boolean;
	onHideEditForm: (data: boolean) => void;
	geographicData: any;
	editData?: any;
};
const EditEntityForm = ({
	visible,
	onHideEditForm,
	geographicData,
	editData,
}: IProps) => {
	const [getPais, setGetPais] = useState<IDropdownProps[]>([]);
	const [getDepartamentos, setGetDepartamentos] = useState<IDropdownProps[]>(
		[]
	);
	const [getMunicipios, setGetMunicipios] = useState<IDropdownProps[]>([]);
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, put } = useCrudService(baseURL);

	const schemaFindSender = yup.object({
		ent_tipo_documento: yup.string().required("El campo es obligatorio"),
		ent_numero_identidad: yup
			.string()
			.min(3, "El documento debe tener al menos 3 caracteres")
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
			.required("El campo es obligatorio"),
		ent_tipo_entidad: yup.string().required("El campo es obligatorio"),
		ent_abreviatura: yup
			.string()
			.notRequired()
			.max(15, "Solo se permiten 15 caracteres")
			.nullable(),
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
			.notRequired()
			.max(15, "Solo se permiten 15 dígitos")
			.nullable(),
		ent_contacto_dos: yup
			.string()
			.max(15, "Solo se permiten 15 dígitos")
			.nullable(),
		ent_observaciones: yup
			.string()
			.notRequired()
			.max(100, "Solo se permiten 100 caracteres")
			.nullable(),
		ent_pais: yup.string().required("El campo es obligatorio"),
		ent_departamento: yup.string().required("El campo es obligatorio"),
		ent_municipio: yup.string().required("El campo es obligatorio"),
		ent_estado: yup.boolean().optional(),
	});

	const {
		register: registerEdit,
		control: controlEdit,
		getValues: getValuesEdit,
		setValue: setValueEdit,
		reset: resetEdit,
		watch: watchEdit,
		handleSubmit: handleSubmitEdit,
		formState: { errors: errorsEdit, isValid: isValidEdit },
	} = useForm<ISenderCreateForm>({
		resolver: yupResolver(schemaFindSender),
		defaultValues: editData,
		mode: "onChange",
	});

	useEffect(() => {
		setGetPais(pais());
		setGetDepartamentos(departamentos());
	}, []);

	useEffect(() => {
		setValueEdit("ent_estado", Boolean(editData.ent_estado));
	}, []);

	useEffect(() => {
		setGetMunicipios(municipios());
	}, [watchEdit("ent_departamento")]);

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
				value: parseInt(item.lge_elemento_codigo),
			};
		});
	};

	const municipios = () => {
		const filterMunicipios = geographicData.filter((item) => {
			return (
				item.lge_agrupador == "MUNICIPIOS" &&
				item.lge_campos_adicionales.departmentId ==
					getValuesEdit("ent_departamento")
			);
		});
		return filterMunicipios.map((item) => {
			return {
				name: item.lge_elemento_descripcion,
				value: parseInt(item.lge_elemento_codigo),
			};
		});
	};

	useEffect(() => {
		checkIdentityType();
	}, [watchEdit("ent_tipo_documento")]);

	const checkIdentityType = () => {
		if (watchEdit("ent_tipo_documento") == "NIT") {
			setValueEdit("ent_nombres", "N/A");
			setValueEdit("ent_apellidos", "N/A");
		} else {
			setValueEdit("ent_razon_social", "N/A");
		}
	};

	const getFormErrorMessage = (name) => {
		return errorsEdit[name] ? (
			<small className="p-error">{errorsEdit[name].message}</small>
		) : (
			<small className="p-error">&nbsp;</small>
		);
	};

	const editEntity = async (data) => {
		const endpoint: string = `/entities/${data.ent_codigo}`;
		const entityData = await put(`${endpoint}`, data);
		return entityData;
	};

	const onSubmitEdit = async (data) => {
		delete data.fullName;
		delete data.created_at;
		delete data.updated_at;

		editEntity(data).then(async ({ data, message }: any) => {
			if (data !== null) {
				setMessage({
					title: "Entidad actualizada",
					description: message.success,
					show: true,
					background: true,
					okTitle: "Aceptar",
					style: "z-index-1200",
					onOk: () => {
						setMessage({});
						onHideEditForm(false);
					},
				});
			}
		});
	};

	return (
		<>
			<Dialog
				header="Editar Entidad"
				visible={visible}
				style={{ width: "50vw" }}
				onHide={() => onHideEditForm(true)}
			>
				<div className="card-table shadow-none mt-8">
					<FormComponent action={handleSubmitEdit(onSubmitEdit)}>
						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} mb-20`}
						>
							<Controller
								name="ent_tipo_documento"
								control={controlEdit}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_tipo_documento"
										className="select-basic select-placeholder"
										control={controlEdit}
										errors={errorsEdit}
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
								control={controlEdit}
								errors={errorsEdit}
								disabled={false}
							/>
							{watchEdit("ent_tipo_documento") !== "NIT" && (
								<>
									<InputTextComponent
										idInput="ent_nombres"
										label="Nombres"
										className="input-basic"
										classNameLabel="text--black text-required"
										control={controlEdit}
										errors={errorsEdit}
										disabled={false}
									/>

									<InputTextComponent
										idInput="ent_apellidos"
										label="Apellidos"
										className="input-basic"
										classNameLabel="text--black text-required"
										control={controlEdit}
										errors={errorsEdit}
										disabled={false}
									/>
								</>
							)}
							{watchEdit("ent_tipo_documento") == "NIT" && (
								<InputTextComponent
									idInput="ent_razon_social"
									label="Razon Social"
									className="input-basic"
									classNameLabel="text--black text-required"
									control={controlEdit}
									errors={errorsEdit}
									disabled={false}
								/>
							)}
						</div>

						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} mb-20`}
						>
							<Controller
								name="ent_tipo_entidad"
								control={controlEdit}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_tipo_entidad"
										className="select-basic select-placeholder"
										control={controlEdit}
										errors={errorsEdit}
										label="Tipo Entidad"
										classNameLabel="text--black text-required"
										direction={EDirection.column}
										placeholder="Seleccionar"
										data={[
											{
												name: "Comunidad",
												value: 1,
											},
											{
												name: "Sapiencia",
												value: 2,
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
								control={controlEdit}
								errors={errorsEdit}
								disabled={false}
							/>
							<InputTextComponent
								idInput="ent_direccion"
								label="Dirección"
								className="input-basic"
								classNameLabel="text--black text-required"
								control={controlEdit}
								errors={errorsEdit}
								disabled={false}
							/>
							<InputTextComponent
								idInput="ent_email"
								label="Email"
								className="input-basic"
								classNameLabel="text--black text-required"
								control={controlEdit}
								errors={errorsEdit}
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
								control={controlEdit}
								errors={errorsEdit}
								disabled={false}
								type={"number"}
							/>

							<InputTextNumberComponent
								idInput="ent_contacto_dos"
								label="Contacto 2"
								className="input-basic"
								classNameLabel="text--black"
								control={controlEdit}
								errors={errorsEdit}
								disabled={false}
								type={"number"}
							/>
							<div className={`${styles["grid"]}`}>
								<InputTextComponent
									idInput="ent_observaciones"
									label="Observaciones"
									className="input-basic"
									classNameLabel="text--black"
									control={controlEdit}
									errors={errorsEdit}
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
								control={controlEdit}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_pais"
										className="select-basic select-placeholder"
										control={controlEdit}
										errors={errorsEdit}
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
								control={controlEdit}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_departamento"
										className="select-basic select-placeholder"
										control={controlEdit}
										errors={errorsEdit}
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
								control={controlEdit}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_municipio"
										className="select-basic select-placeholder"
										control={controlEdit}
										errors={errorsEdit}
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
									control={controlEdit}
									rules={{ required: "Accept is required." }}
									render={({ field, fieldState }) => (
										<>
											<label
												htmlFor={field.name}
												className={classNames({
													"p-error":
														errorsEdit.ent_estado,
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
								action={() => onHideEditForm(true)}
								disabled={false}
							/>
							<ButtonComponent
								className="button-main hover-three py-12 px-16 font-size-16"
								value="Guardar"
								type="submit"
								disabled={!isValidEdit}
							/>
						</div>
					</FormComponent>
				</div>
			</Dialog>
		</>
	);
};

export default EditEntityForm;
