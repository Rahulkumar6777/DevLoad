import { Model } from "../../../models/index.js";
import { makeQueue } from "../../../utils/makeQueue.js";

const accountDelete = async (req, res) => {
    try {
        const user = req.user;

        user.status = "deleted"

        await user.save({ validateBeforeSave: false })

        const accountDeletequeue = makeQueue('accountdelete');
        const tempCleanupAt = process.env.NODE_ENV === 'production' ? Date.now() + 6 * 60 * 60 * 1000 : Date.now() + 2 * 60 * 1000
        await accountDeletequeue.add("accountdelete",
            {
                userId: user._id
            },
            {
                delay: tempCleanupAt - Date.now(),
                removeOnComplete: true
            }
        )



        return res.status(200).json({
            message: "Account Sheduled for deletation"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "Internal server Error"
        })
    }
}

export { accountDelete }