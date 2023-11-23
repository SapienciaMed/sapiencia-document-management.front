import React from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./document-received.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
	ButtonComponent,
	FormComponent,
	InputComponent,
} from "../../../../common/components/Form";
import { InputTextComponent } from "../../../../common/components/Form/input-text.component";

const SearchSenderForm = ({ searchData, onClickHideForm }) => {
	const schemaFindSender = yup.object({
		doc_identidad: yup
			.string()
			.max(15, "Solo se permiten 15 caracteres")
			.optional(),
		entidad: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres")
			.optional(),
		abreviatura: yup
			.string()
			.max(50, "Solo se permiten 50 caracteres")
			.optional(),
	});

	const {
		register: registerSearch,
		control: controlSearch,
		getValues: getValuesSearch,
		reset: resetSearch,
		watch: watchSearch,
		formState: { errors: errorsSearch },
	} = useForm<ISenderSearchForm>({
		resolver: yupResolver(schemaFindSender),
		mode: "all",
	});

	const data = {
		doc_identidad: getValuesSearch("doc_identidad"),
		entidad: getValuesSearch("entidad"),
		abreviatura: getValuesSearch("abreviatura"),
	};

	const watchSearchInputs = watchSearch();
	const isSearchInputsEmpty = Object.entries(watchSearchInputs).every(
		([key, value]) => value === "" || value === undefined || value === null
	);

	return (
		<FormComponent action={null}>
			<div className="card-table shadow-none mt-20">
				<div className="title-area">
					<div className="text-black large bold">
						Parámetros destinatario
					</div>
				</div>
				<div
					className={`${styles["document-container"]} ${styles["document-container--col4"]} ${styles["mb-10"]}`}
				>
					<Controller
						name="doc_identidad"
						control={controlSearch}
						render={({ field }) => (
							<InputTextComponent
								control={controlSearch}
								idInput="doc_identidad"
								label="Documento identidad"
								className="input-basic"
								classNameLabel="text--black"
								errors={errorsSearch}
								disabled={false}
							/>
						)}
					/>
					<Controller
						name="entidad"
						control={controlSearch}
						render={({ field }) => (
							<InputTextComponent
								control={controlSearch}
								idInput="entidad"
								label="Nombre entidad"
								className="input-basic"
								classNameLabel="text--black"
								errors={errorsSearch}
								disabled={false}
							/>
						)}
					/>
					<Controller
						name="abreviatura"
						control={controlSearch}
						render={({ field }) => (
							<InputTextComponent
								control={controlSearch}
								idInput="abreviatura"
								label="Abreviatura "
								className="input-basic"
								classNameLabel="text--black"
								errors={errorsSearch}
								disabled={false}
							/>
						)}
					/>
				</div>
				<div className="flex container-docs-received justify-content--end px-20 py-20 gap-20">
					<ButtonComponent
						className={`${styles["btn-nobackground"]} hover-three py-12 px-16`}
						value="Cancelar"
						type="button"
						action={() => onClickHideForm()}
					/>
					<ButtonComponent
						className="button-main hover-three py-12 px-16 font-size-16"
						value="Buscar"
						type="button"
						action={() => searchData(watchSearchInputs)}
						disabled={isSearchInputsEmpty}
					/>
				</div>
			</div>
		</FormComponent>
	);
};

export default SearchSenderForm;
