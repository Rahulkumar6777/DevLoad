import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import * as crypto from "crypto";
import { Model } from '../models/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url));


const uploadDir = path.resolve(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const user = req.user;
      const projectid = req.params.projectId;
      if (!projectid) {
        return cb(new Error("project  id is required"), false)
      }

      if (user.requestsUsed > user.maxRequests) {
        return cb(new Error("Request Quota reached"))
      }

      const projectexist = await Model.Project.findOne({ _id: projectid, userid: user._id, isActive: 'active' });
      if (!projectexist) {
        return cb(new Error("invalid Project Id"), false)
      }

      const filetypeallowed = projectexist.fileTypeAllowed;

      if (file && file.mimetype) {
        const filetype = file.mimetype.split('/')[0];

        if (!filetypeallowed.includes(filetype)) {
          return cb(new Error(`${filetype} is not allowed! Please Check your Project Setting`), false)
        }
      }
      req.project = projectexist;
      cb(null, uploadDir);

    } catch (error) {
      console.log(error);
      cb(new Error("Failed to resolve file destination"), false);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}${crypto.randomBytes(12).toString("hex")}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024 * 1024,
  },
});

export { upload };