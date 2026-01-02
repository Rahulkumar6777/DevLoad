import { Model } from "../../../../models/index.js"
import { deleteFromMinio } from "../../../../utils/deleteFileFromMinio.js";
import { makeQueue } from "../../../../utils/makeQueue.js";


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

        if (file.underProcessing === true) {
            const filedeleteQueue = new makeQueue('temp-video-delete', { connection })
            const tempCleanupAt = process.env.NODE_ENV === "production" ? Date.now() + 60 * 60 * 1000 : Date.now() + 6 * 60 * 1000

            await filedeleteQueue.add(
                "temp-video-delete",
                {
                    projectId: project,
                    filename,
                    bucket: "main"
                },
                {
                    delay: tempCleanupAt - Date.now(),
                    removeOnComplete: true,
                    removeOnFail: false,
                }
            );
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

        await deleteFromMinio(`${project}/${filename}`, process.env.MAIN_BUCKET);

        await Model.File.deleteOne({ filename });


        return res.status(200).json({
            message: "Delete Success"
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}