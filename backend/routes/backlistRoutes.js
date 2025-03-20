// / routes/blacklistRoutes.js
const express = require('express');
const router = express.Router();
const {
  blacklistMember,
  unblacklistMember,
  getMemberByNationalId,
  
} = require('../controllers/backlistController');

router.get("/:nationalId", getMemberByNationalId);
router.put("/blacklist/:nationalId", blacklistMember);
router.put("/unblacklist/:nationalId", unblacklistMember);

// Get all blacklisted members
// router.get('/blacklisted', getAllBlacklistedMembers);

module.exports = router;