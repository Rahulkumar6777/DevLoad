import { uploadFilesOnMinio } from "../../../../utils/uploadOnMinio.js"
import { makeQueue } from "../../../../utils/makeQueue.js";
import { Model } from "../../../../models/index.js";
import path from 'path'


export const uplaodFile = async (req, res) => {
    try {
        const project = req.project;
        const user = req.user;


        const sizeInBytes = req.file.size;
        const filesizeinmb = Math.floor(sizeInBytes / (1024 * 1024));

        await uploadFilesOnMinio(project._id, req.file.filename, req?.file.filepath);


        const fileType = req.file.mimetype.startsWith('image/') ? 'image' : req.file.mimetype.startsWith('video/') ? 'video' : req.file.mimetype.startsWith('audio/') ? 'audio' : 'document';


        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

        const publicUrl = `${protocol}://${req.get(`host`)}/public/${project._id}/${req.file.filename}`
        const deleteUrl = `${protocol}://${req.get('host')}/api/v2/devload/file/${req.file.filename}`;
        const fDeleteUr = `${protocol}://${req.get('host')}/api/v2/user/${req.file.filename}`
        const downloadeUrl = `${protocol}://${req.get('host')}/api/v2/file${req.file.filename}`;

        const newfile = new Model.File({
            originalfilename: req.file.originalname,
            type: fileType,
            filename: req.file.filename,
            size: filesizeinmb,
            publicUrl: publicUrl,
            downloadeUrl: downloadeUrl,
            fDeleteUr: fDeleteUr,
            deleteUrl: deleteUrl,
            projectid: project._id,
            owner: user._id,
        })

        const isAllowed = await Model.Project.findOne({
            userid: user._id,
            projectid: project._id,
            storageUsed: { $lte: project.projectstoragelimit - filesizeinmb },
        });


        if (!isAllowed) {
            fs.unlinkSync(req.file.path)
            return res.status(400).json({
                message: "your proeject storage quota excessed or filesize limit"
            })
        }

        const updateresult = await Model.User.updateOne(
            {
                _id: user._id,
                storageUsed: { $lte: user.maxStorage - filesizeinmb },
                requestsUsed: { $lt: user.maxRequests }
            },
            {
                $inc: {
                    storageUsed: +filesizeinmb,
                    requestsUsed: +1
                }
            }
        )

        if (updateresult.modifiedCount === 0) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({
                message: "Uploade Blocked: storage or request quota excessed"
            })
        }

        await Model.Project.updateOne(
            {
                userid: user._id,
                projectid: project._id,
            },
            { $inc: { totalUploads: +1, requestsUsed: +1, storageUsed: +filesizeinmb } }
        );




        await newfile.save()

        await user.save({ validateBeforeSave: false })
        await savefile.save()
        await project.save()

        res.status(200).json({
            fileid: savefile._id,
            filename: originalfilename,
            filesize: `${filesizeinmb}MB`,
            filetype: savefile.type,
            publicurl: publicUrl,
            downloadeurl: downloadeUrl,
            deleteurl: fDeleteUr,
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}