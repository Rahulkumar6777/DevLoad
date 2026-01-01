import express from "express"
import { Auth } from "../controllers/Auth/index.js";
import { verifyJWT } from "../middleware/Auth.js";
import { Project} from '../controllers/Project/index.js'

const router = express.Router();


// auth routes
router.post('/auth/register/init' , Auth.register.init);
router.post('/auth/register/verify' , Auth.register.verify);
router.post('/auth/login' , Auth.Login)


// project route
//router.route('/project').post(verifyJWT , Project.core.createProject)

export default router