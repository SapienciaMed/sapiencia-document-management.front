import React, { useContext, useEffect, useState, useRef } from "react";
import { Controller, useForm } from "react-hook-form";

import useCrudService from "../../../common/hooks/crud-service.hook";

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


  return (
    <div className="w-100 custom-mw massive-index" style={{ marginLeft: 'auto', marginRight: 'auto', overflowX: "hidden", paddingBottom: 40 }}>
      <div className="spc-common-table expansible card-table" style={{ marginTop: 20, borderRadius: 20, width: '100%' }}>
            index
      </div>
    </div>
  )
});