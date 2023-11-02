import { EResponseCodes } from "../constants/api.enum";
import useCrudService from "./crud-service.hook";
import { ApiResponse, IPagingData } from "../utils/api-response";

export function uploadService(){

    const baseURL: string = process.env.urlApiCitizenAttention;
    const listUrl: string = "/api/v1/document-management";
    const { get, post, upload } = useCrudService(baseURL);

    async function upLoadFile(file) {
        console.log('->>>> ', file);
        
        const formData = new FormData();
        formData.append('files', file);
        try {
          const endpoint: string = `/radicado-details/massiveIndexing`;
          return await upload(`${listUrl}${endpoint}`,  formData );
        } catch (error) {
          return new ApiResponse({} as IPagingData<[] | null>, EResponseCodes.FAIL, "Error no controlado");
        }
      }

    return {
        upLoadFile
    }
}