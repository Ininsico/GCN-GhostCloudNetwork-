const express = require('express');
const router = express.Router();
const clusterController = require('../controllers/clusterController');
const { auth } = require('../middleware/auth');

router.get('/', auth, clusterController.getClusters);
router.post('/', auth, clusterController.createCluster);
router.get('/:id/terraform', auth, clusterController.exportTerraform);
router.delete('/:id', auth, clusterController.deleteCluster);

module.exports = router;
