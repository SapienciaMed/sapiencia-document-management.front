import { Dialog } from "primereact/dialog";
import React, { useContext, useEffect } from "react";
import * as yup from "yup";
import {
	ButtonComponent,
	FormComponent,
	LabelComponent,
} from "../../../../common/components/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../../common/components/Form/input-text-area.component";
import styles from "./styles.module.scss";
import { AppContext } from "../../../../common/contexts/app.context";
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
	const EVACUADO = "Evacuado";
	const PENDIENTE = "Pendiente";
	const { authorization, setMessage } = useContext(AppContext);
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

	const {
		register: registerActRevDocuments,
		control: controlActRevDocuments,
		setValue: setValueActRevDocuments,
		getValues: getValuesActRevDocuments,
		watch: watchActRevDocuments,
		handleSubmit: handleSubmitActRevDocuments,
		formState: { errors: errorsActRevDocuments },
		reset: resetActRevDocuments,
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

			setValueActRevDocuments(
				"dra_estado_radicado",
				typeModal == "Activar" ? PENDIENTE : EVACUADO
			);

			if (typeModal == "devolucion") {
				setValueActRevDocuments(
					"dra_destinatario",
					dataForModal?.dra_radicado_por
				);
			}
			setValueActRevDocuments("typeModal", typeModal);
			setValueActRevDocuments(
				"dra_usuario",
				authorization?.user?.numberDocument
			);
		}
	}, [dataForModal, typeModal]);

	const storeComment = async (data) => {
		const endpoint: string = `/radicado/comment`;
		const entityData = await post(`${endpoint}`, data);
		return entityData;
	};

	const onSubmit = async (data) => {
		storeComment(data).then(async ({ data, operation }: any) => {
			if (operation.code == "OK") {
				setMessage({
					title: "Consulta de Movimientos",
					description:
						typeModal == "Reversar"
							? "Documento Reversado con Éxito"
							: "Documento Activado con Éxito",
					show: true,
					background: true,
					okTitle: "Aceptar",
					style: "z-index-2300",
					onOk: () => {
						resetActRevDocuments({
							dra_destinatario: "",
							comentario: "",
							dra_estado_radicado: "",
							dra_radicado: "",
							dra_radicado_por: "",
							dra_tipo_radicado: "",
							dra_usuario: "",
						});
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
						resetActRevDocuments({
							dra_destinatario: "",
							comentario: "",
							dra_estado_radicado: "",
							dra_radicado: "",
							dra_radicado_por: "",
							dra_tipo_radicado: "",
							dra_usuario: "",
						});
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
						<input
							id="dra_usuario"
							type="hidden"
							{...registerActRevDocuments("dra_usuario", {
								required: true,
							})}
						/>
						<input
							id="typeModal"
							type="hidden"
							{...registerActRevDocuments("typeModal", {
								required: true,
							})}
						/>
						<input
							id="dra_estado_radicado"
							type="hidden"
							{...registerActRevDocuments("dra_estado_radicado", {
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
							action={() => {
								resetActRevDocuments({
									dra_destinatario: "",
									comentario: "",
									dra_estado_radicado: "",
									dra_radicado: "",
									dra_radicado_por: "",
									dra_tipo_radicado: "",
									dra_usuario: "",
								});
								onCloseModal();
							}}
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
