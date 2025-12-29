import fs from "fs";
import path from "path";
import axios from "axios";
import { spawn } from "child_process";
import { configDotenv } from "dotenv";
import { Worker, Job, Queue } from "bullmq";
import { s3client } from "./src/config/s3client.js";
import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import nodemailer from "nodemailer";
import { connection } from "./src/config/connection.js";
import { error } from "console";

configDotenv();

const ffmpegPath = "/usr/bin/ffmpeg";
const outputDir = "output";
const uploadDir = "upload"; 

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const filename = Math.random().toString(36).substring(2, 15);
let inputFile = `${uploadDir}/${filename}`;

const downloadVideo = async (
  bucketName,
  objectKey,
  endpoint,
  accessId,
  accessKey
) => {
  try {
    const client = s3client(endpoint, accessId, accessKey);

    const extension = path.extname(objectKey).toLowerCase();
    inputFile = `${uploadDir}/${filename}${extension}`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const response = await client.send(command);

    const writer = fs.createWriteStream(inputFile);

    await new Promise((resolve, reject) => {
      response.Body.pipe(writer);
      response.Body.on("error", reject);
      writer.on("finish", resolve);
    });

    console.log(" Video downloaded successfully");
    return inputFile;
  } catch (err) {
    console.error(" Error downloading video:", err.message);
    throw new Error("Download failed", err.message);
  }
};

const convertToOptimizedMP4 = async (inputFile, outputDir) => {
  fs.mkdirSync(outputDir, { recursive: true });

  const fileName = path.basename(inputFile, path.extname(inputFile));
  const outputPath = path.join(outputDir, `${fileName}-optimized.mp4`);

  console.log("🎥 Optimizing MP4...");

  const args = [
    "-i",
    inputFile,
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "19",
    "-profile:v",
    "high",
    "-level",
    "4.1",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-movflags",
    "+faststart",
    outputPath,
  ];

  await new Promise((resolve, reject) => {
    const ffmpeg = spawn(ffmpegPath, args);

    ffmpeg.stderr.on("data", (d) => console.log(d.toString()));

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("MP4 Optimized Successfully:", outputPath);
        resolve();
      } else {
        reject(new Error("FFmpeg optimization failed"));
      }
    });
  });

  return outputPath;
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmailToAdminOnFail = async (
        filename,
        reason
      ) => {
        const mailOptions = {
          from: `"DevLoad" <${process.env.EMAIL_USER}>`,
          to: process.env.ADMIN_EMAIL,
          subject: "❌ DevLoad — File Optimisation Failed",
          html: `
<!DOCTYPE html>
<html>
<body style="margin:0;background:#0b1220;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center" style="padding:40px 10px;">

<table width="520" style="background:#0f172a;border-radius:12px;border:1px solid #1f2937;color:#e5e7eb;">

<tr>
<td style="text-align:center;padding:22px;border-bottom:1px solid #1f2937;">
<h2 style="margin:0;color:#38bdf8;">DevLoad</h2>
</td>
</tr>

<tr>
<td style="padding:28px;text-align:center;">

<p style="color:#9ca3af;margin:12px 0 6px 0;">File Name</p>
<h3 style="margin:0 0 16px 0;color:#fff;">${filename}</h3>

<p style="color:#cbd5e1;line-height:1.6;margin:0 0 20px 0;">
File optimisation failed. The video is still being served from the temporary bucket.<br>
Please review the issue and retry processing.
</p>

<div style="display:inline-block;background:#111827;padding:12px 18px;border-radius:10px;border:1px solid #1f2937;">
<span style="color:#f87171;font-size:16px;">❌ Optimisation Failed</span>
</div>

<p style="margin-top:16px;color:#9ca3af;font-size:13px;">
Reason: <span style="color:#fff">${reason}</span>
</p>

</td>
</tr>

<tr>
<td style="text-align:center;padding:14px 0 18px 0;border-top:1px solid #1f2937;">
<p style="color:#6b7280;font-size:12px;margin:0;">
Powered by DevLoad • Monitoring • Stability • Control
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>
</body>
</html>
`,
        };

        await transporter.sendMail(mailOptions);
      }

