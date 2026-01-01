import { body, validationResult } from "express-validator"
import * as crypto from 'crypto'
import { Model } from "../../../../models/index.js"

const CreateProjectValidate = [
    body('projectname')
        .isString()
        .notEmpty()
        .withMessage('Projectname is must for create Project'),
    body('description')
        .isString()
]

export const createProject = async (req, res) => {
    try {
        await Promise.all(CreateProjectValidate.map((validate) => validate.run(req)))
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: errors.array()[0].msg
            })
        }

        const user = req.user;
        if (user.currentProject >= user.totalProject) {
            return res.status(400).json({
                message: `You not create more than ${user.totalProject} projects`
            })
        }

        const apiKey = crypto.randomBytes(16).toString("hex");
        const { projectname, description } = req.body;
        const userId = user._id;

        const fileTypeAllowedFree = ['image', "audio"]
        const fileTypeAllowedPaid = ['image', "audio", "video", "document"]

        const maxfilesize = user.subscription === 'free' ? 40 : 1024
        const fileTypeAllowed = user.subscription === 'free' ? fileTypeAllowedFree : fileTypeAllowedPaid;
        const maxapikey = user.subscription === 'free' ? 1 : 5;
        const isOptimise = user.subscription === 'free' ? false : true

        const newProject = new Model.Project({
            projectname: projectname,
            description: description,
            userid: userId,
            maxfilesize: maxfilesize,
            maxapikey: maxapikey,
            fileTypeAllowed: fileTypeAllowed,
            isOptimise: isOptimise
        })
        const newApiKey = new Model.Apikey({
            userid: userId,
            projectid: newProject._id,
            key: apiKey
        })

        await newProject.save();
        await newApiKey.save();

        user.currentProject += 1;

        await user.save({ validateBeforeSave: true })

        return res.status(201).json({
            message: "Project Create SuccessFully",
            id: newProject._id,
            name: projectname,
            description: description
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}