import React, { useContext, useEffect, useState, useRef } from "react";
import { SpeedDial } from 'primereact/speeddial';
import { Toast } from 'primereact/toast';
import * as Icons from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";
import arrows from "../../public/images/icons/arrows.icon.png";
import firm from "../../public/images/icons/firm.icon.png";
import { AppContext } from "../../common/contexts/app.context";

import moment from 'moment';
// import { useNavigate } from "react-router-dom";
// import AccordionsComponent from "../../../common/components/accordions.component";
// import { AppContext } from "../../../common/contexts/app.context";
// import { generalConfigurationValidator } from "../../../common/schemas";
// import { useGeneralConfigurationService } from "../hooks/general-configuration-service.hook";
// import { EResponseCodes } from "../../../common/constants/api.enum";

import { ButtonComponent, FormComponent, InputComponent, InputComponentOriginal, SelectComponent } from "../../common/components/Form";
import { EDirection } from "../../common/constants/input.enum";
import { Controller, useForm } from "react-hook-form";
import TableExpansibleComponent from "../../common/components/table-expansible.component";
import { Tooltip } from "primereact/tooltip";
// import useYupValidationResolver from "../../../common/hooks/form-validator.hook";
// import { consecutiveNumberValidator } from "../../../common/schemas/general-configuration-schemas";
import useCrudService from "../../common/hooks/crud-service.hook";
import useBreadCrumb from "../../common/hooks/bread-crumb.hook";

