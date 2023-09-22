import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AccordionsComponent from "../../../common/components/accordions.component";
import ConsecutiveNumberFormComponent from "../components/consecutive-number-form.component";
import { AppContext } from "../../../common/contexts/app.context";
import { generalConfigurationValidator } from "../../../common/schemas";
import { useGeneralConfigurationService } from "../hooks/general-configuration-service.hook";
import { EResponseCodes } from "../../../common/constants/api.enum";

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
                console.log(response.data);
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
            console.log(err);
            setDisabled(true);
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
                <h2 className="text-black biggest bold" style={{ fontSize: 29, fontFamily: 'Rubik' }}>Configuración General</h2>
                <AccordionsComponent
                    data={[
                        { id: 1, name: "ALARMAS", content: (<></>), disabled: true },
                        { id: 2, name: "HORA_LABORAL", content: (<></>), disabled: true },
                        { id: 3, name: "NUM_CONSEC", content: (<ConsecutiveNumberFormComponent onChange={onChange} data={data} />), disabled: false },
                        { id: 4, name: "INICIAR_SIN_IMAGEN", content: (<></>), disabled: true },
                        { id: 5, name: "NOTIFICACIONES", content: (<></>), disabled: true },
                        { id: 6, name: "PROCESOPDF", content: (<></>), disabled: true },
                        { id: 7, name: "PROCESO_RANGO_IP", content: (<></>), disabled: true },
                        { id: 8, name: "PROCESOZIP", content: (<></>), disabled: true },
                        { id: 9, name: "RANGOTEMPORAL", content: (<></>), disabled: true },
                        { id: 10, name: "RADICADOTEMP_NORMAS", content: (<></>), disabled: true },
                        { id: 11, name: "TIPO_ESTANDAR", content: (<></>), disabled: true },
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