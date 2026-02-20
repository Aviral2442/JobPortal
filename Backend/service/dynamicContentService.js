const DynamicContentModel = require('../models/DynamicContentModel');

exports.updateDynamicContent = async (dynamicContentData) => {
    try {

        const updateData = {};

        if (dynamicContentData.privacyPolicy) { updateData.privacyPolicy = dynamicContentData.privacyPolicy; }
        if (dynamicContentData.aboutUs) { updateData.aboutUs = dynamicContentData.aboutUs; }
        if (dynamicContentData.helpCenter) { updateData.helpCenter = dynamicContentData.helpCenter; }
        if (dynamicContentData.contactSupportNumber) { updateData.contactSupportNumber = dynamicContentData.contactSupportNumber; }
        if (dynamicContentData.contactSupportEmail) { updateData.contactSupportEmail = dynamicContentData.contactSupportEmail; }

        const updatedContent = await DynamicContentModel.findOneAndUpdate(
            {},
            { $set: updateData },
            { new: true, upsert: true }
        ).exec();

        return { status: 200, message: "Dynamic content updated successfully", jsonData: updatedContent };

    } catch (error) {
        return { status: 500, message: "An error occurred while updating dynamic content: " + error.message, jsonData: {} };
    }
};