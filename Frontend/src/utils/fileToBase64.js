/**
 * Convert a file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<{base64: string, extension: string}>} Base64 string without data URL prefix and file extension
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = () => {
      try {
        // Get the base64 string and remove the data URL prefix
        const base64String = reader.result.split(',')[1];
        
        // Extract extension from file name
        const extension = file.name.split('.').pop().toLowerCase();
        
        resolve({
          base64: base64String,
          extension: extension
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Convert multiple files to base64 strings
 * @param {FileList|Array<File>} files - The files to convert
 * @returns {Promise<{base64Files: string[], extensions: string[]}>} Arrays of base64 strings and extensions
 */
export const filesToBase64 = async (files) => {
  if (!files || files.length === 0) {
    return { base64Files: [], extensions: [] };
  }

  const fileArray = Array.from(files);
  const promises = fileArray.map(file => fileToBase64(file));
  
  try {
    const results = await Promise.all(promises);
    const base64Files = results.map(result => result.base64);
    const extensions = results.map(result => result.extension);
    
    return { base64Files, extensions };
  } catch (error) {
    throw new Error(`Failed to convert files: ${error.message}`);
  }
};

/**
 * Validate file type
 * @param {File} file - The file to validate
 * @param {Array<string>} allowedTypes - Array of allowed file extensions
 * @returns {boolean} True if valid, false otherwise
 */
export const validateFileType = (file, allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']) => {
  if (!file) return false;
  
  const extension = file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(extension);
};

/**
 * Validate file size
 * @param {File} file - The file to validate
 * @param {number} maxSizeInMB - Maximum file size in MB (default: 5MB)
 * @returns {boolean} True if valid, false otherwise
 */
export const validateFileSize = (file, maxSizeInMB = 5) => {
  if (!file) return false;
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};
