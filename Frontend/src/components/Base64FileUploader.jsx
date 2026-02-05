import React, { useState, useRef } from 'react';
import { Form, Button, Alert, Image, ListGroup } from 'react-bootstrap';
import { FaUpload, FaTrash, FaFileAlt } from 'react-icons/fa';
import { fileToBase64, filesToBase64, validateFileType, validateFileSize } from '@/utils/fileToBase64';

/**
 * Base64FileUploader Component
 * Converts files to base64 and provides preview functionality
 * 
 * @param {Object} props
 * @param {boolean} props.multiple - Allow multiple file uploads
 * @param {Array<string>} props.allowedTypes - Array of allowed file extensions
 * @param {number} props.maxSizeInMB - Maximum file size in MB
 * @param {Function} props.onFilesConverted - Callback when files are converted: ({base64Files, extensions, files}) => {}
 * @param {string} props.label - Label for the file input
 * @param {boolean} props.showPreview - Show preview of uploaded files
 * @param {string} props.accept - HTML accept attribute for file input
 */
const Base64FileUploader = ({
  multiple = false,
  allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'],
  maxSizeInMB = 5,
  onFilesConverted,
  label = "Upload Files",
  showPreview = true,
  accept = "image/*,.pdf,.doc,.docx",
  className = ""
}) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    setError('');
    setLoading(true);

    try {
      // Validate all files
      for (const file of selectedFiles) {
        if (!validateFileType(file, allowedTypes)) {
          throw new Error(`Invalid file type: ${file.name}. Allowed types: ${allowedTypes.join(', ')}`);
        }
        if (!validateFileSize(file, maxSizeInMB)) {
          throw new Error(`File size exceeds ${maxSizeInMB}MB limit: ${file.name}`);
        }
      }

      // Convert files to base64
      if (multiple) {
        const { base64Files, extensions } = await filesToBase64(selectedFiles);
        
        // Create previews for images
        const newPreviews = selectedFiles.map((file, index) => ({
          name: file.name,
          type: file.type,
          size: file.size,
          extension: extensions[index],
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null
        }));

        setFiles(selectedFiles);
        setPreviews(newPreviews);

        // Callback with converted data
        if (onFilesConverted) {
          onFilesConverted({
            base64Files,
            extensions,
            files: selectedFiles
          });
        }
      } else {
        // Single file
        const { base64, extension } = await fileToBase64(selectedFiles[0]);
        
        const preview = {
          name: selectedFiles[0].name,
          type: selectedFiles[0].type,
          size: selectedFiles[0].size,
          extension,
          preview: selectedFiles[0].type.startsWith('image/') ? URL.createObjectURL(selectedFiles[0]) : null
        };

        setFiles([selectedFiles[0]]);
        setPreviews([preview]);

        // Callback with converted data
        if (onFilesConverted) {
          onFilesConverted({
            base64Files: [base64],
            extensions: [extension],
            files: [selectedFiles[0]]
          });
        }
      }
    } catch (err) {
      setError(err.message);
      setFiles([]);
      setPreviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    
    // Revoke object URL to prevent memory leaks
    if (previews[index].preview) {
      URL.revokeObjectURL(previews[index].preview);
    }

    setFiles(newFiles);
    setPreviews(newPreviews);

    // Re-convert remaining files and call callback
    if (newFiles.length > 0 && onFilesConverted) {
      convertAndCallback(newFiles);
    } else if (onFilesConverted) {
      onFilesConverted({
        base64Files: [],
        extensions: [],
        files: []
      });
    }
  };

  const convertAndCallback = async (fileList) => {
    try {
      if (multiple) {
        const { base64Files, extensions } = await filesToBase64(fileList);
        onFilesConverted({ base64Files, extensions, files: fileList });
      } else if (fileList.length > 0) {
        const { base64, extension } = await fileToBase64(fileList[0]);
        onFilesConverted({
          base64Files: [base64],
          extensions: [extension],
          files: [fileList[0]]
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClear = () => {
    previews.forEach(preview => {
      if (preview.preview) {
        URL.revokeObjectURL(preview.preview);
      }
    });
    setFiles([]);
    setPreviews([]);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFilesConverted) {
      onFilesConverted({
        base64Files: [],
        extensions: [],
        files: []
      });
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className={className}>
      <Form.Group className="mb-3">
        <Form.Label>{label}</Form.Label>
        <div className="d-flex gap-2">
          <Form.Control
            ref={fileInputRef}
            type="file"
            multiple={multiple}
            accept={accept}
            onChange={handleFileChange}
            disabled={loading}
          />
          {files.length > 0 && (
            <Button 
              variant="outline-danger" 
              size="sm"
              onClick={handleClear}
              disabled={loading}
            >
              <FaTrash />
            </Button>
          )}
        </div>
        <Form.Text className="text-muted">
          Allowed types: {allowedTypes.join(', ')} | Max size: {maxSizeInMB}MB
        </Form.Text>
      </Form.Group>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {loading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Converting files...</span>
          </div>
        </div>
      )}

      {showPreview && previews.length > 0 && (
        <div className="mt-3">
          <h6>Uploaded Files:</h6>
          <ListGroup>
            {previews.map((preview, index) => (
              <ListGroup.Item key={index} className="d-flex align-items-center gap-3">
                {preview.preview ? (
                  <Image 
                    src={preview.preview} 
                    alt={preview.name}
                    thumbnail
                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="d-flex align-items-center justify-content-center bg-light"
                    style={{ width: '60px', height: '60px' }}
                  >
                    <FaFileAlt size={30} className="text-secondary" />
                  </div>
                )}
                <div className="flex-grow-1">
                  <div className="fw-bold">{preview.name}</div>
                  <small className="text-muted">
                    {preview.extension.toUpperCase()} • {formatFileSize(preview.size)}
                  </small>
                </div>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => handleRemove(index)}
                >
                  <FaTrash />
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
};

export default Base64FileUploader;
