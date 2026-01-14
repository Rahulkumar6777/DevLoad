import { BootStrap } from "./slice/Bootstrap.Controller.js";
import { accountDelete } from "./slice/deleteAccount.js";
import { Subscription } from "./slice/getsubscription.Controller.js";
import { stats } from "./slice/stats.controller.js";
import { UpdateEmail } from "./slice/UpdateEmail.js";
import { updatefullname } from "./slice/UpdateFullname.js";
import { UpdatePassword } from "./slice/UpdatePassword.js";

export const updateUserDetails = {
    email: UpdateEmail,
    password: UpdatePassword,
    updatefullname: updatefullname,
    BootStrap: BootStrap,
    subsription: Subscription,
    delete: accountDelete,
    Stats: stats
}