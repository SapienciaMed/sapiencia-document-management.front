import React, { useContext } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useCurrentDateTime from "../current-date-time";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import { AppContext } from "../../../../common/contexts/app.context";

const RadicadoDetails = () => {
	const { setMessage } = useContext(AppContext);
	const { authorization } = useContext(AppContext);

	const currentDateTime: string = useCurrentDateTime();
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const schema = yup.object({
		radicado: yup.string().required("Ingresar el número de radicado"),
		fecha_radicado: yup.string().required(),
		radicado_origen: yup
			.string()
			.max(12, "Máximo 12 caracteres")
			.optional(),
		fecha_origen: yup.string().optional(),
		radicado_por: yup.string().required(),
		nombres_apellidos: yup
			.string()
			.required("Ingresar el nombre y apellidos completos"),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<IRadicadoDetailsForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const onBlurData = () => {
		const radicadoOrigen = getValues("radicado_origen");
		if (radicadoOrigen) {
			checkRadicadoOrigenInDB(radicadoOrigen).then(
				async ({ data, message }: any) => {
					if (data) {
						setValue("fecha_origen", data.dra_fecha_origen);
					} else {
						setMessage({
							title: "Datos del radicado origen",
							description: message.error,
							show: true,
							background: true,
							okTitle: "Aceptar",
							onOk: () => {
								setMessage({});
							},
						});
					}
				}
			);
		}
	};

	const checkRadicadoOrigenInDB = async (radicado: string) => {
		const endpoint: string = `/radicado-details/${radicado}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	return (
		<FormComponent action={undefined}>
			<div
				className={`${styles["document-container"]} ${styles["document-container--col4"]}`}
			>
				<InputComponent
					id="radicado"
					idInput="radicado"
					label="Radicado"
					className="input-basic"
					classNameLabel="text--black"
					typeInput={"number"}
					register={register}
					onChange={null}
					errors={errors}
					disabled={true}
				/>

				<InputComponent
					id="fecha_radicado"
					idInput="fecha_radicado"
					label="Fecha Radicado"
					className="input-basic"
					classNameLabel="text--black"
					value={currentDateTime}
					typeInput={"string"}
					register={register}
					errors={errors}
					disabled={true}
				/>

				<InputTextComponent
					idInput="radicado_origen"
					control={control}
					label="Radicado Origen"
					className="input-basic"
					classNameLabel="text--black"
					errors={errors}
					disabled={false}
					onBlur={onBlurData}
					max={12}
				/>

				<Controller
					name="fecha_origen"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="fecha_origen"
							idInput="fecha_origen"
							label="Fecha Origen"
							value={`${field.value || ""}`}
							className="input-basic"
							classNameLabel="text--black"
							typeInput="string"
							register={register}
							onChange={null}
							errors={errors}
							disabled={true}
						/>
					)}
				/>

				<InputComponent
					id="radicado_por"
					idInput="radicado_por"
					label="Radicado por"
					value={authorization.user.numberDocument}
					className="input-basic"
					classNameLabel="text--black"
					typeInput={"number"}
					register={register}
					onChange={null}
					errors={errors}
					disabled={true}
				/>

				<Controller
					name="nombres_apellidos"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="nombres_apellidos"
							idInput="nombres_apellidos"
							label="Nombres y Apellidos"
							value={`${
								authorization.user.names +
								" " +
								authorization.user.lastNames
							}`}
							className="input-basic"
							classNameLabel="text--black"
							typeInput={"text"}
							register={register}
							onChange={null}
							errors={errors}
							disabled={false}
						/>
					)}
				/>
			</div>
		</FormComponent>
	);
};

export default RadicadoDetails;
