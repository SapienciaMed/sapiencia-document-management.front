import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccordionsComponent from "../../../common/components/accordions.component";
import { AppContext } from "../../../common/contexts/app.context";
import { generalConfigurationValidator } from "../../../common/schemas";
import { useGeneralConfigurationService } from "../hooks/general-configuration-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

import ConsecutiveNumberFormComponent from "../components/consecutive-number-form.component";
import WorkingHoursFormComponent from "../components/working-hours-form.component";
import StandarTypeFormComponent from "../components/standar-type-form.component";
import AlarmFormComponent from "../components/alarm-form.component";
import NotificationsFormComponent from "../components/notifications-form.component";
import ProcessIpRangeFormComponent from "../components/process-ip-range-form.component";
import StartWithoutImageFormComponent from "../components/start-without-image-form.component";
import TemporaryFilingRulesFormComponent  from "../components/temporary-filing-rules-form.component";
import TemporaryFilingRangeFormComponent from "../components/temporary-filing-range-form.component";
import PDFProcessFormComponent from "../components/pdf-process-form.component";
import ZIPProcessFormComponent from "../components/zip-process-form.component";

export default React.memo(() => {
    const navigate = useNavigate();
    const { setMessage } = useContext(AppContext);
    const [data, setData] = useState<any>({});
    const { GetConfigurationById, UpdateGeneralConfiguration } = useGeneralConfigurationService();

    useEffect(() => {
        setDefaultData();
    }, []);

    const setDefaultData = () => {
        GetConfigurationById().then((response => {
            if (response.operation.code === EResponseCodes.OK) {
              setData(response.data);
              onChange(response.data);
            }
        }));
    }

    const [disabled, setDisabled] = useState<boolean>(true)

    const onChange = async (newData: any) => {
        try {
            setDisabled(false);
            setData(newData);
            await generalConfigurationValidator.validate(newData);
        } catch (err) {
            setDisabled(true);
            console.log(err);
        }
    }

    const save = () => {
        UpdateGeneralConfiguration(1, data).then((response => {
            if (response.operation.code === EResponseCodes.OK) {
                setMessage({
                    // title: "Guardar cambios",
                    description: "Edición exitosa",
                    show: true,
                    background: true,
                    okTitle: "Aceptar",
                    onOk: () => {
                        setMessage({});
                    }
                })
            }
        }));
    }

  return (
    <div className="w-100 general-configuration-page ">
        <div className="spc-common-table expansible card-table" style={{ margin: 20 }}>
            <div className="spc-common-table expansible card-table" >
                <h2 className="biggest bold" style={{ fontSize: 29, fontFamily: 'Rubik', color: 'black' }}>Configuración General</h2>
                <AccordionsComponent
                    data={[
                        { id: 1, name: "ALARMAS",  content: (<AlarmFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 2, name: "HORA_LABORAL",  content: (<WorkingHoursFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 3, name: "NUM_CONSEC", content: (<ConsecutiveNumberFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 4, name: "INICIAR_SIN_IMAGEN",  content: (<StartWithoutImageFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 5, name: "NOTIFICACIONES",  content: (<NotificationsFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 6, name: "PROCESOPDF",  content: (<PDFProcessFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 7, name: "PROCESO_RANGO_IP",  content: (<ProcessIpRangeFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 8, name: "PROCESOZIP",  content: (<ZIPProcessFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 9, name: "RADICADOTEMPORAL",  content: (<TemporaryFilingRangeFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 10, name: "RADICADOTEMP_NORMAS",  content: (<TemporaryFilingRulesFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 11, name: "TIPO_ESTANDAR",  content: (<StandarTypeFormComponent onChange={onChange} data={data} />), disabled: false },
                ]} />
            </div>
        </div>

        <div className="w-100" style={{ padding: 20 }}>
            <div className="d-flex container-button-bot space-between">
                <div></div>                
                <div className="">
                    <button style={{ marginRight: 12 }} className="cancel-button" onClick={(() => {
                        setMessage({
                            // title: "Cancelar cambios",
                            description: "¿Desea cancelar la acción? no se guardarán los datos",
                            show: true,
                            background: true,
                            cancelTitle: "Cancelar",
                            okTitle: "Continuar",
                            onCancel: () => {
                                setMessage({ });
                            },
                            onOk: () => {
                                navigate('./../../');
                                setMessage({});
                            }
                        })
                    })}>
                        Cancelar
                    </button>
                    <button
                        className={`save-button ${disabled ? 'save-button-disabled' : 'cursor-pointer save-button-active' }`}
                        value="Guardar"
                        onClick={() => save()}
                        disabled={disabled}
                    >Guardar</button>
                </div>
            </div>
        </div>

    </div>
  )
});