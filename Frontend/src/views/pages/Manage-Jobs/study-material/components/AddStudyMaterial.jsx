import { useState, useMemo, useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import axios from "@/api/axios";
import React from "react";
import { TbTrash, TbPlus, TbEye } from "react-icons/tb";
import ImageModal from "@/components/ImageModel";

const studyMaterialValidationSchema = Yup.object({
  studyMaterial_jobId: Yup.string().required("Job is required"),
  studyMaterial_title: Yup.string().required("Title is required"),
  studyMaterial_description: Yup.string().required("Description is required"),
  studyMaterial_link: Yup.string().url("Invalid URL format").nullable(),
  studyMaterial_releaseDate: Yup.date().nullable(),
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

const AddStudyMaterial = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [jobsList, setJobsList] = useState([]);
  const [studyMaterialId, setStudyMaterialId] = useState(id || null);
  const [loading, setLoading] = useState(false);
  const [studyMaterialData, setStudyMaterialData] = useState(null);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageTitle, setSelectedImageTitle] = useState("");

  const initialValues = useMemo(
    () => ({
      studyMaterial_jobId: studyMaterialData?.studyMaterial_jobId?._id || studyMaterialData?.studyMaterial_jobId || "",
      studyMaterial_title: studyMaterialData?.studyMaterial_title || "",
      studyMaterial_description: studyMaterialData?.studyMaterial_description || "",
      studyMaterial_link: studyMaterialData?.studyMaterial_link || "",
      studyMaterial_releaseDate: studyMaterialData?.studyMaterial_releaseDate
        ? new Date(studyMaterialData.studyMaterial_releaseDate).toISOString().split("T")[0]
        : "",
    }),
    [studyMaterialData]
  );

  // Convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Handle adding a new file entry
  const handleAddFile = () => {
    setFiles([...files, { file_name: "", file_path: "", file_downloadable: true, _file: null }]);
  };

  // Handle removing a file entry
  const handleRemoveFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // Handle file input change
  const handleFileInputChange = async (index, e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertFileToBase64(file);
        const updated = [...files];
        updated[index] = {
          ...updated[index],
          file_name: updated[index].file_name || file.name,
          file_path: base64,
          _file: file,
        };
        setFiles(updated);
      } catch (error) {
        console.error("Error converting file:", error);
        setMessage({ text: "Error processing file", variant: "danger" });
      }
    }
  };

  // Handle file name change
  const handleFileNameChange = (index, value) => {
    const updated = [...files];
    updated[index] = { ...updated[index], file_name: value };
    setFiles(updated);
  };

  // Handle downloadable toggle
  const handleDownloadableChange = (index, checked) => {
    const updated = [...files];
    updated[index] = { ...updated[index], file_downloadable: checked };
    setFiles(updated);
  };

  // Handle view file
  const handleViewFile = (file, index) => {
    if (file.file_path) {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const imageSrc = file.file_path.startsWith("data:") 
        ? file.file_path 
        : `${BASE_URL}${file.file_path}`;
      setSelectedImage(imageSrc);
      setSelectedImageTitle(file.file_name || `File ${index + 1}`);
      setShowModal(true);
    }
  };

  // Fetch jobs list
  const fetchJobsList = async () => {
    try {
      const res = await axios.get(`/job-categories/government_and_psu_sector_job_list`);
      setJobsList(res.data?.jsonData?.govAndPsuJobList || []);
    } catch (err) {
      console.error("Error fetching jobs list:", err);
      setMessage({ text: "Error fetching jobs list", variant: "danger" });
    }
  };

  // Fetch study material by ID for edit mode
  const fetchStudyMaterialById = async (materialId) => {
    try {
      setLoading(true);
      const res = await axios.get(`/job-categories/get_job_study_material_by_id/${materialId}`);
      const data = res.data?.jsonData?.studyMaterial;
      if (data) {
        setStudyMaterialData(data);
        // Map existing files (already saved on server)
        if (data.studyMaterial_files && data.studyMaterial_files.length > 0) {
          setFiles(
            data.studyMaterial_files.map((f) => ({
              file_name: f.file_name || "",
              file_path: f.file_path || "",
              file_downloadable: f.file_downloadable !== false,
              _file: null,
            }))
          );
        }
      }
    } catch (err) {
      console.error("Error fetching study material:", err);
      setMessage({ text: "Error fetching study material details", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchJobsList();
    if (isEditMode && id) {
      fetchStudyMaterialById(id);
    }
  }, [id]);

  // Create study material
  const createStudyMaterial = async (values) => {
    try {
      const payload = {
        studyMaterial_jobId: values.studyMaterial_jobId,
        studyMaterial_title: values.studyMaterial_title,
        studyMaterial_description: values.studyMaterial_description,
        studyMaterial_link: values.studyMaterial_link || "",
        studyMaterial_releaseDate: values.studyMaterial_releaseDate
          ? Number(new Date(values.studyMaterial_releaseDate).getTime())
          : null,
        studyMaterial_files: files
          .filter((f) => f.file_path)
          .map((f) => {
            // Extract extension from file name or file path
            let extension = "png";
            if (f._file) {
              extension = f._file.name.split(".").pop() || "png";
            } else if (f.file_path && !f.file_path.startsWith("data:")) {
              extension = f.file_path.split(".").pop() || "png";
            }
            return {
              file_name: f.file_name,
              file_path: f.file_path,
              file_downloadable: f.file_downloadable,
              extension: extension,
            };
          }),
      };

      const res = await axios.post(`/job-categories/add_job_study_material`, payload);

      if (res.data.status === 200 || res.data.status === 201) {
        const newId = res.data.jsonData?._id;
        setStudyMaterialId(newId);
        setMessage({ text: "Study material created successfully!", variant: "success" });

        setTimeout(() => {
          navigate("/admin/study-material");
        }, 1500);

        return newId;
      }
    } catch (error) {
      console.error("Error creating study material:", error);
      setMessage({
        text: error.response?.data?.message || "Error creating study material",
        variant: "danger",
      });
      return null;
    }
  };

  // Update study material
  const updateStudyMaterial = async (values) => {
    try {
      const payload = {
        studyMaterial_jobId: values.studyMaterial_jobId,
        studyMaterial_title: values.studyMaterial_title,
        studyMaterial_description: values.studyMaterial_description,
        studyMaterial_link: values.studyMaterial_link || "",
        studyMaterial_releaseDate: values.studyMaterial_releaseDate
          ? Number(new Date(values.studyMaterial_releaseDate).getTime())
          : null,
        studyMaterial_files: files
          .filter((f) => f.file_path)
          .map((f) => {
            // Extract extension from file name or file path
            let extension = "png";
            if (f._file) {
              extension = f._file.name.split(".").pop() || "png";
            } else if (f.file_path && !f.file_path.startsWith("data:")) {
              extension = f.file_path.split(".").pop() || "png";
            }
            return {
              file_name: f.file_name,
              file_path: f.file_path,
              file_downloadable: f.file_downloadable,
              extension: extension,
            };
          }),
        
      };
      console.log("Update Payload:", payload);
      const res = await axios.put(`/job-categories/update_job_study_material/${id}`, payload);

      if (res.data.status === 200) {
        setMessage({ text: "Study material updated successfully!", variant: "success" });
        setTimeout(() => {
          navigate("/admin/study-material");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating study material:", error);
      setMessage({
        text: error.response?.data?.message || "Error updating study material",
        variant: "danger",
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    if (isEditMode) {
      await updateStudyMaterial(values);
    } else {
      await createStudyMaterial(values);
    }
  };

  return (
    <div className="mb-4 pt-4">
      <Card.Body>
        {message.text && (
          <Alert
            variant={message.variant}
            onClose={() => setMessage({ text: "", variant: "" })}
            dismissible
          >
            {message.text}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={studyMaterialValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(values);
                }}
              >
                {/* Study Material Details */}
                <ComponentCard className="mb-3" title="Study Material Details">
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <div className="d-flex justify-content-between align-items-end">
                            <Form.Label className="mb-0 mt-1">
                              Select Job <span className="text-danger ms-1">*</span>
                            </Form.Label>
                          </div>
                          <Form.Select
                            name="studyMaterial_jobId"
                            value={values.studyMaterial_jobId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.studyMaterial_jobId && errors.studyMaterial_jobId}
                          >
                            <option value="">Select Job</option>
                            {jobsList.map((job) => (
                              <option key={job._id} value={job._id}>
                                {job.job_title}
                              </option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.studyMaterial_jobId}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <FormInput
                          name="studyMaterial_title"
                          label="Title"
                          type="text"
                          value={values.studyMaterial_title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.studyMaterial_title}
                          errors={errors.studyMaterial_title}
                          placeholder="Enter study material title"
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          name="studyMaterial_releaseDate"
                          label="Release Date"
                          type="date"
                          value={values.studyMaterial_releaseDate}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.studyMaterial_releaseDate}
                          errors={errors.studyMaterial_releaseDate}
                        />
                      </Col>
                      <Col md={12}>
                        <FormInput
                          name="studyMaterial_link"
                          label="External Link"
                          type="url"
                          value={values.studyMaterial_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.studyMaterial_link}
                          errors={errors.studyMaterial_link}
                          placeholder="https://example.com/study-material"
                        />
                      </Col>
                      <Col md={12}>
                        <FormInput
                          name="studyMaterial_description"
                          label="Description"
                          as="textarea"
                          value={values.studyMaterial_description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.studyMaterial_description}
                          errors={errors.studyMaterial_description}
                          rows={3}
                          placeholder="Enter study material description"
                          required
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                </ComponentCard>

                {/* Files Section */}
                <ComponentCard
                  className="mb-3"
                  title={
                    <div className="d-flex align-items-center justify-content-between gap-3">
                      <span>Attached Files</span>
                      <Button size="sm" variant="outline-primary" onClick={handleAddFile}>
                        <TbPlus className="" />
                      </Button>
                    </div>
                  }
                >
                  <Card.Body>
                    {files.length === 0 && (
                      <p className="text-muted text-center mb-0">
                        No files added yet. Click "Add File" to attach study material files.
                      </p>
                    )}
                    {files.map((file, index) => (
                      <Row key={index} className="mb-3 align-items-end border-bottom pb-3">
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label className="mb-0">
                              File Name <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="text"
                              value={file.file_name}
                              onChange={(e) => handleFileNameChange(index, e.target.value)}
                              placeholder="Enter file name"
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <Form.Label className="mb-0">
                                File <span className="text-danger">*</span>
                              </Form.Label>
                              {file.file_path && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-link p-0 text-primary"
                                  onClick={() => handleViewFile(file, index)}
                                  title="View file"
                                >
                                  <TbEye size={18} />
                                </button>
                              )}
                            </div>
                            <Form.Control
                              type="file"
                              onChange={(e) => handleFileInputChange(index, e)}
                            />
                            {file._file && (
                              <div className="text-success small mt-1">
                                Selected: {file._file.name}
                              </div>
                            )}
                          </Form.Group>
                        </Col>
                        <Col md={2}>
                          <Form.Group>
                            <Form.Check
                              type="checkbox"
                              label="Downloadable"
                              checked={file.file_downloadable}
                              onChange={(e) => handleDownloadableChange(index, e.target.checked)}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={2} className="text-end">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <TbTrash className="" />
                          </Button>
                        </Col>
                      </Row>
                    ))}
                  </Card.Body>
                </ComponentCard>

                <div className="text-end my-2">
                  <Button size="md" type="submit" disabled={isSubmitting}>
                    {isSubmitting
                      ? "Saving..."
                      : studyMaterialId
                      ? "Update Study Material"
                      : "Create Study Material"}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Card.Body>

      <ImageModal
        show={showModal}
        onHide={() => setShowModal(false)}
        imageSrc={selectedImage}
        title={selectedImageTitle}
      />
    </div>
  );
};

export default AddStudyMaterial;