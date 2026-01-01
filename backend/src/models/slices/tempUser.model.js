import mongoose from "mongoose";

const tempuserschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
       type: String,
        required: true,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }
})

export const TempUser = mongoose.model('TempUser' , tempuserschema)