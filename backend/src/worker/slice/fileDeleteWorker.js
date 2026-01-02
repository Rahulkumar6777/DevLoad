import { Worker } from 'bullmq'
import { connection } from "../../utils/connection.js";
import { deleteFromMinio } from "../../utils/deleteFileFromMinio.js";


const worker = new Worker("temp-video-delete", async (job) => {
    try {
        const { projectId, filename } = job.data;
        await deleteFromMinio(`${projectId}/${filename}` , process.env.TEMP_BUCKET);

    } catch (error) {
        console.error("Delete failed:", error.message);
        throw new Error(error.message);
    }
}, { connection })


worker.on("complete", async () => {
    console.log("file deleted")
})