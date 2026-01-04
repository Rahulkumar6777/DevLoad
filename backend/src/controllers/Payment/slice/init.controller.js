import Razorpay from 'razorpay'
import { Model } from '../../../models/index.js';



const razorpay = new Razorpay({
    key_id: `${process.env.key_id}`,
    key_secret: `${process.env.key_secret}`,
});


const initPayment = async (req, res) => {

    const { months } = req.body;

    if(!months){
        return res.status(400).json({
            message: "Months required"
        })
    }

    const basePrice = 29900;
    const discountRates = { 1: 2, 3: 4, 6: 8, 12: 10, 24: 15 }; 
    const discount = discountRates[months] || 0;
    const finalAmount = months * basePrice * (1 - discount / 100).toFixed(2)

    try {
        const order = await razorpay.orders.create({
            amount: finalAmount,
            currency: "INR",
            receipt: "order_rcptid_" + Math.random(),
        });




        await Model.PendingOrder.create({
            userid: req.user._id,
            oderid: order.id,
            months: months,
            amount: finalAmount,
            status: 'pending'
        })

        res.status(200).json(order);
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Error creating Razorpay order" });
    }

}

export {initPayment}