import express from "express"
import { Auth } from "../controllers/Auth/index.js";

const router = express.Router();

router.post('/auth/register/init' , Auth.register.init);
router.post('/auth/register/verify' , Auth.register.verify);

export default router