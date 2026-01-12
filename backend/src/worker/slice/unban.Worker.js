import { Worker } from 'bullmq';
import { transporter } from '../../utils/emailTransporter.js';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { connection } from "../../utils/connection.js"
import { Model } from '../../models/index.js';

const filePath = path.resolve(__dirname, '../../MailTempletHtml/unban.html');
const emailTemplate = fs.readFileSync(filePath, 'utf-8');
const compiledTemplate = handlebars.compile(emailTemplate);


const worker = new Worker(
    'unBanAlert',
    async (job) => {
        try {

            console.log(`Processing job ${job.id}`);


            const jobData = {
                fullname: job.data.fullname,
                email: job.data.email,
                userId: job.data.userId
            };

            if (!jobData.email) {
                throw new Error(`Invalid or missing email address in job ${job.id}: ${jobData.email}`);
            }

            await Model.User.findByIdAndUpdate({
                _id: jobData.userId,
            },
            {
              suspensionEnd:  null  ,
              status: 'active'
            }
            )


            const emailHtml = compiledTemplate(jobData);


            const mailOptions = {
                from: `"DevLoad" <${process.env.EMAIL_USER}>`,
                to: jobData.email,
                subject: 'unban Your Account!',
                html: emailHtml,
            };


            await transporter.sendMail(mailOptions);
            console.log(`unban email sent successfully to ${jobData.email}`);
        } catch (error) {
            console.error(`Failed to send unban email for job ${job.id}:`, error);
            throw error;
        }
    },
    {
        connection,
        concurrency: 5,
        limiter: {
            max: 100,
            duration: 60 * 1000,
        },
    }
);


worker.on('failed', (job, error) => {
    console.error(`Job ${job.id} failed with data:`, JSON.stringify(job.data, null, 2), 'Error:', error);
});


worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed for email: ${job.data.email}`);
});
