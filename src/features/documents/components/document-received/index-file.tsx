import React, { useContext, useRef } from "react";
import { Button } from 'primereact/button';
import { Tooltip } from "primereact/tooltip";
import { clip } from "../../../../common/components/icons/clip";
import { uploadIcon } from "../../../../common/components/icons/upload";
import { trashIcon } from "../../../../common/components/icons/trash";
import { imagesicon } from "../../../../common/components/icons/images";
import "./MassiveFileUploader.css";


const MassiveFileUploader = ({
  files,
  handleFileSelect,
  handleFileRemove,
  handleRemoveAll,
  handleUpload,
  handleDragOver,
  handleDrop,
  inputRef,
}) => {

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
          <div className="spc-common-table expansible card-table massive-index">
            <div className="spc-common-table expansible card-table">
              <h2 className="biggest bold">Indexación Masiva</h2>
    
              <div className="card-table">
                <h2 className="biggest bold">Carga de archivos</h2>
    
                <Tooltip target=".custom-choose-btn" content="Adjuntar" position="bottom" />
                <Tooltip target=".custom-upload-btn" content="Subir" position="bottom" />
                <Tooltip target=".custom-cancel-btn" content="Eliminar" position="bottom" />
    
                <div className="files">
                  <div className="headerMassive">
                    <span className="custom-choose-btn" onClick={handleClick}>
                      <input className="input-field file-input" type="file" hidden accept="application/pdf" multiple ref={inputRef} onChange={handleFileSelect} />
                      <span>{clip}</span>
                    </span>
                    <button className="custom-upload-btn upload-button" onClick={handleUpload} disabled={files.length === 0}>{uploadIcon}</button>
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
                                  <span className="ml-3">{file.name}</span>
                                  <small>{new Date().toLocaleDateString()}</small>
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
                        <span style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }} className="flex-column">
                          <i>{imagesicon}</i>
                          <p className="txtDrop">Arrastra y suelta los archivos aquí</p>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </>
      );
    };
export default MassiveFileUploader;
