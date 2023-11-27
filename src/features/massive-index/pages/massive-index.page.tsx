import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./massive-style.module.scss";
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';


import { Tooltip } from "primereact/tooltip";
import { ButtonComponent } from "../../../common/components/Form";
import axios from "axios";
import { AppContext } from "../../../common/contexts/app.context";
import { trashIcon } from "../../../common/components/icons/trash";
import { imagesicon } from "../../../common/components/icons/images";
import { clip } from "../../../common/components/icons/clip";
import useBreadCrumb from "../../../common/hooks/bread-crumb.hook";
import { uploadIcon } from "../../../common/components/icons/upload";

export default React.memo(() => {
  const [files, setFiles] = useState<File[]>([]);
  const { setMessage } = useContext(AppContext);
  const inputRef = useRef<HTMLInputElement>(null);
  const classes = `${styles.container} spc-common-table expansible card-table massive-index`;
  const classesUpload = `${styles.fileMassive} files`;
  const { authorization } = useContext(AppContext);
  useBreadCrumb({ isPrimaryPage: true, name: "Indexación masiva", url: "/gestion-documental/radicacion/indexacion-masiva" });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files as FileList).filter(
      (file) => file.type === "application/pdf"
    );
    setFiles([...files, ...newFiles]);
  };

  const handleFileRemove = (file: File) => {
    const updatedFiles = files.filter((f) => f !== file);
    setFiles(updatedFiles);

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemoveAll = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    try {
      if (files.length === 0) {
        alert("No hay archivos para subir.");
        return;
      }

      const apiUrl = `${process.env.urlApiDocumentManagement}/api/v1/document-management/radicado-details/massiveIndexing`;

      const promises = files.map(async (file) => {
        try {
          const formData = new FormData();
          formData.append('files', file);

          const response = await axios.post(apiUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              permissions: authorization.encryptedAccess,
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          console.log(`Archivo ${file.name} cargado con éxito. Respuesta de la API:`, response.data);

          return { file, success: true };
        } catch (error) {
          setMessage({
            title: "Error",
            description: `El número de radicado ${file.name} no se encuentra, por favor verifique`,
            show: true,
            background: true,
            okTitle: "Aceptar",
            onOk: () => {
              setMessage({});
            }
          });
          console.error(`Error al cargar el archivo: ${file.name}`, error);
          return { file, success: false };
        }
      });

      const results = await Promise.all(promises);

      const uploadedFiles = results.filter(result => result.success).map(result => result.file.name);

      if (uploadedFiles.length > 0) {
        setMessage({
          title: "Carga exitosa",
          description: `Los siguientes archivos se cargaron con éxito: ${uploadedFiles.join(", ")}`,
          show: true,
          background: true,
          okTitle: "Aceptar",
          onOk: () => {
            setMessage({});
          }
        });
      }

      setFiles([]); // Limpiar los archivos después de la carga
    } catch (error) {

      console.error('Error al cargar archivos:', error);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    setFiles([...files, ...newFiles]);
  };

  const handleClick = () => {
    const inputField = document.querySelector(".input-field") as HTMLInputElement;
    inputField.click();

    const event = {
      target: {
        files: inputField.files,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    handleFileSelect(event);
  };

  return (

    <>
      <div className={classes} style={{ marginTop: 20, borderRadius: 20, width: '100%' }}>
        <div className="spc-common-table expansible card-table" style={{ marginTop: 20, borderRadius: 29, width: '100%' }}>

          <h2 className="biggest bold" style={{ fontSize: 29, fontFamily: 'Rubik', color: 'black' }}>Indexación Masiva</h2>

          <div className="card-table" style={{ marginTop: 20, borderRadius: 29, width: '100%' }}>

            <h2 className="biggest bold" style={{ fontSize: 24, fontFamily: 'Rubik', color: 'black' }}>Carga de archivos</h2>

            <Tooltip target=".custom-choose-btn" content="Adjuntar" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Subir" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Eliminar" position="bottom" />


            <div className={classesUpload}
              style={{ border: 'solid 1px #dee2e6', width: ' 100%', maxWidth: '1280px', height: '430px', borderRadius: '6px' }}>
              <div className="headerMassive" style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', gap: '0.5rem', borderBottom: '1px solid #dee2e6' }}>

                <span className="custom-choose-btn" style={{ background: 'none', border: '1px solid #533893', borderRadius: '50%', height: '3rem', width: '3rem', padding: '0.75rem 0', marginRight: '0.5rem', cursor: 'pointer' }} onClick={handleClick}>
                  <input className='input-field file-input' type="file" hidden accept="application/pdf" multiple ref={inputRef} onChange={handleFileSelect} /><span style={{ display: 'flex', justifyContent: 'center', paddingTop: '3px' }}>{(clip)}</span>
                </span>

                <button className="custom-upload-btn upload-button" style={{ background: 'none', border: '1px solid #22c55e', borderRadius: '50%', height: '3rem', width: '3rem', padding: '0.75rem 0', marginRight: '0.5rem', cursor: 'pointer' }} onClick={handleUpload} disabled={files.length === 0}>{(uploadIcon)}</button>
                <button className="custom-cancel-btn remove-all-button" style={{ background: 'none', border: '1px solid #ef4444', borderRadius: '50%', height: '3rem', width: '3rem', padding: '0.75rem 0', marginRight: '0.5rem', cursor: 'pointer' }} onClick={handleRemoveAll} disabled={files.length === 0}>{(trashIcon)}</button>
              </div>
              <div className="file-uploader" onDragOver={handleDragOver} onDrop={handleDrop}>
                {files.length > 0 && (

                  <div className="itemFile" style={{ padding: '1rem 3rem' }}>
                    <div className="flex align-items-center flex-wrap">
                      <ul className="file-list" style={{height: '300px', overflowY: 'auto', width: '100%'}}>
                        {files.map((file, index) => (
                          <li key={index} className="file-item" style={{display:'flex', alignItems: 'center',justifyContent: 'space-between', marginBottom: '5%'}}>
                            <div className="flex align-items-center" style={{width: '160px'}}>
                              <span className="flex flex-column text-left ml-3 file-name" style={{ fontSize: '17px', color: 'color: #495057 !important' }}>
                                {file.name}
                                <small><small>{new Date().toLocaleDateString()}</small></small>
                              </span>
                            </div>
                            <span className="file-tag" style={{ background: '#533893', fontWeight: 'normal', fontSize: '14px', width: '150px', height: '30px', color: '#fff',display: 'flex', alignItems: 'center',justifyContent: 'center', borderRadius: '6px' }}>{Math.round(file.size / 1024)} KB</span>
                            <Button type="button" icon={(trashIcon)} className="remove-button p-button-outlined p-button-rounded p-button-danger ml-auto" style={{marginRight: '5%'}} onClick={() => handleFileRemove(file)} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                {files.length === 0 && <div className="flex align-items-center flex-column justify-center" style={{height:'339px'}}>
                  <span style={{ fontSize: "1.2em", color: "var(--text-color-secondary)", display: 'flex', alignItems: 'center', justifyContent: 'center', height: '339px'}} className="flex-column">
                    <i style={{ display: 'flex', justifyContent: 'center', marginTop: '3% !important' }}>{imagesicon}</i>
                    <p className={styles.txtDrop}>Arrastra y suelta los archivos aquí</p>
                  </span>
                </div>}
              </div>
            </div>
          </div>

          <div className={styles.btnBack} style={{display: 'flex', justifyContent: 'flex-end', marginTop: '4%'}}>
            <ButtonComponent
              className="button-main huge hover-three"
              value="Volver a la bandeja"
              type="route"
              url={"/gestion-documental/radicacion/bandeja-radicado"}
            />
          </div>
        </div>
      </div>
    </>
  );
});
