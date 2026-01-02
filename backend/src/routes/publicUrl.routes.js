import express from "express"
import { authorizeFileAccess } from "../middleware/authorizeFileAccess.middleware.js";
import { Project } from '../controllers/Project/index.js'


const router = express.Router();

router.get('/:projectid/:filename' , (req, res, next) => {
    next();
} , authorizeFileAccess, Project.file.get)

export default router