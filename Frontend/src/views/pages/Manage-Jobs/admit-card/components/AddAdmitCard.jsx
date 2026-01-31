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
  admitCard_post_name: Yup.string().required("Post Name is required"),
  admitCard_short_desc: Yup.string().required("Short Description is required"),
  admitCard_file: Yup.mixed().required("Admit Card file is required"),
  admitCard_Url: Yup.string().url("Invalid URL format").required("Admit Card URL is required"),
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

  const requiredSections = ["basicDetails"];
  const [sectionsTracking, setSectionsTracking] = useState(
    Object.fromEntries(requiredSections.map((s) => [s, false]))
  );

  const initialValues = useMemo(() => ({
    _id: "",
    admitCard_post_name: "",
    admitCard_short_desc: "",
    admitCard_file: null,
    admitCard_Url: "",
  }), []);

  const ensureAdmitCardId = async (values, setFieldValue) => {
    if (values._id) return values._id;

    if (!values.admitCard_post_name || !values.admitCard_short_desc) {
      setMessage({ text: "Please fill required fields: Post Name and Short Description", variant: "danger" });
      return null;
    }

    const minimal = {
      admitCard_post_name: values.admitCard_post_name.trim(),
      admitCard_short_desc: values.admitCard_short_desc.trim(),
      admitCard_status: 0, // Active by default
    };

    const fd = new FormData();
    fd.append("admitCardData", JSON.stringify(minimal));

    try {
      const res = await axios.post(`/admit-cards`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = res?.data?.admitCardId || res?.data?._id;
      console.log("Created admit card with ID:", res.data);
      if (id) {
        setFieldValue("_id", id);
        setMessage({ text: "Admit card created successfully.", variant: "success" });
      }
      return id;
    } catch (error) {
      console.error("Error creating admit card:", error);
      setMessage({ text: error.response?.data?.error || "Error creating admit card", variant: "danger" });
      return null;
    }
  };

  const uploadFile = async (values, setFieldValue) => {
    const id = await ensureAdmitCardId(values, setFieldValue);
    if (!id || !admitCardFile) {
      setMessage({ text: "Select a file to upload.", variant: "warning" });
      return;
    }

    const fd = new FormData();
    fd.append("admitCardId", id);
    fd.append("files", admitCardFile);

    try {
      await axios.post(`/admit-cards/files`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFieldValue("admitCard_file", admitCardFile.name || "");
      setAdmitCardFile(null);
      setMessage({ text: "File uploaded successfully.", variant: "success" });
    } catch (e) {
      console.error("Error uploading file:", e);
      setMessage({ text: "Error uploading file", variant: "danger" });
    }
  };

  const maybeRedirect = (state) => {
    if (requiredSections.every((s) => state[s])) {
      setTimeout(() => navigate("/admin/admit-cards"), 500);
    }
  };

  const fetchJobsList = async () =>{
    try {
      const res = await axios.get(`/job-categories/government_and_psu_sector_job_list`);
      console.log("Fetched jobs for admit card:", res.data);
      setJobsList(res.data?.jsonData?.govAndPsuJobList || []);
    } catch (err) {
      console.error("Error fetching jobs for admit card:", err);
      return [];
    }
  };

  React.useEffect(() => {
    fetchJobsList();
  }, []);

  const saveSection = async (section, values, setFieldValue) => {
    const id = await ensureAdmitCardId(values, setFieldValue);
    if (!id) return;

    let sectionData = null;

    if (section === "basicDetails") {
      if (!values.admitCard_post_name || !values.admitCard_short_desc || !values.admitCard_Url) {
        setMessage({ text: "Please fill all required fields", variant: "danger" });
        return;
      }

      if (!admitCardFile && !values.admitCard_file) {
        setMessage({ text: "Please upload admit card file", variant: "warning" });
        return;
      }

      sectionData = {
        admitCard_post_name: values.admitCard_post_name.trim(),
        admitCard_short_desc: values.admitCard_short_desc.trim(),
        admitCard_Url: values.admitCard_Url.trim(),
      };
    }

    if (!sectionData || Object.keys(sectionData).length === 0) {
      console.warn("No valid data to save for section:", section);
      setMessage({ text: "No data to save. Please fill required fields.", variant: "warning" });
      return;
    }
    console.log(`Saving section ${section} with data:`, sectionData);

    try {
      const res = await axios.post(`/admit-cards/save-section`, {
        admitCardId: id,
        section,
        data: sectionData
      });
      console.log(`Saved section ${section}:`, res.data);
      setMessage({ text: `${section} saved successfully!`, variant: "success" });

      if (requiredSections.includes(section)) {
        setSectionsTracking((prev) => {
          const updated = { ...prev, [section]: true };
          maybeRedirect(updated);
          return updated;
        });
      }
    } catch (error) {
      console.error("Error saving section:", error);
      setMessage({
        text: error.response?.data?.error || `Error saving ${section}`,
        variant: "danger"
      });
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
          onSubmit={(values) => console.log("Form submitted:", values)}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form onSubmit={(e) => e.preventDefault()}>
              {/* Basic Admit Card Details */}
              <ComponentCard className="mb-3" title="Admit Card Details">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Label className="mb-1">
                          Admit Card File <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <div className="d-flex align-items-center gap-3">
                          <Form.Control
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setAdmitCardFile(file || null);
                            }}
                            isInvalid={touched.admitCard_file && errors.admitCard_file}
                          />
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => uploadFile(values, setFieldValue)}
                            disabled={!admitCardFile}
                          >
                            Upload
                          </Button>
                        </div>
                        {touched.admitCard_file && errors.admitCard_file && (
                          <div className="text-danger small mt-1">{errors.admitCard_file}</div>
                        )}
                        {values.admitCard_file && (
                          <div className="text-success small mt-1">
                            File uploaded: {values.admitCard_file}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <div className="d-flex justify-content-between align-items-end">
                          <Form.Label className="mb-0 mt-1">
                            Post Name <span className="text-danger ms-1">*</span>
                          </Form.Label>
                        </div>
                        <Form.Select
                          name="admitCard_post_name"
                          value={values.admitCard_post_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.admitCard_post_name && errors.admitCard_post_name}
                        > 
                          <option value="">Select Post Name</option>
                          {jobsList.map((job) => (
                            <option key={job._id} value={job.job_title}>
                              {job.job_title}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.admitCard_post_name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="admitCard_Url"
                        label="Admit Card URL"
                        type="url"
                        value={values.admitCard_Url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.admitCard_Url}
                        errors={errors.admitCard_Url}
                        placeholder="https://example.com/admit-card"
                        required
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="answer_key_date"
                        label="Answer Key Date"
                        type="date"
                        value={values.answer_key_date}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.answer_key_date}
                        errors={errors.answer_key_date}
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <FormInput
                        name="admitCard_short_desc"
                        label="Short Description"
                        as="textarea"
                        value={values.admitCard_short_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.admitCard_short_desc}
                        errors={errors.admitCard_short_desc}
                        rows={3}
                        required
                      />
                    </Col>
                  </Row>

                  <div className="text-end my-2">
                    <Button size="sm" onClick={() => saveSection("basicDetails", values, setFieldValue)}>
                      Save Basic Details
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