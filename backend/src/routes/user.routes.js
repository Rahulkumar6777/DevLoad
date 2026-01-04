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
router.route("/:filename").delete(verifyJWT, Project.file.delete)
router.get("/projects", verifyJWT, Project.getProjectdata.allProject);

// user routes for update user details
router.post("/password", verifyJWT, updateUserDetails.password)
router.post("/email", verifyJWT, updateUserDetails.email)
router.post("/fullname", verifyJWT, updateUserDetails.updatefullname)


// Project API keys
router.post("/project/:projectid/api-keys", verifyJWT, Project.apiKey.createApiKey);
router.delete("/project/:projectid/api-keys", verifyJWT, Project.apiKey.deleteApiKey);
router.get("/project/:projectid/api-keys", verifyJWT, Project.apiKey.getApiKey);
router.post("/project/:projectid/api-keys/rotate", verifyJWT, Project.apiKey.updateApiKey);


// Project settings
router.put("/projects/:projectid/settings/name", verifyJWT, Project.settings.rename)
router.put("/projects/:projectid/settings/description", verifyJWT, Project.settings.updateDescription)
router.put("/projects/:projectid/settings/filetype", verifyJWT, Project.settings.FileType);
router.put("/projects/:projectid/settings/storage", verifyJWT, Project.settings.ProjectStorage);
router.post("/projects/:projectId/domain", verifyJWT, Project.domain.addDomain); 
router.delete("/projects/:projectId/domain", verifyJWT, Project.domain.deleteDomain); 

export default router;