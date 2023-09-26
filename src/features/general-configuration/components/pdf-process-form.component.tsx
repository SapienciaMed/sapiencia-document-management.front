import React from "react";
import { FormComponent, InputComponent, SelectComponent } from "../../../common/components/Form";
import { EDirection } from "../../../common/constants/input.enum";
import { useForm } from "react-hook-form";
import { IGeneralConfiguration, } from "../interfaces/GeneralConfigurationInterfaces";
import copyIcon from "../../../public/images/icons/copy.png";

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


  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
  }
  
  return (
    <FormComponent action={undefined} className="accordion-item-container">
      <div className="grid-form-4-container" style={{ padding: '20px 10px'}}>
        <div className="d-flex align-items-center">
          <p className="color-black" style={{  fontSize: 17,  fontWeight: 400, maxWidth: 220 }}>Ruta donde se encuentra instalado PDFCreator, se usa cuando se genera Pdf por impresora</p>
        </div>

        <div className="d-flex align-items-center">
          <InputComponent
            idInput="route_creator_path"
            typeInput="text"
            className="input-basic background-textArea without-border without-bold"
            register={register}
            label="RUTAPDFCreator"
            classNameLabel="text-black big"
            direction={EDirection.column}
            errors={errors}
            disabled
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
            classNameLabel="text-black big"
            direction={EDirection.column}
            errors={errors}
            disabled
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