const uploadFiles = async (
  projectId,
  filename,
  endpoint,
  accessId,
  accesskey,
  userEmail,
  userFullname,
  userEmailSendPrefrence
) => {
  try {
    const client = s3client(endpoint, accessId, accesskey);

    const file = fs.readdirSync(outputDir);
    const filepath = path.join(outputDir, file[0]);
    const fileStream = fs.createReadStream(filepath);

    const uploadOnMinio = new PutObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: `${projectId}/${filename}`,
      Body: fileStream,
      ContentType: "video/mp4",
    });

    try {
      await client.send(uploadOnMinio);

      const sendEmailToUser = async (email) => {
        const mailOptions = {
          from: `"DevLoad" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "File Optimisation complete",
          html: `
          <!DOCTYPE html>
<html>
  <body style="margin:0;background:#0b1220;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 10px;">
          
          <table width="520" style="background:#0f172a;border-radius:12px;border:1px solid #1f2937;color:#e5e7eb;">
            
            <tr>
              <td style="text-align:center;padding:22px;border-bottom:1px solid #1f2937;">
                <h2 style="margin:0;color:#38bdf8;">DevLoad</h2>
              </td>
            </tr>

            <tr>
              <td style="padding:28px;text-align:center;">
                
                <p style="color:#9ca3af;margin:0 0 8px 0;">Hello, 
                  <strong style="color:#fff">${userFullname}</strong>
                </p>

                <p style="color:#9ca3af;margin:12px 0 6px 0;">File Name</p>
                <h3 style="margin:0 0 16px 0;color:#fff;">
                  ${filename}
                </h3>

                <p style="color:#cbd5e1;line-height:1.6;margin:0 0 18px 0;">
                  Your upload has been successfully processed.<br>
                  We’ve switched to the optimized version for faster and better streaming.
                </p>

                <div style="
                  display:inline-block;
                  background:#111827;
                  padding:12px 18px;
                  border-radius:10px;
                  border:1px solid #1f2937;
                ">
                  <span style="color:#4ade80;font-size:16px;">✔ Optimization Completed</span>
                </div>

              </td>
            </tr>

            <tr>
              <td style="text-align:center;padding:14px 0 18px 0;border-top:1px solid #1f2937;">
                <p style="color:#6b7280;font-size:12px;margin:0;">
                  Powered by DevLoad • Fast • Reliable • Optimized
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </body>
</html>

        `,
        };

        await transporter.sendMail(mailOptions);
      };

      if (userEmailSendPrefrence) {
        await sendEmailToUser(userEmail);
      }
    } catch (error) {
      throw error;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const cleanupFiles = async () => {
  try {
    if (fs.existsSync(uploadDir)) {
      fs.readdirSync(uploadDir).forEach((file) => {
        fs.unlinkSync(path.join(uploadDir, file));
      });
    }

    if (fs.existsSync(outputDir)) {
      fs.readdirSync(outputDir).forEach((file) => {
        fs.unlinkSync(path.join(outputDir, file));
      });
    }

    console.log("🧹 Temporary files cleaned");
  } catch (err) {
    console.log("Cleanup error", err);
  }
};

export const deleteFromMinio = async (endpoint, accessId, accessKey, key) => {
  try {
    const client = s3client(endpoint, accessId, accessKey);

    const cmd = new DeleteObjectCommand({
      Bucket: "temp",
      Key: key,
    });

    await client.send(cmd);
    console.log("Deleted successfully:", key);
    return true;
  } catch (err) {
    console.error("Delete failed:", err.message);
    throw new Error(error.message);
  }
};
const worker = new Worker(
  "devload-video-processing",
  async (job) => {
    const {
      projectId,
      filename,
      userFullname,
      useEmailSendPreference,
      userEmail,
      websiteAdminEmail,
    } = job.data;

    try {
      await downloadVideo(
        "temp",
        filename,
        process.env.ENDPOINT,
        process.env.ACCESS_ID,
        process.env.ACCESS_KEY
      );

      await convertToOptimizedMP4(inputFile, outputDir);

      await uploadFiles(
        projectId,
        filename,
        process.env.ENDPOINT,
        process.env.ACCESS_ID,
        process.env.ACCESS_KEY,
        userEmail,
        userFullname,
        useEmailSendPreference,
        websiteAdminEmail
      );

      console.log("Job Done");
    } catch (err) {
      console.log('start sending mail')
      await sendEmailToAdminOnFail(filename,err.message);
      console.error("Process Failed:", err);
      throw err;
    } finally {
      await cleanupFiles();
    }
  },
  { connection,
    concurrency: 1
   }
);

worker.on("completed", async (job) => {

  const projectid = job.projectId
  const filename = job.filename
  const queue = new Queue("process-video-complete", { connection });

      await queue.add("process-video-complete", {
        projectId: projectid,
        filename,
      });

      await deleteFromMinio(
        process.env.ENDPOINT,
        process.env.ACCESS_ID,
        process.env.ACCESS_KEY,
        (key = `${filename}`)
      );
 });
