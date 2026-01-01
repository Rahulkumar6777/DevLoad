import mongoose from 'mongoose'

const fileschema = new mongoose.Schema({

    originalfilename: {
        type: String,
    },
    type: {
        type: String
    },
    filename: {
        type: String
    },
    size: {
        type: Number
    },
    publicUrl: {
        type: String
    },
    downloadeUrl: {
        type: String
    },
    fDeleteUr: {
        type: String
    },
    deleteUrl: {
        type: String
    },
    projectid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['active'],
        default: 'active'
    },
}, { timestamps: true })
export const File = mongoose.model("File", fileschema)