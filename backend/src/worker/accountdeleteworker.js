import { Worker } from "bullmq";
import { Model } from "../models/index.js"


const worker = new Worker("accountdelete", async (job) => {
    try {
        const { userId } = job.data;

        await Model.Project.deleteMany({ userid: userId });
        await Model.Apikey.deleteMany({userid: userId});
        await Model.User.findByIdAndDelete(userId)

        const files = await Model.File.find({ owner: userId })
        if (files) {
            for (const file of files) {

                const filename = file.filename;
                const bucket = file.serveFrom
                const projectId = file.projectid

                await deleteFromMinio(`${projectId}/${filename}`, bucket === "main" ? process.env.MAIN_BUCKET : process.env.TEMPBUCKET)
                await Model.File.findByIdAndDelete(file._id)
            }
        }
    } catch (error) {
        throw error
    }
})

worker.on("completed" , async (job) => {
    console.log("all data Deleated of user" , job.data.userId)
})