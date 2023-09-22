import React, { useEffect } from "react";
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

const RadicadoDetails = () => {
	const currentDateTime: string = useCurrentDateTime();
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const schema = yup.object({
		radicado: yup.string(),
		fecha_radicado: yup.string(),
		radicado_origen: yup.string().max(12),
		fecha_origen: yup.string(),
		radicado_por: yup.string(),
		nombres_apellidos: yup.string(),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		trigger,
		formState: { errors },
	} = useForm<IRadicadoDetailsForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const onBlurData = () => {
		const radicadoOrigen = getValues("radicado_origen");
		console.log("radicadoOrigen", radicadoOrigen);
		if (radicadoOrigen) {
			checkRadicadoOrigenInDB(radicadoOrigen).then(
				async ({ data }: any) => {
					if (data) {
						console.log("data", data);
						setValue("fecha_origen", data.dra_fecha_origen);
					} else {
						console.log("No se encontraron datos");
					}
				}
			);
		}
	};

	const checkRadicadoOrigenInDB = async (radicado: string) => {
		const endpoint: string = `/radicado-details/${radicado}`;
		const data = await get(`${endpoint}`);
		return data;
		// try {
		// 	const response = await fetch(
		// 		`https://rickandmortyapi.com/api/character/?name=rick`
		// 	);
		// 	if (response.ok) {
		// 		const data = await response.json();
		// 		return data || { message: "No se encontraron datos" }; // Devuelve los datos si la solicitud fue exitosa.
		// 	}
		// } catch (error) {
		// 	console.error("Error al consultar en la base de datos:", error);
		// 	return null; // Devuelve null en caso de error.
		// }
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
					classNameLabel="text-black bold"
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
					classNameLabel="text-black bold"
					value={currentDateTime}
					typeInput={"string"}
					register={register}
					onChange={null}
					errors={errors}
					disabled={true}
				/>

				<InputTextComponent
					idInput="radicado_origen"
					control={control}
					label="Radicado Origen"
					className="input-basic"
					classNameLabel="text-black bold"
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
							classNameLabel="text-black bold"
							typeInput={"string"}
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
					className="input-basic"
					classNameLabel="text-black bold"
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
							value={`${field.value}`}
							className="input-basic"
							classNameLabel="text-black bold"
							typeInput={"number"}
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
