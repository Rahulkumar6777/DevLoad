import { Worker } from 'bullmq';
import { transporter } from '../../utils/emailTransporter.js';
import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { connection } from "../../utils/connection.js"

const filePath = path.resolve(__dirname, '../../MailTempletHtml/Ban.html');
const emailTemplate = fs.readFileSync(filePath, 'utf-8');
const compiledTemplate = handlebars.compile(emailTemplate);



const worker = new Worker(
    'banAlert',
    async (job) => {
        try {
            console.log(`Processing job ${job.id}`);

            const now = new Date();
            const unbanTime = new Date(now.getTime() + 60 * 60 * 1000); 

            
            const jobData = {
                email: job.data.email,
                fullname: job.data.fullname || 'User',
                ip: job.data.ip,
                device: job.data.device,
                browser: job.data.browser,
                os: job.data.os,
                attemptCount: job.data.attemptCount,
                suspensionDateTime: now.toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }),
                unbanDateTime: unbanTime.toLocaleString('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true
                }),
                reason_for_ban: `Excessive failed login attempts (${job.data.attemptCount} attempts detected)`
            };

            if (!jobData.email) {
                throw new Error(`missing email address in job ${job.id}: ${jobData.email}`);
            }

            
            const emailHtml = compiledTemplate(jobData);

            
            const mailOptions = {
                from: `"DevLoad" <${process.env.EMAIL_USER}>`,
                to: jobData.email,
                subject: 'Account Suspension Notice',
                html: emailHtml,
            };

            await transporter.sendMail(mailOptions);
            console.log(`Ban email sent successfully to ${jobData.email}`);
        } catch (error) {
            console.error(`Failed to process job ${job.id}:`, error);
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