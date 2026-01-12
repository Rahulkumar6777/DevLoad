import { Worker } from "bullmq";
import { Model } from '../../models/index.js'
import { deleteFromMinio } from "../../utils/deleteFileFromMinio.js";
import { connection } from "../../utils/connection.js";
import { transporter } from '../../utils/emailTransporter.js';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));


const filePath = path.resolve(__dirname, '../../MailTempletHtml/ProjectDelete.html');
const emailTemplate = fs.readFileSync(filePath, 'utf-8');
const compiledTemplate = handlebars.compile(emailTemplate);

const worker = new Worker("projectDeleteQueue", async (job) => {
    try {
        const { projectId, fullname, email, projectName, remainingStorage } = job.data;
        let deletedfiles;
        const isProject = await Model.Project.findById(projectId).populate("userid")
        if (isProject) {

            const isApiKey = await Model.Apikey.find({ projectid: projectId })
            if (isApiKey.length > 0) {
                await Model.Apikey.deleteMany({ projectid: projectId })
            }

            const files = await Model.File.find({ projectid: projectId })
            if (files.length > 0) {
                deletedfiles = files.length;
                for (const file of files) {

                    const filename = file.filename;
                    const bucket = file.serveFrom

                    await deleteFromMinio(`${projectId}/${filename}`, bucket === "main" ? process.env.MAIN_BUCKET : process.env.TEMP_BUCKET)
                    await Model.File.findByIdAndDelete(file._id)
                }
            }

            const isDomain = await Model.Domain.findOne({ projectid: projectId });
            if (isDomain) {
                await Model.Domain.deleteOne({ projectid: projectId })
            }

            await Model.Project.findByIdAndDelete(projectId);

            const jobData = {
                fullname: fullname,
                email: email,
                projectName: projectName,
                projectid: projectId,
                deletedfiles: deletedfiles,
                remainingStorage: (remainingStorage / (1024 * 1024)).toFixed(2)
            };

            const emailHtml = compiledTemplate(jobData);


            const mailOptions = {
                from: `"DevLoad" <${process.env.EMAIL_USER}>`,
                to: jobData.email,
                subject: 'Project Deletion Completed!',
                html: emailHtml,
            };


            await transporter.sendMail(mailOptions);
            console.log(`ProjectDelete email sent successfully to ${jobData.email}`);
        }



    } catch (error) {
        throw error
    }
}, { connection, concurrency: 1 })

worker.on("completed", async (job) => {
    console.log("all files delete of ", "project", job.data.projectId)
})