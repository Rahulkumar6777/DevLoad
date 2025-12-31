import { initRegistration } from "./slice/initRegister.controller.js";
import { Login } from "./slice/login.controller.js";
import { verifyRegister } from "./slice/verifyRegister.controller.js";

export const Auth = {
    register: {
        init: initRegistration,
        verify: verifyRegister
    },
    Login: Login
}