import mongoose from 'mongoose';


const apikeyschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    key: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['active', 'softdelete'],
        default: 'active',
    },
}, {
    timestamps: true
})


apikeyschema.index({ key: 1, projectid: 1 });


const Apikey = mongoose.model('Apikey', apikeyschema);

export { Apikey };