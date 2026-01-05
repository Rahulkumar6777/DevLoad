import { body, validationResult } from "express-validator";


const validateFullName = [
  body('fullname')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3, max: 50 }).withMessage('Full name must be between 3 and 50 characters')
    .matches(/^[a-zA-Z]+(?:[' -][a-zA-Z]+)*\s+[a-zA-Z]+(?:[' -][a-zA-Z]+)*$/)
    .withMessage('Full name must contain at least first and last name, only letters, spaces, hyphens, or apostrophes'),
];

const updatefullname = async (req, res) => {
  try {

    await Promise.all(validateFullName.map((validate) => validate.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0].msg
      });
    }

    const user = req.user;
    if (!user) {
      return res.status(403).json({
        message: "Invalid User",
      });
    }



    const fullname = req.body.fullname;

    user.fullName = fullname;
    await user.save({ validateBeforeSave: false })

    return res.status(200).json({
      message: "Success"
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Something went wrong from our end!"
    })
  }
};

export { updatefullname }
