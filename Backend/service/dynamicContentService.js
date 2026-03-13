const DynamicContentModel = require('../models/DynamicContentModel');
const ContactUsModel = require('../models/ContactUsModel');

exports.updateDynamicContent = async (dynamicContentData) => {
    try {
        const updateData = {};

        if (dynamicContentData.privacyPolicy) { updateData.privacyPolicy = dynamicContentData.privacyPolicy; }
        if (dynamicContentData.aboutUs) { updateData.aboutUs = dynamicContentData.aboutUs; }
        if (dynamicContentData.helpCenter) { updateData.helpCenter = dynamicContentData.helpCenter; }
        if (dynamicContentData.contactSupportNumber) { updateData.contactSupportNumber = dynamicContentData.contactSupportNumber; }
        if (dynamicContentData.contactSupportEmail) { updateData.contactSupportEmail = dynamicContentData.contactSupportEmail; }
        if (dynamicContentData.termsAndConditions) { updateData.termsAndConditions = dynamicContentData.termsAndConditions; }

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

exports.getDynamicContent = async () => {
    try {
        const dynamicContent = await DynamicContentModel.findOne({}).exec();
        if (!dynamicContent) {
            return { status: 404, message: "Dynamic content not found", jsonData: {} };
        }
        return { status: 200, message: "Dynamic content retrieved successfully", jsonData: dynamicContent };
    } catch (error) {
        return { status: 500, message: "An error occurred while retrieving dynamic content: " + error.message, jsonData: {} };
    }
};

exports.submitContactUsForm = async (contactData) => {
    try {
        const contactUs = new ContactUsModel(contactData);
        await contactUs.save();
        return { status: 200, message: "Contact us form submitted successfully", jsonData: {} };
    } catch (error) {
        return {
            status: 500,
            message: "An error occurred while submitting contact us form: " + error.message,
            jsonData: {}
        }
    }
};

exports.getContactUsSubmissions = async () => {
    try {
        const submissions = await ContactUsModel.find({}).sort({ createdAt: -1 }).exec();
        return { status: 200, message: "Contact us submissions retrieved successfully", jsonData: submissions };
    } catch (error) {
        return {
            status: 500,
            message: "An error occurred while retrieving contact us submissions: " + error.message,
            jsonData: []
        }
    }
};