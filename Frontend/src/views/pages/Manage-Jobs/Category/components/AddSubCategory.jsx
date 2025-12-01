import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Image, Spinner } from 'react-bootstrap';
import axios from '@/api/axios';
import ComponentCard from '@/components/ComponentCard';

const AddSubCategory = ({ mode, data, onCancel, onDataChanged }) => {
  const isEditMode = mode === 'edit' && data;

  const [subCategoryName, setSubCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setSubCategoryName(data.subcategory_name || data.subCategoryName || '');
      setParentCategory(data.subcategory_category_id || data.parentCategory || '');
      const imageUrl = data.subcategory_image || data.subCategoryImage || '';
      if (imageUrl) {
        setPreview(imageUrl.startsWith('http') ? imageUrl : `${import.meta.env.VITE_BASE_URL}${imageUrl}`);
      }
    }
  }, [isEditMode, data]);

  // Fetch all categories for the parent dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/job-categories/get_job_category_list`);
        setCategories(res.data?.jsonData?.data || []);
        console.log("Fetched categories in subcat:", res.data?.jsonData?.data);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load categories.');
        setVariant('danger');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSubCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setSubCategoryImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCategoryName.trim() || !parentCategory) {
      setMessage('Sub-category name and parent category are required.');
      setVariant('danger');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('subcategory_name', subCategoryName);
      formData.append('subcategory_category_id', parentCategory);
      if (subCategoryImage) formData.append('subcategory_image', subCategoryImage); // Fixed: Changed from 'subCategoryImage' to 'subcategory_image'

      let response;
      if (isEditMode) {
        response = await axios.put(`/job-categories/update_job_subcategory/${data._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await axios.post('/job-categories/create_job_subcategory', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      const respPayload = response.data?.jsonData || response.data || {};
      const subCategoryNameFromResponse = respPayload.subcategory_name || respPayload.subCategoryName || subCategoryName;
      setMessage(`Sub-category "${subCategoryNameFromResponse}" ${isEditMode ? 'updated' : 'added'} successfully!`);
      setVariant('success');

      if (!isEditMode) {
        setSubCategoryName('');
        setParentCategory('');
        setSubCategoryImage(null);
        setPreview(null);
      }

      // Trigger refresh and hide form after delay
      setTimeout(() => {
        onDataChanged();
        onCancel();
      }, 1500);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || error.message || `Error ${isEditMode ? 'updating' : 'adding'} sub-category.`);
      setVariant('danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="pt-4">
      <ComponentCard title={isEditMode ? 'Edit Sub Category' : 'Add Sub Category'}>
        {message && <Alert variant={variant} dismissible onClose={() => setMessage('')}>{message}</Alert>}
        <Form onSubmit={handleSubmit} className='py-2'>
          <Form.Group className="mb-3" controlId="subCategoryImage">
            <Form.Label>Upload Image <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleSubCategoryImageChange}
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

          <Form.Group className="mb-3" controlId="parentCategory">
            <Form.Label>
              Parent Category <span className="text-danger">*</span>
            </Form.Label>
            {loadingCategories ? (
              <div>
                <Spinner animation="border" size="sm" /> Loading categories...
              </div>
            ) : (
              <Form.Select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                required
              >
                <option value="">Select parent category</option>
                {Array.isArray(categories) &&
                  categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.category_name}
                    </option>
                  ))}
              </Form.Select>
            )}
          </Form.Group>

          <Form.Group className="mb-3" controlId="subCategoryName">
            <Form.Label>
              Sub-Category Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter sub-category name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              required
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={isSubmitting || loadingCategories}>
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" /> {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Sub-Category' : 'Add Sub-Category'
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

export default AddSubCategory;
