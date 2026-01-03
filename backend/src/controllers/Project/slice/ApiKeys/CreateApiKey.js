import { Model } from '../../../../models/index.js';
import * as crypto from 'node:crypto'



const CreateApiKey = async (req, res) => {
    try {
        const user = req.user;
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
                message: "Project Not Found"
            })
        }

        if (projectfind.ownapikey >= projectfind.maxapikey) {
            return res.status(400).json({
                message: `You allready created ${projectfind.ownapikey}keys for your project`
            })
        }


        function generateApiKey(charLength = 32) {
            const byteLength = Math.ceil(charLength / 2);
            return crypto.randomBytes(byteLength).toString("hex").slice(0, charLength);
        }


        const apikey = generateApiKey()


        await Model.Project.updateOne(
            { userid: user._id, _id: projectid },
            { $inc: { ownapikey: 1 } }
        );

        const newapikey = new Model.Apikey({ userid: user._id, projectid, key: apikey })
        await newapikey.save()

        return res.status(200).json({
            message: "APiKey Generate success",
            id : newapikey._id,
            secretKey: apikey,
            createdAt: newapikey.createdAt
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal server errror"
        })
    }
}

export {CreateApiKey}





































