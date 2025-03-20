// models/Blacklist.js
const mongoose = require('mongoose');

const blacklistSchema = new mongoose.Schema(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    nationalId: { 
      type: String, 
      required: true,
      unique: true
    },
    center: { 
      type: String, 
      required: true 
    },
    isBlacklisted: { 
      type: Boolean, 
      default: true 
    },
    blacklistedAt: { 
      type: Date,
      default: Date.now
    },
    unblacklistedAt: { 
      type: Date
    }
  }, {
    timestamps: true
  });
  
  // Index for faster queries
  blacklistSchema.index({ nationalId: 1 });
  blacklistSchema.index({ isBlacklisted: 1 });
const Blacklist = mongoose.model('Blacklist', blacklistSchema);

module.exports = Blacklist;