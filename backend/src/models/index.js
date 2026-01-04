import { Apikey } from "./slices/apikey.model.js";
import { DeleteUserAccountModel } from "./slices/DeleteUserAccount.model.js";
import { Domain } from "./slices/domain.model.js";
import { File } from "./slices/file.model.js";
import { OtpValidate } from "./slices/otpValidator.model.js";
import { PendingOrder } from "./slices/PendingOrder.js";
import { Project } from "./slices/projects.model.js";
import { RenewSubscription } from "./slices/renewSubscription.model.js";
import { TempUser } from "./slices/tempUser.model.js";
import { User } from "./slices/user.Model.js";

export const Model = {
    User,
    TempUser,
    Project,
    OtpValidate,
    DeleteUserAccountModel,
    Apikey,
    File,
    Domain,
    PendingOrder,
    RenewSubscription
}