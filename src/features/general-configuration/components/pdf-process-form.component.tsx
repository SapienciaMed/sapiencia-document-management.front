import React from "react";
import { FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from "react-hook-form";
import { IGeneralConfiguration, } from "../interfaces/GeneralConfigurationInterfaces";
import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
import { pdfProcessFormValidator } from "../../../common/schemas/general-configuration-schemas";
import copyIcon from "../../../public/images/icons/copy.png";

interface IProps {
  onChange: (data: any) => void,
  data: IGeneralConfiguration
}

export default ({ onChange, data }: IProps): React.JSX.Element => {
  const resolver = useYupValidationResolver(pdfProcessFormValidator);
  const {
    register,
    formState: { errors },
  } = useForm<any>({
    resolver,
    defaultValues:{ ...data },
    mode: "all",
  });


  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  }
  
  return (
    <FormComponent action={undefined} className="">
      <div className="grid-form-4-container" style={{ padding: '20px 10px'}}>
        <div className="d-flex align-items-center">
          <p className="color-black" style={{  fontSize: 17,  fontWeight: 400, maxWidth: 220 }}>Ruta donde se encuentra instalado PDFCreator, se usa cuando se genera Pdf por impresora</p>
        </div>

        <div className="d-flex align-items-center">
          <InputComponent
            idInput="route_creator_path"
            typeInput="text"
            className="input-basic background-textArea"
            register={register}
            label="RUTAPDFCreator"
            classNameLabel="text-black big text-required"
            direction={EDirection.column}
            errors={errors}
            onChange={(e) => onChange({ ...data, route_creator_path : e.target.value })}
          />
          <div style={{ position: 'relative'}}>
            <img onClick={() => copy(data.route_creator_path)} style={{ position: 'absolute', marginLeft: '-25px', marginTop: '6px', cursor: 'pointer'  }} width={15} src={copyIcon} />
          </div>
        </div>
        
        <div className="d-flex align-items-center">
          <InputComponent
            idInput="pdf_temporary_path"
            typeInput="text"
            className="input-basic background-textArea"
            register={register}
            label="RUTATEMPPDF"
            classNameLabel="text-black big text-required"
            direction={EDirection.column}
            errors={errors}
            onChange={(e) => onChange({ ...data, pdf_temporary_path : e.target.value })}
          />
          <div style={{ position: 'relative'}}>
            <img onClick={() => copy(data.pdf_temporary_path)} style={{ position: 'absolute', marginLeft: '-25px', marginTop: '6px', cursor: 'pointer'  }} width={15} src={copyIcon} />
          </div>
        </div>
        <div className="d-flex align-items-center">
          <p className="color-black" style={{  fontSize: 17,  fontWeight: 400, maxWidth: 220 }}>Ruta donde se genera el archivo, se usa cuando se genera Pdf por impresora</p>
        </div>
      </div>


    </FormComponent>
  );
}

