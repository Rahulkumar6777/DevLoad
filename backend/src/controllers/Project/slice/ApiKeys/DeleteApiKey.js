import { Model } from "../../../../models/index.js";

const DeleteApiKey = async(req, res)=>{
    try {
        const user = req.user;
        const projectid = req.params.projectid;
        if (!user) {
            return res.status(403).json({
                message: "Invalid user"
            })
        }

        if(!projectid){
            return res.status(400).json({
                message: 'projectid is required'
            })
        }
        const apikey = req.body.secretKey;
        if (!apikey) {
            return res.status(400).json({
                message: "apikey not received"
            })
        }

        const projectfind = await Model.Project.find({ userid: user._id, _id: projectid , isActive: 'active' })
        if (!projectfind) {
            return res.status(400).json({
                message: "Project Not Found"
            })
        }

        if(!await Model.Apikey.findOneAndDelete({userid: user._id, key: apikey})){
            return res.status(400).json({
                message: "Invalid APikey"
            })
        }


       await Model.Project.updateOne({userid: user._id , _id: projectid},
            {$inc: {ownapikey: -1}}
       )

        return res.status(200).json({
            message: "APiKey Generate success"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}


export {DeleteApiKey}