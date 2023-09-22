import React from "react";
import styles from "./document-received.module.scss";
import {
	ButtonComponent,
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";

import { Button } from "primereact/button";
import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";

const AddRecipient = () => {
	const handleAddRecipient = () => {
		console.log("hola");
	};
	return (
		<>
			<div
				className={`${styles["flex-row"]} ${styles["flex-row--gap10"]}`}
			>
				<div className={`${styles["add-recipient-link"]}`}>
					<button className={`${styles["btn-link"]}`} type="button">
						Agregar Destinatario Copia
					</button>
					<FaPlusCircle color="#4338CA" />
				</div>
				<div className={`${styles["add-recipient-link"]}`}>
					<button
						className={`${styles["btn-link"]} ${styles["btn-link--black"]}`}
						type="button"
					>
						Quitar
					</button>
					<FaTrashAlt color="#FF0000" />
				</div>
			</div>

			<FormComponent action={null}>
				<div
					className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
				>
					<InputComponent
						id="documento"
						idInput="documento"
						value={""}
						label="Documento"
						className="input-basic"
						classNameLabel="text-black bold"
						typeInput={"number"}
						register={null}
						onChange={null}
						errors={null}
						disabled={true}
					/>

					<InputComponent
						id="nombre_destinatario_copia"
						idInput="nombre_destinatario_copia"
						value={""}
						label="Nombre"
						className="input-basic"
						classNameLabel="text-black bold"
						typeInput={"text"}
						register={null}
						onChange={null}
						errors={null}
						disabled={true}
					/>
					<InputComponent
						id="correo_destinatario_copia"
						idInput="correo_destinatario_copia"
						value={""}
						label="Correo"
						className="input-basic"
						classNameLabel="text-black bold"
						typeInput={"email"}
						register={null}
						onChange={null}
						errors={null}
						disabled={true}
					/>
				</div>
			</FormComponent>
		</>
	);
};

export default AddRecipient;
