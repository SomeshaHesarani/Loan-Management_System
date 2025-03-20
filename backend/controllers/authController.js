const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const permissions = require('../config/permissions');

const registerUser = async (req, res) => {
    const { username, password, role } = req.body;

    console.log('Request payload:', req.body);

    if (!username || !password || !role) {
        console.log('Validation failed: Missing fields');
        return res.status(400).json({ error: 'Please provide username, password, and role' });
    }

    const validRoles = ['admin', 'manager', 'user'];
    if (!validRoles.includes(role)) {
        console.log('Validation failed: Invalid role');
        return res.status(400).json({ error: 'Invalid role provided' });
    }

    try {
        const existingUser = await User.findOne({ username });
        console.log('Existing user check:', existingUser);
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed');

        const newUser = new User({ username, password: hashedPassword, role });
        await newUser.save();
        console.log('New user saved:', newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ error: 'Error registering user' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please provide both username and password' });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Fetch permissions based on role dynamically
        const userPermissions = permissions[user.role] || [];

        res.status(200).json({
            token,
            role: user.role,
            permissions: userPermissions, // Include permissions for the logged-in user
        });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
};

const initializeAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10); // Default password
            const adminUser = new User({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
            });
            await adminUser.save();
            console.log('Default admin user created');
        } else {
            console.log('Admin user already exists');

            // Additional logic if admin already exists
            const existingAdmin = await User.findOne({ username: 'admin' });
            if (existingAdmin) {
                console.log("Admin user already exists in MongoDB");
                return;
            }

            const userCode = Generator.generateCode("ADMIN");

            // Hash the password before saving
            const hashedPassword = await bcrypt.hash('admin123', 10);

            const newAdminUser = new User({
                username: 'admin',
                role: 'admin', 
                loginTime: "",
                isAdmin: true,
                isUser: false,
                activeState: true,
                password: hashedPassword,
            });

            await newAdminUser.save();
            console.log("Admin user saved to MongoDB");
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
    }
};

module.exports = { registerUser, loginUser, initializeAdmin };