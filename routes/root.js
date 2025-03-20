const express = require('express');
const router = express.Router();
const rootController = require('../controllers/root');

// Routes for managing roots
router.get('/roots', rootController.getAllRoots);
router.post('/roots', rootController.addRoot);
router.delete('/roots/name/:name', rootController.deleteRoot);
router.patch('/roots/collector/name/:name', rootController.assignCollector);

module.exports = router;
