import { body, validationResult } from "express-validator";

const passwordValidate = [
    body('password')
        .notEmpty()
        .withMessage("Password is Required")
        .isString()
        .isLength({ min: 8 })
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        )
        .withMessage(
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
        )
];

const UpdatePassword = async (req, res) => {
    try {

        await Promise.all(passwordValidate.map((validate) => validate.run(req)));
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

        const password = req.body.password;

        user.password = password;
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

export {UpdatePassword}