const Member = require('../models/member');
const Loan = require('../models/loanApplication');
const Repayment = require('../models/repayment');

// Fetch member data based on the loan type
exports.getMemberDataByLoanType = async (req, res) => {
  try {
    const loanTypeId = req.params.loanTypeId;

    // Aggregate member data
    const members = await Member.aggregate([
      { $match: { loanTypeId: mongoose.Types.ObjectId(loanTypeId) } }, // Match members based on loanTypeId
      {
        $lookup: {
          from: 'loans',
          localField: '_id',
          foreignField: 'memberId',
          as: 'loanData',
        },
      },
      {
        $lookup: {
          from: 'repayments',
          localField: '_id',
          foreignField: 'memberId',
          as: 'repaymentData',
        },
      },
      {
        $project: {
          name: 1,
          group: 1,
          center: 1,
          loanAppliedAmount: { $sum: '$loanData.amount' },
          repaymentAppliedAmount: { $sum: '$repaymentData.amount' },
          outstandingAmount: {
            $subtract: [
              { $sum: '$loanData.amount' },
              { $sum: '$repaymentData.amount' },
            ],
          },
        },
      },
    ]);
    
    res.json(members);
  } catch (error) {
    console.error('Error fetching member data:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Reverse penalty and interest rate
exports.reversePenaltyInterest = async (req, res) => {
  try {
    const memberId = req.params.memberId;

    // Assuming you have penalty and interest fields in the Member model, update them to 0
    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Update penalty and interest fields (assuming you have these fields in the schema)
    member.penalty = 0;
    member.interestRate = 0;
    await member.save();

    res.json({ message: 'Penalty and interest reversed successfully.' });
  } catch (error) {
    console.error('Error reversing penalty/interest:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
