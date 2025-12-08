import React, { useState, useEffect } from 'react'
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Row, Col, Card, Alert, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axios';

const studentValidationSchema = Yup.object({
  studentProfilePic: Yup.string(),
  studentFirstName: Yup.string()
    .required('First Name is required')
    .min(2, 'First Name must be at least 2 characters')
    .max(50, 'First Name must not exceed 50 characters'),
  studentLastName: Yup.string()
    .required('Last Name is required')
    .min(2, 'Last Name must be at least 2 characters')
    .max(50, 'Last Name must not exceed 50 characters'),
  studentEmail: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .lowercase()
    .trim(),
  studentMobileNo: Yup.string()
    .required('Mobile Number is required')
    .matches(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits'),
  studentPassword: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase, one lowercase, one number and one special character'
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('studentPassword')], 'Passwords must match'),
  studentJobType: Yup.string().required('Job Type is required'),
  studentReferralByCode: Yup.string()
    .matches(/^CW[A-Z0-9]{6}$/, 'Invalid referral code format (Example: CW123ABC)')
    .optional(),
});

const FormInput = ({
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  touched,
  errors,
  required = false,
  placeholder,
  helperText,
  ...props
}) => (
  <Form.Group className="mb-3">
    <Form.Label>
      {label}
      {required && <span className="text-danger ms-1">*</span>}
    </Form.Label>
    <Form.Control
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={touched && errors}
      placeholder={placeholder}
      {...props}
    />
    <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
    {helperText && <Form.Text className="text-muted d-block">{helperText}</Form.Text>}
  </Form.Group>
);

const Register = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [jobTypeList, setJobTypeList] = useState([]);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const initialValues = {
    studentProfilePic: '',
    studentFirstName: '',
    studentLastName: '',
    studentEmail: '',
    studentMobileNo: '',
    studentPassword: '',
    confirmPassword: '',
    studentJobType: '',
    studentReferralByCode: '',
  };

  const fetchJobTypes = async () => {
    try {
      const response = await axios.get('/job-categories/get_job_type_list');
      setJobTypeList(response.data?.jsonData?.jobTypes || []);
      console.log('Job Types fetched:', response.data);
    } catch (error) {
      console.error('Error fetching job types:', error);
      setMessage({
        text: 'Error loading job types. Please refresh the page.',
        variant: 'warning',
      });
    }
  };

  useEffect(() => {
    fetchJobTypes();
  }, []);

  const handleProfilePicChange = (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage({
          text: 'Please upload a valid image file (JPEG, PNG, WEBP)',
          variant: 'danger',
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({
          text: 'Image size should not exceed 5MB',
          variant: 'danger',
        });
        return;
      }

      setProfilePicFile(file);
      setProfilePicPreview(URL.createObjectURL(file));
      setFieldValue('studentProfilePic', file.name);
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    setMessage({ text: '', variant: '' });

    try {
      const formData = new FormData();

      if (profilePicFile) {
        formData.append('studentProfilePic', profilePicFile);
      }

      formData.append('studentFirstName', values.studentFirstName.trim());
      formData.append('studentLastName', values.studentLastName.trim());
      formData.append('studentEmail', values.studentEmail.toLowerCase().trim());
      formData.append('studentMobileNo', values.studentMobileNo.trim());
      formData.append('studentPassword', values.studentPassword);
      formData.append('studentJobType', values.studentJobType);

      if (values.studentReferralByCode) {
        formData.append('studentReferralByCode', values.studentReferralByCode.trim().toUpperCase());
      }

      const response = await axios.post('/student/student_registration', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Registration response:', response.data);

      setMessage({
        text: response.data.message || 'Student registered successfully!',
        variant: 'success',
      });

      resetForm();
      setProfilePicFile(null);
      setProfilePicPreview('');

      setTimeout(() => {
        navigate('/admin/students');
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        text: error.response?.data?.message || 'Error registering student. Please try again.',
        variant: 'danger',
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-4 pt-4">
      <Card>
        <Card.Body>
          {message.text && (
            <Alert
              variant={message.variant}
              onClose={() => setMessage({ text: '', variant: '' })}
              dismissible
            >
              {message.text}
            </Alert>
          )}

          <Formik
            initialValues={initialValues}
            validationSchema={studentValidationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, setFieldValue }) => (
              <Form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h4 className='mt-1'>Student Registration</h4>
                </div>

                {/* Profile Picture */}
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Upload Profile Picture</Form.Label>
                        <div className="d-flex align-items-center gap-3">
                          <Form.Control
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={(e) => handleProfilePicChange(e, setFieldValue)}
                          />
                          {profilePicPreview && (
                            <div>
                              <Image
                                src={profilePicPreview}
                                alt="Profile Preview"
                                thumbnail
                                style={{ width: '80px', height: '40px', objectFit: 'cover' }}
                              />
                              <Button
                                size="sm"
                                variant="outline-danger"
                                className="mt-2 d-block"
                                onClick={() => {
                                  setProfilePicFile(null);
                                  setProfilePicPreview('');
                                  setFieldValue('studentProfilePic', '');
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                        <Form.Text className="text-muted">
                          Accepted formats: JPEG, PNG, WEBP (Max size: 5MB)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="studentFirstName"
                        label="First Name"
                        value={values.studentFirstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.studentFirstName}
                        errors={errors.studentFirstName}
                        placeholder="Enter first name"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="studentLastName"
                        label="Last Name"
                        value={values.studentLastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.studentLastName}
                        errors={errors.studentLastName}
                        placeholder="Enter last name"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="studentEmail"
                        label="Email Address"
                        type="email"
                        value={values.studentEmail}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.studentEmail}
                        errors={errors.studentEmail}
                        placeholder="example@email.com"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="studentMobileNo"
                        label="Mobile Number"
                        type="tel"
                        value={values.studentMobileNo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.studentMobileNo}
                        errors={errors.studentMobileNo}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="studentPassword"
                        label="Password"
                        type="password"
                        value={values.studentPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.studentPassword}
                        errors={errors.studentPassword}
                        placeholder="Enter password"
                        helperText="Password must contain at least 8 characters, including uppercase, lowercase, number and special character"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={values.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.confirmPassword}
                        errors={errors.confirmPassword}
                        placeholder="Re-enter password"
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Preferred Job Type <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Select
                          name="studentJobType"
                          value={values.studentJobType}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.studentJobType && errors.studentJobType}
                        >
                          <option value="">Select Job Type</option>
                          {jobTypeList.map((jobType) => (
                            <option key={jobType._id} value={jobType._id}>
                              {jobType.job_type_name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                          {errors.studentJobType}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="studentReferralByCode"
                        label="Referral Code (Optional)"
                        value={values.studentReferralByCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.studentReferralByCode}
                        errors={errors.studentReferralByCode}
                        placeholder="Enter referral code (e.g., CW123ABC)"
                        helperText="If you have a referral code, enter it here"
                      />
                    </Col>
                  </Row>
                </Card.Body>

                {/* Submit Button */}
                <div className="d-flex justify-content-end gap-2 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/admin/students')}
                    disabled={loading || isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting ? 'Registering...' : 'Register Student'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;


/*



*/