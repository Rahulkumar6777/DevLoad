import express from "express"
import { Private } from "../controllers/private/index.js";
import { privateRoutesVerifier } from "../middleware/privateRoutesVerifier.js";
import { virusScanning } from "../middleware/viruScanning.middleware.js";
import { upload } from "../middleware/multer.middleware.js";


const privateRouter = express.Router();

privateRouter.post('/:projectId', privateRoutesVerifier,

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
    Private.upload)

export default privateRouter;