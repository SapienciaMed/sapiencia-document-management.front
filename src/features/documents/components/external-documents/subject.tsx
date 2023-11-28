import React, { Children, useEffect, useState } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
	SelectComponent,
} from "../../../../common/components/Form";
import { Controller, useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { TextAreaComponent } from "../../../../common/components/Form/input-text-area.component";
import RelatedAnswers from "./related-answers";
import useCrudService from "../../../../common/hooks/crud-service.hook";

interface IProps {
	onChange: (data: any) => void;
	data: any;
}

const Subject = ({ data, onChange }: IProps) => {
	const MAX_LENGTH_TEXT = 1000;
	const [isVisibleRelatedAnswersModal, setIsVisibleRelatedAnswersModal] =
		useState<boolean>(false);
	const [textoLength, setTextoLength] = useState(0);
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);
	const schema = yup.object({
		referencia: yup.string().max(1000).required("El campo es obligatorio"),
		tipo_asunto: yup.string().required("El campo es obligatorio"),
	});
	const {
		register,
		control,
		getValues: getValuesSubjectForm,
		formState: { errors },
	} = useForm<ISubjectForm>({
		resolver: yupResolver(schema),
		defaultValues: { ...data },
		mode: "all",
	});
	console.log("valuesFOrm", getValuesSubjectForm("tipo_asunto"));
	useEffect(() => {
		const data = async () =>
			await get(`/generic-list/type-radicado-list`).then((data) => {
				setRadicadoTypes(data);
			});
		data();
	}, []);

	const radicadoTypesData = radicadoTypes.filter((item) => {
		return item.lge_agrupador == "TIPOS_RADICADOS";
	});

	const radicadoTypesList = async () => {
		return await radicadoTypesData.map((item) => {
			return {
				name: item.lge_elemento_descripcion,
				value: item.lge_elemento_codigo,
			};
		});
	};

	const nameTypeRadicado = (code: string | number): string => {
		const data = radicadoTypesData.find((item) => {
			return item.lge_elemento_codigo == code;
		});

		return data?.lge_elemento_descripcion;
	};

	return (
		<>
			<FormComponent action={null}>
				<div
					className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
				>
					<Controller
						name="tipo_asunto"
						control={control}
						render={({ field }) => {
							if (field.value !== data.tipo_asunto) {
								onChange({
									...data,
									tipo_asunto: field.value || null,
								});
								data.tipo_asunto = field.value;
							}

							return (
								<SelectComponent
									idInput="tipo_asunto"
									className="select-basic"
									control={control}
									errors={errors}
									label="Opciones de respuesta"
									classNameLabel="text--black"
									placeholder="Seleccionar"
									data={[
										{
											name: "Requiere respuesta",
											value: "1",
										},
										{
											name: "Es una Respuesta",
											value: "2",
										},
										{ name: "Ambas", value: "3" },
										{
											name: "Ninguna de las anteriores",
											value: "4",
										},
									]}
								/>
							);
						}}
					/>
					<div className={`${styles["button-wrapper"]}`}>
						<div className={`${styles["button-item"]}`}></div>
						<button
							style={{
								backgroundColor:
									getValuesSubjectForm("tipo_asunto") == "2"
										? "#533893"
										: "#E2E2E2",
								borderRadius: "30px",
								border: "none",
								height: "55px",
								fontSize: "1rem",
								fontFamily: '"RubikRegular"',
								width: "100%",
								cursor:
									getValuesSubjectForm("tipo_asunto") === "2"
										? "pointer"
										: "default",
								color:
									getValuesSubjectForm("tipo_asunto") === "2"
										? "#fff"
										: "#000",
								// Otros estilos según sea necesario
							}}
							onClick={(e) => {
								e.preventDefault();
								setIsVisibleRelatedAnswersModal(true);
							}}
							disabled={
								getValuesSubjectForm("tipo_asunto") !== "2"
							}
						>
							Respuestas Relacionadas
						</button>
					</div>
				</div>
				<div className={`${styles["grid"]} ${styles["mb-10"]}`}>
					<div className={`${styles["input-wrapper"]}`}>
						<Controller
							name="referencia"
							control={control}
							render={({ field }) => (
								<TextAreaComponent
									id="referencia"
									idInput="referencia"
									label="Referencia"
									className={`${styles["input-textarea"]} ${styles["input"]} ${styles["referencia"]}`}
									classNameLabel="text--black text-required"
									register={register}
									errors={errors}
									disabled={false}
									rows={5}
									placeholder="Escribe aquí"
									onChange={(e) => {
										field.onChange(e);
										setTextoLength(e.target.value.length);
										onChange({
											...data,
											referencia: field.value || null,
										});
									}}
								/>
							)}
						/>
						<span
							className={`${styles["input-icon"]} ${styles["referencia"]}`}
						>
							Max 1000 caracteres
						</span>
					</div>
				</div>
			</FormComponent>

			<RelatedAnswers
				visible={isVisibleRelatedAnswersModal}
				onCloseModal={() => setIsVisibleRelatedAnswersModal(false)}
				idRadicado={data?.dra_radicado}
				idTypeRadicado={"Recibido"}
			/>
		</>
	);
};

export default Subject;
