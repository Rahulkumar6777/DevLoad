import { Model } from "../../../../models/index.js";


const ApiKeys = async (req, res)=>{
    try {
        const user = req.user;
        const projectid = req.params.projectid;

        if(!projectid){
            return res.status(400).json({
                message: "Projectid is Required"
            })
        }

        const findProject = await Model.Project.findOne({_id: projectid , userid: user._id , isActive: 'active'});
        if(!findProject){
            return res.status(404).json({
                message: "Invalid project or frozen project"
            })
        }

        const Api = await Model.Apikey.find({projectid: projectid});
        if(!Api){
            return res.status(400).json({message: 'no apikey found' , apikeys :[]})
        }

        

        const apikeys = Api.map(key => ({
            id : key._id,
            secretKey: key.key,
            createdAt: key.createdAt
        }))

        return res.status(200).json({
            apiKeys: apikeys
        })

    } catch (error) {
        console.log(error)
       return res.status(500).json({
        error: "Internal server"
       }) 
    }
}


export {ApiKeys}