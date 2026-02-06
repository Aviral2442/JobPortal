import { useState, useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Alert, FormSelect } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import axios from "@/api/axios";
import React from "react";

const answerKeyValidationSchema = Yup.object({
  _id: Yup.string(),
  answerKey_JobId: Yup.string().required("Job is required"),
  answerKey_Title: Yup.string().required("Title is required"),
  answerKey_Desc: Yup.string().required("Description is required"),
  answerKey_URL: Yup.string().url("Invalid URL format").required("Answer Key URL is required"),
  answerKey_ReleaseDate: Yup.date().required("Release Date is required"),
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

const AddAnswerKey = () => {
  const navigate = useNavigate();
  const [answerKeyFile, setAnswerKeyFile] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [jobsList, setJobsList] = useState([]);
  const [answerKeyId, setAnswerKeyId] = useState(null);
  const [fileBase64, setFileBase64] = useState("");

  const initialValues = useMemo(() => ({
    _id: "",
    answerKey_JobId: "",
    answerKey_Title: "",
    answerKey_Desc: "",
    answerKey_URL: "",
    answerKey_ReleaseDate: "",
    answerKey_FilePath: "",
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
      setAnswerKeyFile(file);
      try {
        const base64 = await convertFileToBase64(file);
        setFileBase64(base64);
        setFieldValue("answerKey_FilePath", file.name);
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
      console.log("Fetched jobs for answer key:", res.data);
      setJobsList(res.data?.jsonData?.govAndPsuJobList || []);
    } catch (err) {
      console.error("Error fetching jobs for answer key:", err);
      setMessage({ text: "Error fetching jobs list", variant: "danger" });
    }
  };

  React.useEffect(() => {
    fetchJobsList();
  }, []);

  // Create answer key using POST API
  const createAnswerKey = async (values) => {
    try {
      const payload = {
        answerKey_JobId: values.answerKey_JobId,
        answerKey_Title: values.answerKey_Title,
        answerKey_Desc: values.answerKey_Desc,
        answerKey_URL: values.answerKey_URL,
        answerKey_ReleaseDate: Number(new Date(values.answerKey_ReleaseDate).getTime()),
        answerKey_FilePath: fileBase64,
      };

      const res = await axios.post(`/job-categories/add_answer_key`, payload);

      if (res.data.status === 200 || res.data.status === 201) {
        const newAnswerKeyId = res.data.answerKeyId || res.data.jsonData?._id;
        setAnswerKeyId(newAnswerKeyId);
        setMessage({ text: "Answer key created successfully!", variant: "success" });

        setTimeout(() => {
          navigate("/admin/answer-key");
        }, 1500);

        return newAnswerKeyId;
      }
    } catch (error) {
      console.error("Error creating answer key:", error);
      setMessage({
        text: error.response?.data?.message || "Error creating answer key",
        variant: "danger"
      });
      return null;
    }
  };

  // Update answer key using PUT API
  const updateAnswerKey = async (values) => {
    if (!answerKeyId) {
      setMessage({ text: "No answer key to update", variant: "warning" });
      return;
    }

    try {
      const payload = {
        answerKey_Title: values.answerKey_Title,
        answerKey_Desc: values.answerKey_Desc,
        answerKey_URL: values.answerKey_URL,
        answerKey_ReleaseDate: Number(new Date(values.answerKey_ReleaseDate).getTime()),
      };

      if (fileBase64) {
        payload.answerKey_FilePath = fileBase64;
      }

      const res = await axios.put(`/job-categories/update_answer_key/${answerKeyId}`, payload);

      if (res.data.status === 200) {
        setMessage({ text: "Answer key updated successfully!", variant: "success" });

        setTimeout(() => {
          navigate("/admin/answer-key");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating answer key:", error);
      setMessage({
        text: error.response?.data?.message || "Error updating answer key",
        variant: "danger"
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    if (answerKeyId) {
      await updateAnswerKey(values);
    } else {
      await createAnswerKey(values);
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
          validationSchema={answerKeyValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
            <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(values); }}>
              {/* Basic Answer Key Details */}
              <ComponentCard className="mb-3" title="Answer Key Details">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Label className="mb-1">
                          Answer Key File <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                        />
                        {values.answerKey_FilePath && (
                          <div className="text-success small mt-1">
                            File selected: {values.answerKey_FilePath}
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
                          name="answerKey_JobId"
                          value={values.answerKey_JobId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.answerKey_JobId && errors.answerKey_JobId}
                        >
                          <option value="">Select Job</option>
                          {jobsList.map((job) => (
                            <option key={job._id} value={job._id}>
                              {job.job_title}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.answerKey_JobId}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="answerKey_Title"
                        label="Answer Key Title"
                        type="text"
                        value={values.answerKey_Title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.answerKey_Title}
                        errors={errors.answerKey_Title}
                        placeholder="Enter answer key title"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="answerKey_URL"
                        label="Answer Key URL"
                        type="url"
                        value={values.answerKey_URL}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.answerKey_URL}
                        errors={errors.answerKey_URL}
                        placeholder="https://example.com/answer-key"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="answerKey_ReleaseDate"
                        label="Release Date"
                        type="date"
                        value={values.answerKey_ReleaseDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.answerKey_ReleaseDate}
                        errors={errors.answerKey_ReleaseDate}
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <FormInput
                        name="answerKey_Desc"
                        label="Description"
                        as="textarea"
                        value={values.answerKey_Desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.answerKey_Desc}
                        errors={errors.answerKey_Desc}
                        rows={3}
                        placeholder="Enter answer key description"
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
                      {isSubmitting ? "Saving..." : answerKeyId ? "Update Answer Key" : "Create Answer Key"}
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