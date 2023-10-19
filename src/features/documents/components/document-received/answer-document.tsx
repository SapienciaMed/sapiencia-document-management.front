import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import {
	ButtonComponent,
	FormComponent,
	SelectComponent,
} from "../../../../common/components/Form";
import { useForm } from "react-hook-form";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./document-received.module.scss";

import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import useCrudService from "../../../../common/hooks/crud-service.hook";

interface IProps {
	visible: boolean;
	onCloseModal: (data: boolean) => void;
	saveAnswerDocument: (data: string) => void;
	idTypeRadicado: string;
}
const AnswerDocument = ({
	visible,
	onCloseModal,
	saveAnswerDocument,
	idTypeRadicado,
}: IProps) => {
	const [selectedCheckbox, setSelectedCheckbox] = useState<string>("");
	const [radicadoTypes, setRadicadoTypes] = useState<any>([]);
	const [isVisibleTable, setIsVisibleTable] = useState<boolean>(false);
	const [answerDocumentList, setAnswerDocumentList] = useState<any>([]);
	const baseURL: string =
		process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
	const { get } = useCrudService(baseURL);
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
				const texto = typeRadicadoName(row?.dra_tipo_radicado);
				return texto?.lge_elemento_descripcion || "";
			},
		},
		{
			fieldName: "rn_radicado_remitente_to_entity.fullName",
			header: "Remitente",
		},
		{
			fieldName: "rn_radicado_destinatario_to_entity.fullName",
			header: "Destinatario",
		},
		{
			fieldName: "dra_codigo_asunto",
			header: "Asunto",
		},
		{
			fieldName: "dra_observacion",
			header: "Observación",
		},
		{
			fieldName: "dra_fecha_radicado",
			header: "Fecha radicado",
		},
	];

	useEffect(() => {
		if (visible) {
			get(`/generic-list/type-radicado-list`).then((data) => {
				setRadicadoTypes(data);
			});
		}
	}, [visible]);

	const radicadoTypesList = () => {
		const radicadoTypesData = radicadoTypes.filter((item) => {
			return item.lge_agrupador == "TIPOS_RADICADOS";
		});

		return radicadoTypesData.map((item) => {
			return {
				name: item.lge_elemento_descripcion,
				value: item.lge_elemento_codigo,
			};
		});
	};

	const typeRadicadoName = (code: string | number) =>
		radicadoTypes.find((item) => {
			return (
				item.lge_agrupador == "TIPOS_RADICADOS" &&
				item.lge_elemento_codigo == code
			);
		});

	// useEffect(() => {
	// 	getAnswerDocumentByID("966496264426", "1").then( //TODO: CAMBIAR IDs POR VARIABLES
	// 		async ({ data, operation }) => {
	// 			console.log(data, "data1");
	// 			setRelatedAnswers(data);
	// 		}
	// 	);
	// }, []);

	const getAnswerDocumentByID = async (radicadoId: string, type: string) => {
		const endpoint: string = `/answer-document/${radicadoId}/type/${type}`;
		const dataList = await get(`${endpoint}`);
		setAnswerDocumentList(dataList.data);
		setIsVisibleTable(true);
	};

	const schema = yup.object({
		dra_radicado: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.required("El campo es obligatorio"),
		dra_tipo_radicado: yup.string().nullable(),
	});

	const {
		register: registerAnswerDocument,
		control: controlAnswerDocument,
		setValue: setValueAnswerDocument,
		getValues: getValuesAnswerDocument,
		watch: watchAnswerDocument,
		formState: { errors: errorsAnswerDocument },
	} = useForm<IAnswerDocumentForm>({
		resolver: yupResolver(schema),
		defaultValues: {
			dra_tipo_radicado: idTypeRadicado == "1" ? "3" : "2",
		},
		mode: "all",
	});

	/**
	 * FUNCTIONS
	 */

	const handleCheckboxChange = (event) => {
		setSelectedCheckbox(event.target.value);
		//setIsDisableSendButton(event.target.value ? false : true);
	};

	return (
		<>
			<Dialog
				header="Documento de Respuesta"
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
						<p>
							Si este documento es una respuesta, digite el número
							del documento al cual está respondiendo
						</p>
						<div
							className={`${styles["document-container"]} ${styles["flex-row"]} ml-40 mb-20`}
						>
							<InputTextComponent
								idInput="dra_radicado"
								label="Digite el documento o parte de él"
								className={`input-basic`}
								classNameLabel="text--black"
								control={controlAnswerDocument}
								errors={errorsAnswerDocument}
								disabled={false}
							/>

							<SelectComponent
								idInput="dra_tipo_radicado"
								className="select-basic select-placeholder mx-20"
								control={controlAnswerDocument}
								errors={errorsAnswerDocument}
								label="Clase de documento"
								classNameLabel="text--black mx-20"
								placeholder="Seleccionar"
								data={radicadoTypesList() || []}
							/>
							<div
								className={`${styles["align-self-end"]} ${styles["flex-basis-30"]} mb-4 ml-106`}
							>
								<ButtonComponent
									className={`button-main hover-three py-12 px-16 mr-24 font-size-16`}
									value="Buscar"
									type="button"
									action={() => {
										getAnswerDocumentByID(
											getValuesAnswerDocument(
												"dra_radicado"
											),
											getValuesAnswerDocument(
												"dra_tipo_radicado"
											)
										);
									}}
									disabled={false}
								/>
								<ButtonComponent
									className={`button-main hover-three py-12 px-16 font-size-16`}
									value="Cerrar"
									type="button"
									action={() => {
										onCloseModal(false);
									}}
									disabled={false}
								/>
							</div>
						</div>
					</div>
					{isVisibleTable && (
						<>
							<div className="card-table shadow-none mt-20">
								{/* Expansible Table */}
								{Array.isArray(answerDocumentList) ? (
									<TableExpansibleComponent
										columns={columnSenderTable}
										data={answerDocumentList}
										tableTitle="Ubicar documento para relacionar"
									/>
								) : (
									<div className="font-size-28 font-w500 text-center text-color--gray py-40 px-40">
										No hay documentos
									</div>
								)}
							</div>
							<div
								className={`flex container-docs-received ${styles["flex-center"]}  px-20 py-20 gap-20`}
							>
								<ButtonComponent
									className={`button-main hover-three py-12 px-16 font-size-16`}
									value="Aceptar"
									type="button"
									action={() => {
										saveAnswerDocument(selectedCheckbox);
										onCloseModal(false);
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
							</div>
						</>
					)}
				</FormComponent>
			</Dialog>
		</>
	);
};

export default AnswerDocument;
