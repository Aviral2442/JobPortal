const express = require('express');
const router = express.Router();
const DynamicContentController = require('../controllers/dynamicContentController');

// Dynamic Content Routes
router.put('/update_dynamic_content', DynamicContentController.updateDynamicContent);
router.get('/get_dynamic_content', DynamicContentController.getDynamicContent);

router.post('/submit_contact_us_form', DynamicContentController.submitContactUsForm);
router.get('/get_contact_us_submissions', DynamicContentController.getContactUsSubmissions);

module.exports = router;