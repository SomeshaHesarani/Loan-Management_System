const express = require('express');
const multer = require('multer');
const { addMember, getMembers, getMemberById,getAllMembersById,getAllMembersByName, updateMember, deleteMember,getMembersCount,getMemberByLoanTypeAndId,getMembersByLoanType ,getIdByName,getMemberStatus,blacklistMember,unblacklistMember,getMemberByNationalId } = require('../controllers/members');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Configure upload destination

router.post('/', upload.single('idPhoto'), addMember);
router.get('/', getMembers);
router.get('/:id', getMemberById);
router.put('/:id', updateMember); // Ensure this route uses PUT method for updates
router.delete('/:id', deleteMember);
router.get('/count', getMembersCount);
router.get('/by-id', getAllMembersById); // Get all members by ID
router.get('/by-name', getAllMembersByName); // Get all members by Name
router.get('/by-loan/:idNumber/:loanType', getMemberByLoanTypeAndId); // Add this new route
router.get('/members/:idNumber', getMemberById); // Use idNumber in the route path
router.get('/get-id-by-name', getIdByName);

// Get member status
router.get('/:nationalId/status', getMemberStatus);

// Blacklist a member
router.post('/:nationalId/blacklist',blacklistMember);

// Unblacklist a member
router.post('/:nationalId/unblacklist', unblacklistMember);
router.get("/:nationalId", getMemberByNationalId);


module.exports = router;
