import { Model } from "../../../../models/index.js"
import { deleteFromMinio } from "../../../../utils/deleteFileFromMinio.js";


export const deleteFile = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const filename = req.params.filename;
        const user = req.user;

        const project = await Model.Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                message: "Invalid ProjectId"
            })
        }

        if (project.userid !== user._id) {
            return res.status(400).json({
                message: "invalid Request"
            })
        }

        const file = await Model.File.findOne({ filename });
        if (!file) {
            return res.status(404).json({
                message: "Invalid filename"
            })
        }

        const size = file.size;

        await Model.User.updateOne(
            {
                _id: user._id
            },
            {
                $inc: {
                    storageUsed: -size,
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
                    requestsUsed: 1,
                    storageUsed: -size,
                },
            }
        );

        await deleteFromMinio(`${projectId}/${filename}`);

        return res.status(200).json({
            message: "Delete Success"
        })

    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}