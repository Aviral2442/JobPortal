import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Image, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ComponentCard from '@/components/ComponentCard';

const EditSubCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [subCategoryName, setSubCategoryName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSubCategory, setLoadingSubCategory] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // Fetch all parent categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/job-categories/get_job_category_list`);
        setCategories(res.data.data || []); // <-- fix: ensure array
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

  // Fetch sub-category data
  useEffect(() => {
    if (!id) return;

    const fetchSubCategory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/subcategories/${id}`);
        const sub = res.data;

        setSubCategoryName(sub.subCategoryName);
        setParentCategory(sub.parentCategory?._id || '');
        setPreview(sub.subCategoryImage ? `${BASE_URL}${sub.subCategoryImage}` : null);
      } catch (err) {
        console.error(err);
        setMessage('Failed to load sub-category');
        setVariant('danger');
      } finally {
        setLoadingSubCategory(false);
      }
    };
    fetchSubCategory();
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSubCategoryImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
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
      formData.append('subCategoryName', subCategoryName);
      formData.append('parentCategory', parentCategory);
      if (subCategoryImage) formData.append('subCategoryImage', subCategoryImage);

      const res = await axios.put(`${BASE_URL}/api/subcategories/${id}`, formData);
      setMessage(`Sub-category "${res.data.subCategoryName}" updated successfully!`);
      setVariant('success');

      setTimeout(() => navigate('/admin/sub-category'), 1000);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Error updating sub-category.');
      setVariant('danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingCategories || loadingSubCategory) {
    return (
      <Container className="pt-4 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container fluid className="pt-4">
      <ComponentCard title="Edit Sub Category" >
        {message && <Alert variant={variant}>{message}</Alert>}
        <Form onSubmit={handleSubmit} className='py-2'>
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

          <Form.Group className="mb-3" controlId="parentCategory">
            <Form.Label>
              Parent Category <span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              value={parentCategory}
              onChange={(e) => setParentCategory(e.target.value)}
              required
            >
              <option value="">Select parent category</option>
              {Array.isArray(categories) &&
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="subCategoryImage">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          {preview && (
            <div className="mb-3 text-start">
              <p>Image Preview:</p>
              <Image src={preview} alt="Preview" thumbnail width="200" />
            </div>
          )}

          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Spinner animation="border" size="sm" /> Updating...
              </>
            ) : (
              'Update Sub-Category'
            )}
          </Button>
        </Form>
      </ComponentCard>
    </Container>
  );
};

export default EditSubCategory;
