import React from "react";
import { FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from "react-hook-form";
import { IGeneralConfiguration, } from "../interfaces/GeneralConfigurationInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { notificationsValidator } from "../../../common/schemas/general-configuration-schemas";


interface IProps {
  onChange: (data: any) => void,
  data: IGeneralConfiguration
}

export default ({ onChange, data }: IProps): React.JSX.Element => {
  const resolver = useYupValidationResolver(notificationsValidator);
  const {
    register,
    formState: { errors },
  } = useForm<any>({
    resolver,
    defaultValues:{ ...data },
    mode: "all",
  });
  
  return (
    <FormComponent action={undefined} className="">
      <div className="grid-form-3-container d-flex align-items-center" style={{ padding: '20px 10px'}}>
          <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>CORREOADMINISTRADOR</p>

          <InputComponent
            idInput="admin_email"
            typeInput="email"
            className="input-basic background-textArea"
            register={register}
            label="Correo electrónico"
            classNameLabel="text-black big text-required"
            direction={EDirection.column}
            errors={errors}
            onChange={(e) => onChange({ ...data, admin_email : e.target.value })}
        />
        <p className="color-black" style={{  fontSize: 17,  fontWeight: 400, maxWidth: 310 }}>Guarda el correo al que se debe notificar si se realizó el proceso de notificaciones</p>
      </div>


    </FormComponent>
  );
}

