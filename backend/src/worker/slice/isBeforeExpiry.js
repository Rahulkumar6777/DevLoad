import { Worker } from "bullmq";
import { Model } from "../../models/index.js";
import { connection } from "../../utils/connection.js";
import { transporter } from "../../utils/emailTransporter.js"




const worker = new Worker("isBeforeExpiryQueue", async (job) => {
    try {
        const { userId, email, fullname } = job.data

        await Model.User.findByIdAndUpdate(
            {
                _id: userId
            }, {
            isUnderRenew: true
        }
        )

        const mailOptions = {
            from: `"DevLoad" ${process.env.EMAIL_USER}`,
            to: email,
            subject: "Devload - Subscription Expiring",
            html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Devload - Subscription Expiring</title>
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
              <h3 style="margin-top:0;">⚠️ Your subscription is about to expire</h3>

              <p style="font-size:15px;line-height:1.6;">
                Hello <strong>${fullname}</strong>,<br><br>
                Aapka <strong>Devload subscription</strong> jaldi expire hone wala hai.
              </p>

              <p style="font-size:15px;line-height:1.6;color:#b91c1c;">
                Agar aapne time par renew nahi kiya:
              </p>

              <ul style="font-size:15px;line-height:1.7;color:#111827;">
                <li>Aapke <strong>saare active projects</strong> delete kar diye jayenge</li>
                <li>Aapka <strong>poora data permanently remove</strong> ho jayega</li>
                <li>Expiration ke baad <strong>data recovery possible nahi</strong> hogi</li>
              </ul>

              <p style="font-size:15px;line-height:1.6;">
                Data loss se bachne ke liye please <strong>abhi renew karein</strong>.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:30px 0;">
                <a href="https://app-devload.cloudcoderhub.in/renew"
                   style="background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:6px;font-size:16px;font-weight:bold;display:inline-block;">
                  Renew Subscription
                </a>
              </div>

              <p style="font-size:14px;color:#374151;">
                Agar aap already renew kar chuke hain, to is email ko ignore kar sakte hain.
              </p>

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
`
        }

        await transporter.sendMail(mailOptions);

        
    } catch (error) {
        throw error;
    }
}, { connection })


worker.on("completed", async () => {
    console.log("notified user near expiry")
})