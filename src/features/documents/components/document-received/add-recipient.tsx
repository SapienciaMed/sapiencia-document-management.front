import React, { useEffect, useState, useContext } from "react";
import styles from "./document-received.module.scss";
import {
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import { AppContext } from "../../../../common/contexts/app.context";

import { FaPlusCircle, FaTrashAlt } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { AiOutlinePlusCircle } from "react-icons/ai";
import AddRecipientCopyForm from "./add-recipient-copy-form";


interface IProps {
	onChange: (data: any) => void,
	data: any
}

const AddRecipient = ({ data: payload, onChange }: IProps) => {
	const { setMessage } = useContext(AppContext);
	const [show, setShow] = useState(false);
	const [data, setData] = useState<any>([]);

	useEffect(() => {
		if (payload.add_recipient_data) {
			setData(payload.add_recipient_data)
		}

	}, [])
	

	const newData = (newData: any[]) => {
		const mergeData = [...data, ...newData];
		const d = Array.from(new Set(mergeData.map(m => m.USR_NUMERO_DOCUMENTO))).map(USR_NUMERO_DOCUMENTO => mergeData.find(obj => obj.USR_NUMERO_DOCUMENTO === USR_NUMERO_DOCUMENTO))
		setData(d);
		onChange({ ...payload, add_recipient_data: d})

	}

	const remove = (USR_NUMERO_DOCUMENTO: string) => {
		setMessage({
			title: "Eliminar copia destinatario",
			description:
				"¿Esta seguro que desea  eliminar el destinatario en copia?",
			show: true,
			background: true,
			okTitle: "Aceptar",
			cancelTitle: "Cancelar",
			style: "z-index-1300",
			onOk: () => {
				const d = data.filter((d) => d.USR_NUMERO_DOCUMENTO !== USR_NUMERO_DOCUMENTO)
				setData(d)
				onChange({ ...payload, add_recipient_data: d})
				setMessage({});
			},
			onCancel: () => {
				setMessage({});
			},
		});

		
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
				loadedData={payload}
			/>
			

			{
				data.map((d) => (
					<FormComponent key={d.USR_NUMERO_DOCUMENTO} action={null}>
						<div
							className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
						>
							<InputComponent
								id="documento"
								idInput="documento"
								value={d.USR_NUMERO_DOCUMENTO}
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
								value={`${d.USR_NOMBRES || ''} ${d.USR_APELLIDOS || ''}`}
								label="Nombre"
								className="input-basic"
								classNameLabel="text--black"
								typeInput={"text"}
								register={null}
								onChange={null}
								errors={null}
								disabled={true}
							/>

							<div className="d-flex align-items-center" style={{ cursor: 'pointer'}} onClick={() => remove(d.USR_NUMERO_DOCUMENTO)}>
								<InputComponent
									id="correo_destinatario_copia"
									idInput="correo_destinatario_copia"
									value={d.USR_CORREO}
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
