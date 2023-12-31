import React from "react";
import { FormComponent, InputComponent, InputComponentOriginal } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from "react-hook-form";
import { IConsecutiveNumberForm, } from "../interfaces/GeneralConfigurationInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { consecutiveNumberValidator } from "../../../common/schemas/general-configuration-schemas";


interface IProps {
  onChange: (data: any) => void,
  data: IConsecutiveNumberForm|{}
}

export default ({ onChange, data }: IProps): React.JSX.Element => {
  const resolver = useYupValidationResolver(consecutiveNumberValidator);
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
      <div className="grid-form-3-container" style={{ padding: '20px 10px'}}>
        <div>
            <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo de los Anexos de los Documentos</p>
            <InputComponentOriginal
                idInput="anexo"
                typeInput="number"
                className="input-basic background-textArea"
                register={register}
                label="ANEXO"
                classNameLabel="text-black big text-required"
                direction={EDirection.column}
                errors={errors}
                onChange={(e) => onChange({ ...data, anexo: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
            />
        </div>
        <div>
          <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo de las cartas</p>
          <InputComponentOriginal
              idInput="letter"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="CARTA"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, letter: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
          />
        </div>

        <div>
          <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo del número de Expediente</p>
          <InputComponentOriginal
              idInput="expedient"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="EXPENDIENTE"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, expedient: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="grid-form-3-container" style={{ padding: '20px 10px'}}>
        <div>
            <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo del Radicado de los documentos Externos</p>
            <InputComponentOriginal
                idInput="external"
                typeInput="number"
                className="input-basic background-textArea"
                register={register}
                label="EXTERNO"
                classNameLabel="text-black big text-required"
                direction={EDirection.column}
                errors={errors}
                onChange={(e) => onChange({ ...data, external: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
            />
        </div>
        <div>
          <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo del Radicado de los documentos Internos</p>
          <InputComponentOriginal
              idInput="internal"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="INTERNO"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, internal: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
          />
        </div>

        <div>
          <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo del Radicado de los documentos no Radicables</p>
          <InputComponentOriginal
              idInput="radiable_number"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="NO_RADICABLE"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, radiable_number: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="grid-form-3-container" style={{ padding: '20px 10px'}}>
        <div>
            <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo del Radicado de los No Radicables desde el expediente</p>
            <InputComponentOriginal
                idInput="filed_number_exped"
                typeInput="number"
                className="input-basic background-textArea"
                register={register}
                label="NO_RADICABLE_EXPENDIENTE"
                classNameLabel="text-black big text-required"
                direction={EDirection.column}
                errors={errors}
                onChange={(e) => onChange({ ...data, filed_number_exped: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
             />
        </div>
        <div>
          <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo del Radicado de los documentos Recibidos</p>
          <InputComponentOriginal
              idInput="received"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="RECIBIDO"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, received: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
          />
        </div>

        <div>
          <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que comienza el consecutivo de las series documentes del inventario</p>
          <InputComponentOriginal
              idInput="series"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="SERIE"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, series: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="grid-form-3-container" style={{ padding: '20px 10px'}}>
        <div>
            <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que se comienza el ingreso del Registro de Inventario Documental</p>
            <InputComponentOriginal
                idInput="inventory_record"
                typeInput="number"
                className="input-basic background-textArea"
                register={register}
                label="REGINVENTARIO"
                classNameLabel="text-black big text-required"
                direction={EDirection.column}
                errors={errors}
                onChange={(e) => onChange({ ...data, inventory_record: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
             />
        </div>
        <div>
          <p className="color-black" style={{ minHeight: 70, fontSize: 17 }}>Número con el que se comienza el ingreso de los Documentos del Registro de Inventario Documental</p>
          <InputComponentOriginal
              idInput="inventory_record_detail"
              typeInput="number"
              className="input-basic background-textArea"
              register={register}
              label="DETALLEREGINVENTARIO"
              classNameLabel="text-black big text-required"
              direction={EDirection.column}
              errors={errors}
              onChange={(e) => onChange({ ...data, inventory_record_detail: Number(e.target.value) == 0 ? null : Number(e.target.value) })}
           />
        </div>
      </div>
    </FormComponent>
  );
}

