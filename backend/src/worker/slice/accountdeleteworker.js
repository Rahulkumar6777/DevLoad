import { Worker } from "bullmq";
import { Model } from "../../models/index.js"
import { connection } from "../../utils/connection.js";


const worker = new Worker("accountdelete", async (job) => {
    try {
        const { userId } = job.data;

        const isProject = await Model.Project.find({userid: userId});
        if (isProject.length > 0) {

            const isApiKey = await Model.Apikey.find({ projectid: projectId });
            if (isApiKey.length > 0) {
                await Model.Apikey.deleteMany({ projectid: projectId })
            }

            const files = await Model.File.find({ projectid: projectId })
            if (files.length > 0) {
                for (const file of files) {

                    const filename = file.filename;
                    const bucket = file.serveFrom

                    await deleteFromMinio(`${projectId}/${filename}`, bucket === "main" ? process.env.MAIN_BUCKET : process.env.TEMP_BUCKET)
                    await Model.File.findByIdAndDelete(file._id)
                }
            }

            const isDomain = await Model.Domain.findOne({ projectid: projectId });
            if (isDomain) {
                await Model.Domain.deleteOne({ projectid: projectId })
            }

            await Model.Project.findByIdAndDelete(projectId);

        }
    } catch (error) {
        throw error
    }
}, { connection})

worker.on("completed", async (job) => {
    console.log("all data Deleated of user", job.data.userId)
})