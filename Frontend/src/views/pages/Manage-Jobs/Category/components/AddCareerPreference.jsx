import React from 'react'
import { Form, Button, Alert, Container, Image, Spinner } from 'react-bootstrap';
import axios from '@/api/axios';
import ComponentCard from '@/components/ComponentCard';
import { useEffect } from 'react';


const AddCareerPreference = ({ mode, data, onCancel, onDataChanged }) => {

  const isEditMode = mode === 'edit' && data;

  const [careerPreferenceName, setCareerPreferenceName] = React.useState('');
  const [careerPreferenceDescription, setCareerPreferenceDescription] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [variant, setVariant] = React.useState('success');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [sectors, setSectors] = React.useState([]);
  const [selectedSector, setSelectedSector] = React.useState('');



  useEffect(() => {
    if (isEditMode) {
      setCareerPreferenceName(data.careerPreferenceName || '');
      setCareerPreferenceDescription(data.careerPreferenceDescription || '');
      setSelectedSector(data.careerPreferenceSectorId._id || '');
    }
  }, [isEditMode, data]);

  const fetchSectorDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/job-categories/get_job_sector_list`);
      // console.log('Sector details fetched:', response.data);
      // Handle different response structures
      const sectorData = response.data?.jsonData?.data || response.data || [];
      setSectors(Array.isArray(sectorData) ? sectorData : []);
    } catch (error) {
      console.error('Error fetching sector details:', error);
      setSectors([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSectorDetails();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!careerPreferenceName.trim()) {
      setMessage('Career Preference name is required.');
      setVariant('danger');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        careerPreferenceName: careerPreferenceName.trim(),
        careerPreferenceDescription: careerPreferenceDescription.trim(),
        careerPreferenceSectorId: selectedSector,
      };
      let response;
      if (isEditMode) {
        response = await axios.put(`/job-categories/update_career_preference/${data._id}`, payload);
      } else {
        response = await axios.post('/job-categories/add_career_preference', payload);
      }
      console.log('Add/Update Career Preference response:', response.data);
      const respPayload = response.data?.jsonData || response.data || {};
      const nameFromResponse = respPayload.careerPreferenceName || careerPreferenceName;
      setMessage(`Career Preference "${nameFromResponse}" ${isEditMode ? 'updated' : 'added'} successfully!`);
      setVariant('success');
      if (!isEditMode) {
        setCareerPreferenceName('');
        setCareerPreferenceDescription('');
        setSelectedSector('');
      }
      setTimeout(() => {
        onDataChanged();
        onCancel();
      }, 1500);
    } catch (error) {
      console.error('Error adding/updating Career Preference:', error);
      setMessage('An error occurred. Please try again.');
      setVariant('danger');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid className='pt-4'>
      <ComponentCard
        title={isEditMode ? 'Edit Career Preference' : 'Add Career Preference'}
        isCollapsible
        defaultOpen={false}
      >
        {message && <Alert variant={variant} dismissible onClose={() => setMessage('')}>{message}</Alert>}
        <Form onSubmit={handleSubmit} className='py-2'>
          <Form.Group className="mb-3" controlId="categoryName">
            <Form.Label>
              Select Sector <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              required
            >
              <option value="">Select a sector</option>
              {sectors.map((sector) => (
                <option key={sector._id} value={sector._id}>
                  {sector.job_sector_name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className='mb-3' controlId='categoryName'>
            <Form.Label>
              Career Preference Name <span className='text-danger'>*</span>
            </Form.Label>
            <Form.Control
              type='text'
              value={careerPreferenceName}
              onChange={(e) => setCareerPreferenceName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className='mb-3' controlId='categoryDescription'>
            <Form.Label>Career Preference Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              value={careerPreferenceDescription}
              onChange={(e) => setCareerPreferenceDescription(e.target.value)}
            />
          </Form.Group>


          <div className='d-flex gap-2'>
            <Button variant='primary' type='submit' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner animation='border' size='sm' /> {isEditMode ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                isEditMode ? 'Update Career Preference' : 'Add Career Preference'
              )}
            </Button>
            <Button
              variant='secondary'
              type='button'
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </Form>
      </ComponentCard>
    </Container>
  )
}

export default AddCareerPreference