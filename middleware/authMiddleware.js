const jwt = require('jsonwebtoken');
const permissions = require('../config/permissions');

// Token verification middleware
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Get token from authorization header

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (!decoded || !decoded.role) {
            return res.status(400).json({ message: 'Invalid token structure' });
        }
        req.user = decoded; // Attach the decoded user to the request object
        next();
    });
};

const authorize = (requiredPermissions) => {
    return (req, res, next) => {
        const userRole = req.user.role; // Assuming user role is set in req.user
        const userPermissions = permissions[userRole] || [];

        const hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
        if (!hasPermission) {
            return res.status(403).json({ error: 'You do not have permission to perform this action' });
        }
        next();
    };
};



// Authorization middleware to check for specific permissions
const authorizePermission = (requiredPermission) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        const userPermissions = permissions[userRole] || [];
        if (!userPermissions.includes(requiredPermission)) {
            return res.status(403).json({ error: 'You do not have permission to perform this action' });
        }
        next();
    };
};

module.exports = { verifyToken, authorize, authorizePermission };