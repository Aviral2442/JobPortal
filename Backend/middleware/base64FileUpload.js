const fs = require("fs");
const path = require("path");

/**
 * Save raw base64 file (IMAGE / PDF)
 * ✔ works without data:mime;base64,
 * ✔ detects file via magic numbers
 */
exports.saveBase64File = (
  base64Data,
  folderName = "MiscFiles",
  prefix = "file"
) => {
  if (!base64Data || typeof base64Data !== "string") return null;

  let fileData = base64Data;
  let ext = "bin";

  // Remove data:mime;base64, if exists
  const match = base64Data.match(/^data:(.+);base64,(.*)$/);
  if (match) {
    fileData = match[2];
  }

  // 2️⃣ CLEAN base64 (🔥 VERY IMPORTANT 🔥) 
  fileData = fileData
    .replace(/\s/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const buffer = Buffer.from(fileData, "base64");

  // Detect file type using magic numbers
  if (buffer.slice(0, 4).toString() === "%PDF") {
    ext = "pdf";
  } else if (buffer.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
    ext = "png";
  } else if (buffer.slice(0, 3).toString("hex") === "ffd8ff") {
    ext = "jpg";
  }

  // Create directory if not exists
  const uploadDir = path.join("uploads", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Create file name
  const fileName = `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/${uploadDir}/${fileName}`.replace(/\\/g, "/");
};
