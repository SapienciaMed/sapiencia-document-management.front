import React from "react";
import { FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from "react-hook-form";
import { IGeneralConfiguration, } from "../interfaces/GeneralConfigurationInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { workingHoursFormValidator } from "../../../common/schemas/general-configuration-schemas";


interface IProps {
  onChange: (data: any) => void,
  data: IGeneralConfiguration
}

export default ({ onChange, data }: IProps): React.JSX.Element => {
  const resolver = useYupValidationResolver(workingHoursFormValidator);
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
      <div className="grid-form-2-container" style={{ padding: '20px 10px'}}>
        <div className="grid-form-3-container ">              
          <div className="d-flex align-items-center">
            <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>Configuración para el manejo de reportes para tomar en cuenta solo los días, horas y minutos hábiles.</p>
          </div>

          <div className="d-flex align-items-center">
            <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>DIAS_HABILES</p>
          </div>
          
          <div className="d-flex align-items-center">
            <label className="switch">
              <input checked={data?.business_days || false} type="checkbox" onChange={(e) => onChange({ ...data, business_days: e.target.checked })} />
              <span className="slider"></span>
            </label>
          </div>
      </div>


        <div className="grid-form-2-container w-100">
          <div className="d-flex align-items-center">
            <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>Indica la hora de inicio del almuerzo en formato 24hs (Horas:minutos)</p>
          </div>

          <div className="d-flex align-items-center">
            <InputComponent
              idInput="lunch_duration"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="DURACION_ALMUERZO"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, lunch_duration : Number(e.target.value) == 0 ? null : Number(e.target.value) })}
            />
          </div>
        </div>

      </div>


      <div className="grid-form-2-container" style={{ padding: '20px 10px'}}>
        <div className="grid-form-2-container">
          <div className="d-flex align-items-center">
            <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>Indica cuánto es el tiempo laboral (Número de Horas)</p>
          </div>

          <div className="d-flex align-items-center">
            <InputComponent
              idInput="time"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="TIEMPO"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, time : Number(e.target.value) == 0 ? null : Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="grid-form-2-container">
          <div className="d-flex align-items-center">
            <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>Indica la duracion del almuerzo en minutos</p>
          </div>

          <div className="d-flex align-items-center">
            <InputComponent
                idInput="lunch_time"
                typeInput="number"
                className="input-basic background-textArea"
                register={register}
                label="HORA_ALMUERZO"
                classNameLabel="text-black big text-required"
                direction={EDirection.column}
                errors={errors}
                onChange={(e) => onChange({ ...data, lunch_time : Number(e.target.value) == 0 ? null : Number(e.target.value) })}
            />
          </div>
        </div>


      </div>
    </FormComponent>
  );
}

