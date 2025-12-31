import mongoose from 'mongoose';
import cron from 'node-cron'

const projectschema = new mongoose.Schema({
  projectname: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  storageUsed: {
    type: Number,
    default: 0,
  },
  projectstoragelimit: {
    type: Number,
    default: 1024
  },
  requestsUsed: {
    type: Number,
    default: 0,
  },
  maxfilesize: {
    type: Number,
    default: 15
  },
  totalUploads: {
    type: Number,
    default: 0,
  },
  trafficused: {
    type: Number,
    default: 0
  },
  fileTypeAllowed: {
    type: [String],
    enum: ['image', 'video', 'audio' ,'document'],
    default: ['image', 'audio']
  },
  maxapikey: {
    type: Number,
    default: 1
  },
  ownapikey: {
    type: Number,
    default: 1
  },
  isOptimise: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: String,
    default: 'active',
    enum: ['active' , 'deactivate' , 'frozen'  ]
  },
  deleteatedAt: {
    type: Date,
  }
},
  { timestamps: true });

const Project = mongoose.model('Project', projectschema);

export { Project };





































async function resetRequestsUsed() {
  try {
    await User.updateMany({}, { requestsUsed: 0 });
    console.log("requestsUsed field reset to 0 for all users");
  } catch (error) {
    console.error("Error resetting requestsUsed field:", error);
  }
}

cron.schedule("0 0 1 * *", resetRequestsUsed);