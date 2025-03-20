const Member = require('../models/member');
const Blacklist = require('../models/backlistcustomer'); // Assuming this model is for blacklisted customers

// Get member details by National ID
exports.getMemberByNationalId = async (req, res) => {
  try {
    const { nationalId } = req.params;
    const member = await Member.findOne({ nationalId });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Blacklist a member - also save their data to the Blacklist collection
exports.blacklistMember = async (req, res) => {
  try {
    const { nationalId } = req.params;
    
    // Find the member by nationalId
    const member = await Member.findOne({ nationalId });

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Update the member's 'isBlacklisted' field
    member.isBlacklisted = true;
    await member.save();

    // Now save the member to the blacklist collection
    const blacklistEntry = new Blacklist({
      nationalId: member.nationalId,
      firstName: member.firstName,
      lastName: member.lastName,
      loanAmount: member.loanAmount,
      loanCategory: member.loanCategory,
      blacklistedAt: new Date(),
    });

    await blacklistEntry.save(); // Save to blacklist collection

    res.json({ message: "Member blacklisted and saved to blacklist successfully", member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unblacklist a member
exports.unblacklistMember = async (req, res) => {
  try {
    const { nationalId } = req.params;

    // Find the member by nationalId and unblacklist
    const member = await Member.findOneAndUpdate(
      { nationalId },
      { isBlacklisted: false },
      { new: true }
    );

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    res.json({ message: "Member unblacklisted successfully", member });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all blacklisted members from the blacklist collection
exports.getAllBlacklistedMembers = async (req, res) => {
  try {
    const blacklistedMembers = await Blacklist.find();

    if (!blacklistedMembers.length) {
      return res.status(404).json({ message: "No blacklisted members found" });
    }

    res.json(blacklistedMembers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
