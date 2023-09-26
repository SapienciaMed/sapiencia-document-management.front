import React, { useContext, useEffect, useState } from "react";
import {
	FormComponent,
	InputComponent,
	SelectComponent,
} from "../../../../common/components/Form";
import styles from "./document-received.module.scss";
import { EDirection } from "../../../../common/constants/input.enum";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { HiOutlineSearch } from "react-icons/hi";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import { IoWarningOutline } from "react-icons/io5";
import { AppContext } from "../../../../common/contexts/app.context";
import { InputTextIconComponent } from "../input-text-icon.component";

const BasicDocumentInformation = () => {
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);
	const COLORS = ["", "#FFCC00", "#00CC00", "#CC0000"];

	const schema = yup.object({
		codigo_asunto: yup
			.string()
			.required("El campo es obligatorio")
			.min(10, "Solo permiten mínimo 10 dígitos")
			.max(10, "Solo permiten 10 dígitos"),
		nombre_asunto: yup.string().required(),
		tiempo_respuesta: yup.string().required(),
		unidad: yup.string().required(),
		tipo: yup.string().required("El campo es obligatorio"),
		prioridad: yup.string().required("El campo es obligatorio"),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		watch,
		reset,
		formState: { errors },
	} = useForm<IBasicDocumentInformationForm>({
		resolver: yupResolver(schema),
		mode: "onChange",
	});

	const onBlurData = () => {
		const idAsunto = getValues("codigo_asunto");

		if (idAsunto) {
			checkIdInDB(idAsunto).then(async ({ data, message }: any) => {
				if (data) {
					setValue("nombre_asunto", data.inf_nombre_asunto);
					setValue("tiempo_respuesta", data.inf_timepo_respuesta);
					setValue("unidad", data.inf_unidad);
				} else {
					setMessage({
						title: "Información básica del documento",
						description: message.error,
						show: true,
						background: true,
						okTitle: "Aceptar",
						onOk: () => {
							setMessage({});
						},
					});
					reset();
				}
			});
		}
	};

	const checkIdInDB = async (idAsunto: string) => {
		const endpoint: string = `/basic-document/${idAsunto}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	return (
		<FormComponent action={undefined}>
			<div
				className={`${styles["document-container"]} ${styles["document-container--col4"]}`}
			>
				<div>
					<InputTextIconComponent
						idInput="codigo_asunto"
						control={control}
						label="Código asunto"
						className="input-basic"
						classNameLabel="text--black text-required"
						errors={errors}
						disabled={false}
						onBlur={onBlurData}
						max={12}
						type="number"
					/>
				</div>

				<Controller
					name="nombre_asunto"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="nombre_asunto"
							idInput="nombre_asunto"
							value={`${field.value || ""}`}
							label="Nombre asunto"
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
					name="tiempo_respuesta"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="tiempo_respuesta"
							idInput="tiempo_respuesta"
							value={`${field.value || ""}`}
							label="Tiempo de respuesta"
							className="input-basic"
							classNameLabel="text--black "
							typeInput={"text"}
							register={register}
							onChange={null}
							errors={errors}
							disabled={true}
						/>
					)}
				/>

				<Controller
					name="unidad"
					control={control}
					render={({ field }) => (
						<InputComponent
							id="unidad"
							idInput="unidad"
							value={`${field.value || ""}`}
							label="Unidad"
							className="input-basic"
							classNameLabel="text--black "
							typeInput={"text"}
							register={register}
							onChange={null}
							errors={errors}
							disabled={true}
						/>
					)}
				/>

				<Controller
					name="tipo"
					control={control}
					render={({ field }) => (
						<SelectComponent
							idInput="tipo"
							className="select-basic select-placeholder"
							control={control}
							errors={errors}
							label="Tipo"
							classNameLabel="text--black text-required"
							direction={EDirection.column}
							placeholder="Seleccionar"
							data={[
								{ name: "Tipo 1", value: "1" },
								{ name: "Tipo 2", value: "2" },
								{ name: "Tipo 3", value: "3" },
							]}
						/>
					)}
				/>

				<Controller
					name="prioridad"
					control={control}
					render={({ field }) => (
						<SelectComponent
							idInput="prioridad"
							className="select-basic"
							control={control}
							errors={errors}
							label="Prioridad"
							classNameLabel="text--black text-required"
							direction={EDirection.column}
							placeholder="Seleccionar"
							data={[
								{ name: "Baja", value: "1" },
								{ name: "Normal", value: "2" },
								{ name: "Alta", value: "3" },
							]}
						/>
					)}
				/>
				<div className={`${styles["button-wrapper"]}`}>
					<div className={`${styles["button-item"]}`}></div>
					<IoWarningOutline
						color={COLORS[watch("prioridad")]}
						size={60}
					/>
				</div>
			</div>
		</FormComponent>
	);
};

export default BasicDocumentInformation;
