const fs = require('fs');
const path = require('path');

/**
 * Save base64 file to disk
 * @param {string} base64Data - data:image/png;base64,xxxx
 * @param {string} folderName - uploads subfolder
 * @param {string} prefix - filename prefix
 */
exports.saveBase64File = (base64Data, folderName = 'MiscFiles', prefix = 'file') => {
    if (!base64Data) return null;

    // Match base64 format
    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
        throw new Error('Invalid base64 file format');
    }

    const mimeType = matches[1];
    const fileData = matches[2];

    // Get file extension
    const ext = mimeType.split('/')[1];
    const buffer = Buffer.from(fileData, 'base64');

    const uploadDir = path.join('uploads', folderName);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, buffer);

    return `/${uploadDir}/${fileName}`.replace(/\\/g, '/');
};
