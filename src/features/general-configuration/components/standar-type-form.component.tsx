import React from "react";
import { FormComponent, InputComponentOriginal, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from "react-hook-form";
import { IGeneralConfiguration, } from "../interfaces/GeneralConfigurationInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { standarTypeFormValidator } from "../../../common/schemas/general-configuration-schemas";


interface IProps {
  onChange: (data: any) => void,
  data: IGeneralConfiguration
}

export default ({ onChange, data }: IProps): React.JSX.Element => {
  const resolver = useYupValidationResolver(standarTypeFormValidator);
  const {
    register,
    formState: { errors },
  } = useForm<any>({
    resolver,
    defaultValues:{ ...data },
    mode: "all",
  });
  
  return (
    <FormComponent action={undefined} className="accordion-item-container">
      <div className="grid-form-2-container standar-type-container" >
          <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>Tipo de causal estandar para la devolucion por condicion que se debe configurar en la tabla causales</p>

          <InputComponentOriginal
            idInput="cause_of_return_x_condition"
            typeInput="number"
            className="input-basic background-textArea"
            register={register}
            label="CAUSAL_DEVOLUCION_X_CONDICION"
            classNameLabel="text-black big text-required fs-md-2"
            direction={EDirection.column}
            errors={errors}
            onChange={(e) => onChange({ ...data, cause_of_return_x_condition: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
          />
      </div>


    </FormComponent>
  );
}

