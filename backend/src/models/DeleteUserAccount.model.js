import mongoose from 'mongoose';

const DeleteUserAccount = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    noNewCreate: {
        type: Boolean,
        default: false,  
    },
    createdAt: {
        type: Date,
        expires: 2592000, 
        default: Date.now,
    },
})

export const DeleteUserAccountModel = mongoose.model('DeleteUserAccount', DeleteUserAccount);