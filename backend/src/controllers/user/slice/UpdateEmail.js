import { body, validationResult } from "express-validator";

const emailValidate = [
    body('email')
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email Formet')
];


const UpdateEmail = async (req, res) => {
    try {

        await Promise.all(emailValidate.map((validate) => validate.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: errors.array()[0].msg
            });
        }


        const user = req.user;
        if(!user){
            return res.status(403).json({
                message: "Invalid User"
            })
        }

        const email = req.body.email;

        user.email = email;
        await user.save({validateBeforeSave: false})

        return res.status(200).json({
            message: "Success"
        })

    } catch (error) {
        return res.status(500).json({
            error: "Internal Server Error"
        })
    }
}

export {UpdateEmail}