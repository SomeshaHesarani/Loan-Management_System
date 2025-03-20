const Member = require('../models/member');
const Loan = require('../models/loanApplication'); // Make sure the loan model is imported

// Function to generate unique account numbers
const generateUniqueAccountNumber = async () => {
    let accountNumber;
    let exists = true;

    do {
        const randomDigits = Math.floor(10000 + Math.random() * 90000); // Generate 5 random digits
        accountNumber = `Acc${randomDigits}`;
        const existingMember = await Member.findOne({ accountNumber });
        exists = !!existingMember; // Check if the generated account number already exists
    } while (exists);

    return accountNumber;
};

// Add Member
exports.addMember = async (req, res) => {
    try {
        const accountNumber = await generateUniqueAccountNumber();

        const newMember = new Member({
            ...req.body,
            accountNumber, // Set the generated account number
        });

        if (req.file) {
            newMember.idPhoto = req.file.path; // Add file path if photo is uploaded
        }

        await newMember.save();
        res.status(201).json({ message: 'Member added successfully', member: newMember });
    } catch (error) {
        console.error('Error adding member:', error);
        res.status(400).json({ message: 'Error adding member', error });
    }
};

// Get All Members
exports.getMembers = async (req, res) => {
    try {
        const members = await Member.find({}, 'accountNumber branch center firstName nationalId group phone memberCategory root');
        res.status(200).json({ data: members });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ message: 'Error fetching members', error });
    }
};

// Get Single Member
exports.getMemberById = async (req, res) => {
    try {
        const member = await Member.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        res.status(200).json({ member });
    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({ message: 'Error fetching member', error });
    }
};

// Update Member
exports.updateMember = async (req, res) => {
    try {
        console.log('Updating member with ID:', req.params.id); // Debugging line
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMember) return res.status(404).json({ message: 'Member not found' });

        res.status(200).json({ message: 'Member updated successfully', member: updatedMember });
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(400).json({ message: 'Error updating member', error });
    }
};

// Delete Member (Set activeStatus to false)
exports.deleteMember = async (req, res) => {
    try {
        const updatedMember = await Member.findByIdAndUpdate(req.params.id, { activeStatus: false }, { new: true });
        if (!updatedMember) return res.status(404).json({ message: 'Member not found' });

        res.status(200).json({ message: 'Member marked as inactive successfully' });
    } catch (error) {
        console.error('Error updating member status:', error);
        res.status(500).json({ message: 'Error marking member as inactive', error });
    }
};

exports.getMembersFirstNames = async (req, res) => {
    try {
        const members = await Member.find({}, 'firstName'); // Fetch only `firstName` and `_id`
        res.json({ success: true, data: members });
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch members' });
    }
};

exports.getMembersCount = async (req, res) => {
    try {
        console.log("Fetching member count...");
        const memberCount = await Member.countDocuments(); // This should just return a count.
        console.log('Member count:', memberCount);
        res.status(200).json({ count: memberCount });
    } catch (error) {
        console.error('Error fetching member count:', error);
        res.status(500).json({ message: 'Error fetching member count', error });
    }
};

// Get All Members by Account Number
exports.getAllMembersById = async (req, res) => {
    try {
        const { accountNumber } = req.query; // Get accountNumber from query params
        if (!accountNumber) {
            return res.status(400).json({ message: 'Account number is required' });
        }

        const members = await Member.find({ accountNumber: accountNumber }); // Search members by account number
        if (members.length === 0) {
            return res.status(404).json({ message: 'No members found with this account number' });
        }

        res.status(200).json({ data: members });
    } catch (error) {
        console.error('Error fetching members by ID:', error);
        res.status(500).json({ message: 'Error fetching members by ID', error });
    }
};

// Get All Members by Name
exports.getAllMembersByName = async (req, res) => {
    try {
        const { name } = req.query; // Get name from query params
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const members = await Member.find({ firstName: { $regex: name, $options: 'i' } }); // Search by first name (case-insensitive)
        if (members.length === 0) {
            return res.status(404).json({ message: 'No members found with this name' });
        }

        res.status(200).json({ data: members });
    } catch (error) {
        console.error('Error fetching members by name:', error);
        res.status(500).json({ message: 'Error fetching members by name', error });
    }
};

