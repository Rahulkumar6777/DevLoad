import { Model } from "../../../../models/index.js";

const ProjectStorage = async (req, res) => {
    try {
        const user = req.user;
        const requestStroage = req.body.storage;
        const projectid = req.params.projectid;

        if (!user || !requestStroage) {
            return res.status(400).json({
                message: "storage not Provided by user"
            })
        }

        const usermaxstorage = user.maxStorage;

        if (requestStroage > usermaxstorage) {
            return res.status(400).json({
                message: `you set max storage of your Project is less than your totalstorage${(usermaxstorage / (1024 * 1024)).toFixed(2)}MB of your account!`
            })
        }

        const projectupdate = await Model.Project.findOneAndUpdate(
            {
                userid: user._id,
                _id: projectid,
                $expr: { $lt: ["$storageUsed", requestStroage] }
            },
            { $set: { projectstoragelimit: requestStroage } },
            { new: true }
        );


        if (!projectupdate) {
            return res.status(400).json({
                message: "invalid projectid or storage limit is less than current storage used"
            })
        }


        return res.status(200).json({
            message: `your Updated value of max storage of your project is ${projectupdate.projectstoragelimit}`
        })

    } catch (error) {
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}

export { ProjectStorage }