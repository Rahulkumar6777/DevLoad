import { Model } from "../../../../models/index.js"
import { makeQueue } from "../../../../utils/makeQueue.js";


const projectDeleteQueue = makeQueue('projectDeleteQueue');


export const deleteProject = async (req, res) => {
    try {
        const userId = req.user._id;
        const { projectid } = req.body

        if (!projectid) {
            return res.status(400).json({
                message: "projectID is required"
            })
        }

        const project = await Model.Project.findById(projectid);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        if (project.isActive !== "active") {
            return res.status(400).json({
                message: "Your Project is Frozen! please Unfreeze"
            })
        }

        const storageUsedByProject = project.storageUsed.toFixed(2)
        await Model.User.updateOne(
            { _id: userId },
            { $inc: { storageUsed: -storageUsedByProject, currentProject: -1 } }
        )

        project.isActive = 'softdelete';

        await project.save({validateBeforeSave: false})
        await projectDeleteQueue.add('projectDeleteQueue' , {
            projectId: project._id
        })

        return  res.status(200).json({
            message: 'Project is scheduled for deletation'
        })

    } catch (error) {
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}