// Assuming Loan and Customer are models
exports.getMemberByLoanTypeAndId = async (req, res) => {
    const { idNumber, loanType } = req.params;
  
    try {
        // Find loan by loanType and customer ID
        const loan = await Loan.findOne({ loanType, idNumber }); // Corrected the loan model reference
  
        if (!loan) {
            return res.status(404).json({ message: "Loan or customer not found for the given ID and loan type" });
        }
  
        // Find customer associated with the loan
        const customer = await Member.findOne({ idNumber });
  
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
  
        res.status(200).json({ member: customer, loan });
    } catch (error) {
        console.error("Error fetching customer data:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get Members by Loan Type
exports.getMemberByLoanType = async (req, res) => {
    try {
        const { loanType } = req.params;  // Extract loanType from URL params

        // Find all members that have the specified loanType
        const members = await Member.find({ loanType });

        // Check if any members exist
        if (members.length === 0) {
            return res.status(404).json({ message: 'No members found for this loan type' });
        }

        // Return the members found
        res.status(200).json({ data: members });
    } catch (error) {
        console.error('Error fetching members by loan type:', error);
        res.status(500).json({ message: 'Error fetching members by loan type', error });
    }
};
// Get Member by Name (Return ID only)
exports.getIdByName = async (req, res) => {
    try {
        const { name } = req.query; // Get name from query params
        if (!name) {
            return res.status(400).json({ message: 'Name is required' });
        }

        // Search members by first name (case-insensitive)
        const members = await Member.find({ firstName: { $regex: name, $options: 'i' } });

        if (members.length === 0) {
            return res.status(404).json({ message: 'No members found with this name' });
        }

        // Return the ID(s) of the members that match the name
        const memberIds = members.map(member => member._id);
        res.status(200).json({ data: memberIds });
    } catch (error) {
        console.error('Error fetching member by name:', error);
        res.status(500).json({ message: 'Error fetching member by name', error });
    }
};


// Fetch all members
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.json({ success: true, data: members });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Get Member Status (Blacklist Status)
exports.getMemberStatus = async (req, res) => {
    try {
        const { nationalId } = req.params;
        const member = await Member.findOne({ nationalId });

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                name: member.firstName,
                isBlacklisted: member.isBlacklisted,
            },
        });
    } catch (error) {
        console.error('Error fetching member status:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

exports.blacklistMember = async (req, res) => {
    try {
        const { nationalId } = req.params;
        const member = await Member.findOneAndUpdate(
            { nationalId },
            { isBlacklisted: true }, // Mark as blacklisted
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.status(200).json({ success: true, message: 'Member blacklisted successfully', data: member });
    } catch (error) {
        console.error('Error blacklisting member:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


exports.unblacklistMember = async (req, res) => {
    try {
        const { nationalId } = req.params;
        const member = await Member.findOneAndUpdate(
            { nationalId },
            { isBlacklisted: false }, // Remove from blacklist
            { new: true }
        );

        if (!member) {
            return res.status(404).json({ success: false, message: 'Member not found' });
        }

        res.status(200).json({ success: true, message: 'Member unblacklisted successfully', data: member });
    } catch (error) {
        console.error('Error unblacklisting member:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


// Get All Members by Account Number
exports.getAllMembersById = async (req, res) => {
    try {
        const { accountNumber } = req.query;
        if (!accountNumber) {
            return res.status(400).json({ success: false, message: 'Account number is required' });
        }

        const members = await Member.find({ accountNumber });
        if (members.length === 0) {
            return res.status(404).json({ success: false, message: 'No members found with this account number' });
        }

        res.status(200).json({ success: true, data: members });
    } catch (error) {
        console.error('Error fetching members by account number:', error);
        res.status(500).json({ success: false, message: 'Error fetching members by account number', error: error.message });
    }
};

// Blacklist a member
exports.blacklistMember = async (req, res) => {
    try {
      const { nationalId } = req.body;
      const member = await Member.findOneAndUpdate(
        { nationalId },
        { isBlacklisted: true },
        { new: true }
      );
  
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
  
      res.json({ message: "Member blacklisted successfully", member });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };
  
  // Unblacklist a member
  exports.unblacklistMember = async (req, res) => {
    try {
      const { nationalId } = req.body;
      const member = await Member.findOneAndUpdate(
        { nationalId },
        { isBlacklisted: false },
        { new: true }
      );
  
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
  
      res.json({ message: "Member removed from blacklist", member });
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  };

//   / Get member details by National ID
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
  
