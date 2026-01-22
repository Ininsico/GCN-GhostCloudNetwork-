const express = require('express');
const router = express.Router();
const nodeController = require('../controllers/nodeController');
const { auth } = require('../middleware/auth');

router.get('/', auth, nodeController.getNodes);
router.post('/register', auth, nodeController.registerNode);
router.post('/heartbeat', nodeController.heartbeat); // Heartbeat typically uses token in body or API key, but let's keep it open for now or add auth if verified

module.exports = router;
