import React, { useContext } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { AppContext } from "../../../../common/contexts/app.context";
import { IoSearchOutline } from "react-icons/io5";
import { InputTextIconComponent } from "../input-text-icon.component";

const SenderData = () => {
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

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
		formState: { errors },
	} = useForm<ISenderDataForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const onBlurData = () => {
		const idNumber = getValues("enviado_por");

		if (idNumber) {
			checkIdInDB(idNumber).then(async ({ data, message }: any) => {
				console.log(message);
				if (data !== null) {
					setValue(
						"nombres_apellidos",
						data.usr_nombre + " " + data.usr_apellidos
					);
					setValue("pais", data.usr_pais);
					setValue("departamento", data.usr_departamento);
					setValue("municipio", data.usr_municipio);
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
				}
			});
		}
	};

	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/sender-information/${idNumber}`;
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
							max={12}
						/>
					</div>

					<Controller
						name="nombres_apellidos"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="nombres_apellidos"
								idInput="nombres_apellidos"
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
						name="pais"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="pais"
								idInput="pais"
								value={`${field.value || ""}`}
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
								value={`${field.value || ""}`}
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
								value={`${field.value || ""}`}
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
	);
};

export default SenderData;
