import React from "react";
import { EDirection } from "../../constants/input.enum";
import { LabelComponent } from "./label.component";

import { Control, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";

interface IInputText<T> {
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
	useGrouping?: boolean;
	optionsRegister?: {};
	shouldUnregister?: boolean;
	onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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

export function InputTextComponent({
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
	optionsRegister,
	shouldUnregister,
	onBlur,
}: IInputText<any>): React.JSX.Element {
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
			<div>
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
									? `${className} error`
									: className
							}
							disabled={disabled}
							prefix={prefix}
							min={min}
							max={max}
						/>
					)}
				/>
				{messageError() && <span className="icon-error"></span>}
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
