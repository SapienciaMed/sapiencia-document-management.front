import React from "react";
import {
	ButtonComponent,
	FormComponent,
	InputComponentOriginal,
} from "../../../../common/components/Form";
import { EDirection } from "../../../../common/constants/input.enum";
import styles from "./styles.module.scss";
import TableExpansibleComponent from "../../../../common/components/table-expansible.component";
import useBreadCrumb from "../../../../common/hooks/bread-crumb.hook";

const RadicadoMovements = () => {
	useBreadCrumb({ isPrimaryPage: false, name: "Consulta de Movimientos - Parámetros", url: "/gestion-documental/consultas/movimientos" });
	return (
		<>
			<div className="spc-common-table expansible card-table mt-40 mx-24">
				<div className="mb-22 text-black  font-size-28">
					Consulta de Movimientos - Parámetros
				</div>
				<FormComponent action={undefined}>
					<div className="spc-common-table expansible card-table">
						<div
							className="flex gap-20"
							style={{ maxWidth: "90%" }}
						>
							<div
								className="text-black font-size-24 pr-40 mt-20"
								style={{ flexBasis: "40%" }}
							>
								Datos documentos:
							</div>
							<div>
								<InputComponentOriginal
									idInput="days"
									typeInput="number"
									className={`input-basic text-center ${styles.inputSize}`}
									register={null}
									label="N.° Radicado"
									classNameLabel="text-black text-required custom-label"
									direction={EDirection.column}
									errors={null}
								/>
							</div>
							<div className="flex flex-column">
								<InputComponentOriginal
									idInput="start"
									typeInput="date"
									className={`input-basic ${styles.inputSize}`}
									register={null}
									label="Fecha de radicación"
									classNameLabel="text-black custom-label"
									direction={EDirection.column}
									errors={null}
								/>
								<InputComponentOriginal
									idInput="start"
									typeInput="date"
									className={`input-basic ${styles.inputSize}`}
									register={null}
									label=" "
									classNameLabel="text-black custom-label"
									direction={EDirection.column}
									errors={null}
								/>
							</div>
							<div
								className="mt-30"
								style={{ alignSelf: "center" }}
							>
								<input type="checkbox" />
							</div>
						</div>
					</div>
					<div
						className="flex gap-20 mt-30"
						style={{ maxWidth: "90%" }}
					>
						<div
							className="text-black font-size-24 pr-40 pl-24"
							style={{ flexBasis: "40%" }}
						>
							Ordenar Resultados por:
						</div>
						<div>
							<InputComponentOriginal
								idInput="days"
								typeInput="number"
								className={`input-basic text-center ${styles.inputSize}`}
								register={null}
								label="Ordenar por"
								classNameLabel="text-black text-required custom-label"
								direction={EDirection.column}
								errors={null}
							/>
						</div>
						<div
							className={`flex gap-20`}
							style={{ alignItems: "flex-end" }}
						>
							<ButtonComponent
								className={`${styles.btnPurpleBorder} ${styles.btnSizeBorder} hover-three py-12 px-16`}
								value="Volver a la bandeja"
								type="button"
								action={null}
							/>
							<ButtonComponent
								className={`button-main ${styles.btnPurpleSize} hover-three py-12 px-16 font-size-16`}
								value="Cerrar"
								type="button"
								action={() => {}}
								disabled={false}
							/>
						</div>
					</div>
				</FormComponent>
				<div className="spc-common-table expansible card-table">
					<TableExpansibleComponent
						columns={[]}
						data={[]}
						actions={[]}
						tableTitle="Consulta de Movimientos - Resultado"
					/>
				</div>
			</div>
		</>
	);
};

export default RadicadoMovements;
