import { CreateApiKey } from "./slice/ApiKeys/CreateApiKey.js";
import { DeleteApiKey } from "./slice/ApiKeys/DeleteApiKey.js";
import { ApiKeys } from "./slice/ApiKeys/GetApiKey.js";
import { RotateApiKey } from "./slice/ApiKeys/RotateApiKey.js";
import { createProject } from "./slice/core/createProject.js";
import {deleteProject} from './slice/core/deleteProject.controller.js'
import { deleteFile } from "./slice/file/delete.controller.js";
import { PublicUrl } from "./slice/file/get.controller.js";
import { uplaodFile } from "./slice/file/upload.controller.js";
import { ProjectStorage } from "./slice/settings/settings/ProjectStorage.js";
import { RenameProject } from "./slice/settings/settings/RenameProject.js";
import { UpdateDescription } from "./slice/settings/settings/UpdateDescription.js";

export const Project = {
    core: {
        createProject: createProject,
        deleteProject: deleteProject
    },
    file: {
        uplaodFile: uplaodFile,
        get: PublicUrl,
        delete: deleteFile
    },
    apiKey: {
        createApiKey: CreateApiKey,
        deleteApiKey: DeleteApiKey,
        getApiKey: ApiKeys,
        updateApiKey: RotateApiKey 
    },
    settings: {
        rename: RenameProject,
        updateDescription: UpdateDescription,
        ProjectStorage: ProjectStorage
    }
}