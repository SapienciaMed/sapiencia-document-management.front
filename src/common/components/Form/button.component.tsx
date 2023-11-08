import React, { SyntheticEvent } from "react";
import { Link } from "react-router-dom";

interface ILabelProps {
  value: string | React.JSX.Element;
  type?: "button" | "submit" | "reset" | "route" | "link";
  className?: string;
  action?: Function;
  url?: string;
  target?: string;
  id?: string;
  form?: string;
  disabled?: boolean;
}

export function ButtonComponent({
  value,
  type = "submit",
  className = "button-main",
  action = () => {},
  url,
  target,
  id,
  form,
  disabled,
}: ILabelProps): React.JSX.Element {
  const handleButtonClick = (event: SyntheticEvent) => {
    if (type !== "submit") event.preventDefault();
    action();
  };

  const renderButton = () => {
    let button = null;
    switch (type) {
      case "link":
        button = disabled ? (
          <span id={id} className={className}>
            {value}
          </span>
        ) : (
          <a
            href={url}
            target={target ? target : "_self"}
            id={id}
            className={className}
          >
            {value}
          </a>
        );
        break;
      case "route":
        button = disabled ? (
          <span id={id} className={className+" linkButton"}>
            {value}
          </span>
        ) : (
          <Link
            to={url}
            id={id}
            className={className+" linkButton"}
          >
            {value}
          </Link>
        );

        break;

      default:
        button = (
          <button
            type={type}
            id={id}
            form={form}
            className={className}
            onClick={handleButtonClick}
            disabled={disabled}
          >
            {value}
          </button>
        );
        break;
    }
    return button;
  };
  return renderButton();
}