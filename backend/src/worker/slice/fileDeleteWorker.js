import { Worker } from 'bullmq'
import { connection } from "../../utils/connection.js";
import { deleteFromMinio } from "../../utils/deleteFileFromMinio.js";


const worker = new Worker("temp-video-delete", async (job) => {
    try {
        const { projectId, filename , bucket} = job.data;
        let bucketName;
        if(bucket === "temp"){
            bucketName = process.env.TEMP_BUCKET
        }
        if(bucket === 'main'){
            bucketName = process.env.MAIN_BUCKET
        }
        await deleteFromMinio(`${projectId}/${filename}` , bucketName);

    } catch (error) {
        console.error("Delete failed:", error.message);
        throw new Error(error.message);
    }
}, { connection ,
    concurrency: 1
})


worker.on("complete", async () => {
    console.log("file deleted")
})