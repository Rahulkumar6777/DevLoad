import { PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../configs/s3client.js";


export const uploadFilesOnMinio = async (
    projectId,
    filename,
    filepath,
    contentType,
    bucketName
) => {
    try {
        const client = s3client();
        const uploadOnMinio = new PutObjectCommand({
            Bucket: bucketName,
            Key: `${projectId}/${filename}`,
            Body: filepath,
            ContentType: contentType,
        });

        try {
            await client.send(uploadOnMinio);

        } catch (error) {
            console.log(error)
            throw new Error(`failed to upload on minio: ${error.message}`);
        }
    } catch (error) {
        console.log(error)
        throw new Error("upload error", error);
    }
};


export const getFileInfo = async (key) => {
    try {
        const client = s3client()
        const command = new HeadObjectCommand({ Bucket: process.env.MAIN_BUCKET, Key: key });
        const response = await client.send(command);

        return response;
    } catch (error) {
        console.log(error)
        throw new Error(`failed to upload on minio: ${error.message}`);
    }
}