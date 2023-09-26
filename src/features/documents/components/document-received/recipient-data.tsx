import React, { useContext } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { AppContext } from "../../../../common/contexts/app.context";
import { InputTextIconComponent } from "../input-text-icon.component";

const RecipientData = () => {
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const schema = yup.object({
		dirigido_a: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		nombres_apellidos_destinatario: yup.string(),
		pais_destinatario: yup.string(),
		departamento_destinatario: yup.string(),
		municipio_destinatario: yup.string(),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		reset,
		formState: { errors },
	} = useForm<IRecipientDataForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const getPais = (pais: number) => {
		const paises = [
			{
				codigo: 57,
				descripcion: "Colombia",
			},
			{
				codigo: 1,
				descripcion: "Estados Unidos",
			},
			{
				codigo: 2,
				descripcion: "Alemania",
			},
		];

		const paisEncontrado = paises.find(
			(descripcion) => descripcion.codigo === pais
		);

		// Si encontramos el país, mostramos su descripción
		if (paisEncontrado) {
			console.log(paisEncontrado);
			setValue("pais_destinatario", paisEncontrado.descripcion);
		}
	};

	const getDepartamento = (departamento: number) => {
		const departamentos = [
			{
				codigo: 13,
				descripcion: "Bolivar",
			},
		];

		const departamentoEncontrado = departamentos.find(
			(descripcion) => descripcion.codigo === departamento
		);

		// Si encontramos el país, mostramos su descripción
		if (departamentoEncontrado) {
			setValue(
				"departamento_destinatario",
				departamentoEncontrado.descripcion
			);
		}
	};

	const getMunicipio = (municipio: number) => {
		const municipios = [
			{
				codigo: 13001,
				descripcion: "Cartagena de Indias",
			},
		];

		const municipioEncontrado = municipios.find(
			(descripcion) => descripcion.codigo === municipio
		);

		// Si encontramos el país, mostramos su descripción
		if (municipioEncontrado) {
			setValue("municipio_destinatario", municipioEncontrado.descripcion);
		}
	};

	const onBlurData = () => {
		const idNumber = getValues("dirigido_a");

		if (idNumber) {
			checkIdInDB(idNumber).then(async ({ data, message }: any) => {
				if (data !== null) {
					setValue(
						"nombres_apellidos_destinatario",
						data.usr_nombre + " " + data.usr_apellidos
					);
					getPais(data.usr_pais);
					//setValue("pais_destinatario", data.usr_pais);
					getDepartamento(data.usr_departamento);
					// setValue(
					// 	"departamento_destinatario",
					// 	data.usr_departamento
					// );
					getMunicipio(data.usr_municipio);
					//setValue("municipio_destinatario", data.usr_municipio);
				} else {
					setMessage({
						title: "Datos del destinatario",
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

	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/recipient-information/${idNumber}`;
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
							idInput="dirigido_a"
							control={control}
							label="Dirigido a"
							className="input-basic"
							classNameLabel="text--black text-required"
							errors={errors}
							disabled={false}
							onBlur={onBlurData}
							min={15}
							type={"number"}
						/>
					</div>

					<Controller
						name="nombres_apellidos_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="nombres_apellidos_destinatario"
								idInput="nombres_apellidos_destinatario"
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
						name="pais_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="pais_destinatario"
								idInput="pais_destinatario"
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
						name="departamento_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="departamento_destinatario"
								idInput="departamento_destinatario"
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
						name="municipio_destinatario"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="municipio_destinatario"
								idInput="municipio_destinatario"
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

export default RecipientData;
