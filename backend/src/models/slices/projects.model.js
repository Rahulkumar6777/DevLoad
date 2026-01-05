import mongoose from 'mongoose';

const projectschema = new mongoose.Schema({
  projectname: {
    type: String,
    default: "New Project"
  },
  description: {
    type: String,
    default: "default Project"
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
    default: 1073741824
  },
  storageProcessing: {
    type: Number,
    default: 0
  },
  requestsUsed: {
    type: Number,
    default: 0,
  },
  maxfilesize: {
    type: Number,
    default: 52428800
  },
  totalUploads: {
    type: Number,
    default: 0,
  },
  totaloptimisedfile: {
    type: Number,
    default: 0
  },
  optimisedRawBytes: {
    type: Number,
    default: 0
  },
  optimisedFinalBytes: {
    type: Number,
    default: 0
  },
  savedStorage: {
    type: Number,
    default: 0
  },
  trafficused: {
    type: Number,
    default: 0
  },
  fileTypeAllowed: {
    type: [String],
    enum: ['image', 'video', 'audio'],
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
    enum: ['active', 'softdelete', 'frozen']
  },
  deleteatedAt: {
    type: Date,
  },
  emailSendPreference: {
    type: Boolean,
    default: true
  },

},
  { timestamps: true });

const Project = mongoose.model('Project', projectschema);

export { Project };
