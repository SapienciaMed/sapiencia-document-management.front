import React from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";

import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlinePlusCircle } from "react-icons/ai";

const AddRecipient = () => {
	return (
		<>
			<div
				className={`${styles["flex-row"]} ${styles["flex-row--gap10"]}`}
			>
				<div className={`${styles["add-recipient-link"]}`}>
					<button className={`${styles["btn-link"]}`} type="button">
						Agregar Destinatario Copia
					</button>
					<AiOutlinePlusCircle size={15} color="#4338CA" />
				</div>
				{/* <div className={`${styles["add-recipient-link"]}`}>
					<button
						className={`${styles["btn-link"]} ${styles["btn-link--black"]}`}
						type="button"
					>
						Quitar
					</button>
					<IoTrashOutline size={20} color="#FF0000" />
				</div> */}
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
						classNameLabel="text--black"
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
						classNameLabel="text--black"
						typeInput={"text"}
						register={null}
						onChange={null}
						errors={null}
						disabled={true}
					/>

					<div className="d-flex align-items-center">
						<InputComponent
							id="correo_destinatario_copia"
							idInput="correo_destinatario_copia"
							value={""}
							label="Correo"
							className="input-basic"
							classNameLabel="text--black"
							typeInput={"email"}
							register={null}
							onChange={null}
							errors={null}
							disabled={true}
						/>

						<IoTrashOutline style={{ marginLeft: 20, marginTop: 20 }} size={20} color="#FF0000" />

					</div>
				</div>
			</FormComponent>
		</>
	);
};

export default AddRecipient;
