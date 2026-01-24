const fs = require("fs");
const path = require("path");

exports.saveBase64File = (
  base64Data,
  folderName = "MiscFiles",
  fileName = "file",
  extension = "bin" // 👈 extension from user
) => {
  // remove data:mime;base64, if present
  const cleanBase64 = base64Data.includes(",")
    ? base64Data.split(",")[1]
    : base64Data;

  const buffer = Buffer.from(cleanBase64, "base64");

  // create directory
  const uploadDir = path.join("uploads", folderName);
  fs.mkdirSync(uploadDir, { recursive: true });

  // save file with extension
  const finalFileName = `${fileName}-${Date.now()}.${extension}`;
  const filePath = path.join(uploadDir, finalFileName);

  fs.writeFileSync(filePath, buffer);

  return `/${uploadDir}/${finalFileName}`.replace(/\\/g, "/");
};
