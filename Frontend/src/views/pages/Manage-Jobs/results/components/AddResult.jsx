import { useState, useMemo } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import axios from "@/api/axios";

const resultValidationSchema = Yup.object({
  _id: Yup.string(),
  result_post_name: Yup.string().required("Post Name is required"),
  result_short_desc: Yup.string().required("Short Description is required"),
  result_file: Yup.mixed().required("Admit Card file is required"),
  result_Url: Yup.string().url("Invalid URL format").required("Admit Card URL is required"),
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
  const [resultFile, setResultFile] = useState(null);
  const [message, setMessage] = useState({ text: "", variant: "" });

  const requiredSections = ["basicDetails"];
  const [sectionsTracking, setSectionsTracking] = useState(
    Object.fromEntries(requiredSections.map((s) => [s, false]))
  );

  const initialValues = useMemo(() => ({
    _id: "",
    result_post_name: "",
    result_short_desc: "",
    result_file: null,
    result_Url: "",
  }), []);

  const ensureResultId = async (values, setFieldValue) => {
    if (values._id) return values._id;

    if (!values.result_post_name || !values.result_short_desc) {
      setMessage({ text: "Please fill required fields: Post Name and Short Description", variant: "danger" });
      return null;
    }

    const minimal = {
      result_post_name: values.result_post_name.trim(),
      result_short_desc: values.result_short_desc.trim(),
      result_status: 0, // Active by default
    };

    const fd = new FormData();
    fd.append("resultData", JSON.stringify(minimal));

    try {
      const res = await axios.post(`/admit-cards`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = res?.data?.resultId || res?.data?._id;
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
    const id = await ensureResultId(values, setFieldValue);
    if (!id || !resultFile) {
      setMessage({ text: "Select a file to upload.", variant: "warning" });
      return;
    }

    const fd = new FormData();
    fd.append("resultId", id);
    fd.append("files", resultFile);

    try {
      await axios.post(`/admit-cards/files`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setFieldValue("result_file", resultFile.name || "");
      setResultFile(null);
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

  const saveSection = async (section, values, setFieldValue) => {
    const id = await ensureresultId(values, setFieldValue);
    if (!id) return;

    let sectionData = null;

    if (section === "basicDetails") {
      if (!values.result_post_name || !values.result_short_desc || !values.result_Url) {
        setMessage({ text: "Please fill all required fields", variant: "danger" });
        return;
      }

      if (!resultFile && !values.result_file) {
        setMessage({ text: "Please upload admit card file", variant: "warning" });
        return;
      }

      sectionData = {
        result_post_name: values.result_post_name.trim(),
        result_short_desc: values.result_short_desc.trim(),
        result_Url: values.result_Url.trim(),
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
        resultId: id,
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
          validationSchema={resultValidationSchema}
          onSubmit={(values) => console.log("Form submitted:", values)}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form onSubmit={(e) => e.preventDefault()}>
              {/* Basic Admit Card Details */}
              <ComponentCard className="mb-3" title="Result Details">
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-2">
                        <Form.Label className="mb-1">
                          Result File <span className="text-danger ms-1">*</span>
                        </Form.Label>
                        <div className="d-flex align-items-center gap-3">
                          <Form.Control
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setresultFile(file || null);
                            }}
                            isInvalid={touched.result_file && errors.result_file}
                          />
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => uploadFile(values, setFieldValue)}
                            disabled={!resultFile}
                          >
                            Upload
                          </Button>
                        </div>
                        {touched.result_file && errors.result_file && (
                          <div className="text-danger small mt-1">{errors.result_file}</div>
                        )}
                        {values.result_file && (
                          <div className="text-success small mt-1">
                            File uploaded: {values.result_file}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={6}>
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
                          <option value="Post A">Post A</option>
                          <option value="Post B">Post B</option>
                          <option value="Post C">Post C</option>
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">{errors.admitCard_post_name}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="result_Url"
                        label="Result URL"
                        type="url"
                        value={values.result_Url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.result_Url}
                        errors={errors.result_Url}
                        placeholder="https://example.com/admit-card"
                        required
                      />
                    </Col>
                    <Col md={12}>
                      <FormInput
                        name="result_short_desc"
                        label="Short Description"
                        as="textarea"
                        value={values.result_short_desc}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.result_short_desc}
                        errors={errors.result_short_desc}
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

export default AddResult;