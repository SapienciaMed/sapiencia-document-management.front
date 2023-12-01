import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from 'primereact/button';
import { Tooltip } from "primereact/tooltip";
import { clip } from "../../../../common/components/icons/clip";
import { uploadIcon } from "../../../../common/components/icons/upload";
import { trashIcon } from "../../../../common/components/icons/trash";
import { imagesicon } from "../../../../common/components/icons/images";
import "./MassiveFileUploader.css";
import { AppContext } from "../../../../common/contexts/app.context";


const MassiveFileUploader = ({
    handleUpload,
    messageFileIndex,
    setHideModalIndex,
    setMessageFileIndex,
}) => {
    const [files, setFiles] = useState<File[]>([]);
    const [hideMessage, setHideMessage] = useState<any>(messageFileIndex);
    //const { setMessage } = useContext(AppContext);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setMessage } = useContext(AppContext);
    //const classes = `${styles.container} spc-common-table expansible card-table massive-index`;
    //const classesUpload = `${styles.fileMassive} files`;

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(event.target.files as FileList);

        const uniqueNewFiles = newFiles.filter(newFile =>
            !files.some(existingFile => existingFile.name === newFile.name)
        );
    
        setFiles([...files, ...uniqueNewFiles]);
    };

    useEffect(() => {
        if (messageFileIndex) {
            setHideMessage(true);
        }
    }, [messageFileIndex]);

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

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const newFiles = Array.from(event.dataTransfer.files);
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

    const handleAccepted = () => {
        setHideMessage(false);
        setHideModalIndex(false);
        setFiles([]); 
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
                            <input className="input-field file-input" type="file" hidden  multiple ref={inputRef} onChange={handleFileSelect} onClick={() => setHideMessage(false)} />
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
                    {hideMessage && <div className="modalMessageOk">
                        <div className="containerMessageOk">
                            <div>
                                <button className="closeMessage" onClick={() => { setHideMessage(false); }}>X</button>
                            </div>
                            <span className="titleMessage">Archivo adjunto</span>
                            <p className="textMessage">Archivo adjuntado exitosamente</p>
                            <button className="buttonMessageOk" onClick={() => { setHideMessage(false); setHideModalIndex(false); setMessageFileIndex(false); }}>Aceptar</button>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    );
};
export default MassiveFileUploader;