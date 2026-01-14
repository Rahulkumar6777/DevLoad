import { Model } from "../../../models/index.js"

export const stats = async (req, res) => {
    try {
        const user = req.user;

        const projectStats = await Model.Project.find({ userid: user._id })
        const userStats = await Model.User.findById(user._id).select("totalProject currentProject maxStorage storageUsed maxRequests requestsUsed")

        return res.status(200).json({
            message: "Success",
            projectStats,
            userStats
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}