import { Model } from "../../../../models/index.js"
import { deleteFromMinio } from "../../../../utils/deleteFileFromMinio.js";


export const deleteFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const user = req.user;

        const file = await Model.File.findOne({ filename });
        if (!file) {
            return res.status(404).json({
                message: "Invalid filename"
            })
        }

        const project = file.projectid;
        const owner = file.owner;

        if (owner.toString() !== user._id.toString()) {
            return res.status(400).json({
                message: "invalid Request"
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

        await deleteFromMinio(`${projectId}/${filename}`, process.env.MAIN_BUCKET);

        await Model.File.deleteOne({ filename });


        return res.status(200).json({
            message: "Delete Success"
        })

    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}