import express from "express"
import { verifyApiKey } from "../middleware/verifyApiKey.js";
import { virusScanning } from "../middleware/viruScanning.middleware.js";
import { Package } from '../controllers/Package/index.js'
import { upload } from "../middleware/multer.middleware.js";
import { Project } from "../controllers/Project/index.js";
import { VerifyDeleteForPackage } from "../middleware/VerifyDeleteForPackage.js";

const router = express.Router();


router.post("/projects/:projectId/upload", verifyApiKey,
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
    Package.upload
)

router.delete("/file/:filename", VerifyDeleteForPackage, Project.file.delete)

export default router