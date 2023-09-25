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
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { HiOutlineSearch } from "react-icons/hi";
import { AppContext } from "../../../../common/contexts/app.context";

const RecipientData = () => {
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const schema = yup.object({
		dirigido_a: yup
			.string()
			.max(12, "Máximo 12 caracteres")
			.required("Campo requerido"),
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
		formState: { errors },
	} = useForm<IRecipientDataForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const onBlurData = () => {
		const idNumber = getValues("dirigido_a");

		if (idNumber) {
			checkIdInDB(idNumber).then(async ({ data, message }: any) => {
				if (data !== null) {
					setValue(
						"nombres_apellidos_destinatario",
						data.usr_nombre + " " + data.usr_apellidos
					);
					setValue("pais_destinatario", data.usr_pais);
					setValue(
						"departamento_destinatario",
						data.usr_departamento
					);
					setValue("municipio_destinatario", data.usr_municipio);
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
					<div className={styles["search-input"]}>
						<div className={styles["search-input-enviado"]}>
							<InputTextComponent
								idInput="dirigido_a"
								control={control}
								label="Dirigido a"
								className="input-basic"
								classNameLabel="text--black text-required"
								errors={errors}
								disabled={false}
								onBlur={onBlurData}
								min={12}
							/>
						</div>
						<div className={styles["icon-search"]}>
							<HiOutlineSearch />
						</div>
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
								label="Pais"
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
