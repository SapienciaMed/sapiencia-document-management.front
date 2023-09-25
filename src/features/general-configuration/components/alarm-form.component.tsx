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
            <p className="color-black" style={{ minHeight: 20, fontSize: 17, fontWeight: 400 }}> Configura si se envían o no correos de C/S mediente la utilidad de web</p>
            <div className="d-flex align-items-center space-between w-100">
              
              <p className="color-black" style={{  fontSize: 17,  fontWeight: 400 }}>ALARMACORREO</p>
             
              <div className="d-flex align-items-center">
                <span style={{ fontSize: 17, fontWeight: 400, font: 'Rubik', marginRight: 7 }}>NO</span>
                <label className="switch">
                    <input checked={data?.email_alarm || false} type="checkbox" onChange={(e) => onChange({ ...data, email_alarm: e.target.checked })} />
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

