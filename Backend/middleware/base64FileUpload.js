const fs = require("fs");
const path = require("path");

/**
 * Save base64 file to disk
 * Supports:
 *  - pure base64 string
 *  - data:image/png;base64,...
 *
 * @param {string} base64Data
 * @param {string} folderName
 * @param {string} prefix
 * @returns {string|null} file path
 */
exports.saveBase64File = (
  base64Data,
  folderName = "MiscFiles",
  prefix = "file"
) => {
  if (!base64Data) return null;

  let fileData = base64Data;
  let ext = "bin";

  // ✅ Handle data:image/...;base64,
  const matches = base64Data.match(/^data:(.+);base64,(.+)$/);

  if (matches) {
    const mimeType = matches[1];        // image/png
    fileData = matches[2];              // actual base64
    ext = mimeType.split("/")[1] || "bin";
  }

  const buffer = Buffer.from(fileData, "base64");

  const uploadDir = path.join("uploads", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${prefix}-${Date.now()}-${Math.round(
    Math.random() * 1e9
  )}.${ext}`;

  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/${uploadDir}/${fileName}`.replace(/\\/g, "/");
};
