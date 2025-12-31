import { body, validationResult } from "express-validator"
import { TempUser } from "../../../models/tempUser.model.js";
import { User } from "../../../models/user.Model.js";
import { OtpValidate } from "../../../models/otpValidator.model";
import * as crypto from "crypto"
import { Project } from "../../../models/projects.model.js";
import { Apikey } from "../../../models/apikey.model.js";
import { makeQueue } from "../../../utils/makeQueue.js";

const validateVerifyregister = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid Email Formet"),
    body('otp')
        .notEmpty()
        .withMessage("otp is required")
        .isLength({ min: 6 })
        .isNumeric()
        .withMessage("Otp Length is 6 and should be number")
]


export const verifyRegister = async (req, res) => {
    try {
        await Promise.all(validateVerifyregister.map((validate) => validate.run(req)));
        const error = validationResult(req)

        if (!error.isEmpty()) {
            return res.status(400).json({
                message: error.array()[0].msg
            })
        }

        const { email, otp } = req.body;

        const findAndValidateInTempuser = await TempUser.findOne({ email })
        if (!findAndValidateInTempuser) {
            return res.status(404).json({
                message: "you not init register!"
            })
        }

        const user = await OtpValidate.findOneAndDelete({ email: email, code: otp })
        if (!user) {
            return res.status(400).json({
                message: "Invalid Otp Or Expired"
            })
        }

        const apiKey = crypto.randomBytes(16).toString('hex')

        // create new user
        const newUser = new User({
            fullName: findAndValidateInTempuser.fullname,
            email: findAndValidateInTempuser.email,
            password: findAndValidateInTempuser.password,
        })

        // create default project
        const newProject = new Project({ userid: newUser._id })

        // create default apiKey for defaultproject
        const newApiKey = new Apikey({ userid: newUser._id, projectid: newProject._id, key: apiKey })

        // save all
        await newUser.save();
        await newProject.save();
        await newApiKey.save();

        // make queue
        const queue = makeQueue("WelcomeMessage")

        const queuedata = {
            fullname: fullname,
            email: email
        }
        await queue.add("WelcomeMessage", { data: queuedata })

        return res.status(201).json({
            message: "User register Success",
        })
    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}