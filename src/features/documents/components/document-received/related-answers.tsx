import React, { useContext, useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import {
	ButtonComponent,
	FormComponent,
} from "../../../../common/components/Form";
import { useForm } from "react-hook-form";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./document-received.module.scss";
import { ITableAction } from "../../../../common/interfaces/table.interfaces";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import useCrudService from "../../../../common/hooks/crud-service.hook";
import AnswerDocument from "./answer-document";
import { AppContext } from "../../../../common/contexts/app.context";

interface IProps {
	idRadicado: string;
	idTypeRadicado: string;
	visible: boolean;
	onCloseModal: (data: boolean) => void;
}
const RelatedAnswers = ({
	visible,
	onCloseModal,
	idRadicado,
	idTypeRadicado,
}: IProps) => {
	const { setMessage } = useContext(AppContext);
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);
	const [relatedAnswers, setRelatedAnswers] = useState<any>([]);
	const [isVisibleAnswerDocumentModal, setIsVisibleAnswerDocumentModal] =
		useState<boolean>(false);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get, post, deleted } = useCrudService(baseURL);
	const columnSenderTable = [
		{
			fieldName: "check",
			header: "Seleccione",
			renderCell: (row) => {
				return (
					<input
						type="checkbox"
						value={row?.dra_radicado}
						checked={selectedCheckbox == row?.dra_radicado}
						onChange={handleCheckboxChange}
					/>
				);
			},
		},
		{
			fieldName: "dra_radicado",
			header: "N.° Radicado",
		},
		{
			fieldName: "dra_tipo_radicado",
			header: "Tipo documento",
			renderCell: (row) => {
				const texto = radicadoTypesList(row?.dra_tipo_radicado);
				return texto?.lge_elemento_descripcion || "";
			},
		},
		{
			fieldName: "dra_nombre_radicador",
			header: "Radicador",
		},
	];

	const relatedAnswersTableActions: ITableAction<any>[] = [
		{
			icon: "Detail",
			onClick: (row) => {
				//setEditData(row);
				//setVisibleEditForm(true);
			},
		},
		{
			icon: "Delete",
			onClick: (row) => {
				//setEditData(row);
				//setVisibleEditForm(true);
				deleteRelatedAnswer(row?.dra_radicado);
			},
		},
	];

	useEffect(() => {
		getRelatedAnswersByID(idRadicado).then(
			//TODO: CAMBIAR ID POR VARIABLE
			async ({ data, operation }) => {
				setRelatedAnswers(data);
			}
		);

		get(`/generic-list/type-radicado-list`).then((data) => {
			setRadicadoTypes(data);
		});
	}, []);

	const getRelatedAnswersByID = async (radicadoId: string) => {
		const endpoint: string = `/related-answers/${radicadoId}`;
		const data = await get(`${endpoint}`);
		return data;
	};

	const schema = yup.object({
		dra_radicado: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		dra_tipo_radicado: yup.string(),
	});

	const {
		register: registerRelatedAnswer,
		control: controlRelatedAnswer,
		setValue: setValueRelatedAnswer,
		getValues: getValuesRelatedAnswer,
		watch: watchRelatedAnswer,
		formState: { errors: errorsRelatedAnswer },
	} = useForm<IRelatedAnswerForm>({
		resolver: yupResolver(schema),
		defaultValues: {
			dra_radicado: idRadicado,
			dra_tipo_radicado: idTypeRadicado,
		},
		mode: "all",
	});

	/**
	 * FUNCTIONS
	 */

	const radicadoTypesList = (code: string | number) =>
		radicadoTypes.find((item) => {
			return (
				item.lge_agrupador == "TIPOS_RADICADOS" &&
				item.lge_elemento_codigo == code
			);
		});

	const handleCheckboxChange = (event) => {
		setSelectedCheckbox(event.target.value);
		//setIsDisableSendButton(event.target.value ? false : true);
	};

	const saveAnswerDocument = async (idAnswerDocument) => {
		const data = {
			rrr_id_radicado: idRadicado,
			rrr_id_respuestas_relacionadas: idAnswerDocument,
		};
		const endpoint: string = `/related-answers`;
		const relatedAnswerData = await post(`${endpoint}`, data);
		if (relatedAnswerData.operation.code == "OK") {
			getRelatedAnswersByID(idRadicado).then(
				//TODO: CAMBIAR ID POR VARIABLE
				async ({ data, operation }) => {
					setRelatedAnswers(data);
				}
			);
		}
	};

	const deleteRelatedAnswer = async (idAnswerDocument) => {
		const deleteData = async () => {
			const endpoint: string = `/related-answers/${idAnswerDocument}/${idRadicado}`;
			const relatedAnswerData = await deleted(`${endpoint}`);
			console.log(relatedAnswerData, "relatedAnswerData");
			if (relatedAnswerData.operation.code == "OK") {
				getRelatedAnswersByID(idRadicado).then(
					//TODO: CAMBIAR ID POR VARIABLE
					async ({ data, operation }) => {
						setRelatedAnswers(data);
					}
				);
			}
		};
		setMessage({
			title: "Borrar respuesta",
			description:
				"¿Está seguro que desea borrar la respuesta de este radicado?",
			show: true,
			background: true,
			okTitle: "Aceptar",
			cancelTitle: "Cancelar",
			style: "z-index-1300",
			onOk: () => {
				deleteData();
				setMessage({});
			},
			onCancel: () => {
				setMessage({});
			},
		});
	};

	return (
		<>
			<Dialog
				header="Respuestas relacionadas"
				visible={visible}
				style={{ width: "60vw" }}
				onHide={() => {
					onCloseModal(false);
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
				<FormComponent action={null}>
					<div className="card-table shadow-none mt-8">
						<div
							className={`${styles["document-container"]} ${styles["flex-row"]}  ${styles["flex-center"]} mb-20`}
						>
							<InputTextComponent
								idInput="dra_radicado"
								label="N.° Radicado original"
								className="input-basic"
								classNameLabel="text--black"
								control={controlRelatedAnswer}
								errors={errorsRelatedAnswer}
								disabled={true}
							/>

							<InputTextComponent
								idInput="dra_tipo_radicado"
								label="Clase de documento"
								className="input-basic"
								classNameLabel="text--black"
								control={controlRelatedAnswer}
								errors={errorsRelatedAnswer}
								disabled={true}
							/>
						</div>
					</div>
					<div className="card-table shadow-none mt-20">
						{/* Expansible Table */}
						{Array.isArray(relatedAnswers) &&
						relatedAnswers.length > 0 ? (
							<TableExpansibleComponent
								columns={columnSenderTable}
								data={relatedAnswers}
								actions={relatedAnswersTableActions}
								tableTitle="Respuestas del documento"
							/>
						) : (
							<div className="font-size-28 font-w500 text-center text-color--gray py-40 px-40">
								No hay documentos relacionados
							</div>
						)}
					</div>
					<div className={`flex  px-20 py-20`}>
						<ButtonComponent
							className={` ${styles["btn-main"]} hover-three py-12 px-36`}
							value="Relacionar Respuesta"
							type="button"
							action={() => {
								setIsVisibleAnswerDocumentModal(true);
							}}
							disabled={false}
						/>

						<ButtonComponent
							className="button-main hover-three py-12 px-16 font-size-16"
							value="Cerrar"
							type="button"
							action={() => {
								onCloseModal(false);
							}}
							disabled={false}
						/>
						<div className="px-112"></div>
					</div>
				</FormComponent>
				{isVisibleAnswerDocumentModal && (
					<AnswerDocument
						visible={isVisibleAnswerDocumentModal}
						onCloseModal={() =>
							setIsVisibleAnswerDocumentModal(false)
						}
						saveAnswerDocument={saveAnswerDocument}
						idTypeRadicado={idTypeRadicado}
					/>
				)}
			</Dialog>
		</>
	);
};

export default RelatedAnswers;
