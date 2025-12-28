import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userschema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    default: "free",
    enum: ["free", "member"],
  },
  subscriptionStart: {
    type: Date,
  },
  subscriptionEnd: {
    type: Date,
  },
  subscriptionId: {
    type: String,
    default: null,
  },
  storageUsed: {
    type: Number,
    default: 0,
  },
  maxStorage: {
    type: Number,
    default: 1024,
    enum: [1024, 5120],
  },
  requestsUsed: {
    type: Number,
    default: 0,
  },
  maxRequests: {
    type: Number,
    default: 1500,
    enum: [1500, 15000],
  },
  currentProject: {
    type: Number,
  },
  totalProject: {
    type: Number,
    default: 1,
    enum: [1, 5],
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "banned"],
  },
  suspensionEnd: {
    type: Date,
  },
  refreshtoken: {
    type: String,
  },
  isUnderRenew: {
    type: Boolean,
    default: false,
  },
});


// hash passwrd before save
userschema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});


// compare hash and userEntered Password
userschema.methods.checkpassword = async function (oldpassword) {
  const result1 = await bcrypt.compare(oldpassword, this.password);
  return result1;
};


// generate socketToken for validate socket connection
userschema.methods.generateSocketToken = async function (params) {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.SOCKET_TOKEN_SECRET,
        {
            expiresIn: process.env.SOCKET_TOKEN_EXPIRY
        }
    )
}


// make accesstoken
userschema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};


userschema.methods.generateRefreshToken = async function (userAgent, ip) {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};


export const User = mongoose.model("User", userschema);
