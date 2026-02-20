const dynamicContentService = require('../service/dynamicContentService');

exports.updateDynamicContent = async (req, res) => {
    try {

        const result = await dynamicContentService.updateDynamicContent(req.body);
        res.status(result.status).json(result);

    } catch (error) {
        res.status(500).json({ status: 500, message: "An error occurred while updating dynamic content", error: error.message });
    }
}