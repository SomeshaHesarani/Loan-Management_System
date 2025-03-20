const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const { initializeAdmin } = require('./controllers/authController');
const app = express();
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const loanApplication = require('./routes/loanApplication')
const member = require ('./routes/member')
const branch = require('./routes/branch');
const root = require('./routes/root');
const center = require('./routes/center');
const repayment = require('./routes/repayment');
const protectedRoutes = require('./routes/protectedRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
// const userRoutes = require('./routes/userRouter')
const HolidayRoutes = require("./routes/HolidayRoutes");
const backlistRoutes = require("./routes/backlistRoutes");
const InterestPenaltyPaymentRouter = require("./routes/InterestPenaltyPaymentRouter")





app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await initializeAdmin(); // Initialize the admin user
    })
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/members', member);
app.use('/api', branch);
app.use('/api', root);
app.use('/api/centers', center);
app.use('/api/loans', loanApplication);
app.use('/api/repayments', repayment);
app.use("/api/loan-categories", categoryRoutes);
// app.use('/api/loan-types', categoryRoutes);  // New route for loan types
app.use('/api', HolidayRoutes);
app.use("/api/blacklist", backlistRoutes);
app.use('/api/interest-penalty', InterestPenaltyPaymentRouter );







// app.use('/api/user', userRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
