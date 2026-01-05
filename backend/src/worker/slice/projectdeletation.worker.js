import { Worker } from "bullmq";
import { Model } from '../../models/index.js'
import { deleteFromMinio } from "../../utils/deleteFileFromMinio.js";
import { connection } from "../../utils/connection.js";


const worker = new Worker("projectDeleteQueue", async (job) => {
    try {
        const { projectId } = job.data;

        const files = await Model.File.find({ projectid: projectId })
        if (files.length > 0) {
            for (const file of files) {

                const filename = file.filename;
                const bucket = file.serveFrom

                await deleteFromMinio(`${projectId}/${filename}`, bucket === "main" ? process.env.MAIN_BUCKET : process.env.TEMPBUCKET)
                await Model.File.findByIdAndDelete(file._id)
            }
        }

        await Model.Project.findByIdAndDelete(projectId);
        await Model.Apikey.deleteMany({ projectid: projectId })
        
    } catch (error) {
        throw error
    }
}, { connection })

worker.on("completed", async (job) => {
    console.log("all files delete of ", "project", job.data.projectId)
})