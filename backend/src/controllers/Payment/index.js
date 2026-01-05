import { initPayment } from "./slice/init.controller.js";
import { paymentVerify } from "./slice/verify.controller.js";

export const Payment = {
    init: initPayment,
    verify: paymentVerify
}