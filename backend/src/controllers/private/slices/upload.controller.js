import { uploadFilesOnMinio } from "../../../utils/uploadOnMinio.js";
import { Model } from "../../../models/index.js";
import fs from "fs";
import sharp from "sharp";
import path from "path"

export const uplaodFile = async (req, res) => {
    try {
        const project = req.project;
        const user = req.user;

        if (req.file.size > project.maxfilesize) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "max file size! please check your project setting"
            });
        }

        const originalBuffer = await fs.promises.readFile(req.file.path);


        const sizes = [
            { name: "thumb", width: 320, quality: 70 },
            { name: "medium", width: 800, quality: 75 },
            { name: "large", width: 1600, quality: 80 },
            { name: "xl", width: 2000, quality: 82 }
        ];

        const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

        const ext = path.extname(req.file.filename);

        const variants = await Promise.all(sizes.map(async (s) => {
            const buffer = await sharp(originalBuffer)
                .resize({ width: s.width, withoutEnlargement: true })
                .webp({ quality: s.quality })
                .toBuffer();

            return {
                name: s.name,
                buffer,
                filename: `${req.file.filename.split(".")[0]}_${s.name}.${ext}`,
                size: buffer.length
            };
        }));

        const totalSize = variants.reduce((acc, v) => acc + v.size, 0);

        const isAllowed = await Model.Project.findOne({
            _id: project._id,
            userid: user._id,
            $expr: {
                $lte: [
                    { $add: ["$storageUsed", "$storageProcessing", totalSize] },
                    "$projectstoragelimit"
                ]
            }
        });

        const isAlloweds = await Model.User.findOne({
            _id: user._id,
            $expr: {
                $lte: [{ $add: ["$storageUsed", totalSize] }, "$maxStorage"]
            }
        });

        if (!isAlloweds || !isAllowed) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: "quota exceeded" });
        }

        for (const v of variants) {
            await uploadFilesOnMinio(
                project._id.toString(),
                v.filename,
                v.buffer,
                "image/webp",
                process.env.MAIN_BUCKET
            );
        }

        await Model.File.insertMany(
            variants.map(v => ({
                originalfilename: req.file.originalname,
                type: "image",
                filename: v.filename,
                size: v.size,
                projectid: project._id,
                owner: user._id,
                serveFrom: "main",
                publicUrl: `${protocol}://${req.get("host")}/public/${project._id}/${v.filename}`,
                fDeleteUr: `${protocol}://${req.get("host")}/api/v2/user/file/${v.filename}`,
                deleteUrl: `${protocol}://${req.get("host")}/api/v1/devload/file/${v.filename}`,
                downloadeUrl: `${protocol}://${req.get("host")}/api/v2/file/${v.filename}`,
                underProcessing: false
            }))
        );
        await fs.promises.unlink(req.file.path);


        await Model.Project.updateOne(
            { userid: user._id, _id: project._id },
            { $inc: { totalUploads: 1, requestsUsed: 1, storageUsed: totalSize } }
        );


        await Model.User.updateOne(
            {
                _id: user._id,
                storageUsed: { $lte: user.maxStorage - totalSize },
                requestsUsed: { $lt: user.maxRequests },
            },
            { $inc: { storageUsed: totalSize, requestsUsed: 1 } }
        );

        const urls = variants.map(v => ({
            type: "image",
            filename: v.filename,
            size: v.name,
            publicUrl: `${protocol}://${req.get("host")}/public/${project._id}/${v.filename}`,
            deleteUrl: `${protocol}://${req.get("host")}/api/v1/devload/file/${v.filename}`,
            downloadeUrl: `${protocol}://${req.get("host")}/api/v2/file/${v.filename}`
        }))

        res.status(200).json({
            urls
        });
    } catch (error) {
        console.log(error);
        fs.unlinkSync(req?.file?.path ?? "");
        return res.status(500).json({ error: "Internal server Error" });
    }
};