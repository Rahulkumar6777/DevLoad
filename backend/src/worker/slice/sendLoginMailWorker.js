import { Worker } from 'bullmq';
import { transporter } from '../../utils/emailTransporter.js';
import fs from 'fs';
import axios from 'axios';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { connection} from "../../utils/connection.js"

const filePath = path.resolve(__dirname, '../../MailTempletHtml/loginalert.html');
const emailTemplate = fs.readFileSync(filePath, 'utf-8');
const compiledTemplate = handlebars.compile(emailTemplate);


const worker = new Worker(
    'loginAlert',
    async (job) => {
        try {
            console.log(`Processing job ${job.id}`);

            let location;

            async function fetchLocation(url) {
                try {
                    const response = await axios.get(url);
                    const data = await response.data;
                    location = data.status === 'fail' ? 'Unknown location' : `${data.city || 'Unknown'}, ${data.regionName || 'Unknown'}, ${data.country || 'Unknown'}`;
                } catch (error) {
                    console.error('Error fetching IP data:', error);
                }
            }


            const url = `http://ip-api.com/json/${job.data.ip}`;
            await fetchLocation(url);

            // Validate job data
            const jobData = {
                fullname: job.data.fullname || 'User',
                email: job.data.email,
                ip: job.data.ip || 'Unknown',
                device: job.data.device || 'Unknown',
                browser: job.data.browser || 'Unknown',
                os: job.data.os || 'Unknown',
                location: location || 'Unknown',
                isLocalIp: job.data.isLocalIp || 'Unknown',
                loginTime: job.data.loginTime || 'lol',
            };

            if (!jobData.email) {
                throw new Error(`Invalid or missing email address in job ${job.id}: ${jobData.email}`);
            }

            // Generate HTML from template
            const emailHtml = compiledTemplate(jobData);

            
            const mailOptions = {
                from: `"DevLoad" <${process.env.EMAIL_USER}>`,
                to: jobData.email,
                subject: 'New Login Alert for Your DevLode Account',
                html: emailHtml,
            };


            await transporter.sendMail(mailOptions);
            console.log(`Login alert email sent successfully to ${jobData.email}`);
        } catch (error) {
            console.error(`Failed to send login alert email for job ${job.id}:`, error);
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


worker.on("completed" , async ()=> {
    console.log("job Done")
})