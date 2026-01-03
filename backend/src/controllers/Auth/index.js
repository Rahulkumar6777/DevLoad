import { initRegistration } from "./slice/initRegister.controller.js";
import { Login } from "./slice/Login.controller.js";
import { RefreshToken } from "./slice/RefreshToken.Controller.js";
import { verifyRegister } from "./slice/verifyRegister.controller.js";

export const Auth = {
    register: {
        init: initRegistration,
        verify: verifyRegister
    },
    Login: Login,
    RefreshToken: RefreshToken
}