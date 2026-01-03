import express from "express"
import { Auth } from "../controllers/Auth/index.js";
import { verifyJWT } from "../middleware/Auth.js";
import { Project } from '../controllers/Project/index.js'
import { upload } from "../middleware/multerForFrontend.middleware.js";
import { virusScanning } from "../middleware/viruScanning.middleware.js";
import { updateUserDetails } from "../controllers/user/index.js";

const router = express.Router();


// auth routes
router.post('/auth/register/init', Auth.register.init);
router.post('/auth/register/verify', Auth.register.verify);
router.post('/auth/login', Auth.Login)


// project route
router.route('/project').post(verifyJWT, Project.core.createProject).delete(verifyJWT, Project.core.deleteProject)
router.route('/project/:projectId/upload').post(verifyJWT,
    (req, res, next) => {
        upload.single("file")(req, res, function (err) {
            if (err) {
                console.error("Upload error:", err);
                return res.status(err.statusCode || 400).json({
                    message: err.message || "Upload failed",
                });
            }
            next();
        });
    },
    virusScanning,
    Project.file.uplaodFile
)
router.route("/:filename").delete(verifyJWT , Project.file.delete)


// user routes for update user details
router.post("/password" , verifyJWT , updateUserDetails.password)

export default router