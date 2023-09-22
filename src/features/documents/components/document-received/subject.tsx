import React, { Children, useState } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
	SelectComponent,
} from "../../../../common/components/Form";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const Subject = () => {
	const MAX_LENGTH_TEXT = 2000;
	const [textoLength, setTextoLength] = useState(0);
	const schema = yup.object({
		referencia: yup
			.string()
			.max(2000)
			.required("Campo Referencia requerido"),
		tipo: yup.string().required("Campo Tipo requerido"),
	});
	const {
		register,
		control,
		formState: { errors },
	} = useForm<ISubjectForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	return (
		<>
			<FormComponent action={null}>
				<div
					className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
				>
					<div className={`${styles["input-wrapper"]}`}>
						<Controller
							name="referencia"
							control={control}
							render={({ field }) => (
								<InputComponent
									id="referencia"
									idInput="referencia"
									label="Referencia"
									className={`${styles["input"]} ${styles["referencia"]} input-basic`}
									classNameLabel="text-black bold text-required"
									typeInput={"text"}
									register={register}
									onChange={(e) => {
										field.onChange(e); // Importante para que react-hook-form registre el cambio.
										setTextoLength(e.target.value.length);
									}}
									errors={errors}
									disabled={false}
								/>
							)}
						/>
						<span
							className={`${styles["input-icon"]} ${styles["referencia"]}`}
						>
							{MAX_LENGTH_TEXT - textoLength}
						</span>
					</div>
					<Controller
						name="tipo"
						control={control}
						render={({ field }) => (
							<SelectComponent
								idInput="tipo"
								className="select-basic"
								control={control}
								errors={errors}
								label="Opciones de respuesta"
								classNameLabel="text-black bold text-required"
								// direction={EDirection.column}
								placeholder="Seleccionar"
								data={[
									{ name: "Requiere respuesta", value: "1" },
									{ name: "Es una Respuesta", value: "2" },
									{ name: "Ambas", value: "3" },
									{
										name: "Ninguna de las anteriores",
										value: "4",
									},
								]}
							/>
						)}
					/>
					<div className={`${styles["button-wrapper"]}`}>
						<div className={`${styles["button-item"]}`}></div>
						<button
							className={`${styles["btn"]} ${styles["btn--gray"]}`}
						>
							Respuestas Relacionadas
						</button>
					</div>
				</div>
			</FormComponent>
		</>
	);
};

export default Subject;
