import { Model } from "../../../../models/index.js";

const processing = async (req, res) => {
    try {
        const { areYouWantToOptimise, wantToSendEmailNotificationOnAfterOptimisation } = req.body;
        const projectId = req.params.projectid;

        const update = {};

        if (typeof areYouWantToOptimise === "boolean") {
            update.isOptimise = areYouWantToOptimise;
        }

        if (typeof wantToSendEmailNotificationOnAfterOptimisation === "boolean") {
            update.emailSendPreference = wantToSendEmailNotificationOnAfterOptimisation;
        }

        if (Object.keys(update).length === 0) {
            return res.status(400).json({ message: "required option not comes" });
        }

        const updatedProject = await Model.Project.findOneAndUpdate(
            { userid: req.user._id, _id: projectId },
            { $set: update },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        return res.status(200).json(updatedProject);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server Error" });
    }
};

export { processing };