import express from "express"
import { Auth } from "../controllers/Auth/index.js";
import { verifyJWT } from "../middleware/Auth.js";
import { Project } from '../controllers/Project/index.js'
import { upload } from "../middleware/multerForFrontend.middleware.js";
import { virusScanning } from "../middleware/viruScanning.middleware.js";
import { updateUserDetails } from "../controllers/user/index.js";
import { Payment } from "../controllers/Payment/index.js";

const router = express.Router();


// auth routes
router.post('/auth/register/init', Auth.register.init);
router.post('/auth/register/verify', Auth.register.verify);
router.post('/auth/login', Auth.Login)
router.get('/auth/refresh-token', Auth.RefreshToken)
router.post('/auth/logout', verifyJWT, Auth.Logout)


// project route
router.route('/project').post(verifyJWT, Project.core.createProject)
router.delete('/project/:projectId', verifyJWT, Project.core.deleteProject)
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
router.route("/file/:filename").delete(verifyJWT, Project.file.delete)
router.get("/project", verifyJWT, Project.getProjectdata.allProject);
router.get("/project/:projectid", verifyJWT, Project.getProjectdata.singleProjectAllData);
router.get('/project/:projectid/analytics', verifyJWT, Project.getProjectdata.analytics)

// user routes for update user details
router.put("/password", verifyJWT, updateUserDetails.password)
router.put("/email", verifyJWT, updateUserDetails.email)
router.put("/fullname", verifyJWT, updateUserDetails.updatefullname)
router.get('/subscription', verifyJWT, updateUserDetails.subsription)
router.get('/bootstrap', verifyJWT, updateUserDetails.BootStrap)
router.delete('/delete', verifyJWT, updateUserDetails.delete)


// Project API keys
router.post("/project/:projectid/api-keys", verifyJWT, Project.apiKey.createApiKey);
router.delete("/project/:projectid/api-keys", verifyJWT, Project.apiKey.deleteApiKey);
router.get("/project/:projectid/api-keys", verifyJWT, Project.apiKey.getApiKey);
router.post("/project/:projectid/api-keys/rotate", verifyJWT, Project.apiKey.updateApiKey);


// Project settings
router.put("/project/:projectid/settings/name", verifyJWT, Project.settings.rename)
router.put("/project/:projectid/settings/description", verifyJWT, Project.settings.updateDescription)
router.put("/project/:projectid/settings/filetype", verifyJWT, Project.settings.FileType);
router.put("/project/:projectid/settings/storage", verifyJWT, Project.settings.ProjectStorage);
router.patch("/project/:projectid/settings/processing", verifyJWT, Project.settings.processing);
router.post("/project/:projectId/domain", verifyJWT, Project.domain.addDomain);
router.delete("/project/:projectId/domain", verifyJWT, Project.domain.deleteDomain);


// paymnet
router.post('/payment' , verifyJWT , Payment.init)
router.post('/payment/verify' , verifyJWT , Payment.verify)
router.get('/payment/renew/info' , verifyJWT , Payment.renewInfo)
router.post('/payment/renew/init' , verifyJWT , Payment.initRenew)
router.post('/payment/renew/verify' , verifyJWT , Payment.verifyRenew)


router.get('/stats' , verifyJWT , updateUserDetails.Stats)


export default router;