import { Worker } from "bullmq";
import { Model } from "../../models/index.js";


const worker = new Worker("subscriptionend", async (job) => {
    try {
        const { userId } = job.data

        await Model.Project.deleteMany({
            userid: userId
        },
        )

        await Model.File.deleteMany({
            owner: userId
        })

        await Model.Apikey.deleteMany({
            userid: userId
        })

        await Model.User.findByIdAndUpdate({
            _id: userId
        }, {
            subscription: "free",
            subscriptionStart: null,
            subscriptionEnd: null,
            subscriptionId: null,
            storageUsed: 1073741824,
            requestsUsed: 0,
            maxRequests: 1500,
            currentProject: 0,
            totalProject: 1,
            isBeforeExpiryDate: null,
            isUnderRenew: false
        })

        console.log("user subscription expired and set to default")

    } catch (error) {
        throw error;
    }
})

worker.on("completed", async (job) => {
    console.log("Subscription expire job Completed for ", job.id)
})