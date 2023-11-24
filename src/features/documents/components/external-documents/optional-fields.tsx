import React, { useEffect } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../../common/components/Form/input-text-area.component";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputTextNumberComponent } from "../input-text-number";

interface IProps {
	onChange: (data: any) => void,
	data: any
}

const OptionalFields = ({ data: allData, onChange }: IProps) => {
	const schema = yup.object({
		observaciones: yup.string().max(2000).optional(),
		numero_anexos: yup
			.string()
			.max(3, "Solo se permiten 3 dígitos")
			.optional(),
		numero_folios: yup
			.string()
			.max(3, "Solo se permiten 3 dígitos")
			.optional(),
		numero_cajas: yup
			.string()
			.max(3, "Solo se permiten 3 dígitos")
			.optional(),
	});

	const {
		register,
		control,
		formState: { errors },
		setValue
	} = useForm<IOptionalFieldsForm>({
		resolver: yupResolver(schema),
		mode: "all",
		defaultValues: { ...allData },
	});


	useEffect(() => {
		if (allData && allData.numero_anexos) {
			setValue('numero_anexos',  allData?.numero_anexos)
			setValue('numero_cajas',  allData?.numero_cajas)
			setValue('numero_folios',  allData?.numero_folios)
			setValue('observaciones',  allData?.observaciones)
		}
	}, [])


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
								classNameLabel="text--black"
								register={register}
								errors={errors}
								disabled={false}
								rows={5}
								placeholder="Escribe aquí"
							/>
						)}
					/>
					<div className="text-right">
						<span>Máx. 2000 caracteres</span>
					</div>
				</div>

				<div
					className={`text-center ${styles["document-container"]} ${styles["document-container--col4-small"]} ${styles["mb-10"]}`}
				>
					<InputTextNumberComponent
						idInput="numero_anexos"
						label="Número de anexos"
						className={`input-basic ${styles["input-small"]}`}
						classNameLabel="text--black"
						max={999}
						min={1}
						control={control}
						errors={errors}
						disabled={false}
						type={"number"}
					/>
					<InputTextNumberComponent
						idInput="numero_folios"
						label="Número de folios"
						className={`input-basic ${styles["input-small"]}`}
						classNameLabel="text--black text-center"
						control={control}
						errors={errors}
						disabled={false}
						max={999}
						min={1}
						type={"number"}
					/>
					<InputTextNumberComponent
						idInput="numero_cajas"
						label="Número de cajas"
						className={`input-basic ${styles["input-small"]}`}
						classNameLabel="text--black text-center"
						errors={errors}
						control={control}
						disabled={false}
						max={999}
						min={1}
						type={"number"}
					/>
				</div>
			</FormComponent>
		</>
	);
};

export default OptionalFields;
