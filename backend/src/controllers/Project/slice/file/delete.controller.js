import { Model } from "../../../../models/index.js"
import { deleteFromMinio } from "../../../../utils/deleteFileFromMinio.js";
import { makeQueue } from "../../../../utils/makeQueue.js";
import { connection } from '../../../../utils/connection.js'


export const deleteFile = async (req, res) => {
    try {
        const filename = req.params.filename;
        const user = req.user;

        const file = await Model.File.findOne({ filename }).populate("projectid")
        if (!file) {
            return res.status(404).json({
                message: "Invalid filename"
            })
        }

        const project = file.projectid._id;
        const owner = file.owner;

        if (project.isActive === "softdelete") {
            return res.status(400).json({
                message: "Project is Scheduled for deletation"
            })
        }

        if (owner.toString() !== user._id.toString()) {
            return res.status(400).json({
                message: "invalid Request"
            })
        }

        if (file.status === 'deleted') {
            return res.status(400).json({
                message: "file Already Deleated"
            })
        }

        if (file.underProcessing === true) {

            await Model.File.updateOne({
                filename
            },
                {
                    status: "deleted"
                }
            )
            const filedeleteQueue = makeQueue('temp-video-delete')
            const tempCleanupAt = process.env.NODE_ENV === "production" ? Date.now() + 3 * 60 * 60 * 1000 : Date.now() + 3 * 60 * 1000

            await filedeleteQueue.add(
                "temp-video-delete",
                {
                    projectId: project,
                    filename,
                    bucket: "main"
                },
                {
                    delay: tempCleanupAt - Date.now(),
                    removeOnComplete: true
                }
            );
        }

        if (file.underProcessing === false) {

            const size = file.size;

            await Model.User.updateOne(
                { _id: user._id },
                [
                    {
                        $set: {
                            requestsUsed: { $add: ["$requestsUsed", 1] },
                            storageUsed: {
                                $max: [{ $subtract: ["$storageUsed", size] }, 0]
                            }
                        }
                    }
                ]
            );

            await Model.Project.updateOne(
                { userid: user._id, _id: project._id },
                [
                    {
                        $set: {
                            requestsUsed: { $add: ["$requestsUsed", 1] },
                            storageUsed: {
                                $max: [{ $subtract: ["$storageUsed", size] }, 0]
                            }
                        }
                    }
                ]
            );

            await deleteFromMinio(`${project}/${filename}`, process.env.MAIN_BUCKET);
            await Model.File.deleteOne({ filename });
        }

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