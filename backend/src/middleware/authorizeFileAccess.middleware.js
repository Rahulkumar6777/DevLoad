import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { Model} from '../models/index.js'

const memberLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 400,
  message: "Request bhaut zyada ho gaya",
  keyGenerator: ipKeyGenerator,
});

const freeLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 150,
  message: "Request bhaut zyada ho gaya",
  keyGenerator: ipKeyGenerator,
});

const authorizeFileAccess = async (req, res, next) => {
    try {
        const { filename } = req.params;

        if (!filename) {
            return res.status(400).json({
                message: "filename missing"
            })
        }

        const file = await Model.File.findOne({ filename }).populate('owner').populate("projectid");
        if (!file) {
            return res.status(400).json({ message: "file not exist" });
        }
        
        if(file.status === 'deleted'){
            return res.status(400).json({ message: "file deleted" });
        }

        const user = file.owner?.status;
        const limit = user === 'member' ? memberLimit : freeLimit;
        return limit(req, res, () => {
            req.file = file;
            next();
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "error While Server Your File" });
    }
};

export { authorizeFileAccess };