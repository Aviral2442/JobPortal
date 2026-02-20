const express = require('express');
const router = express.Router();
const DynamicContentController = require('../controllers/dynamicContentController');

// Dynamic Content Routes
router.put('/update_dynamic_content', DynamicContentController.updateDynamicContent);
router.get('/get_dynamic_content', DynamicContentController.getDynamicContent);

module.exports = router;