import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Image, Spinner } from 'react-bootstrap';
import axios from '@/api/axios';
import ComponentCard from '@/components/ComponentCard';

const AddCategory = ({ mode, data, onCancel, onDataChanged }) => {
  const isEditMode = mode === 'edit' && data;

  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setCategoryName(data.category_name || data.categoryName || '');
      const imageUrl = data.category_image || data.categoryImage || '';
      if (imageUrl) {
        setPreview(imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_BASE_URL}${imageUrl}`);
      }
    }
  }, [isEditMode, data]);

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setCategoryImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      setMessage('Category name is required.');
      setVariant('danger');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('category_name', categoryName);
      if (categoryImage) {
        formData.append('category_image', categoryImage);
      }

      let response;
      if (isEditMode) {
        response = await axios.put(`/job-categories/update_job_category/${data._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('/job-categories/create_job_category', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const respPayload = response.data?.jsonData || response.data || {};
      const categoryNameFromResponse = respPayload.category_name || respPayload.categoryName || categoryName;
      setMessage(`Category "${categoryNameFromResponse}" ${isEditMode ? 'updated' : 'added'} successfully!`);
      setVariant('success');

      if (!isEditMode) {
        setCategoryName('');
        setCategoryImage(null);
        setPreview(null);
      }

      // Trigger refresh and hide form after delay
      setTimeout(() => {
        onDataChanged();
        onCancel();
      }, 1500);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || error.message || `Error ${isEditMode ? 'updating' : 'adding'} category.`);
      setVariant('danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="pt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className="pt-4">
      <ComponentCard
        title={isEditMode ? 'Edit Category' : 'Add Category'}
        isCollapsible
        defaultOpen={false}
      >
        {message && <Alert variant={variant} dismissible onClose={() => setMessage('')}>{message}</Alert>}
        <Form onSubmit={handleSubmit} className='py-2'>
          <Form.Group className="mb-3" controlId="categoryImage">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleCategoryImageChange}
            />
            {isEditMode && <Form.Text className="text-muted">
              Leave empty to keep the current image
            </Form.Text>}
          </Form.Group>

          {preview && (
            <div className="mb-3 text-start">
              <p>{isEditMode ? 'Current / New Image:' : 'Image Preview:'}</p>
              <Image src={preview} alt="Preview" thumbnail width="200" />
            </div>
          )}

          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </Form.Group>


          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" /> {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Category' : 'Add Category'
              )}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ComponentCard>
    </Container>
  );
};

export default AddCategory;