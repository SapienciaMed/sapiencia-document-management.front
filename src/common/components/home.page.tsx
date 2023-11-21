import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TabView, TabPanel } from 'primereact/tabview';
import { ButtonComponent } from "./Form";
import useCrudService from "../../common/hooks/crud-service.hook";
import useBreadCrumb from "../hooks/bread-crumb.hook";
import { AppContext } from "../contexts/app.context";

export default React.memo(() => {
  useBreadCrumb({ isPrimaryPage: true, name: "", url: "" });
  const { validateActionAccess } = useContext(AppContext);

  const baseURL: string = process.env.urlApiDocumentManagement + process.env.projectsUrlSlug;
  const { get } = useCrudService(baseURL);
  const [dataSummaryRecipients, setDataSummaryRecipients] = useState({
    documentos_vencidos_sin_tramitar: 0,
    documentos_en_fase_inicial_de_tramite: 0,
    documentos_a_tramitar_prontamente: 0,
    documentos_proximos_a_vencerse: 0,
    total: 0,
  })

  const [dataSummaryFileds, setDataSummaryFileds] = useState({
    documentos_vencidos_sin_tramitar: 0,
    documentos_en_fase_inicial_de_tramite: 0,
    documentos_a_tramitar_prontamente: 0,
    documentos_proximos_a_vencerse: 0,
    total: 0,
  })

  useEffect(() => {
    if (validateActionAccess('BANDEJA_DESTINATARIOS')) {
      getSummaryRecipients();
    }

    if (validateActionAccess('BANDEJA_RADICADOS')) {
      getSummaryFileds();
    }
  }, [])


  const getSummaryRecipients = async () => {
    const response: any = await get(`/radicado-details/getSummaryRecipients?id-destinatario=${JSON.parse(localStorage.getItem('credentials'))?.numberDocument }`);
    setDataSummaryRecipients(response.data)
  }

  const getSummaryFileds = async () => {
    const response: any = await get('/radicado-details/getSummaryFileds');
    setDataSummaryFileds(response.data)
  }

  let index = -1

  if (validateActionAccess('BANDEJA_RADICADOS')) {
    index = 1
  }

  if (validateActionAccess('BANDEJA_DESTINATARIOS')) {
    index = 0
  }

  return (
    <div className="w-100 home" style={{ maxWidth: 1600, marginLeft: 'auto', marginRight: 'auto' }}>
        <div className="card-table" style={{ margin: 20, borderRadius: 20 }}>
            <div className="" style={{ borderRadius: 29, paddingBottom: 50 }}>
                <h2 className="biggest bold" style={{ fontSize: 29, fontFamily: 'Rubik', color: 'black', marginTop: 0 }}>Resumen documentos pendientes de gestión</h2>

                {
                  index !== -1 && (
                    <TabView activeIndex={index}>
                      {
                        validateActionAccess('BANDEJA_DESTINATARIOS') && (
                          <TabPanel header="Bandeja Destinarios" style={{ margin: 0, padding: 0}}>
                            <div className="grid-form-2-container" style={{ marginTop: 100 }}>
                              <div className="" style={{ padding: '0 7px' }}>
                                <div className="grid-form-4-container card-table" style={{ padding: 15, textAlign: 'center', color: 'white', borderRadius: 29, columnGap: 54 }}>
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#00FF29', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos en fase inicial de tramite:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryRecipients?.documentos_en_fase_inicial_de_tramite || 0}</p>
                                  </div>
    
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#FFF200', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos a tramitar prontamente:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryRecipients?.documentos_a_tramitar_prontamente || 0}</p>
                                  </div>
    
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#FF6B00', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos próximos a vencerse:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryRecipients?.documentos_proximos_a_vencerse || 0}</p>
                                  </div>
    
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#FF0000', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos Vencidos sin tramite:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryRecipients?.documentos_vencidos_sin_tramitar || 0}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="w-100 d-flex jusitfy-content-center align-items-center" style={{ textAlign: 'center', flexDirection: 'column', padding: '0 7px' }}>
                                <div className="card-table" style={{ borderRadius: 29, width: 202, height: 217, padding: '20px 10px', marginBottom: 20, color: 'black' }}>
                                  <p style={{ fontFamily: 'Rubik', fontSize: 25, fontWeight: 500 }}>Total de documentos:</p>
                                  <p style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 40 }}>{
                                  (dataSummaryRecipients?.documentos_en_fase_inicial_de_tramite || 0)
                                  + (dataSummaryRecipients?.documentos_a_tramitar_prontamente || 0)
                                  + (dataSummaryRecipients?.documentos_proximos_a_vencerse || 0)
                                  + (dataSummaryRecipients?.documentos_vencidos_sin_tramitar || 0)
                                  
                                  }</p>
                                </div>
                              
                                
                                <ButtonComponent
                                  className="button-main hover-three py-12 px-14 font-size-16"
                                  value="Ver detalle de bandeja"
                                  type="button"
                                  action={() => { }}
                                />
                              </div>
                            </div>
                          </TabPanel>
                        )
                      }
                      
                      {
                        validateActionAccess('BANDEJA_RADICADOS') && (
                          <TabPanel header="Bandeja Radicados">
                            <div className="grid-form-2-container" style={{ marginTop: 100 }}>
                              <div className="" style={{ padding: '0 7px' }}>
                                <div className="grid-form-4-container card-table" style={{ padding: 15, textAlign: 'center', color: 'white', borderRadius: 29, columnGap: 54 }}>
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#00FF29', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos en fase inicial de tramite:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryFileds?.documentos_en_fase_inicial_de_tramite || 0}</p>
                                  </div>
    
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#FFF200', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos a tramitar prontamente:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryFileds?.documentos_a_tramitar_prontamente || 0}</p>
                                  </div>
    
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#FF6B00', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos próximos a vencerse:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryFileds?.documentos_proximos_a_vencerse || 0}</p>
                                  </div>
    
                                  <div style={{ borderRadius: 20, width: 137, height: 188, backgroundColor: '#533893', padding: 10, margin: 'auto' }}>
                                    <div className="w-100" style={{ width: 18, height: 18, borderRadius: '100%', backgroundColor: '#FF0000', float: 'right' }}></div>
                                    <p style={{ marginTop: 35, fontFamily: 'Rubik', fontSize: 17, fontWeight: 500 }}>Documentos Vencidos sin tramite:</p>
                                    <p className="w-100" style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 25, float: 'inline-end' }}>{dataSummaryFileds?.documentos_vencidos_sin_tramitar || 0}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="w-100 d-flex jusitfy-content-center align-items-center" style={{ textAlign: 'center', flexDirection: 'column', padding: '0 7px' }}>
                                <div className="card-table" style={{ borderRadius: 29, width: 202, height: 217, padding: '20px 10px', marginBottom: 20, color: 'black' }}>
                                  <p style={{ fontFamily: 'Rubik', fontSize: 25, fontWeight: 500 }}>Total de documentos:</p>
                                  <p style={{ fontFamily: 'Rubik', fontWeight: 500, fontSize: 40 }}>{dataSummaryFileds?.total || 0}</p>
                                </div>
                              
                                
                                <ButtonComponent
                                  className="button-main hover-three py-12 px-14 font-size-16"
                                  value="Ver detalle de bandeja"
                                  type="button"
                                  action={() => { }}
                                />
                              </div>
                            </div>
                          </TabPanel>  
                        )
                      }
                                    
                  </TabView>
                  )
                }
               

            </div>
        </div>
    </div>
  )
});