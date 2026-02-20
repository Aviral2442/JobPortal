import React, { Suspense, useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Button, Card, Col, Form as BootstrapForm, Row, Spinner } from 'react-bootstrap';
import axios from '@/api/axios';
import toast from 'react-hot-toast';
import { useFormik } from 'formik';
import SnowEditor from '@/components/SnowEditor';

const dynamicContentValidationSchema = Yup.object().shape({
  privacyPolicy: Yup.string().required('Privacy Policy is required'),
  aboutUs: Yup.string().required('About Us is required'),
  helpCenter: Yup.string().required('Help Center is required'),
  contactSupportNumber: Yup.string().required('Contact number is required'),
  contactSupportEmail: Yup.string().email('Invalid email').required('Contact email is required'),
});

const DynamicContent = () => {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const formik = useFormik({
    initialValues: {
      privacyPolicy: '',
      aboutUs: '',
      helpCenter: '',
      contactSupportNumber: '',
      contactSupportEmail: '',
    },
    validationSchema: dynamicContentValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const res = await axios.put('/dynamic-content/update_dynamic_content', values);
        toast.success(res.data?.message || 'Dynamic content updated successfully');
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message || 'Failed to update dynamic content');
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, setValues } = formik;

  // Fetch existing dynamic content on mount
  useEffect(() => {
    const fetchDynamicContent = async () => {
      try {
        const res = await axios.get('/dynamic-content/get_dynamic_content');
        const data = res.data?.jsonData;
        if (data) {
          setValues({
            privacyPolicy: data.privacyPolicy || '',
            aboutUs: data.aboutUs || '',
            helpCenter: data.helpCenter || '',
            contactSupportNumber: data.contactSupportNumber || '',
            contactSupportEmail: data.contactSupportEmail || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch dynamic content:', error);
      } finally {
        setFetching(false);
      }
    };
    fetchDynamicContent();
  }, []);

  if (fetching) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="py-2">
      <Card>
        <Card.Header>
          <h5 className="mb-0">Dynamic Content</h5>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            {/* Privacy Policy Editor */}
            <BootstrapForm.Group className="mb-4">
              <BootstrapForm.Label className="fw-semibold">Privacy Policy</BootstrapForm.Label>
              <Suspense fallback={<Spinner animation="border" size="sm" />}>
                <SnowEditor
                  value={values.privacyPolicy}
                  onChange={(v) => setFieldValue('privacyPolicy', v)}
                />
              </Suspense>
              {touched.privacyPolicy && errors.privacyPolicy && (
                <div className="text-danger mt-1 small">{errors.privacyPolicy}</div>
              )}
            </BootstrapForm.Group>

            {/* About Us Editor */}
            <BootstrapForm.Group className="mb-4">
              <BootstrapForm.Label className="fw-semibold">About Us</BootstrapForm.Label>
              <Suspense fallback={<Spinner animation="border" size="sm" />}>
                <SnowEditor
                  value={values.aboutUs}
                  onChange={(v) => setFieldValue('aboutUs', v)}
                />
              </Suspense>
              {touched.aboutUs && errors.aboutUs && (
                <div className="text-danger mt-1 small">{errors.aboutUs}</div>
              )}
            </BootstrapForm.Group>

            {/* Help Center Editor */}
            <BootstrapForm.Group className="mb-4">
              <BootstrapForm.Label className="fw-semibold">Help Center</BootstrapForm.Label>
              <Suspense fallback={<Spinner animation="border" size="sm" />}>
                <SnowEditor
                  value={values.helpCenter}
                  onChange={(v) => setFieldValue('helpCenter', v)}
                />
              </Suspense>
              {touched.helpCenter && errors.helpCenter && (
                <div className="text-danger mt-1 small">{errors.helpCenter}</div>
              )}
            </BootstrapForm.Group>

            <Row>
              {/* Contact Support Number */}
              <Col md={6}>
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label className="fw-semibold">Contact Support Number</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="text"
                    name="contactSupportNumber"
                    placeholder="Enter contact support number"
                    value={values.contactSupportNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.contactSupportNumber && !!errors.contactSupportNumber}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.contactSupportNumber}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              </Col>

              {/* Contact Support Email */}
              <Col md={6}>
                <BootstrapForm.Group className="mb-3">
                  <BootstrapForm.Label className="fw-semibold">Contact Support Email</BootstrapForm.Label>
                  <BootstrapForm.Control
                    type="email"
                    name="contactSupportEmail"
                    placeholder="Enter contact support email"
                    value={values.contactSupportEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.contactSupportEmail && !!errors.contactSupportEmail}
                  />
                  <BootstrapForm.Control.Feedback type="invalid">
                    {errors.contactSupportEmail}
                  </BootstrapForm.Control.Feedback>
                </BootstrapForm.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end mt-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  'Update Content'
                )}
              </Button>
            </div>
          </form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DynamicContent;