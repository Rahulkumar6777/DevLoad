import Razorpay from 'razorpay'
import * as crypto from 'crypto'
import { Model } from '../../../models/index.js';


const razorpay = new Razorpay({
    key_id: `${process.env.key_id}`,
    key_secret: `${process.env.key_secret}`,
});

const paymentVerify = async (req, res) => {

    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
        return res.status(400).json({
            message: "required details fro verify payment"
        })
    }


    try {
        const generated_signature = crypto
            .createHmac("sha256", `${process.env.key_secret}`)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature === razorpay_signature) {


            console.log("Payment verification successful");
            const user = req?.user
            if (!user) {
                return res.status(400).json({ success: false, message: "User not found!" });
            }



            const orderfromdb = await Model.PendingOrder.findOne({ userid: user._id, oderid: razorpay_order_id });

            if (!orderfromdb) {
                return res.status(400).json({
                    message: "something went wrong! PLease Contact your team"
                })
            }


            if (orderfromdb.status === 'completed') {
                return res.status(400).json({
                    message: "Your Oder ALready PRocessed"
                })
            }

            const months = orderfromdb.months;


            const now = new Date();
            const subscriptionend = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);  // here later i send this on worker queue so it handle expiry
            const isBeforeExpiryDate = new Date(now.getTime() + months * 25 * 24 * 60 * 60 * 1000) // here i notify user to renew service

            // Update user subscription details

            console.log("User found:", user.fullname);

            const projectdata = await Model.Project.findOne({ userid: user._id })


            user.subscriptionStart = now;
            user.subscriptionEnd = subscriptionend;
            user.subscriptionId = razorpay_order_id;


            user.subscription = "member";
            user.maxStorage = 5000000000;
            user.maxRequests = 15000;
            user.totalProject = 5;

            if (projectdata) {
                await Project.updateOne(
                    { userid: user._id },
                    {
                        $addToSet: { fileTypeAllowed: 'video' },
                        $set: { maxfilesize: 1000000000, maxapikey: 5 }
                    }
                );
            }

            user.save({ validateBeforeSave: false })

            function getUserInitials(fullname) {
                return fullname.split(' ')
                    .map(name => name[0].toUpperCase())
                    .join('');
            }

            orderfromdb.status = 'completed'
            await orderfromdb.save({ validateBeforeSave: false })




            return res.json({ success: true, userSubscribe: user.subscription, message: "Payment verified successfully!" });
        } else {
            return res.status(400).json({ success: false, message: "Payment verification failed!" });
        }
    } catch (error) {
        console.error("Payment verification error:", error);
        res.status(500).json({ error: "Error verifying payment" });
    }

}

export { paymentVerify }