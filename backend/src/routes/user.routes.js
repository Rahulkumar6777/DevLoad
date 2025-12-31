import express from "express"
import { Auth } from "../controllers/Auth/index.js";

const router = express.Router();


// auth routes
router.post('/auth/register/init' , Auth.register.init);
router.post('/auth/register/verify' , Auth.register.verify);
router.post('/auth/login' , Auth.Login)

export default router