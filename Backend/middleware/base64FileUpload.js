const fs = require("fs");
const path = require("path");

/**
 * Save raw base64 file (IMAGE / PDF)
 * ✔ works with /iVBORw0KGgo...
 * ✔ works without data:mime;base64,
 * ✔ auto-detects file via magic numbers
 */
exports.saveBase64File = (
  base64Data,
  folderName = "MiscFiles",
  prefix = "file"
) => {
  if (!base64Data || typeof base64Data !== "string") return null;

  let fileData = base64Data.trim();
  let ext = "bin";

  // 1️⃣ Remove data:mime;base64, if exists
  const match = fileData.match(/^data:(.+);base64,(.*)$/);
  if (match) {
    fileData = match[2];
  }

  // 2️⃣ Remove INVALID leading slash (🔥 MAIN FIX 🔥)
  if (fileData.startsWith("/")) {
    fileData = fileData.substring(1);
  }

  // 3️⃣ Normalize base64 (URL-safe → standard)
  fileData = fileData
    .replace(/\s/g, "")
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  // 4️⃣ Fix missing padding
  while (fileData.length % 4 !== 0) {
    fileData += "=";
  }

  const buffer = Buffer.from(fileData, "base64");

  // 5️⃣ Detect file type using magic numbers
  if (buffer.slice(0, 4).toString() === "%PDF") {
    ext = "pdf";
  } else if (buffer.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
    ext = "png";
  } else if (buffer.slice(0, 3).toString("hex") === "ffd8ff") {
    ext = "jpg";
  }

  // 6️⃣ Create directory if not exists
  const uploadDir = path.join("uploads", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 7️⃣ Create file
  const fileName = `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  return `/${uploadDir}/${fileName}`.replace(/\\/g, "/");
};
