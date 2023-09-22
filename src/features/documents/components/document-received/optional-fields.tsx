import React from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../../common/components/Form/input-text-area.component";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const OptionalFields = () => {
	const schema = yup.object({
		observaciones: yup.string().max(2000).optional(),
		numero_anexos: yup
			.number()
			.positive("Debe ser un numero positivo")
			.integer("Debe ser un numero entero")
			.optional(),
		numero_folios: yup
			.number()
			.positive("Debe ser un numero positivo")
			.integer("Debe ser un numero entero")
			.optional(),
		numero_cajas: yup
			.number()
			.positive("Debe ser un numero positivo")
			.integer("Debe ser un numero entero")
			.optional(),
	});
	const {
		register,
		control,
		formState: { errors },
	} = useForm<IOptionalFieldsForm>({
		resolver: yupResolver(schema),
		mode: "onBlur",
	});
	return (
		<>
			<FormComponent action={null}>
				<div className={`${styles["grid"]} ${styles["mb-10"]}`}>
					<Controller
						name="observaciones"
						control={control}
						render={({ field }) => (
							<TextAreaComponent
								id="observaciones"
								idInput="observaciones"
								label="Observaciones"
								className={`${styles["input-textarea"]}`}
								classNameLabel="text-black bold"
								register={register}
								errors={errors}
								disabled={false}
								rows={5}
							/>
						)}
					/>
					<div className="text-right">
						<span>Max 2000 caracteres</span>
					</div>
				</div>

				<div
					className={`text-center ${styles["document-container"]} ${styles["document-container--col4-small"]} ${styles["mb-10"]}`}
				>
					<InputComponent
						id="numero_anexos"
						idInput="numero_anexos"
						label="Número de anexos"
						className={`input-basic ${styles["input-small"]}`}
						classNameLabel="text-black bold"
						typeInput={"number"}
						register={register}
						errors={errors}
						disabled={false}
					/>
					<InputComponent
						id="numero_folios"
						idInput="numero_folios"
						label="Número de folios"
						className={`input-basic ${styles["input-small"]}`}
						classNameLabel="text-black bold text-center"
						typeInput={"number"}
						register={register}
						errors={errors}
						disabled={false}
					/>
					<InputComponent
						id="numero_cajas"
						idInput="numero_cajas"
						label="Número de cajas"
						className={`input-basic ${styles["input-small"]}`}
						classNameLabel="text-black bold text-center"
						typeInput={"number"}
						register={register}
						errors={errors}
						disabled={false}
					/>
				</div>
			</FormComponent>
		</>
	);
};

export default OptionalFields;
