import { Model } from "../../../../models/index.js";

const GetAnalyticsData = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(403).json({
                message: "Invalid User"
            })
        }

        const projectid = req.params.projectid;
        if (!projectid) {
            return res.status(400).json({
                message: "Projectid not Received"
            })
        }

        const findProject = await Model.Project.findOne({ _id: projectid, userid: user._id, isActive: 'active' });
        if (!findProject) {
            return res.status(404).json({
                message: "Invalid project or frozen project"
            })
        }

        const analytics = {
            uploads: findProject.totalUploads,
            storageused: findProject.storageUsed,
            maxstorage: findProject.projectstoragelimit,
            operationused: findProject.requestsUsed,
            trafficused: findProject.trafficused
        }

        return res.status(200).json({
            analytics: analytics,
        }
        )


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}


export { GetAnalyticsData }