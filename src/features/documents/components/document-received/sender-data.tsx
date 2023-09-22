import React from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import { HiOutlineSearch } from "react-icons/hi";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";

const SenderData = () => {
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);

	const schema = yup.object({
		enviado_por: yup
			.string()
			.max(12, "Máximo 12 caracteres")
			.required("Campo requerido"),
		nombres_apellidos: yup.string().required(),
		pais: yup.string().required(),
		departamento: yup.string().required(),
		municipio: yup.string().required(),
	});

	const {
		register,
		control,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<ISenderDataForm>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const onBlurData = () => {
		const idNumber = getValues("enviado_por");
		console.log("idNumber", idNumber);

		if (idNumber) {
			checkIdInDB(idNumber).then(async ({ data, message }: any) => {
				console.log("data", message);
				if (data !== null) {
					console.log("data x", message);
					setValue(
						"nombres_apellidos",
						data.usr_nombre + " " + data.usr_apellidos
					);
					setValue("pais", data.usr_pais);
					setValue("departamento", data.usr_departamento);
					setValue("municipio", data.usr_municipio);
				} else {
					console.log(message.error);
				}
			});
		}
	};

	const checkIdInDB = async (idNumber: string) => {
		const endpoint: string = `/sender-information/${idNumber}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	return (
		<FormComponent action={null}>
			<div className="card-table">
				<div
					className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
				>
					<div className={styles["search-input"]}>
						<div className={styles["search-input-enviado"]}>
							<InputTextComponent
								idInput="enviado_por"
								control={control}
								label="Enviado por"
								className="input-basic"
								classNameLabel="text-black bold text-required"
								errors={errors}
								disabled={false}
								onBlur={onBlurData}
								max={12}
							/>
						</div>
						<div className={styles["icon-search"]}>
							<HiOutlineSearch />
						</div>
					</div>
					<Controller
						name="nombres_apellidos"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="nombres_apellidos"
								idInput="nombres_apellidos"
								value={`${field.value || ""}`}
								label="Nombres y apellidos"
								className="input-basic"
								classNameLabel="text-black bold"
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
						name="pais"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="pais"
								idInput="pais"
								value={`${field.value || ""}`}
								label="Pais"
								className="input-basic"
								classNameLabel="text-black bold"
								typeInput={"text"}
								register={register}
								onChange={null}
								errors={errors}
								disabled={true}
							/>
						)}
					/>

					<Controller
						name="departamento"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="departamento"
								idInput="departamento"
								value={`${field.value || ""}`}
								label="Departamento"
								className="input-basic"
								classNameLabel="text-black bold"
								typeInput={"text"}
								register={register}
								onChange={null}
								errors={errors}
								disabled={true}
							/>
						)}
					/>
					<Controller
						name="municipio"
						control={control}
						render={({ field }) => (
							<InputComponent
								id="municipio"
								idInput="municipio"
								value={`${field.value || ""}`}
								label="Municipio"
								className="input-basic"
								classNameLabel="text-black bold"
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

export default SenderData;
