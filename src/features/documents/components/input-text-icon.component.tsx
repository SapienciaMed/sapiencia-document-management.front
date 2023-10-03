import React from "react";
import { EDirection } from "../../../common/constants/input.enum";
import { LabelComponent } from "../../../common/components/Form/label.component";
import styles from "./document-received/document-received.module.scss";

import { Control, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { IoSearchOutline } from "react-icons/io5";

interface IInputTextIcon<T> {
	idInput: string;
	control: Control<any>;
	className?: string;
	placeholder?: string;
	label?: string | React.JSX.Element;
	classNameLabel?: string;
	direction?: EDirection;
	children?: React.JSX.Element | React.JSX.Element[];
	errors?: any;
	disabled?: boolean;
	fieldArray?: boolean;
	prefix?: string;
	suffix?: string;
	locale?: string;
	min?: number;
	max?: number;
	type?: string;
	useGrouping?: boolean;
	optionsRegister?: {};
	shouldUnregister?: boolean;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
	iconAction?: () => void;
}

function LabelElement({ label, idInput, classNameLabel }): React.JSX.Element {
	if (!label) return <></>;
	return (
		<LabelComponent
			htmlFor={idInput}
			className={classNameLabel}
			value={label}
		/>
	);
}

export function InputTextIconComponent({
	idInput,
	control,
	className = "select-basic",
	placeholder = "",
	label,
	classNameLabel = "text-main",
	direction = EDirection.column,
	children,
	errors = {},
	disabled,
	fieldArray,
	prefix,
	min,
	max,
	type,
	optionsRegister,
	shouldUnregister,
	onBlur,
	iconAction,
}: IInputTextIcon<any>): React.JSX.Element {
	const messageError = () => {
		const keysError = idInput.split(".");
		let errs = errors;
		if (fieldArray) {
			const errorKey = `${keysError[0]}[${keysError[1]}].${keysError[2]}`;
			return errors[errorKey]?.message;
		} else {
			for (let key of keysError) {
				errs = errs?.[key];
				if (!errs) {
					break;
				}
			}
			return errs?.message ?? null;
		}
	};

	return (
		<div
			className={
				messageError() ? `${direction} container-icon_error` : direction
			}
		>
			<LabelElement
				label={label}
				idInput={idInput}
				classNameLabel={classNameLabel}
			/>
			<div className={`${styles["search-input-absolute"]}`}>
				<div className={styles["search-input-size"]}>
					<Controller
						name={idInput}
						control={control}
						rules={optionsRegister}
						shouldUnregister={shouldUnregister}
						render={({ field }) => (
							<InputText
								id={field.name}
								onChange={(e) => field.onChange(e.target.value)}
								onBlur={onBlur}
								placeholder={placeholder}
								value={field.value}
								className={
									messageError()
										? `${className} error `
										: className
								}
								disabled={disabled}
								prefix={prefix}
								min={min}
								max={max}
								type={type}
							/>
						)}
					/>
				</div>
				<div
					className={`${styles["icon-search"]} ${styles["icon-position-left"]}`}
				>
					<IoSearchOutline onClick={iconAction} />
				</div>
			</div>
			{messageError() && (
				<p className="error-message not-margin-padding">
					{messageError()}
				</p>
			)}
			{children}
		</div>
	);
}
