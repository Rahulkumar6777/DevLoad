import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3client } from "../../../../configs/s3client.js";

const PublicUrl = async (req, res) => {
    try {
        const file = req.file;
        const filename = file.filename;
        const projectid = file.projectid._id;
        const serveFrom = file.serveFrom;

        const client = s3client();
        const range = req.headers.range;
        const ext = filename.split(".").pop().toLowerCase();

        // -------- CONTENT TYPE ----------
        let contentType = "application/octet-stream";

        if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
            contentType = "image/webp";
        } else if (ext === "mp4") {
            contentType = "video/mp4";
        } else if (ext === "webm") {
            contentType = "video/webm";
        } else if (ext === "mp3") {
            contentType = "audio/mpeg";
        } else if (ext === "ogg") {
            contentType = "audio/ogg";
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Accept-Ranges", "bytes");
        res.setHeader("Content-Type", contentType);

        const bucket =
            serveFrom === "temp"
                ? process.env.TEMP_BUCKET
                : process.env.MAIN_BUCKET;

        const objectKey = `${projectid}/${filename}`;

        // -------- RANGE REQUEST ----------
        if (range) {
            const command = new GetObjectCommand({
                Bucket: bucket,
                Key: objectKey,
                Range: range,
            });

            const response = await client.send(command);

            res.status(206);

            //  REQUIRED HEADERS FOR VIDEO SEEK
            if (response.ContentRange) {
                res.setHeader("Content-Range", response.ContentRange);
            }
            if (response.ContentLength) {
                res.setHeader("Content-Length", response.ContentLength);
            }

            response.Body.pipe(res);
            return;
        }

        // -------- NORMAL REQUEST ----------
        const command = new GetObjectCommand({
            Bucket: bucket,
            Key: objectKey,
        });

        const response = await client.send(command);

        if (response.ContentLength) {
            res.setHeader("Content-Length", response.ContentLength);
        }

        response.Body.pipe(res);

    } catch (error) {

        
        if (error.name === "NoSuchKey") {
            return res.status(404).json({ message: "File not found" });
        }

        console.error(error);
        res.status(500).json({
            message: "Error while serving file from storage",
        });
    }
};

export { PublicUrl };
