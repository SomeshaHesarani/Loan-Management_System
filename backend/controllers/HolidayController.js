// controllers/HolidayController.js
const Category = require('../models/Category'); // Loan Type model
const Holiday = require('../models/Holiday'); // Holiday model (if needed for your app)
const  center = require ('../models/center');


// Get loan types
const getLoanTypes = async (req, res) => {
  try {
    const loanTypes = await Category.find({ isDeleted: false }); // Only return active loan types
    res.json(loanTypes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan types', error });
  }
};
// Fetch centers
const getCenters = async (req, res) => {
    try {
      const centers = await Center.find();
      res.json(centers);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching centers', error });
    }
  };
  
  // Fetch loans with optional filters
  const getLoans = async (req, res) => {
    const { loanType, center } = req.query;
  
    const filters = {};
    if (loanType) filters.loanType = loanType;
    if (center) filters.center = center;
  
    try {
      const loans = await Loan.find(filters)
        .populate('loanType', 'name') // Populate loan type
        .populate('center', 'name') // Populate center
        .exec();
  
      res.json(loans.map((loan) => ({
        customerName: loan.customerName,
        loanAmount: loan.loanAmount,
        group: loan.group,
        center: loan.center.name,
        loanName: loan.loanName,
        loanFrequency: loan.loanFrequency,
        loanDuration: loan.loanDuration,
      })));
    } catch (error) {
      res.status(500).json({ message: 'Error fetching loans', error });
    }
  };

  const getrepayLoans = async (req, res) => {
    try {
      const { loanId } = req.params;
  
      let loans;
  
      if (loanId) {
        // Find the loan by loanId and ensure it's approved
        loans = await Loan.findOne({ _id: loanId, status: 'Approved' })
          .populate('member', 'firstName nationalId phone memberCategory branch root') // Populate only required fields
          .exec();
  
        if (!loans) {
          return res.status(404).json({ message: `Loan with ID ${loanId} not found.` });
        }
      } else {
        // Find all approved loans
        loans = await loans.find({ status: 'Approved' })
          .populate('member', 'firstName nationalId phone memberCategory branch root') // Populate only required fields
          .exec();
  
        if (!loans || loans.length === 0) {
          return res.status(404).json({ message: 'No approved loans found.' });
        }
      }
  
      // Respond with loan details
      res.status(200).json({ data: loans });
    } catch (error) {
      console.error('Error fetching loan details:', error);
      res.status(500).json({ message: 'Error fetching loan details', error: error.message });
    }
  };





// Fetch loan categories by type
const getLoanCategoriesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const loanCategories = await Category.find({ type, isDeleted: false });
    
    if (loanCategories.length === 0) {
      return res.status(404).json({ message: 'No loan categories available for the selected type' });
    }
    res.json(loanCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching loan categories', error });
  }
};

// Fetch members by loan type
const getMembersByLoanType = async (req, res) => {
  try {
    const { loanType } = req.params;
    const members = await Member.find({ loanType })
      .select('firstName lastName'); // Fetch only necessary fields
    
    const enrichedMembers = members.map((member) => ({
      _id: member._id,
      fullName: `${member.firstName} ${member.lastName}`,
    }));
    
    res.json(enrichedMembers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching members', error });
  }
};
// Add a new holiday
const addHoliday = async (req, res) => {
  const { date, name, description } = req.body;

  try {
    const holiday = new Holiday({ date, name, description });
    await holiday.save();
    res.status(201).json({ message: 'Holiday added successfully', holiday });
  } catch (error) {
    res.status(500).json({ message: 'Error adding holiday', error });
  }
};

// Get all holidays
const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.find();
    res.status(200).json(holidays);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching holidays', error });
  }
};


module.exports = { getLoanCategoriesByType, getLoanTypes, getCenters, getLoans, getrepayLoans, getMembersByLoanType,addHoliday,getHolidays };

  
  