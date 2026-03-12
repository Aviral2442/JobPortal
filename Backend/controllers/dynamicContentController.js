const dynamicContentService = require('../service/dynamicContentService');

exports.updateDynamicContent = async (req, res) => {
    try {

        const result = await dynamicContentService.updateDynamicContent(req.body);
        res.status(result.status).json(result);

    } catch (error) {
        res.status(500).json({ status: 500, message: "An error occurred while updating dynamic content", error: error.message });
    }
}

exports.getDynamicContent = async (req, res) => {
    try {
        const result = await dynamicContentService.getDynamicContent();
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ status: 500, message: "An error occurred while retrieving dynamic content", error: error.message });
    }
}

exports.submitContactUsForm = async (req, res) => {
    try {
        console.log("Received contact us form data:", req.body);
        const result = await dynamicContentService.submitContactUsForm(req.body);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ status: 500, message: "An error occurred while submitting contact us form", error: error.message });
    }
};

exports.getContactUsSubmissions = async (req, res) => {
    try {
        const result = await dynamicContentService.getContactUsSubmissions();
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ status: 500, message: "An error occurred while retrieving contact us submissions", error: error.message });
    }
};