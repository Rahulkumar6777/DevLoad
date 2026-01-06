import { Model } from "../models/index.js";


const verifyApiKey = async (req, res, next) => {


    try {
        const apikey = req.headers['x-api-key'];
        const projectid = req.params.projectId;
        if (!apikey) {
            return res.status(400).json({
                message: "Api Required"
            })
        }

        if (!projectid) {
            return res.status(400).json({
                message: "projectid Required"
            })
        }


        const apimatch = await Model.Apikey.findOne({ key: apikey, projectid }).populate('userid');
        if (!apimatch) {
            return res.status(400).json({
                message: "Invalid Api"
            })
        }

        const user = apimatch.userid;
        console.log(user)

        if (user.status === 'banned') {
            return res.status(403).json({
                message: "Your Account temporarly Banned and unBanned on "
            })
        }
        

        const projectfind = await Model.Project.findById(projectid)
        if (!projectfind) {
            return res.status(400).json({
                message: "invalid projectid"
            })
        }


        if (projectfind.isActive !== 'active') {
            return res.status(500).json({
                message: "Project not active"
            })
        }  

        req.project = projectfind;
        req.user = user;

        next()
    } catch (error) {
        return res.status(500).jons({
            error: "Internal Server Error"
        })
    }
}

export { verifyApiKey }