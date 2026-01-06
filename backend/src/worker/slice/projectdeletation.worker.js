import { Worker } from "bullmq";
import { Model } from '../../models/index.js'
import { deleteFromMinio } from "../../utils/deleteFileFromMinio.js";
import { connection } from "../../utils/connection.js";


const worker = new Worker("projectDeleteQueue", async (job) => {
    try {
        const { projectId } = job.data;

        const isProject = await Model.Project.findById(projectId);
        if (isProject) {

            isApiKey = await Model.Apikey.find({ projectid: projectId });
            if (isApiKey.length > 0) {
                await Model.Apikey.deleteMany({ projectid: projectId })
            }

            const files = await Model.File.find({ projectid: projectId })
            if (files.length > 0) {
                for (const file of files) {

                    const filename = file.filename;
                    const bucket = file.serveFrom

                    await deleteFromMinio(`${projectId}/${filename}`, bucket === "main" ? process.env.MAIN_BUCKET : process.env.TEMPBUCKET)
                    await Model.File.findByIdAndDelete(file._id)
                }
            }

            const isDomain = await Model.Domain.find({ projectid: projectId });
            if (isDomain) {
                await Model.Domain.deleteOne({ projectid: projectId })
            }

            await Model.Project.findByIdAndDelete(projectId);

        }



    } catch (error) {
        throw error
    }
}, { connection })

worker.on("completed", async (job) => {
    console.log("all files delete of ", "project", job.data.projectId)
})