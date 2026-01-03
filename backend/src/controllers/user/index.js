import { UpdateEmail } from "./slice/UpdateEmail.js";
import { UpdatePassword } from "./slice/UpdatePassword.js";

export const updateUserDetails = {
    email: UpdateEmail,
    password: UpdatePassword
}