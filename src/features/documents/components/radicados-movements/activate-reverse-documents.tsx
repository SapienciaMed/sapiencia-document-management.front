import { Dialog } from "primereact/dialog";
import React, { useContext } from "react";
import * as yup from "yup";
import {
	ButtonComponent,
	InputComponent,
	InputComponentOriginal,
} from "../../../../common/components/Form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { TextAreaComponent } from "../../../../common/components/Form/input-text-area.component";
import styles from "./styles.module.scss";
import { AppContext } from "../../../../common/contexts/app.context";

interface IProps {
	visible: boolean;
	typeModal: string;
	onCloseModal: () => void;
}

const ActivateReverseDocuments = ({ onCloseModal, visible, typeModal }) => {
	const { setMessage } = useContext(AppContext);

	const schema = yup.object({
		dra_radicado: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		dra_tipo_radicado: yup.string(),
	});

	const {
		register: registerActRevDocuments,
		control: controlActRevDocuments,
		setValue: setValueActRevDocuments,
		getValues: getValuesActRevDocuments,
		watch: watchActRevDocuments,
		formState: { errors: errorsActRevDocuments },
	} = useForm<any>({
		resolver: yupResolver(schema),
		defaultValues: {
			dra_radicado: "",
			dra_tipo_radicado: "",
		},
		mode: "all",
	});

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

	return (
		<Dialog
			header="Datos de Activación"
			visible={visible}
			style={{ width: "60vw" }}
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
				<div className="flex gap-14">
					<InputComponent
						id="fecha_radicado"
						idInput="fecha_radicado"
						label="Documento"
						className="input-basic"
						classNameLabel="text--black"
						typeInput={"string"}
						register={null}
						errors={null}
						disabled={true}
					/>
					<InputComponent
						id="fecha_radicado"
						idInput="fecha_radicado"
						label="Tipo"
						className="input-basic"
						classNameLabel="text--black"
						typeInput={"string"}
						register={null}
						errors={null}
						disabled={true}
					/>
					<InputComponent
						id="fecha_radicado"
						idInput="fecha_radicado"
						label="Asignar a"
						className="input-basic"
						classNameLabel="text--black text-required"
						typeInput={"string"}
						register={null}
						errors={null}
						disabled={false}
					/>
				</div>
				<div className={`flex flex-column mt-28`}>
					<Controller
						name="comentarios"
						control={controlActRevDocuments}
						render={({ field }) => (
							<TextAreaComponent
								id="comentarios"
								idInput="comentarios"
								label="Comentarios"
								className={styles.inputTextarea}
								classNameLabel="text--black"
								register={registerActRevDocuments}
								errors={errorsActRevDocuments}
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
						type="button"
						action={onClicSave}
						disabled={false}
					/>
				</div>
			</div>
		</Dialog>
	);
};

export default ActivateReverseDocuments;
