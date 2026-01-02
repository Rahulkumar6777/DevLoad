import { s3client } from '../configs/s3client.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3'


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