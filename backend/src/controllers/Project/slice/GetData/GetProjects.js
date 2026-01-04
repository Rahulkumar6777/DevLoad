import { Model } from "../../../../models/index.js";

const GetProject = async (req, res) => {
    try {
        const user = req.user;

        const findProject = await Project.find({ userid: user._id , isActive: 'active' });
        if (!findProject) {
            return res.status(404).json({
                message: "no Project Found"
            })
        }

        const projectDetails = findProject.map((project) => ({
            id: project._id,
            name: project.projectname,
            description: project.description || 'No description',
        }));

        return res.status(200).json(projectDetails)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}

export { GetProject }