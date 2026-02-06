import { useState, useMemo, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Alert, FormSelect } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import axios from "@/api/axios";
import React from "react";

const resultValidationSchema = Yup.object({
  _id: Yup.string(),
  result_JobId: Yup.string().required("Job is required"),
  result_Title: Yup.string().required("Title is required"),
  result_Desc: Yup.string().required("Description is required"),
  result_URL: Yup.string().url("Invalid URL format").required("Result URL is required"),
  result_ReleaseDate: Yup.date().required("Release Date is required"),
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

const AddResult = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get result ID from URL params for edit mode
  const isEditMode = Boolean(id);
  const [resultFile, setResultFile] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [jobsList, setJobsList] = useState([]);
  const [resultId, setResultId] = useState(id || null);
  const [fileBase64, setFileBase64] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState(null);

  const initialValues = useMemo(() => ({
    _id: "",
    result_JobId: "",
    result_Title: "",
    result_Desc: "",
    result_URL: "",
    result_ReleaseDate: "",
    result_FilePath: "",
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
      setResultFile(file);
      try {
        const base64 = await convertFileToBase64(file);
        setFileBase64(base64);
        setFieldValue("result_FilePath", file.name);
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

  // Fetch result data if in edit mode
  const fetchResultData = async (resultId) => {
    setLoading(true);
    try {
      const res = await axios.get(`/job-categories/get_result_list_of_job/${resultId}`);
      if (res.data.status === 200) {
        const data = res.data.jsonData;
        setResultData(data);
        return data;
      }
    } catch (error) {
      console.error("Error fetching result:", error);
      setMessage({ text: "Error loading result data", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobsList();
    if (isEditMode && id) {
      fetchResultData(id);
    }
  }, [isEditMode, id]);

  // Create result using POST API
  const createResult = async (values) => {
    try {
      const payload = {
        result_JobId: values.result_JobId,
        result_Title: values.result_Title,
        result_Desc: values.result_Desc,
        result_URL: values.result_URL,
        result_ReleaseDate: Number(new Date(values.result_ReleaseDate).getTime()),
        result_FilePath: fileBase64,
      };

      const res = await axios.post(`/job-categories/add_result`, payload);

      if (res.data.status === 200 || res.data.status === 201) {
        const newResultId = res.data.resultId || res.data.jsonData?._id;
        setResultId(newResultId);
        setMessage({ text: "Result created successfully!", variant: "success" });

        setTimeout(() => {
          navigate("/admin/result");
        }, 1500);

        return newResultId;
      }
    } catch (error) {
      console.error("Error creating result:", error);
      setMessage({
        text: error.response?.data?.message || "Error creating answer key",
        variant: "danger"
      });
      return null;
    }
  };

  // Update answer key using PUT API
  const updateResult = async (values) => {
    if (!resultId) {
      setMessage({ text: "No result to update", variant: "warning" });
      return;
    }

    try {
      const payload = {
        result_Title: values.result_Title,
        result_Desc: values.result_Desc,
        result_URL: values.result_URL,
        result_ReleaseDate: Number(new Date(values.result_ReleaseDate).getTime()),
      };

      if (fileBase64) {
        payload.result_FilePath = fileBase64;
      }

      const res = await axios.put(`/job-categories/update_result/${resultId}`, payload);

      if (res.data.status === 200) {
        setMessage({ text: "Result updated successfully!", variant: "success" });

        setTimeout(() => {
          navigate("/admin/result");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating result:", error);
      setMessage({
        text: error.response?.data?.message || "Error updating result",
        variant: "danger"
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    if (resultId) {
      await updateResult(values);
    } else {
      await createResult(values);
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
          validationSchema={resultValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            // Load result data in edit mode
            useEffect(() => {
              if (isEditMode && resultData) {
                setFieldValue("_id", resultData._id || "");
                setFieldValue("result_JobId", resultData.result_JobId?._id || resultData.result_JobId || "");
                setFieldValue("result_Title", resultData.result_Title || "");
                setFieldValue("result_Desc", resultData.result_Desc || "");
                setFieldValue("result_URL", resultData.result_URL || "");
                setFieldValue("result_ReleaseDate", resultData.result_ReleaseDate ? new Date(resultData.result_ReleaseDate).toISOString().split('T')[0] : "");
                setFieldValue("result_FilePath", resultData.result_FilePath || "");
              }
            }, [isEditMode, resultData]);

            return (
            <Form onSubmit={(e) => { e.preventDefault(); handleSubmit(values); }}>
              {/* Basic Result Details */}
              <ComponentCard className="mb-3" title="Result Details">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Label className="mb-1">
                          Result File <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <Form.Control
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileChange(e, setFieldValue)}
                        />
                        {values.result_FilePath && (
                          <div className="text-success small mt-1">
                            File selected: {values.result_FilePath}
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
                          name="result_JobId"
                          value={values.result_JobId}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.result_JobId && errors.result_JobId}
                        >
                          <option value="">Select Job</option>
                          {jobsList.map((job) => (
                            <option key={job._id} value={job._id}>
                              {job.job_title}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.result_JobId}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="result_Title"
                        label="Result Title"
                        type="text"
                        value={values.result_Title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.result_Title}
                        errors={errors.result_Title}
                        placeholder="Enter result title"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="result_URL"
                        label="Result URL"
                        type="url"
                        value={values.result_URL}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.result_URL}
                        errors={errors.result_URL}
                        placeholder="https://example.com/result"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="result_ReleaseDate"
                        label="Release Date"
                        type="date"
                        value={values.result_ReleaseDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.result_ReleaseDate}
                        errors={errors.result_ReleaseDate}
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <FormInput
                        name="result_Desc"
                        label="Description"
                        as="textarea"
                        value={values.result_Desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.result_Desc}
                        errors={errors.result_Desc}
                        rows={3}
                        placeholder="Enter result description"
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
                      {isSubmitting ? "Saving..." : resultId ? "Update Result" : "Create Result"}
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>
            </Form>
          );}
        }
        </Formik>
      </Card.Body>
    </div>
  );
};

export default AddResult;