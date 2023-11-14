import React, { useContext, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Tooltip } from "primereact/tooltip";
import { clip } from "../../../../common/components/icons/clip";
import { uploadIcon } from "../../../../common/components/icons/upload";
import { trashIcon } from "../../../../common/components/icons/trash";
import { imagesicon } from "../../../../common/components/icons/images";
import "./MassiveFileUploader.css";


const MassiveFileUploader = ({
    handleUpload,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    //const { setMessage } = useContext(AppContext);
    const inputRef = useRef<HTMLInputElement>(null);
    //const classes = `${styles.container} spc-common-table expansible card-table massive-index`;
    //const classesUpload = `${styles.fileMassive} files`;

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

    /*const handleUpload = async () => {
      try {
        if (files.length === 0) {
          alert("No hay archivos para subir.");
          return;
        }
  
        const apiUrl = 'https://sapiencia-document-management-api-ukyunq2uxa-uc.a.run.app/api/v1/document-management/radicado-details/massiveIndexing';
  
        const promises = files.map(async (file) => {
          try {
            const formData = new FormData();
            formData.append('files', file);
  
            const response = await axios.post(apiUrl, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
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
    };*/

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
            <div className="card-table file-container">

                <Tooltip target=".custom-choose-btn" content="Adjuntar" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Subir" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Eliminar" position="bottom" />

                <div className="files">
                    <div className="headerMassive">
                        <span className="custom-choose-btn" onClick={handleClick}>
                            <input className="input-field file-input" type="file" hidden accept="application/pdf" multiple ref={inputRef} onChange={handleFileSelect} />
                            <span className="clip-ico">{clip}</span>
                        </span>
                        <button className="custom-upload-btn upload-button" onClick={() => handleUpload(files[0])} disabled={files.length === 0}>{uploadIcon}</button>
                        <button className="custom-cancel-btn remove-all-button" onClick={handleRemoveAll} disabled={files.length === 0}>{trashIcon}</button>
                    </div>
                    <div className="file-uploader" onDragOver={handleDragOver} onDrop={handleDrop}>
                        {files.length > 0 && (
                            <div className="itemFile">
                                <div className="flex align-items-center flex-wrap">
                                    <ul className="file-list">
                                        {files.map((file, index) => (
                                            <li key={index} className="file-item">
                                                <div className="flex align-items-center file-name">
                                                    <span className="name-file-date">{file.name}
                                                    <small>{new Date().toLocaleDateString()}</small>
                                                    </span>
                                                </div>
                                                <span className="file-tag">{Math.round(file.size / 1024)} KB</span>
                                                <button type="button" className="remove-button p-button-outlined p-button-rounded p-button-danger" onClick={() => handleFileRemove(file)}>{trashIcon}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {files.length === 0 && (
                            <div className="flex align-items-center flex-column justify-center">
                                <span className="flex-column files-zone">
                                    <i>{imagesicon}</i>
                                    <p className="txtDrop">Arrastra y suelta los archivos aquí</p>
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};
export default MassiveFileUploader;
