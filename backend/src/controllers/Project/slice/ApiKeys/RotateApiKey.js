import { Model } from "../../../../models/index.js";
import * as crypto from 'node:crypto'



const RotateApiKey = async (req, res) => {
    try {
        const user = req.user;
        const apikeys = req.body.secretKey;
        if (!user) {
            return res.status(403).json({
                message: "Invalid user"
            })
        }

        const projectid = req.params.projectid;
        if (!projectid) {
            return res.status(400).json({
                message: "projectid not received"
            })
        }

        const projectfind = await Model.Project.findOne({ userid: user._id, _id: projectid , isActive: 'active' })
        if (!projectfind) {
            return res.status(400).json({
                message: "Project Not Found or frozen project"
            })
        }


        function generateApiKey(charLength = 32) {
            const byteLength = Math.ceil(charLength / 2);
            return crypto.randomBytes(byteLength).toString("hex").slice(0, charLength);
        }


        const apikey = generateApiKey()

        const resp = await Model.Apikey.updateOne({userid: user._id , projectid: projectid , key: apikeys} ,
            {$set: {key: apikey}}
        )

        if(!resp){
            return res.status(400).json({
                message: "Invalid secretkey"
            })
        }

        return res.status(200).json({
            message: "APiKey Generate success",
            secretKey: apikey,
            createdAt: new Date(Date.now())
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal server errror"
        })
    }
}

export {RotateApiKey}