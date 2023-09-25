import React from "react";
import { FormComponent } from "../../../common/components/Form";
import { useForm } from "react-hook-form";
import { IGeneralConfiguration } from "../interfaces/GeneralConfigurationInterfaces";


interface IProps {
  onChange: (data: any) => void,
  data: IGeneralConfiguration
}

export default ({ onChange, data }: IProps): React.JSX.Element => {
  const {
    formState: { errors },
  } = useForm<any>({
    mode: "all",
  });
  
  return (
    <FormComponent action={undefined} className="accordion-item-containerw-100">
      <div className="w-100" style={{ padding: '20px 10px'}}>
        <div className="w-100">
            <p className="color-black" style={{ minHeight: 20, fontSize: 17, fontWeight: 400 }}>Indica si administrará direcciones internas y externas para mostrar los archivos</p>
            <div className="d-flex align-items-center space-between w-100">
              
              <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>COMPRIMIR_IMAGEN</p>
             
              <div className="d-flex align-items-center">
                <span style={{ fontSize: 17, fontWeight: 400, font: 'Rubik', marginRight: 7 }}>NO</span>
                <label className="switch">
                    <input checked={data?.compress_image || false} type="checkbox" onChange={(e) => onChange({ ...data, compress_image: e.target.checked })} />
                    <span className="slider"></span>
                </label>
                <span style={{ fontSize: 17, fontWeight: 400, font: 'Rubik', marginLeft: 7 }}>SI</span>
              </div>
            </div>
        </div>
      </div>
    </FormComponent>
  );
}

