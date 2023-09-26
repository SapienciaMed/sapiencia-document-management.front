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
import { InputNumberComponent } from "../../../../common/components/Form/input-number.component";
import { InputTextNumberComponent } from "../input-text-number";


interface IProps {
	onChange: (data: any) => void,
	data: any
}

const RadicadoDetails = ({ data, onChange }: IProps) => {
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
			.min(12, "Escribir mínimo 12 dígitos")
			.max(12, "Solo se permiten 12 dígitos")
			.optional(),
		fecha_origen: yup.string().optional(),
		radicado_por: yup.string().required(),
		nombres_apellidos: yup.string().required("El campo es obligatorio"),
	});

	const schema2 = yup.object({
		radicado: yup.string().required("Ingresar el número de radicado"),
		fecha_radicado: yup.string().required(),
		radicado_origen: yup
			.string()
			.min(12, "Escribir mínimo 12 dígitos")
			.max(12, "Solo se permiten 12 dígitos")
			.required('El campo es obligatorio'),
		fecha_origen: yup.string().optional(),
		radicado_por: yup.string().required(),
		nombres_apellidos: yup.string().required("El campo es obligatorio"),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<IRadicadoDetailsForm>({
		resolver: yupResolver(data.tipo == 2 ? schema2 : schema),
		defaultValues: { ...data },
		mode: "all",
	});

	const onBlurData = () => {
		const radicadoOrigen = getValues("radicado_origen");
		onChange({ ...data, radicado_origen: Number(radicadoOrigen) == 0 ? null : Number(radicadoOrigen) })
		if (radicadoOrigen) {
			checkRadicadoOrigenInDB(radicadoOrigen).then(
				async ({ data, message }: any) => {
					if (data) {
						setValue("fecha_origen", data.dra_fecha_radicado);
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
						setValue("fecha_origen", "");
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

	console.log(data)
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
				
				<div>
					<InputTextNumberComponent
						idInput="radicado_origen"
						control={control}
						label="Radicado Origen"
						className="input-basic"
						classNameLabel={`text--black ${data.tipo == 2 ? 'text-required' : ''}`}
						errors={errors}
						disabled={false}
						onBlur={onBlurData}
						max={12}
						type={"number"}
					/>
					{ data.tipo == 2 && data.radicado_origen == null  ? (
						<span className="error-message not-margin-padding">El campo es obligatorio</span>
					): null }
					
				</div>

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