export default React.memo(() => {
  useBreadCrumb({ isPrimaryPage: true, name: "Histórico destinatarios", url: "/gestion-documental/consultas/historico-destinatarios" });
  // const resolver = useYupValidationResolver(consecutiveNumberValidator);
  const [search, setSearch] = useState("");
  const { authorization } = useContext(AppContext);
  const [data, setData] = useState<any>([]);
  const [showTable, setShowTable] = useState(false);
  const COLORS = ["", "#FFCC00", "#00CC00", "#CC0000"];

  const baseURL: string = process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
  const { get, post } = useCrudService(baseURL);

  const {
    register,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<any>({
    // resolver,
    mode: "all",
  });

  const searchInDB = async () => {
		const endpoint: string = `/radicado-details/searchByRecipient`;;
    const listAuthActions = authorization.allowedActions;

		const response = await get(
      listAuthActions.includes("ADM_ROL")
        ? `${endpoint}?id-destinatario=${authorization.user.numberDocument}&dias=${getValues('days')}&desde=${getValues('start')}&hasta=${getValues('end')}&role=ADM_ROL`
        : `${endpoint}?id-destinatario=${authorization.user.numberDocument}&dias=${getValues('days')}&desde=${getValues('start')}&hasta=${getValues('end')}`
      
      );

		setData(response.data)
		setShowTable(true)
	}

  const toast = useRef(null);
    const items = [
        {
          template: () => (
            <>
              <Tooltip target=".ver-anexo" />
              <a href="#" role="menuitem" className="p-speeddial-action disabled ver-anexo" data-pr-tooltip="Ver anexo">
                <Icons.FaPaperclip className="button grid-button button-link" style={{ color: 'white' }}/>
              </a>
            </>
          ),
        },
        {
          template: () => (
            <>
              <Tooltip target=".ver-firma" />
              <a href="#" role="menuitem" className="p-speeddial-action disabled ver-firma" data-pr-tooltip="Firma">
                <img className="icons" src={firm} />
              </a>
            </>
          ),
        },
        {
          template: () => (
            <>
              <Tooltip target=".ver-comentarios" />
              <a href="#" role="menuitem" className="p-speeddial-action disabled ver-comentarios" data-pr-tooltip="Ver comentario">
              <Icons.FaComment className="button grid-button button-link" style={{ color: 'white' }}/>
              </a>
            </>
          ),
        },
        {
          template: () => (
            <>
              <Tooltip target=".ver-expediente" />
              <a href="#" role="menuitem" className="p-speeddial-action disabled ver-expediente" data-pr-tooltip="Ver expediente">
              <Icons.FaFile className="button grid-button button-link" style={{ color: 'white' }}/>
              </a>
            </>
          ),
        },
        {
          template: () => (
            <>
              <Tooltip target=".ver-todo" />
              <a href="#" role="menuitem" className="p-speeddial-action disabled ver-todo" data-pr-tooltip="Ver todo">
                <Icons.FaFolderOpen className="button grid-button button-link" style={{ color: 'white' }}/>
              </a>
            </>
          ),
        },
        {
          template: () => (
            <>
              <Tooltip target=".movimientos" />
                <a href="#" role="menuitem" className="p-speeddial-action disabled movimientos" data-pr-tooltip="Movimientos">
                <img className="icons" src={arrows} />
              </a>
            </>
          ),
        },
        {
          template: () => (
            <>
              <Tooltip target=".ver-todo" />
              <a href="#" role="menuitem" className="p-speeddial-action disabled ver-todo" data-pr-tooltip="Ver imagen">
                <Icons.FaImage className="button grid-button button-link" style={{ color: 'white' }}/>
              </a>
            </>
          ),
        }
    ];

  return (
    <div className="w-100 custom-mw recipient-tray-page" style={{ marginLeft: 'auto', marginRight: 'auto', overflowX: "hidden", paddingBottom: 40 }}>
      <div className="spc-common-table expansible card-table" style={{ marginTop: 20, borderRadius: 20, width: '100%' }}>
        <div className="spc-common-table expansible card-table" style={{ borderRadius: 29, paddingBottom: 30 }}>
            <h2 className="biggest bold" style={{ fontSize: 29, fontFamily: 'Rubik', color: 'black', margin: 0, padding: 0 }}>Histórico destinatarios</h2>
            <FormComponent action={undefined} className="accordion-item-container w-100">
              <div className="grid-form-3-container w-100" style={{ padding: '20px 10px', columnGap: 150 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <InputComponentOriginal
                        idInput="days"
                        typeInput="number"
                        className="input-basic background-textArea text-center"
                        register={register}
                        label="Documentos evacuados en los últimos:"
                        classNameLabel="text-black big custom-label"
                        direction={EDirection.column}
                        errors={errors}
                    />
                    <span style={{ marginTop: 45, marginLeft: 15 }} className="custom-label">días</span>
                </div>
                <div style={{ marginTop: 20 }}>
                  <InputComponentOriginal
                      idInput="start"
                      typeInput="date"
                      className="input-basic background-textArea"
                      register={register}
                      label="Desde"
                      classNameLabel="text-black big custom-label"
                      direction={EDirection.column}
                      errors={errors}
                  />
                </div>

                <div style={{ marginTop: 20 }}>
                  <InputComponentOriginal
                      idInput="end"
                      typeInput="date"
                      className="input-basic background-textArea"
                      register={register}
                      label="Hasta"
                      classNameLabel="text-black big custom-label"
                      direction={EDirection.column}
                      errors={errors}
                  />
                </div>
              </div>
              <div className="w-100" style={{ float: "right" }}>
                <div className="d-flex align-items-center">
                  <div style={{ marginRight: 15 }}>
                    <ButtonComponent
                      className="btn-clean"
                      value="Limpiar campos"
                      type="button"
                      action={() => {
                        setValue('days', '')
                        setValue('start', '')
                        setValue('end', '')
                        setData([])
                        setShowTable(false)
                        setSearch('')
                      }}
                      disabled={false}
                    />
                  </div>
                  <ButtonComponent
                    className="button-main hover-three py-12 px-14 font-size-16"
                    value="Buscar"
                    type="button"
                    action={() => { searchInDB(); }}
                  />
                </div>
              </div>

            </FormComponent>
        </div>
        {
          showTable ? (
            <div className="card-table" style={{ marginTop: 25, width: '100%' }}>
          <TableExpansibleComponent
            tableTitle=" "
            renderTitle={() => {
              return (
                <div style={{ marginTop: '-40px'}}>
                  <InputComponentOriginal
                    idInput="search"
                    typeInput="text"
                    className="input-basic background-textArea custom-placeholder"
                    register={register}
                    label="Buscar documentos en la bandeja:"
                    classNameLabel="text-black big custom-label"
                    direction={EDirection.column}
                    placeholder="Buscar"
                    errors={errors}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              )
            }}
            actions={[
              {
                customIcon: () => (
                  <div style={{ height: '100px' }} className="card d-flex align-items-center justify-content-center" >
                    <div style={{ justifyContent: 'center', width: '250px' }} className="">
                        <Toast ref={toast} />
                        <SpeedDial style={{ marginTop: '-30px' }} model={items} radius={80} type="circle" buttonClassName="custom-speed-dial custom-p-button" />
                    </div>
                  </div>
                ),
                icon: '',
                onClick: () => { console.log('click')}
              }
            ]}
            columns={[
              {
                fieldName: "DRA_RADICADO",
                header: "No.Radicado",
                sort: true,
              },
              {
                fieldName: "clase",
                header: "Clase",
                sort: true,
              },
              {
                fieldName: "DRA_TIPO_DOCUMENTO_RADICADO",
                header: "Origen",
                sort: true,
              },
              {
                fieldName: "DRA_FECHA_RADICADO",
                header: "Fecha Radicación",
                renderCell: (row) => {
                  return (
                    <>{moment(row.DRA_FECHA_RADICADO).format('DD/MM/YYYY')}</>
                  )
                },
                sort: true,
              },
              {
                fieldName: "DRA_FECHA_EVACUACION_ENTRADA",
                header: "Fecha Entrada",
                renderCell: (row) => {
                  return (
                    <>{row.DRA_FECHA_EVACUACION_ENTRADA ? moment(row.DRA_FECHA_EVACUACION_ENTRADA).format('DD/MM/YYYY'): ''}</>
                  )
                },
                sort: true,
              },
              {
                fieldName: "DRA_FECHA_EVACUACION_SALIDA",
                header: "Fecha Salida",
                renderCell: (row) => {
                  return (
                    <>{row.DRA_FECHA_EVACUACION_SALIDA ? moment(row.DRA_FECHA_EVACUACION_SALIDA).format('DD/MM/YYYY'): ''}</>
                  )
                },
                sort: true,
              },
              {
                fieldName: "NombresORazonSocial_Remitente",
                header: "Remitente",
                renderCell: (row) => {
                  return (
                    <>{row.NombresORazonSocial_Remitente}</>
                  )
                },
                sort: true,
              },
              {
                fieldName: "NombresORazonSocial_DestinatarioOriginal",
                header: "Destinatario",
                renderCell: (row) => {
                  return (
                    <>{row.NombresORazonSocial_DestinatarioOriginal ? row.NombresORazonSocial_DestinatarioOriginal : row.NombresORazonSocial_DestinatarioCopia}</>
                  )
                },
                sort: true,
              },
              {
                fieldName: "",
                header: "Tipo documento",
                sort: true,
                renderCell: () => {
                  return (<>Solicitud de documentos</>)
                }
              },
              {
                fieldName: "DRA_REFERENCIA",
                header: "Referencia",
                sort: true,
              },
              {
                fieldName: "DRA_RADICADO_ORIGEN",
                header: "Radicado origen",
                sort: true,
              },
              {
                fieldName: "DRA_PRIORIDAD",
                header: "Prioridad",
                sort: true,
                renderCell: (row) => {
                  return (<><IoWarningOutline color={COLORS[row.DRA_PRIORIDAD]} size={50} /></>)
                }
              },
            ]}
            data={data.filter((item) => {
              if (search) {
                for (const key in item) {
                  if (item[key] && item[key].toString().toLowerCase().includes(search.toLowerCase())) {
                    return true;
                  }                  
                }
                return false;
              }

              return true;
            })}
          />
        </div>
          ) : null
        }
      </div>
    </div>
  )
});