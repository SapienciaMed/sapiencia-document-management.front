import React, { useContext, useEffect, useState } from "react";
import {
	ButtonComponent,
	FormComponent,
	InputComponentOriginal,
	SelectComponent,
} from "../../../../common/components/Form";
import { Dialog } from "primereact/dialog";
import styles from "./document-received.module.scss";
import { InputSwitch } from "primereact/inputswitch";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { EDirection } from "../../../../common/constants/input.enum";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { IDropdownProps } from "../../../../common/interfaces/select.interface";
import { AppContext } from "../../../../common/contexts/app.context";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import { classNames } from "primereact/utils";
import { InputTextNumberComponent } from "../input-text-number";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import { ApiResponse } from "../../../../common/utils/api-response";

const AddRecipientCopyForm = ({
	visible,
	onHideCreateForm,
	geographicData,
	chargingNewData,
}) => {
	const [data, setData] = useState<any>([])
	const [selectedCheckboxs, setSelectedCheckboxs] = useState<any>([])
	const { setMessage } = useContext(AppContext);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);
	
	const schemaFindSender = yup.object({
		ent_tipo_documento: yup.string().required("El campo es obligatorio"),
		ent_numero_identidad: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.optional(),
		ent_nombres: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres")
			.optional(),
	});

	const {
		register,
		control,
		watch,
		setValue,
		formState: { errors, isValid },
	} = useForm<any>({
		resolver: yupResolver(schemaFindSender),
		mode: "all",
	});

	const search = async () => {
		const endpoint: string = `/entities/search`;

		let params = '';

		if (watch("ent_tipo_entidad")) {
			params += `&ent_tipo_documento=${watch("ent_tipo_entidad")}` 
		}

		if (watch("ent_numero_identidad")) {
			params += `&ent_numero_identidad=${watch("ent_numero_identidad")}` 
		}

		if (watch("ent_nombres")) {
			params += `&ent_nombres=${watch("ent_nombres")}` 
		}

		const response = await get(`${endpoint}?${params}`);
		setData(response.data)
	}


	const handleCheckboxChange = (e) => {
		const entIndex = data.findIndex((d) => d.ent_numero_identidad === e.target.value);
	  
		if (e.target.checked) {
		  setSelectedCheckboxs((prevSelectedCheckboxs) => [...prevSelectedCheckboxs, data[entIndex]]);
		} else {
		  setSelectedCheckboxs((prevSelectedCheckboxs) =>
			prevSelectedCheckboxs.filter((s) => s.ent_numero_identidad !== e.target.value)
		  );
		}
	  };
	  
	return (
		<>
			<Dialog
				header="Parámetros Destinatario"
				visible={visible}
				style={{ width: "80vw" }}
				onHide={() => onHideCreateForm(true)}
				pt={{
					headerTitle: { className: "text-title-modal text--black" },
					closeButtonIcon: {
						className: "color--primary close-button-modal",
					},
				}}
			>
				<div className="card-table shadow-none mt-8">
					<FormComponent action={undefined}>
						<div className="grid-form-4-container">
							<InputComponentOriginal
								idInput="ent_numero_identidad"
								typeInput="text"
								className="input-basic background-textArea"
								register={register}
								label="Documento"
								classNameLabel="text-black big"
								direction={EDirection.column}
								errors={errors}
							/>

							<InputComponentOriginal
								idInput="ent_nombres"
								typeInput="text"
								className="input-basic background-textArea"
								register={register}
								label="Nombre"
								classNameLabel="text-black big"
								direction={EDirection.column}
								errors={errors}
							/>

							<Controller
								name="ent_tipo_entidad"
								control={control}
								render={({ field }) => (
									<SelectComponent
										idInput="ent_tipo_entidad"
										className="select-basic select-placeholder"
										control={control}
										errors={errors}
										label="Tipo Entidad"
										classNameLabel="text--black text-required"
										direction={EDirection.column}
										placeholder="Seleccionar"
										data={[
											{
												name: "Usuario",
												value: "CC",
											},
											{
												name: "Entidad",
												value: "NIT",
											},
										]}
									/>
								)}
							/>
							<div className={`flex container-docs-received ${styles["flex-center"]}  px-20 py-20 gap-20`}>
								<ButtonComponent
									className={`${styles["btn-nobackground"]} hover-three py-12 px-22`}
									value="Cancelar"
									type="button"
									action={() => {
										onHideCreateForm(true)
										setSelectedCheckboxs([])
										setValue('ent_numero_identidad', '');
										setValue('ent_nombres', '');
										setValue('ent_tipo_entidad', '');
									}}
									disabled={false}
								/>
								<ButtonComponent
									className="button-main hover-three py-12 px-16 font-size-16"
									value="Buscar"
									type="button"
									action={() => search()}
									disabled={watch("ent_tipo_entidad") == "" || watch("ent_tipo_entidad") == undefined}
								/>
							</div>
						</div>
					</FormComponent>
				</div>
				

				<div style={{padding: '20px 40px' }}>
					<div className="card-table">
						<TableExpansibleComponent
							actions={undefined}
							columns={[
								{
									fieldName: "check",
									header: "Seleccione",
									renderCell: (row) => (
										<input
											type="checkbox"
											value={
												row?.ent_numero_identidad
											}
											checked={
												selectedCheckboxs.find((s) => s.ent_numero_identidad == row?.ent_numero_identidad)
											}
											onChange={handleCheckboxChange}
										/>
									),
								},
								{
									fieldName: "ent_numero_identidad",
									header: "Documento",
								},
								{
									fieldName: "Nombres y apellidos ",
									header: "Nombres y apellidos",
									renderCell: (row) => (
										<>
											{row.ent_tipo_documento == "CC" ? (<>{row.ent_nombres}{" "}{row.ent_apellidos}{" "}</>) : null}
											{row.ent_tipo_documento == "NIT" ? (<>{row.ent_razon_social}{" "}</>) : null}											
										</>
									),
								},
							]}
							data={data}
						/>
					</div>
				</div>

				<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
					<ButtonComponent
						className={`${styles["btn-nobackground"]} hover-three py-12 px-22`}
						value="Cancelar"
						type="button"
						action={() => {
							onHideCreateForm(true)
							setSelectedCheckboxs([])
							setValue('ent_numero_identidad', '');
							setValue('ent_nombres', '');
							setValue('ent_tipo_entidad', '');
						}}
						disabled={false}
					/>

					<ButtonComponent
						className="button-main hover-three py-12 px-16 font-size-16"
						value="Guardar"
						type="button"
						action={() => {
							chargingNewData(selectedCheckboxs)
							onHideCreateForm(true)
							setSelectedCheckboxs([])
							setValue('ent_numero_identidad', '');
							setValue('ent_nombres', '');
							setValue('ent_tipo_entidad', '');
						}}
						disabled={selectedCheckboxs.length <= 0}
					/>
				</div>
			</Dialog>
		</>
	);
};

export default AddRecipientCopyForm;
function setFindSenderData(arg0: ApiResponse<unknown>) {
	throw new Error("Function not implemented.");
}

