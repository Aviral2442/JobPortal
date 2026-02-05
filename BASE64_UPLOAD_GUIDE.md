# Base64 File Upload Integration Guide

## Overview
This guide explains how to use the base64 file conversion utilities and components in the Job Portal application.

## Files Created

### 1. `src/utils/fileToBase64.js`
Utility functions for converting files to base64 format.

**Functions:**
- `fileToBase64(file)` - Converts a single file to base64
- `filesToBase64(files)` - Converts multiple files to base64
- `validateFileType(file, allowedTypes)` - Validates file extension
- `validateFileSize(file, maxSizeInMB)` - Validates file size

### 2. `src/components/Base64FileUploader.jsx`
Reusable React component for file uploads with base64 conversion.

**Props:**
- `multiple` (boolean) - Allow multiple file uploads
- `allowedTypes` (array) - Allowed file extensions
- `maxSizeInMB` (number) - Maximum file size
- `onFilesConverted` (function) - Callback with converted data
- `label` (string) - Input label
- `showPreview` (boolean) - Show file previews
- `accept` (string) - HTML accept attribute

## API Integration

### Backend API Endpoint
```
POST /jobs/add
```

**Request Body (JSON):**
```json
{
  "job_title": "Software Engineer",
  "job_organization": "Tech Corp",
  "job_advertisement_no": "ADV-2024-001",
  "job_type": "60a1b2c3d4e5f6g7h8i9j0k1",
  "job_sector": "60a1b2c3d4e5f6g7h8i9j0k2",
  "job_short_desc": "Job description",
  "job_category": "60a1b2c3d4e5f6g7h8i9j0k3",
  "job_sub_category": "60a1b2c3d4e5f6g7h8i9j0k4",
  "job_logo": "base64_encoded_string_here",
  "extension": "png",
  "files": ["base64_file1", "base64_file2"],
  "extensions": ["pdf", "docx"]
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Job created successfully",
  "data": {
    "_id": "60a1b2c3d4e5f6g7h8i9j0k5",
    "job_title": "Software Engineer",
    ...
  }
}
```

### Update Job with Logo
```
PUT /jobs/update_job/:id
```

**Request Body:**
```json
{
  "job_logo": "base64_encoded_logo",
  "extension": "png"
}
```

### Update Job with Files
```
PUT /jobs/update_job/:id
```

**Request Body:**
```json
{
  "files": ["base64_file1", "base64_file2"],
  "extensions": ["pdf", "docx"]
}
```

## Usage Examples

### Example 1: Using Base64FileUploader Component

```jsx
import Base64FileUploader from '@/components/Base64FileUploader';
import { useState } from 'react';

function MyForm() {
  const [logoData, setLogoData] = useState(null);

  const handleLogoConverted = ({ base64Files, extensions }) => {
    setLogoData({
      logo: base64Files[0],
      extension: extensions[0]
    });
  };

  const handleSubmit = async () => {
    const response = await axios.post('/jobs/add', {
      job_title: "Software Engineer",
      job_logo: logoData.logo,
      extension: logoData.extension,
      // ... other fields
    });
  };

  return (
    <Base64FileUploader
      label="Upload Logo"
      multiple={false}
      allowedTypes={['jpg', 'jpeg', 'png', 'gif']}
      maxSizeInMB={5}
      accept="image/*"
      onFilesConverted={handleLogoConverted}
      showPreview={true}
    />
  );
}
```

### Example 2: Manual File Conversion

```jsx
import { fileToBase64 } from '@/utils/fileToBase64';

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  
  try {
    const { base64, extension } = await fileToBase64(file);
    
    // Upload to API
    await axios.post('/jobs/add', {
      job_logo: base64,
      extension: extension,
      // ... other fields
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Example 3: Multiple Files

```jsx
import { filesToBase64 } from '@/utils/fileToBase64';

const handleMultipleFiles = async (files) => {
  try {
    const { base64Files, extensions } = await filesToBase64(files);
    
    // Upload to API
    await axios.put('/jobs/update_job/60a1b2c3d4e5f6g7h8i9j0k5', {
      files: base64Files,
      extensions: extensions
    });
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Changes Made to AddJob.jsx

### 1. Updated Import
```jsx
import { fileToBase64, filesToBase64, validateFileType, validateFileSize } from "@/utils/fileToBase64";
```

### 2. Modified `ensureJobId` Function
- Changed from FormData to JSON payload
- Uses `/jobs/add` endpoint
- Sends data as `application/json`

### 3. Modified `uploadLogo` Function
- Converts logo to base64 before upload
- Validates file type and size
- Uses PUT `/jobs/update_job/:id` endpoint

### 4. Modified `saveSection` (files section)
- Converts files to base64 array
- Validates each file
- Uses PUT `/jobs/update_job/:id` endpoint

## Validation Rules

### File Types
- **Logo:** jpg, jpeg, png, gif
- **Documents:** jpg, jpeg, png, gif, pdf, doc, docx

### File Size
- Maximum: 5MB per file

### Validation Functions
```jsx
import { validateFileType, validateFileSize } from '@/utils/fileToBase64';

// Check file type
const isValid = validateFileType(file, ['jpg', 'png', 'pdf']);

// Check file size (5MB default)
const isSizeOK = validateFileSize(file, 5);
```

## Error Handling

The utilities provide proper error messages:

```jsx
try {
  const { base64, extension } = await fileToBase64(file);
} catch (error) {
  // error.message will contain user-friendly error
  console.error(error.message);
}
```

Common errors:
- "No file provided"
- "Failed to convert files: [reason]"
- "Invalid file type"
- "File size exceeds limit"

## Backend Processing

The backend (`JobsService.js`) automatically:
1. Receives base64 strings and extensions
2. Converts base64 to file
3. Saves to disk in `uploads/jobs/` directory
4. Stores file paths in database

## Testing

To test the integration:

1. **Test Logo Upload:**
   - Select an image file
   - Verify base64 conversion
   - Check API request payload
   - Confirm file saved on server

2. **Test Multiple Files:**
   - Select multiple documents
   - Verify all files converted
   - Check extensions array matches files array
   - Confirm all files saved

3. **Test Validation:**
   - Try uploading >5MB file (should fail)
   - Try unsupported file type (should fail)
   - Verify error messages display correctly

## Notes

- Base64 encoding increases file size by ~33%
- Large files may take time to encode
- Consider adding loading indicators for user feedback
- The backend handles base64 decoding automatically
- File paths are stored in the database, not base64 strings
