import { Worker } from "bullmq";
import { Model } from "../../models/index.js"
import { connection } from "../../utils/connection.js";


const worker = new Worker("accountdelete", async (job) => {
    try {
        const { userId } = job.data;

        const isProject = await Model.Project.find({ userid: userId });
        if (isProject.length > 0) {

            for (const project of isProject) {
                const isApiKey = await Model.Apikey.find({ projectid: project._id });
                if (isApiKey.length > 0) {
                    await Model.Apikey.deleteMany({ projectid: project._id })
                }

                const files = await Model.File.find({ projectid: project._id })
                if (files.length > 0) {
                    for (const file of files) {

                        const filename = file.filename;
                        const bucket = file.serveFrom

                        await deleteFromMinio(`${project._id}/${filename}`, bucket === "main" ? process.env.MAIN_BUCKET : process.env.TEMP_BUCKET)
                        await Model.File.findByIdAndDelete(file._id)
                    }
                }

                const isDomain = await Model.Domain.findOne({ projectid: project._id });
                if (isDomain) {
                    await Model.Domain.deleteOne({ projectid: project._id })
                }

                await Model.Project.findByIdAndDelete(project._id);
            }

        }

        const user = await Model.User.findById(userId)
        await Model.DeleteUserAccountModel.create({
            userId: userId,
            email: user?.email
        })

        await Model.User.findByIdAndDelete(userId)
    } catch (error) {
        throw error
    }
}, { connection })

worker.on("completed", async (job) => {
    console.log("all data Deleated of user", job.data.userId)
})