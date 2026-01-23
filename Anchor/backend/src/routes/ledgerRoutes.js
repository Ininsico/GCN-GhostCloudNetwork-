const express = require('express');
const router = express.Router();
const ledger = require('../services/ledgerService');
const auth = require('../middleware/auth');

// GET /api/ledger/balance
router.get('/balance', auth.auth, async (req, res) => {
    try {
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        res.json({ credits: user.credits || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
