import { s3client } from "../../configs/s3client.js";
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Worker } from 'bullmq'
import { connection } from "../../utils/connection.js";


export const deleteFromMinio = async (key) => {
    try {
        const client = s3client();

        const cmd = new DeleteObjectCommand({
            Bucket: "temp",
            Key: key,
        });

        await client.send(cmd);
        console.log("Deleted successfully:", key);
        return true;
    } catch (err) {
        console.error("Delete failed:", err.message);
        throw new Error(err.message);
    }
};


const worker = new Worker("temp-video-delete", async (job) => {
    try {
        const { projectId, filename } = job.data;
        await deleteFromMinio(`${projectId}/${filename}`);

    } catch (error) {
        console.error("Delete failed:", error.message);
        throw new Error(error.message);
    }
}, { connection })


worker.on("complete", async () => {
    console.log("file deleted")
})