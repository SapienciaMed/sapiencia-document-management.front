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
    <FormComponent action={undefined} className="accordion-item-container w-100">
      <div className="w-100" style={{ padding: '20px 10px'}}>
        <div className="w-100">
            <p className="color-black" style={{ minHeight: 20, fontSize: 17, fontWeight: 400 }}>Indica si el sistema utiliza radicados temporales para las Normas</p>
            <div className="d-flex space-between w-100 switch-md">
              
              <p className="color-black fs-md">RADICADOTEMPORAL_NORMAS</p>
             
              <div className="d-flex align-items-center">
                <span style={{ fontSize: 17, fontWeight: 400, font: 'Rubik', marginRight: 7 }}>NO</span>
                <label className="switch">
                    <input checked={data?.temporary_filing_rules || false} type="checkbox" onChange={(e) => onChange({ ...data, temporary_filing_rules: e.target.checked })} />
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

