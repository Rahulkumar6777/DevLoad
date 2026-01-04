import { initPayment } from "./slice/init.controller.js";
import { paymentVerify } from "./slice/verify.controller.js";

const Payment = {
    init: initPayment,
    verify: paymentVerify
}