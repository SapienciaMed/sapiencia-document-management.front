import React from "react";
import { FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from "react-hook-form";
import { IGeneralConfiguration, } from "../interfaces/GeneralConfigurationInterfaces";

interface IProps {
  onChange: (data: any) => void,
  data: IGeneralConfiguration
}

export default ({ onChange, data }: IProps): React.JSX.Element => {
  const {
    register,
    formState: { errors },
  } = useForm<any>({
    defaultValues:{ ...data },
    mode: "all",
  });
  
  return (
    <FormComponent action={undefined} className="accordion-item-container">
      <div className="grid-form-3-container">
        <div className="d-flex align-items-center">
          <p className="color-black" style={{ fontSize: 17,  fontWeight: 400 }}>CORREOADMINISTRADOR</p>
        </div>

        <div className="d-flex align-items-center w-100 grid-form-1-container">
          <InputComponent
            idInput="admin_email"
            typeInput="email"
            className="input-basic background-textArea w-100 without-border without-bold"
            register={register}
            label="Correo electrónico"
            classNameLabel="text-black"
            direction={EDirection.column}
            errors={errors}
            disabled
        />
        </div>
        <div className="d-flex align-items-center">
          <p className="color-black" style={{ fontSize: 17,  fontWeight: 400, maxWidth: 310 }}>Guarda el correo al que se debe notificar si se realizó el proceso de notificaciones</p>
        </div>
      </div>


    </FormComponent>
  );
}

