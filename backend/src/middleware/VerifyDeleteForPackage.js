import { Model } from "../models/index.js";

const VerifyDeleteForPackage = async (req , res , next)=>{
    try {
        
        const apikey = req.headers['x-api-key'];
        if(!apikey){
            return res.status(400).json({
                message: "Api Required"
            })
        }
        const verifyApiKey = await Model.Apikey.findOne({key: apikey}).populate('userid')
        if(!verifyApiKey){
            return res.status(400).json({
                message: "Invalid Api"
            })
        }

        req.user = verifyApiKey.userid

        next()

    } catch (error) {
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}

export {VerifyDeleteForPackage}