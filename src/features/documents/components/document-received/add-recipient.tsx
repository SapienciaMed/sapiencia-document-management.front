import React, { useEffect, useState } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";

import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlinePlusCircle } from "react-icons/ai";
import AddRecipientCopyForm from "./add-recipient-copy-form";


interface IProps {
	onChange: (data: any) => void,
	data: any
}

const AddRecipient = ({ data: payload, onChange }: IProps) => {
	const [show, setShow] = useState(false);
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		if (payload.add_recipient_data) {
			setData(payload.add_recipient_data)
		}
	}, [])

	const newData = (newData: any[]) => {
		const mergeData = [...data, ...newData];
		const d = Array.from(new Set(mergeData.map(m => m.ent_numero_identidad))).map(ent_numero_identidad => mergeData.find(obj => obj.ent_numero_identidad === ent_numero_identidad))
		setData(d);
		onChange({ ...payload, add_recipient_data: d})
	}

	const remove = (ent_numero_identidad: string) => {
		const d = data.filter((d) => d.ent_numero_identidad !== ent_numero_identidad)
		setData(d)
		onChange({ ...payload, add_recipient_data: d})
	}

	return (
		<>
			<div
				className={`${styles["flex-row"]} ${styles["flex-row--gap10"]}`}
				onClick={() => setShow(true)}
			>
				<div className={`${styles["add-recipient-link"]}`}>
					<button className={`${styles["btn-link"]}`} type="button">
						Agregar Destinatario Copia
					</button>
					<AiOutlinePlusCircle size={15} color="#4338CA" />
				</div>
			</div>

			<AddRecipientCopyForm
				visible={show}
				onHideCreateForm={() =>  setShow(false) }
				geographicData={() => {} }
				chargingNewData={newData}
			/>
			

			{
				data.map((d) => (
					<FormComponent key={d.ent_numero_identidad} action={null}>
						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
						>
							<InputComponent
								id="documento"
								idInput="documento"
								value={d.ent_numero_identidad}
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
								value={d.ent_tipo_documento == "CC" ? `${d.ent_nombres} ${d.ent_apellidos}`: d.ent_razon_social}
								label="Nombre"
								className="input-basic"
								classNameLabel="text--black"
								typeInput={"text"}
								register={null}
								onChange={null}
								errors={null}
								disabled={true}
							/>

							<div className="d-flex align-items-center" style={{ cursor: 'pointer'}} onClick={() => remove(d.ent_numero_identidad)}>
								<InputComponent
									id="correo_destinatario_copia"
									idInput="correo_destinatario_copia"
									value={d.ent_email}
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
					</FormComponent>)
				)
			}
			
		</>
	);
};

export default AddRecipient;
