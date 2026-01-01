import { createProject } from "./slice/core/createProject.js";
import {deleteProject} from './slice/core/deleteProject.controller.js'

export const Project = {
    core: {
        createProject: createProject,
        deleteProject: deleteProject
    }
}