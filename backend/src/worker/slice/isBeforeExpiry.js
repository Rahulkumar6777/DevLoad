import { Worker } from "bullmq";
import { Model } from "../../models/index.js";
import { connection } from "../../utils/connection.js";


const worker = new Worker("isBeforeExpiryQueue", async (job) => {
    try {
        const { userId } = job.data

        await Model.User.findByIdAndUpdate(
            {
                _id: userId
            }, {
            isUnderRenew: true
        }
        )
    } catch (error) {
        throw error;
    }
}, { connection })


worker.on("completed", async () => {
    console.log("notified user near expiry")
})