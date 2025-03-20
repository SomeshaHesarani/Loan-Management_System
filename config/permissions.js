// backend/config/permissions.js
const permissions = {
    admin: ['create', 'read', 'update', 'delete'],
    manager: ['read', 'update', 'approve_loans'],
    accountant: ['read', 'update'],
    user: ['read'],
};

module.exports = permissions;