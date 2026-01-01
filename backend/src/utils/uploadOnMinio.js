import { s3client } from "../configs/s3client.js";
import fs from 'fs'


export const uploadFilesOnMinio = async (
    projectId,
    filename,
    filepath,
    contentType
) => {
    try {
        const client = s3client(process.env.ENDPOINT, process.env.ACCESS_ID, process.env.ACCESS_KEY);

        const uploadOnMinio = new PutObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: `${projectId}/${filename}`,
            Body: fs.createReadStream(filepath),
            ContentType: contentType,
        });

        try {
            await client.send(uploadOnMinio);

        } catch (error) {
            throw new Error('failed to uplaod on minio' , error.message);
        }
    } catch (error) {
        throw new Error("upload error", error.message);
    }
};