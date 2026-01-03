import { Domain } from "../../../../Models/domain.model.js";
import { Project } from "../../../../Models/projects.model.js";
import redisConnect from "../../../../Config/RedisClient.js";

const AddDomain = async (req, res) => {
    try {
        const alloweddomain = req.body.domains;
        const { projectId } = req.params;

        if (!projectId || !alloweddomain) {
            return res.status(400).json({ error: "Project ID and domain are required." });
        }

        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;

        if (!domainRegex.test(alloweddomain)) {
            return res.status(400).json({ error: "Invalid domain format. Please provide a valid domain." });
        }

        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ message: "Unauthorized: Invalid user" });
        }

        const project = await Project.findOne({ projectid: projectId, userid: user._id, isActive: 'active' }).lean();
        if (!project) {
            return res.status(404).json({ message: "Project not found or you do not have permission or frozen project" });
        }


        const existingDomain = await Domain.findOneAndUpdate(
            { projectid: projectId },
            { $addToSet: { alloweddomain: alloweddomain } },
            { new: true, upsert: true }
        );
        if (!existingDomain) {
            return res.status(400).json({
                message: "failed to update"
            })
        }

        const returndata = await redisConnect.sAdd(`devload/project:${projectId}:domains`, alloweddomain);
        if (returndata === 1) {
            console.log(`Domain ${alloweddomain} added to Redis for project ${projectId}`);
        } else {
            console.log(`Domain ${alloweddomain} already exists in Redis for project ${projectId}`);
        }

        return res.status(200).json({ message: "Domain added successfully." });

    } catch (error) {
        console.error("Error adding domain:", error);
        return res.status(500).json({ error: "An error occurred while adding the domain." });
    }
}

export { AddDomain }