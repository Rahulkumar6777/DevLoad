import { initRegistration } from "./slice/initRegister.controller.js";
import { verifyRegister } from "./slice/verifyRegister.controller.js";

export const Auth = {
    register: {
        init: initRegistration,
        verify: verifyRegister
    },
}