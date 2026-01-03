import { UpdateEmail } from "./slice/UpdateEmail.js";
import { updatefullname } from "./slice/UpdateFullname.js";
import { UpdatePassword } from "./slice/UpdatePassword.js";

export const updateUserDetails = {
    email: UpdateEmail,
    password: UpdatePassword,
    updatefullname: updatefullname
}