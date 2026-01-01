import { Apikey } from "./slices/apikey.model.js";
import { DeleteUserAccountModel } from "./slices/DeleteUserAccount.model.js";
import { File } from "./slices/file.model.js";
import { OtpValidate } from "./slices/otpValidator.model.js";
import { Project } from "./slices/projects.model.js";
import { TempUser } from "./slices/tempUser.model.js";
import { User } from "./slices/user.Model.js";

export const Model = {
    User,
    TempUser,
    Project,
    OtpValidate,
    DeleteUserAccountModel,
    Apikey,
    File
}