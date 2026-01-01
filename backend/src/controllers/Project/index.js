import { createProject } from "./slice/core/createProject.js";
import {deleteProject} from './slice/core/deleteProject.controller.js'
import { uplaodFile } from "./slice/file/upload.controller.js";

export const Project = {
    core: {
        createProject: createProject,
        deleteProject: deleteProject
    },
    file: {
        uplaodFile: uplaodFile
    }
}