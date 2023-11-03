import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import {
	ButtonComponent,
	FormComponent,
	InputComponent,
	InputComponentOriginal,
	LabelComponent,
} from "../../../../common/components/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../../common/components/Form/input-text-area.component";
import styles from "./styles.module.scss";
import { AppContext } from "../../../../common/contexts/app.context";
import {
	AutoComplete,
	AutoCompleteCompleteEvent,
} from "primereact/autocomplete";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { ReactSearchAutocomplete } from "react-search-autocomplete";

interface IProps {
	title?: string;
	visible: boolean;
	typeModal?: string;
	dataForModal?: any;
	onCloseModal: () => void;
}

const ActivateReverseDocuments = ({
	onCloseModal,
	visible,
	typeModal,
	title,
	dataForModal,
}: IProps) => {
	const { setMessage } = useContext(AppContext);
	//const [value, setValue] = useState<string>("");
	const [items, setItems] = useState<string[]>([]);
	const [dataModal, setDataModal] = useState<any>({});
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post } = useCrudService(baseURL);

	const schema = yup.object({
		dra_radicado: yup.string().max(15, "Solo se permiten 15 caracteres"),
		dra_tipo_radicado: yup.string(),
		dra_destinatario: yup.string().required("El campo es obligatorio"),
		comentario: yup
			.string()
			.max(200, "Solo se permiten 200 caracteres")
			.required("El campo es obligatorio"),
	});
	console.log(dataForModal, "dataForModal");

	const {
		register: registerActRevDocuments,
		control: controlActRevDocuments,
		setValue: setValueActRevDocuments,
		getValues: getValuesActRevDocuments,
		watch: watchActRevDocuments,
		handleSubmit: handleSubmitActRevDocuments,
		formState: { errors: errorsActRevDocuments },
	} = useForm<IModalActivateReverse>({
		resolver: yupResolver(schema),
		// values: dataForModal,
		mode: "all",
	});

	useEffect(() => {
		if (dataForModal) {
			setValueActRevDocuments("dra_radicado", dataForModal?.dra_radicado);
			setValueActRevDocuments(
				"dra_tipo_radicado",
				dataForModal?.dra_tipo_radicado
			);
			console.log(typeModal, "typeModal");
			// setValueActRevDocuments(
			// 	"dra_destinatario",
			// 	typeModal == "Reversar" ? dataForModal?.dra_destinatario : "14"
			// );
			if (typeModal == "devolucion") {
				setValueActRevDocuments(
					"dra_destinatario",
					dataForModal?.dra_radicado_por
				);
			}
		}
	}, [dataForModal]);

	console.log(
		getValuesActRevDocuments("dra_radicado"),
		"watchActRevDocuments"
	);
	const onClicSave = () => {
		setMessage({
			title: "Consulta de Movimientos",
			description: typeModal + ", guardado exitosamente.",
			show: true,
			background: true,
			okTitle: "Aceptar",
			style: "z-index-2300",
			onOk: () => {
				setMessage({});
				onCloseModal();
			},
		});
	};

	const storeComment = async (data) => {
		console.log(data, "data");
		const endpoint: string = `/radicado/comment`;
		const entityData = await post(`${endpoint}`, data);
		return entityData;
	};

	const onSubmit = async (data) => {
		storeComment(data).then(async ({ data, operation }: any) => {
			console.log(data, "data");
			console.log(operation, "message");
			if (operation.code == "OK") {
				setMessage({
					title: "Consulta de Movimientos",
					description: typeModal + ", guardado exitosamente.",
					show: true,
					background: true,
					okTitle: "Aceptar",
					style: "z-index-2300",
					onOk: () => {
						setMessage({});
						onCloseModal();
					},
				});
			} else {
				setMessage({
					title: "Consulta de Movimientos",
					description: "Ocurrió un error al guardar los datos",
					show: true,
					background: true,
					okTitle: "Aceptar",
					style: "z-index-2300",
					onOk: () => {
						setMessage({});
						onCloseModal();
					},
				});
			}
		});
	};

	const formatResult = (item) => {
		return (
			<>
				<span style={{ display: "block", textAlign: "left" }}>
					id: {item.id}
				</span>
				<span style={{ display: "block", textAlign: "left" }}>
					name: {item.name}
				</span>
			</>
		);
	};

	return (
		<Dialog
			header={title}
			visible={visible}
			style={{ width: "40vw" }}
			onHide={onCloseModal}
			pt={{
				headerTitle: {
					className: "text-title-modal text--black text-center",
				},
				closeButtonIcon: {
					className: "color--primary close-button-modal",
				},
			}}
		>
			<div className="spc-common-table expansible card-table">
				<FormComponent action={handleSubmitActRevDocuments(onSubmit)}>
					<div
						className={`flex gap-14 ${
							typeModal == "devolucion"
								? "flex-center"
								: "flex-justify-between"
						}`}
					>
						<input
							id="dra_destinatario"
							type="hidden"
							{...registerActRevDocuments("dra_destinatario", {
								required: true,
							})}
						/>
						<InputTextComponent
							idInput="dra_radicado"
							label="Documento"
							className="input-basic"
							classNameLabel="text--black"
							control={controlActRevDocuments}
							errors={errorsActRevDocuments}
							disabled={true}
						/>
						<InputTextComponent
							idInput="dra_tipo_radicado"
							label="Tipo"
							className="input-basic"
							classNameLabel="text--black"
							control={controlActRevDocuments}
							errors={errorsActRevDocuments}
							disabled={true}
						/>

						{typeModal !== "devolucion" && (
							// <InputTextComponent
							// 	idInput="dra_destinatario"
							// 	label="Asignar a"
							// 	className="input-basic"
							// 	classNameLabel="text--black text-required"
							// 	control={controlActRevDocuments}
							// 	errors={errorsActRevDocuments}
							// 	disabled={false}
							// />

							<div
								style={{
									width: 200,
									display: "flex",
									flexDirection: "column",
									alignItems: "flex-end",
									gap: "0.5rem",
								}}
							>
								<LabelComponent
									//htmlFor={idInput}
									className="text--black text-required"
									value="Asignar a"
								/>
								<ReactSearchAutocomplete
									items={[
										{
											id: 1047365247,
											name: "Francisco Gaviria",
										},
										{ id: 2, name: "Item 2" },
									]}
									onSelect={(item) => {
										setValueActRevDocuments(
											"dra_destinatario",
											item.id
										);
										console.log(item);
									}}
									autoFocus
									formatResult={formatResult}
									className="input-basic-autocomplete"
									styling={{
										hoverBackgroundColor: "none",
										backgroundColor: "none",
										border: "none",
										boxShadow: "none",
										borderRadius: "none",
									}}
								/>
							</div>
						)}
						{typeModal == "devolucion" && (
							<input
								id="dra_radicado_por"
								type="hidden"
								{...registerActRevDocuments(
									"dra_radicado_por",
									{
										required: true,
									}
								)}
							/>
						)}
						{/* <AutoComplete
						value={value}
						suggestions={items}
						completeMethod={(e) => {}}
						onChange={(e) => setValue(e.value)}
					/> */}
					</div>
					<div className={`flex flex-column mt-28`}>
						<Controller
							name="comentario"
							control={controlActRevDocuments}
							render={({ field }) => (
								<TextAreaComponent
									id="comentario"
									idInput="comentario"
									label="Comentario"
									className={styles.inputTextarea}
									classNameLabel="text--black text-required"
									register={registerActRevDocuments}
									errors={errorsActRevDocuments}
									disabled={false}
									rows={5}
									placeholder="Escribe aquí"
								/>
							)}
						/>
						<div className="text-right">
							<span>Máx. 200 caracteres</span>
						</div>
					</div>
					<div className={`flex gap-20 flex-center`}>
						<ButtonComponent
							className={`${styles.btnNoBackground} py-12 px-16 font-size-16`}
							value="Cancelar"
							type="button"
							action={onCloseModal}
						/>
						<ButtonComponent
							className={`${styles.btnTextBlack} ${styles.btnGray} py-12 px-16 font-size-16`}
							value="Aceptar"
							type="submit"
							//action={onClicSave}
							disabled={false}
						/>
					</div>
				</FormComponent>
			</div>
		</Dialog>
	);
};

export default ActivateReverseDocuments;