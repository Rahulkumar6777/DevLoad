import { Worker } from "bullmq";
import { Model } from '../../models/index.js'
import { getFileInfo } from "../../utils/uploadOnMinio.js";
import { connection } from "../../utils/connection.js";

const worker = new Worker("process-video-complete", async (job) => {
    const { projectId, filename } = job.data;



    const res = await getFileInfo(`${projectId}/${filename}`);
    const optmisedVideoSize = (res.ContentLength / (1024 * 1024)).toFixed(2)

    const file = await Model.File.findOne({ filename });
    const oldFileSize = file.size;
    const ownerId = file.owner;

    const updateSize = parseInt(oldFileSize - optmisedVideoSize).toFixed(2)

    await Model.Project.updateOne(
        {
            _id: projectId,
        },
        {
            $inc: {
                requestsUsed: 1,
                storageUsed: -updateSize,
                savedStorage: updateSize
            },
        }
    );

    await Model.User.updateOne(
        {
            _id: ownerId
        },
        {
            $inc: {
                storageUsed: -updateSize,
                requestsUsed: 1,
            },
        }
    );

    file.serveFrom = 'main'
    file.size = optmisedVideoSize;
    await file.save({ validateBeforeSave: false })

}, {
    connection,
    concurrency: 1
})


worker.on("completed", async (job) => {
    console.log(`work done of optimiseMetaData worker ${job.id}`)
})