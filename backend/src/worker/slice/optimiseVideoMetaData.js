import { Worker } from "bullmq";
import { Model } from '../../models/index.js'
import { getFileInfo } from "../../utils/uploadOnMinio.js";
import { connection } from "../../utils/connection.js";
import { deleteFromMinio } from "../../utils/deleteFileFromMinio.js";

const worker = new Worker("process-video-complete", async (job) => {
    const { projectId, filename } = job.data;



    const res = await getFileInfo(`${projectId}/${filename}`);
    const optmisedVideoSize = res.ContentLength

    const file = await Model.File.findOne({ filename });
    const oldFileSize = file.size;
    const ownerId = file.owner;

    const updateSize = parseInt(oldFileSize - optmisedVideoSize)

    await Model.Project.updateOne(
        {
            _id: projectId,
        },
        {
            $inc: {
                requestsUsed: 1,
                totaloptimisedfile: 1,
                optimisedRawBytes: oldFileSize,
                storageUsed: optmisedVideoSize,
                storageProcessing: -oldFileSize,
                optimisedFinalBytes: optmisedVideoSize, 
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
    file.underProcessing = false
    await file.save({ validateBeforeSave: false })

    if (file.status === "deleted") {
        await Model.User.updateOne({
            _id: file.owner
        },
            {
                $inc: {
                    storageUsed: -optmisedVideoSize,
                },
            }
        )

        await Model.Project.updateOne({
            _id: projectId
        },
            {
                $inc: {
                    storageUsed: -optmisedVideoSize,
                },
            }
        )
        await Model.File.deleteOne({ filename })
        await deleteFromMinio(`${projectId}/${filename}`, process.env.TEMP_BUCKET);
    }

}, {
    connection,
    concurrency: 1
})


worker.on("completed", async (job) => {
    console.log(`work done of optimiseMetaData worker ${job.id}`)
})