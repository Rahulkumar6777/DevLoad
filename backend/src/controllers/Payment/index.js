import { initPayment } from "./slice/init.controller.js";
import { RenewPayment } from "./slice/renew.controller.js";
import { renewInfo } from "./slice/renewInfo.controller.js";
import { paymentVerify } from "./slice/verify.controller.js";
import { verifyRenew } from "./slice/verifyRenew.controller.js";

export const Payment = {
    init: initPayment,
    verify: paymentVerify,
    renewInfo,
    initRenew: RenewPayment,
    verifyRenew: verifyRenew
}