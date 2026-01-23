const fs = require("fs");
const path = require("path");

/**
 * Save base64 file (PDF / IMAGE SAFE)
 */
exports.saveBase64File = (
  base64Data,
  folderName = "MiscFiles",
  prefix = "file"
) => {
  if (!base64Data) return null;

  let fileData = base64Data;
  let ext = "bin";

  // 1️⃣ Remove data:mime;base64, if exists
  const match = base64Data.match(/^data:(.+);base64,(.*)$/);
  if (match) {
    fileData = match[2];
  }

  // 2️⃣ CLEAN base64 (🔥 VERY IMPORTANT 🔥)
  fileData = fileData
    .replace(/\s/g, "")     // remove spaces & newlines
    .replace(/-/g, "+")     // URL-safe base64
    .replace(/_/g, "/");

  const buffer = Buffer.from(fileData, "base64");

  // 3️⃣ Detect via MAGIC NUMBERS (100% reliable)

  // PDF → %PDF
  if (buffer.slice(0, 4).toString() === "%PDF") {
    ext = "pdf";
  }
  // PNG
  else if (buffer.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
    ext = "png";
  }
  // JPG
  else if (buffer.slice(0, 3).toString("hex") === "ffd8ff") {
    ext = "jpg";
  }

  // 4️⃣ Create directory
  const uploadDir = path.join("uploads", folderName);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // 5️⃣ Save file
  const fileName = `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, buffer);

  return `/${uploadDir}/${fileName}`.replace(/\\/g, "/");
};
