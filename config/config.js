require('dotenv').config(); // Load environment variables

module.exports = {
    PORT: process.env.PORT || 4000, // Default to 3000 if no PORT is set
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/loanmanagementsystem', // Default MongoDB URI
};
