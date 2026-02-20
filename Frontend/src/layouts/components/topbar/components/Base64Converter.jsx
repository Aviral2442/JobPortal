import React, { useState, useRef } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { SiConvertio } from 'react-icons/si';
import { TbCopy, TbUpload, TbX } from 'react-icons/tb';

const Base64Converter = () => {
  const [show, setShow] = useState(false);
  const [base64String, setBase64String] = useState('');
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef(null);

  const handleOpen = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setBase64String('');
    setPreview('');
    setFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      const pureBase64 = result.includes(',') ? result.split(',')[1] : result;
      setBase64String(pureBase64);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = async () => {
    if (!base64String) {
      toast.error('No base64 string to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(base64String);
      toast.success('Base64 string copied to clipboard!');
    } catch {
      toast.error('Failed to copy');
    }
  };

  return (
    <>
      <button className="border-0 bg-transparent" onClick={handleOpen}>
        <SiConvertio size={18}/>
      </button>

      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Base64 Image Converter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* File Upload */}
          <Form.Group className="">
            <Form.Label className="fw-semibold">Upload Image</Form.Label>
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          {/* Image Preview */}
          {preview && (
            <div className="text-center">
              <p className="fw-semibold mt-1 text-start">Preview ({fileName})</p>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', borderRadius: 6, border: '1px solid #dee2e6' }}
              />
            </div>
          )}

          {/* Base64 Output */}
          {base64String && (
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="fw-semibold">Base64 String</span>
                <Button variant="outline-primary" size="sm" onClick={handleCopy}>
                  <TbCopy className="" />
                </Button>
              </div>
              <Form.Control
                as="textarea"
                rows={6}
                readOnly
                value={base64String}
                style={{ fontSize: '0.8rem', wordBreak: 'break-all' }}
              />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Base64Converter;