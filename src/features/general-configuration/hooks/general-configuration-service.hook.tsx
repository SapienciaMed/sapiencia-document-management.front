import useCrudService from "../../../common/hooks/crud-service.hook";
import { ApiResponse } from "../../../common/utils/api-response";
import { IGeneralConfiguration, IGeneralConfigurationTemp } from "../interfaces/GeneralConfigurationInterfaces";

export function useGeneralConfigurationService() {
    const baseURL: string = process.env.urlApiDocumentManagement;
    const projectsUrl: string = "/api/v1/general-configuration";
    const { get, post, put, deleted } = useCrudService(baseURL);

    async function GetConfigurationById(id: number = 1): Promise<ApiResponse<IGeneralConfiguration>> {
        const endpoint: string = `/get-by-id/${id}`;
        return get(`${projectsUrl}${endpoint}`);
    }

    async function CreateProject(data: IGeneralConfigurationTemp): Promise<ApiResponse<IGeneralConfiguration>> {
        const endpoint: string = "/create";
        return post(`${projectsUrl}${endpoint}`, data);
    }

    async function UpdateGeneralConfiguration(
        id: number = 1,
        data: IGeneralConfigurationTemp
    ): Promise<ApiResponse<IGeneralConfiguration>> {
        const endpoint: string = `/update/${id}`;
        return put(`${projectsUrl}${endpoint}`, data);
    }

    async function DeleteProject(id: number): Promise<ApiResponse<IGeneralConfiguration>> {
        const endpoint: string = `/delete/${id}`;
        return deleted(`${projectsUrl}${endpoint}`);
    }

    return { GetConfigurationById, CreateProject, UpdateGeneralConfiguration, DeleteProject }
}