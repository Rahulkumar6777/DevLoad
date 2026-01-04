import mongoose from "mongoose";

const renewsubscriptionschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "User"
    },
    isproject: {
        type: String,
        default: 'yes'
    },
    activeproject: {
        type: Number,
        default: 0
    },
    activeprojectid: {
        type: String,
    },
    isactiveprojectmorethan1gb: {
        type: String,
        default: 'no'
    },
    isactiveprojectmorethan1gbsize: {
        type: Number
    },
    isfrozenprojecthave: {
        type: String,
        default: 'no'
    },
    frozenproject: {
        type: Number,
        default: 0
    },
    frozenprojectid: {
        type: [String],
    },
    datadeletationdate: {
        type: Date
    },

})


export const RenewSubscription =  mongoose.model('RenewSubscription' , renewsubscriptionschema)