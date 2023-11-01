import React, { useContext, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Rating } from 'primereact/rating';
import { FileUpload } from 'primereact/fileupload';
import styles from "./massive-style.module.scss";
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import 'primeicons/primeicons.css';

import { ProgressSpinner } from 'primereact/progressspinner';
        

import useCrudService from "../../../common/hooks/crud-service.hook";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { Tooltip } from "primereact/tooltip";
import { ButtonComponent } from "../../../common/components/Form";
import axios from "axios";
import { AppContext } from "../../../common/contexts/app.context";


export default React.memo(() => {
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
    mode: "all",
  });

  const { setMessage } = useContext(AppContext);
  const [documents, setdocuments] = useState([]);
  const [totalUpload, setTotalUpload] = useState<number[]>([]);
  console.log("Total Upload",totalUpload)

  const ondocumentsChange = (e) => {
    let _documents = [...documents];
    console.log("documentos",documents)
    if (e.checked)
      _documents.push(e.value);
    else
      _documents.splice(_documents.indexOf(e.value), 1);

    setdocuments(_documents);
  }

  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const [fileUpload, setfileUpload] = useState<any[]>([]);
  const fileUploadRef = useRef(null);
  
  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;
    let fileDoc = fileUpload;
    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
      console.log(files[key])
      fileDoc.push(files[key])
    });
    setfileUpload(fileDoc)
    setTotalSize(_totalSize);
  };
  console.log("archivo file",fileUpload)

  const [loading, setLoading] = useState(false)

  const onTemplateUpload = async (e) => {
    console.log("entré")
    try {
      const apiUrl = 'https://sapiencia-document-management-api-ukyunq2uxa-uc.a.run.app/api/v1/document-management/radicado-details/massiveIndexing';
      
      const promises = fileUpload.map(async (file) => {
        setLoading(true)
        console.log("archivo234", file)
        try {
          const formData = new FormData();
          formData.append('uploadedFile', file); // Asegúrate de que 'pdfFile' coincida con el nombre esperado por la API
  
          const response = await axios.post(apiUrl, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Establece el tipo de contenido adecuado
            },
          });
          setfileUpload([]);
          setTotalSize(0);
          
          // La respuesta de la API estará en response.data
          setMessage({
            title: "Carga exitosa",
            description: "Cargue realizado con éxito",
            show: true,
            background: true,
            okTitle: "Aceptar",
            onOk: () => {
                setMessage({});
            }
        })
          console.log(`Archivo ${file.name} cargado con éxito. Respuesta de la API:`, response.data);
          
          setLoading(false)
          return { file, success: true };
        } catch (error) {
          setMessage({
            title: "Error",
            description: `El numero de radicado ${file.name}: no se encuentra, por favor verifique`,
            show: true,
            background: true,
            okTitle: "Aceptar",
            onOk: () => {
                setMessage({});
            }
          })
          console.error(`Error al cargar el archivo ${file.name}:`, error);
          return { file, success: false };
        }
      });
  
      const results = await Promise.all(promises);
  
      // Puedes utilizar la información de 'results' para manejar los resultados de la carga, por ejemplo, mostrar mensajes de éxito o error.
    } catch (error) {
      console.error('Error al cargar archivos:', error);
    }
  };

  const [count, setcount] = useState<number>(0)
  console.log("contador",count)

  const onTemplateRemove = (file, callback) => {
    let newCount;
    if (count === 0){
      newCount = fileUpload.length;
    }else{
      newCount = count
    }
    console.log("nuevo",newCount)
    let nuevoCount = newCount-1
    console.log("cont2",nuevoCount)
    setcount(nuevoCount)
    const fileIndexToRemove = fileUpload.findIndex((item) => item.id === file.id);
    console.log("file index", fileIndexToRemove);
    
    if (fileIndexToRemove !== -1) {
      const arrayUpdate = [...fileUpload];
      //arrayUpdate.splice(fileIndexToRemove, 1); // Elimina el archivo por su índice
      arrayUpdate.pop()
      //setcount(arrayUpdate.length)
      console.log("Array actualizado", arrayUpdate);
      console.log("sisa", file.size);
      
      setTotalSize(totalSize - file.size);
     //setfileUpload([...arrayUpdate]); // Actualiza el estado con el nuevo array
      callback();
    }
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };
  console.log("total size", totalSize)

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        {<div className="flex align-items-center gap-3 ml-auto">
                  {/* <span>{formatedValue} / 1 MB</span>
                  <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar> */}
                  
              </div> }
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          {/* <img alt={file.name} role="presentation" src={file.objectURL} width={100} /> */}
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} style={{ background: '#533893', fontWeight: 'normal', fontSize: '14px' }} className="" />
        <Button type="button" icon={(<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1207 18.375H6.87571C5.95959 18.375 5.19834 17.668 5.13009 16.7536L4.34521 6.125H16.625L15.8663 16.7493C15.8007 17.6654 15.0386 18.375 14.1207 18.375V18.375Z" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M10.5 9.625V14.875" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M3.5 6.125H17.5" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M14.875 6.125L13.9886 3.76075C13.7323 3.07737 13.0795 2.625 12.3497 2.625H8.65025C7.9205 2.625 7.26775 3.07737 7.01138 3.76075L6.125 6.125" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M13.5012 9.625L13.125 14.875" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M7.49876 9.625L7.87501 14.875" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        )} className="p-button-outlined p-button-rounded p-button-danger ml-auto" style={{ marginLeft: '20px' }} onClick={() => onTemplateRemove(file, props.onRemove)} />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column justify-center">
        <span style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }} className="flex-column">
          <i style={{ display: 'flex', justifyContent: 'center' }}>{<svg width="147" height="147" viewBox="0 0 147 147" fill="none" xmlns="http://www.w3.org/2000/svg" >
            <rect width="147" height="147" fill="url(#pattern0)" />
            <defs>
              <pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use href="#image0_1427_13220" transform="translate(-0.0482234) scale(0.00507614)" />
              </pattern>
              <image id="image0_1427_13220" width="216" height="197" href="data:image/png;base64,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" />
            </defs>
          </svg>}</i>
          <p className={styles.txtDrop}>Arrastra y suelta los archivos aquí</p>
        </span>
      </div>
    );
  };


  const chooseOptions = {
    icon: (<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.56744 16.8758C4.14637 16.8813 2.77623 16.347 1.73411 15.3808C1.2266 14.9116 0.821644 14.3424 0.544686 13.7091C0.267728 13.0758 0.124756 12.392 0.124756 11.7008C0.124756 11.0096 0.267728 10.3259 0.544686 9.69257C0.821644 9.05927 1.2266 8.4901 1.73411 8.02083L8.97911 1.17833C9.72424 0.498174 10.6967 0.121086 11.7056 0.121086C12.7144 0.121086 13.6869 0.498174 14.432 1.17833C14.8205 1.53899 15.132 1.97453 15.3478 2.45874C15.5635 2.94294 15.6791 3.4658 15.6874 3.99583C15.6901 4.45388 15.5977 4.90751 15.4163 5.32811C15.2349 5.74871 14.9683 6.12715 14.6333 6.43958L7.37869 13.2917C6.94094 13.6978 6.36585 13.9235 5.76869 13.9235C5.17153 13.9235 4.59644 13.6978 4.15869 13.2917C3.94147 13.0915 3.7681 12.8485 3.64952 12.578C3.53093 12.3075 3.46971 12.0154 3.46971 11.72C3.46971 11.4246 3.53093 11.1325 3.64952 10.862C3.7681 10.5915 3.94147 10.3485 4.15869 10.1483L10.867 3.83291C11.0018 3.69831 11.1845 3.62271 11.3749 3.62271C11.5654 3.62271 11.7481 3.69831 11.8829 3.83291C12.0175 3.96768 12.0931 4.15036 12.0931 4.34083C12.0931 4.5313 12.0175 4.71398 11.8829 4.84875L5.17452 11.1642C5.09928 11.2298 5.03897 11.3108 4.99765 11.4018C4.95632 11.4927 4.93494 11.5914 4.93494 11.6912C4.93494 11.7911 4.95632 11.8898 4.99765 11.9807C5.03897 12.0716 5.09928 12.1527 5.17452 12.2183C5.34811 12.3668 5.56902 12.4484 5.79744 12.4484C6.02586 12.4484 6.24677 12.3668 6.42036 12.2183L13.6749 5.38541C13.8595 5.20452 14.0056 4.98817 14.1044 4.74937C14.2032 4.51057 14.2527 4.25425 14.2499 3.99583C14.242 3.66274 14.1666 3.33473 14.0282 3.03164C13.8898 2.72855 13.6914 2.45668 13.4449 2.2325C12.9719 1.79401 12.3506 1.55039 11.7056 1.55039C11.0605 1.55039 10.4393 1.79401 9.96619 2.2325L2.74994 9.06541C2.3845 9.40029 2.0927 9.80751 1.89307 10.2612C1.69345 10.7149 1.59036 11.2052 1.59036 11.7008C1.59036 12.1965 1.69345 12.6868 1.89307 13.1405C2.0927 13.5941 2.3845 14.0014 2.74994 14.3362C3.53051 15.0638 4.55789 15.4683 5.62494 15.4683C6.69199 15.4683 7.71937 15.0638 8.49994 14.3362L15.6779 7.54166C15.7439 7.47385 15.8229 7.41996 15.9101 7.38316C15.9974 7.34637 16.0911 7.32741 16.1858 7.32741C16.2805 7.32741 16.3742 7.34637 16.4614 7.38316C16.5486 7.41996 16.6276 7.47385 16.6937 7.54166C16.8283 7.67643 16.9039 7.85911 16.9039 8.04958C16.9039 8.24005 16.8283 8.42273 16.6937 8.5575L9.45827 15.3808C8.4022 16.3615 7.0085 16.8971 5.56744 16.8758Z" fill="#533893" />
    </svg>
    ), iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined'
  };
  const uploadOptions = {
    icon: (
      <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M14.7513 13.5638C14.5524 13.5638 14.3616 13.4847 14.221 13.3441C14.0803 13.2034 14.0013 13.0127 14.0013 12.8138C14.0013 12.6148 14.0803 12.4241 14.221 12.2834C14.3616 12.1428 14.5524 12.0638 14.7513 12.0638C16.4113 12.0638 17.0013 11.2338 17.0013 8.88375C16.9291 8.04604 16.5635 7.26072 15.9689 6.66617C15.3744 6.07163 14.589 5.70601 13.7513 5.63375C13.4108 5.6424 13.0735 5.7031 12.7513 5.81375C12.654 5.85444 12.5492 5.87386 12.4438 5.87073C12.3384 5.86759 12.2349 5.84197 12.1402 5.79557C12.0455 5.74917 11.9618 5.68307 11.8947 5.6017C11.8277 5.52033 11.7788 5.42556 11.7513 5.32375C11.3707 4.1346 10.5788 3.12002 9.51765 2.46209C8.4565 1.80416 7.1956 1.54595 5.96124 1.73382C4.72689 1.92168 3.5999 2.54331 2.78252 3.48714C1.96515 4.43098 1.51091 5.63522 1.50133 6.88375C1.50133 10.3238 2.26133 12.0638 3.75133 12.0638C3.95024 12.0638 4.141 12.1428 4.28166 12.2834C4.42231 12.4241 4.50133 12.6148 4.50133 12.8138C4.50133 13.0127 4.42231 13.2034 4.28166 13.3441C4.141 13.4847 3.95024 13.5638 3.75133 13.5638C1.25133 13.5638 0.00132606 11.3138 0.00132606 6.88375C-0.029911 5.30751 0.491578 3.77005 1.47533 2.53808C2.45908 1.30611 3.84304 0.457349 5.38712 0.139031C6.93121 -0.179288 8.538 0.0529171 9.92879 0.795367C11.3196 1.53782 12.4066 2.74367 13.0013 4.20375C13.2653 4.15608 13.5331 4.13265 13.8013 4.13375C15.0363 4.20952 16.201 4.73429 17.0759 5.6092C17.9508 6.48411 18.4756 7.64876 18.5513 8.88375C18.5013 10.1638 18.5013 13.5638 14.7513 13.5638Z"
          fill="#34ca6b"
        />
        <path
          d="M12.0817 10.9638C11.8833 10.9615 11.6934 10.8826 11.5517 10.7438L9.25172 8.44376L6.95172 10.7438C6.80955 10.8762 6.6215 10.9484 6.4272 10.9449C6.2329 10.9415 6.04751 10.8628 5.9101 10.7254C5.77269 10.588 5.69397 10.4026 5.69055 10.2083C5.68712 10.014 5.75924 9.82593 5.89172 9.68376L8.72172 6.85376C8.79067 6.783 8.87308 6.72677 8.96411 6.68837C9.05514 6.64997 9.15293 6.63019 9.25172 6.63019C9.35052 6.63019 9.44831 6.64997 9.53933 6.68837C9.63036 6.72677 9.71278 6.783 9.78172 6.85376L12.6117 9.68376C12.7522 9.82438 12.8311 10.015 12.8311 10.2138C12.8311 10.4125 12.7522 10.6031 12.6117 10.7438C12.4689 10.8809 12.2797 10.9594 12.0817 10.9638Z"
          fill="#34ca6b"
        />
        <path
          d="M9.25098 14.4937C9.05206 14.4937 8.8613 14.4147 8.72065 14.2741C8.57999 14.1334 8.50098 13.9426 8.50098 13.7437V7.38373C8.50098 7.18482 8.57999 6.99405 8.72065 6.8534C8.8613 6.71275 9.05206 6.63373 9.25098 6.63373C9.44989 6.63373 9.64065 6.71275 9.78131 6.8534C9.92196 6.99405 10.001 7.18482 10.001 7.38373V13.7437C10.001 13.9426 9.92196 14.1334 9.78131 14.2741C9.64065 14.4147 9.44989 14.4937 9.25098 14.4937Z"
          fill="#34ca6b"
        />
      </svg>
    ),
    iconOnly: true,
    className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined", onClick: onTemplateUpload
  };
  const cancelOptions = {
    icon: (<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M14.1207 18.375H6.87571C5.95959 18.375 5.19834 17.668 5.13009 16.7536L4.34521 6.125H16.625L15.8663 16.7493C15.8007 17.6654 15.0386 18.375 14.1207 18.375V18.375Z" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M10.5 9.625V14.875" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M3.5 6.125H17.5" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M14.875 6.125L13.9886 3.76075C13.7323 3.07737 13.0795 2.625 12.3497 2.625H8.65025C7.9205 2.625 7.26775 3.07737 7.01138 3.76075L6.125 6.125" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M13.5012 9.625L13.125 14.875" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M7.49876 9.625L7.87501 14.875" stroke="#FF0000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    ), iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'
  };
  
  const classes = `${styles.container} spc-common-table expansible card-table massive-index`
  

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

            {loading && <div className={styles.spinner}>
            <ProgressSpinner />
            </div>}
            <FileUpload ref={fileUploadRef} name="demo[]" url="/api/upload" multiple accept="image/*" maxFileSize={1000000}
              onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
              headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
              chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />

            <div>
              <p>Total archivos subidos: {count}</p> <button onClick={onTemplateUpload}>enviar</button>
            </div>
          </div>
          
          <div className={styles.btnBack}>
            <ButtonComponent
              className="button-main huge hover-three"
              value="Volver a la bandeja"
              type="button"
              action={null}
            />
          </div>
        </div>
      </div>
    </>
  )
});