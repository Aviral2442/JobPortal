import { useState, useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Alert, FormSelect } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import axios from "@/api/axios";
import React from "react";

const admitCardValidationSchema = Yup.object({
  _id: Yup.string(),
  admitCard_JobId: Yup.string().required("Job is required"),
  admitCard_Title: Yup.string().required("Title is required"),
  admitCard_Desc: Yup.string().required("Description is required"),
  admitCard_URL: Yup.string().url("Invalid URL format").required("Admit Card URL is required"),
  admitCard_ReleaseDate: Yup.date().required("Release Date is required"),
});

const FormInput = ({
  name,
  label,
  sublabel,
  type = "text",
  as,
  value,
  onChange,
  onBlur,
  touched,
  errors,
  required = false,
  ...props
}) => (
  <Form.Group className="mb-2">
    <div className="d-flex justify-content-between align-items-end">
      <Form.Label className="mb-0 mt-1">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </Form.Label>
      {sublabel && <div className="text-muted fs-6 pe-2">{sublabel}</div>}
    </div>
    <Form.Control
      name={name}
      type={type}
      as={as}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={touched && errors}
      {...props}
    />
    <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
  </Form.Group>
);

const AddAdmitCard = () => {
  const navigate = useNavigate();
  const [admitCardFile, setAdmitCardFile] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [jobsList, setJobsList] = useState([]);
  const [admitCardId, setAdmitCardId] = useState(null);
  const [fileBase64, setFileBase64] = useState("");

  const initialValues = useMemo(() => ({
    _id: "",
    admitCard_JobId: "",
    admitCard_Title: "",
    admitCard_Desc: "",
    admitCard_URL: "",
    admitCard_ReleaseDate: "",
    admitCard_FilePath: "",
  }), []);

  // Convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle file change
  const handleFileChange = async (e, setFieldValue) => {
    const file = e.target.files?.[0];
    if (file) {
      setAdmitCardFile(file);
      try {
        const base64 = await convertFileToBase64(file);
        setFileBase64(base64);
        setFieldValue("admitCard_FilePath", file.name);
      } catch (error) {
        console.error("Error converting file:", error);
        setMessage({ text: "Error processing file", variant: "danger" });
      }
    }
  };

  // Fetch jobs list
  const fetchJobsList = async () => {
    try {
      const res = await axios.get(`/job-categories/government_and_psu_sector_job_list`);
      console.log("Fetched jobs for admit card:", res.data);
      setJobsList(res.data?.jsonData?.govAndPsuJobList || []);
    } catch (err) {
      console.error("Error fetching jobs for admit card:", err);
      setMessage({ text: "Error fetching jobs list", variant: "danger" });
    }
  };

  React.useEffect(() => {
    fetchJobsList();
  }, []);

  // Create admit card using POST API
  const createAdmitCard = async (values) => {
    try {
      const payload = {
        admitCard_JobId: values.admitCard_JobId,
        admitCard_Title: values.admitCard_Title,
        admitCard_Desc: values.admitCard_Desc,
        admitCard_URL: values.admitCard_URL,
        admitCard_ReleaseDate: Number(new Date(values.admitCard_ReleaseDate).getTime()),
        admitCard_FilePath: fileBase64,
      };

      const res = await axios.post(`/job-categories/add_admit_card`, payload);
      
      if (res.data.status === 200 || res.data.status === 201) {
        const newAdmitCardId = res.data.admitCardId || res.data.jsonData?._id;
        setAdmitCardId(newAdmitCardId);
        setMessage({ text: "Admit card created successfully!", variant: "success" });
        
        setTimeout(() => {
          navigate("/admin/admit-card");
        }, 1500);
        
        return newAdmitCardId;
      }
    } catch (error) {
      console.error("Error creating admit card:", error);
      setMessage({
        text: error.response?.data?.message || "Error creating admit card",
        variant: "danger"
      });
      return null;
    }
  };

  // Update admit card using PUT API
  const updateAdmitCard = async (values) => {
    if (!admitCardId) {
      setMessage({ text: "No admit card to update", variant: "warning" });
      return;
    }

    try {
      const payload = {
        admitCard_Title: values.admitCard_Title,
        admitCard_Desc: values.admitCard_Desc,
        admitCard_URL: values.admitCard_URL,
        admitCard_ReleaseDate: Number(new Date(values.admitCard_ReleaseDate).getTime()),
      };

      if (fileBase64) {
        payload.admitCard_FilePath = fileBase64;
      }

      const res = await axios.put(`/job-categories/update_admit_card/${admitCardId}`, payload);
      
      if (res.data.status === 200) {
        setMessage({ text: "Admit card updated successfully!", variant: "success" });
        
        setTimeout(() => {
          navigate("/admin/admit-cards");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating admit card:", error);
      setMessage({
        text: error.response?.data?.message || "Error updating admit card",
        variant: "danger"
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    if (admitCardId) {
      await updateAdmitCard(values);
    } else {
      await createAdmitCard(values);
    }
  };

  return (
    <div className="mb-4 pt-4">
      <Card.Body>
        {message.text && (
          <Alert variant={message.variant} onClose={() => setMessage({ text: "", variant: "" })} dismissible>
            {message.text}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={admitCardValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(values); }}>
              {/* Basic Admit Card Details */}
              <ComponentCard className="mb-3" title="Admit Card Details">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Label className="mb-1">
                          Admit Card File <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                        />
                        {values.admitCard_FilePath && (
                          <div className="text-success small mt-1">
                            File selected: {values.admitCard_FilePath}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <div className="d-flex justify-content-between align-items-end">
                          <Form.Label className="mb-0 mt-1">
                            Select Job <span className="text-danger ms-1">*</span>
                          </Form.Label>
                        </div>
                        <Form.Select
                          name="admitCard_JobId"
                          value={values.admitCard_JobId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.admitCard_JobId && errors.admitCard_JobId}
                        > 
                          <option value="">Select Job</option>
                          {jobsList.map((job) => (
                            <option key={job._id} value={job._id}>
                              {job.job_title}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.admitCard_JobId}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="admitCard_Title"
                        label="Admit Card Title"
                        type="text"
                        value={values.admitCard_Title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.admitCard_Title}
                        errors={errors.admitCard_Title}
                        placeholder="Enter admit card title"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="admitCard_URL"
                        label="Admit Card URL"
                        type="url"
                        value={values.admitCard_URL}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.admitCard_URL}
                        errors={errors.admitCard_URL}
                        placeholder="https://example.com/admit-card"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="admitCard_ReleaseDate"
                        label="Release Date"
                        type="date"
                        value={values.admitCard_ReleaseDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.admitCard_ReleaseDate}
                        errors={errors.admitCard_ReleaseDate}
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <FormInput
                        name="admitCard_Desc"
                        label="Description"
                        as="textarea"
                        value={values.admitCard_Desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.admitCard_Desc}
                        errors={errors.admitCard_Desc}
                        rows={3}
                        placeholder="Enter admit card description"
                        required
                      />
                    </Col>
                  </Row>

                  <div className="text-end my-2">
                    <Button 
                      size="md" 
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : admitCardId ? "Update Admit Card" : "Create Admit Card"}
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </div>
  );
};

export default AddAdmitCard;