import { useState, useEffect } from 'react';
import { Form, Button, Alert, Container, Spinner } from 'react-bootstrap';
import axios from '@/api/axios';
import ComponentCard from '@/components/ComponentCard';

const AddSector = ({ mode = 'add', data = null, onCancel = () => {}, onDataChanged = () => {} }) => {
  const isEditMode = mode === 'edit' && data;

  const [sectorName, setSectorName] = useState('');
  const [message, setMessage] = useState('');
  const [variant, setVariant] = useState('success');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode) {
      setSectorName(data.job_sector_name || '');
    } else {
      setSectorName('');
    }
  }, [isEditMode, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!sectorName.trim()) {
      setMessage('Sector name is required.');
      setVariant('danger');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        job_sector_name: sectorName.trim(),
      };

      let response;
      if (isEditMode) {
        response = await axios.put(`/job-categories/update_job_sector/${data._id}`, payload);
      } else {
        response = await axios.post('/job-categories/create_job_sector', payload);
      }

      console.log('Add/Update Sector response:', response.data); 
      const respPayload = response.data?.jsonData || response.data || {};
      const sectorNameFromResponse = respPayload.job_sector_name || sectorName;
      setMessage(`Sector "${sectorNameFromResponse}" ${isEditMode ? 'updated' : 'added'} successfully!`);
      setVariant('success');

      if (!isEditMode) {
        setSectorName('');
      }

      // Trigger refresh and hide form after delay
      setTimeout(() => {
        onDataChanged();
        onCancel();
      }, 1500);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || error.message || `Error ${isEditMode ? 'updating' : 'adding'} sector.`);
      setVariant('danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container fluid className="pt-4">
      <ComponentCard title={isEditMode ? 'Edit Sector' : 'Add Sector'}>
        {message && <Alert variant={variant} dismissible onClose={() => setMessage('')}>{message}</Alert>}
        <Form onSubmit={handleSubmit} className='py-2'>
          <Form.Group className="mb-3" controlId="sectorName">
            <Form.Label>
              Sector Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter sector name"
              value={sectorName}
              onChange={(e) => setSectorName(e.target.value)}
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
                isEditMode ? 'Update Sector' : 'Add Sector'
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

export default AddSector;
