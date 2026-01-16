import { Worker } from 'bullmq';
import { transporter } from "../../utils/emailTransporter.js"
import { connection } from '../../utils/connection.js';



const worker = new Worker(
    'subscriptionstart',
    async (job) => {
        try {
           
            const { fullName , email , price , duration} = job.data;

            const mailOptions = {
                from: `"DevLoad" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'For Subscription',
                html: `
                <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Devload - Subscription Activated</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.05);">

          <!-- Header -->
          <tr>
            <td style="background:#111827;color:#ffffff;padding:20px 24px;">
              <h2 style="margin:0;font-size:22px;">Devload</h2>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px;color:#111827;">

              <h3 style="margin-top:0;"> Subscription Activated Successfully!</h3>

              <p style="font-size:15px;line-height:1.6;">
                Hello <strong>${fullName}</strong>,<br><br>
                Aapka <strong>Devload subscription</strong> successfully activate ho chuka hai.
              </p>

              <!-- Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:6px;padding:16px;margin:20px 0;">
                <tr>
                  <td style="font-size:15px;padding:6px 0;">
                    <strong>Price:</strong> ₹ ${price}
                  </td>
                </tr>
                <tr>
                  <td style="font-size:15px;padding:6px 0;">
                    <strong>Duration:</strong> ${duration}
                  </td>
                </tr>
              </table>

              <p style="font-size:15px;line-height:1.6;">
                Ab aap Devload ke saare features use kar sakte ho bina kisi restriction ke.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:30px 0;">
                <a href="https://app-devload.cloudcoderhub.in/subscription"
                   style="background:#16a34a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">
                  View My Subscription
                </a>
              </div>

              <p style="font-size:14px;color:#6b7280;margin-top:30px;">
                — Team Devload
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f3f4f6;padding:16px;text-align:center;font-size:12px;color:#6b7280;">
              © 2026 Devload. All rights reserved.
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
            console.log(`Subscription email sent successfully to ${fullName}`);
        } catch (error) {
            console.error(`Failed to send Subscription email for job ${job.id}:`, error);
            throw error;
        }
    },
    {
        connection,
        concurrency: 1, 
    }
);




worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed for email: ${job.data.fullName}`);
});


process.on('SIGTERM', async () => {
    await worker.close();
    console.log('Worker closed gracefully');
});