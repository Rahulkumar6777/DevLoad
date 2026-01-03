import mongoose from "mongoose"

const DomainSchema = new mongoose.Schema({
    projectid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    alloweddomain: {
        type: [String],
        required: true
    },

} ,{timestamps: true})

export const Domain = mongoose.model('Domain' , DomainSchema);