import { uploadFilesOnMinio } from "../../../../utils/uploadOnMinio.js"
import { makeQueue } from "../../../../utils/makeQueue.js";
import { Model } from "../../../../models/index.js";
import fs from "fs";
import sharp from "sharp";
import { generateSignedUrl } from "../../../../utils/getSignedUrl.js";


export const uplaodFile = async (req, res) => {
    try {
        const project = req.project;
        const user = req.user;
        let finalBuffer;
        let uploadFilename = req.file.filename;
        let contentType = req.file.mimetype;
        let serveFrom;
        let underProcessing = false
        const isImage = req.file.mimetype.startsWith("image/");
        const isVideo = req.file.mimetype.startsWith("video/");


        if (isImage) {
            const originalBuffer = await fs.promises.readFile(req.file.path);
            finalBuffer = await sharp(originalBuffer)
                .rotate()
                .resize({
                    width: 2000,
                    withoutEnlargement: true,
                })
                .webp({
                    quality: 82,
                    effort: 6,
                    smartSubsample: true,
                })
                .toBuffer();

            uploadFilename =
                req.file.filename.split(".")[0] + ".webp";

            contentType = "image/webp";
        } else {
            finalBuffer = fs.readFileSync(req.file.path);
        }


        const filesizeinmb = Number(
            (finalBuffer.length / (1024 * 1024)).toFixed(2)
        );

        const fileType = isImage ? "image" : isVideo ? "video" : "audio";


        const isAllowed = await Model.Project.findOne({
            userid: user._id,
            _id: project._id,
            storageUsed: {
                $lte: project.projectstoragelimit - filesizeinmb,
            },
        });

        const isAlloweds = await Model.User.findOne({
            _id: user._id,
            storageUsed: {
                $lte: user.maxStorage - filesizeinmb,
            },
        });

        if (!isAlloweds) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message:
                    "your storage quota exceeded",
            });
        }

        if (!isAllowed) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message:
                    "your project storage quota exceeded",
            });
        }


        if (isVideo) {
            if (project.isOptimise && user.subscription === "member") {
                const videoProcessingQueue = makeQueue(
                    "devload-video-processing"
                );

                await uploadFilesOnMinio(
                    project._id.toString(),
                    uploadFilename,
                    finalBuffer,
                    contentType,
                    process.env.TEMP_BUCKET
                );

                const url = await generateSignedUrl(
                    process.env.TEMP_BUCKET,
                    `${project._id}/${uploadFilename}`,
                    process.env.ENDPOINT,
                    process.env.ACCESS_ID,
                    process.env.ACCESS_KEY
                );


                serveFrom = "temp"
                underProcessing= true

                await videoProcessingQueue.add(
                    "devload-video-processing",
                    {
                        url,
                        projectId: project._id,
                        filename: req.file.filename,
                        userFullname: user.fullName,
                        userEmail: user.email,
                        userEmailSendPreference: project.emailSendPreference,
                    }
                );
            }
        } else {

            await uploadFilesOnMinio(
                project._id.toString(),
                req.file.filename,
                finalBuffer,
                contentType,
                process.env.MAIN_BUCKET
            );

            serveFrom = "main"
        }

        await fs.promises.unlink(req.file.path);


        const protocol =
            process.env.NODE_ENV === "production"
                ? "https"
                : "http";

        const publicUrl = `${protocol}://${req.get(
            "host"
        )}/public/${project._id}/${req.file.filename}`;

        const deleteUrl = `${protocol}://${req.get(
            "host"
        )}/api/v2/devload/file/${req.file.filename}`;

        const fDeleteUr = `${protocol}://${req.get(
            "host"
        )}/api/v2/user/file/${req.file.filename}`;

        const downloadeUrl = `${protocol}://${req.get(
            "host"
        )}/api/v2/file/${req.file.filename}`;

        const newfile = new Model.File({
            originalfilename: req.file.originalname,
            type: fileType,
            filename: req.file.filename,
            size: filesizeinmb,
            publicUrl,
            downloadeUrl,
            fDeleteUr,
            deleteUrl,
            projectid: project._id,
            owner: user._id,
            serveFrom,
            underProcessing
        });

        await Model.User.updateOne(
            {
                _id: user._id,
                storageUsed: { $lte: user.maxStorage - filesizeinmb },
                requestsUsed: { $lt: user.maxRequests },
            },
            {
                $inc: {
                    storageUsed: filesizeinmb.toFixed(2),
                    requestsUsed: 1,
                },
            }
        );

        await Model.Project.updateOne(
            {
                userid: user._id,
                _id: project._id,
            },
            {
                $inc: {
                    totalUploads: 1,
                    requestsUsed: 1,
                    storageUsed: filesizeinmb.toFixed(2),
                },
            }
        );

        await newfile.save();

        res.status(200).json({
            success: true,
            fileid: newfile._id,
            filename: newfile.originalfilename,
            storedFilename: uploadFilename,
            filesize: `${filesizeinmb}MB`,
            filetype: newfile.type,
            publicUrl,
            downloadeUrl,
            deleteUrl: fDeleteUr,
        });
    } catch (error) {
        console.log(error);
        fs.unlinkSync(req?.file?.path ?? "");
        return res.status(500).json({
            error: "Internal server Error",
        });
    }
};
