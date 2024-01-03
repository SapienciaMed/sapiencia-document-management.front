import { yupResolver } from "@hookform/resolvers/yup";
import { Dialog } from "primereact/dialog";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import {
	ButtonComponent,
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import { TextAreaComponent } from "../../../../common/components/Form/input-text-area.component";

import styles from "../radicados-movements/styles.module.scss";
import { useContext, useEffect } from "react";
import { AppContext } from "../../../../common/contexts/app.context";
import useCrudService from "../../../../common/hooks/crud-service.hook";

interface IProps {
	visible: boolean;
	dataForModal?: any;
	onCloseModal: () => void;
	onClickEvacuation: () => void;
}

const EvacuationComments = ({
	onCloseModal,
	visible,
	dataForModal,
	onClickEvacuation,
}: IProps) => {
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { setMessage } = useContext(AppContext);
	const { post } = useCrudService(baseURL);

	const schema = yup.object({
		dra_radicado: yup.string().max(15, "Solo se permiten 15 caracteres"),
		comentario: yup
			.string()
			.max(200, "Solo se permiten 200 caracteres")
			.required("El campo es obligatorio"),
	});

	const {
		register: registerCommentsRecipientTray,
		control: controlCommentsRecipientTray,
		setValue: setValueCommentsRecipientTray,
		getValues: getValuesCommentsRecipientTray,
		watch: watchCommentsRecipientTray,
		handleSubmit: handleSubmitCommentsRecipientTray,
		formState: {
			errors: errorsCommentsRecipientTray,
			isValid: isValidCommentsRecipientTray,
		},
		reset: resetCommentsRecipientTray,
	} = useForm<IModalEvacuationComments>({
		resolver: yupResolver(schema),
		mode: "all",
	});

	useEffect(() => {
		setValueCommentsRecipientTray(
			"dra_radicado",
			dataForModal?.dra_radicado
		);
	}, [dataForModal]);

	let notValidForm = !watchCommentsRecipientTray("comentario");

	/**
	 * storeComment: Guarda Comentario
	 * @param data
	 * @returns
	 */
	const storeComment = async (data) => {
		const endpoint: string = `/radicado/comment`;
		const entityData = await post(`${endpoint}`, data);
		return entityData;
	};

	const onSubmit = async (data) => {
		storeComment(data).then(async ({ data, operation }: any) => {
			if (operation.code == "OK") {
				onClickEvacuation();
				resetCommentsRecipientTray({
					comentario: "",
					dra_radicado: "",
				});
				setMessage({});
				onCloseModal();
			} else {
				setMessage({
					title: "Evacuación",
					description: "Ocurrió un error al guardar los datos",
					show: true,
					background: true,
					okTitle: "Aceptar",
					style: "z-index-2300",
					onOk: () => {
						resetCommentsRecipientTray({
							comentario: "",
							dra_radicado: "",
						});
						setMessage({});
						onCloseModal();
					},
				});
			}
		});
	};

	return (
		<Dialog
			header="Evacuación"
			visible={visible}
			style={{ width: "40vw" }}
			onHide={() => {
				resetCommentsRecipientTray({
					comentario: "",
					dra_radicado: "",
				});
				onCloseModal();
			}}
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
				<FormComponent
					action={handleSubmitCommentsRecipientTray(onSubmit)}
				>
					<div className={`flex gap-14 ${"flex-center"}`}>
						<InputComponent
							id="dra_radicado"
							idInput="dra_radicado"
							value={`${dataForModal?.dra_radicado}`}
							label="Documento"
							className="input-basic"
							classNameLabel="text--black"
							typeInput={"text"}
							register={null}
							onChange={null}
							errors={errorsCommentsRecipientTray}
							disabled={true}
						/>
					</div>
					<div className={`flex flex-column mt-28`}>
						<Controller
							name="comentario"
							control={controlCommentsRecipientTray}
							render={({ field }) => (
								<TextAreaComponent
									id="comentario"
									idInput="comentario"
									label="Comentario"
									className={styles.inputTextarea}
									classNameLabel="text--black text-required"
									register={registerCommentsRecipientTray}
									errors={errorsCommentsRecipientTray}
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
								resetCommentsRecipientTray({
									comentario: "",
									dra_radicado: "",
								});
								onCloseModal();
							}}
						/>
						<ButtonComponent
							className={`${
								notValidForm
									? styles.btnTextBlack
									: "button-main"
							} ${
								notValidForm && styles.btnGray
							} py-12 px-16 font-size-16 cursor-pointer`}
							value="Aceptar"
							type="submit"
							disabled={!watchCommentsRecipientTray("comentario")}
						/>
					</div>
				</FormComponent>
			</div>
		</Dialog>
	);
};

export default EvacuationComments;
