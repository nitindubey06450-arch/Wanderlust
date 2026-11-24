const express = require('express');
const router = express.Router();
const { getAdminStats, getAdminUsers } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);

module.exports = router;
