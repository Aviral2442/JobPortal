import { useState, useMemo, useEffect } from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import axios from "@/api/axios";
import React from "react";
import { TbTrash, TbEye, TbPlus } from "react-icons/tb";
import ImageModal from "@/components/ImageModel";

const documentValidationSchema = Yup.object({
    _id: Yup.string(),
    document_title: Yup.string().required("Document title is required"),
    document_short_desc: Yup.string().required("Short description is required"),
    document_long_desc: Yup.string().required("Long description is required"),
    document_formated_desc1: Yup.string(),
    document_formated_desc2: Yup.string(),
    document_formated_desc3: Yup.string(),
    document_formated_desc4: Yup.string(),
    document_posted_date: Yup.date().required("Posted date is required"),
    document_important_dates: Yup.array().of(
        Yup.object().shape({
            dates_label: Yup.string().required("Date label is required"),
            dates_value: Yup.string().required("Date value is required"),
        })
    ),
    document_important_links: Yup.array().of(
        Yup.object().shape({
            links_label: Yup.string().required("Link label is required"),
            links_url: Yup.string().url("Invalid URL").required("Link URL is required"),
        })
    ),
    document_application_fees: Yup.array().of(
        Yup.object().shape({
            links_label: Yup.string().required("Fee label is required"),
            links_url: Yup.string().url("Invalid URL").required("Fee URL is required"),
        })
    ),
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

const AddDocument = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const [message, setMessage] = useState({ text: "", variant: "" });
    const [documentId, setDocumentId] = useState(id || null);
    const [logoBase64, setLogoBase64] = useState("");
    const [filesBase64, setFilesBase64] = useState([]);
    const [loading, setLoading] = useState(false);
    const [documentData, setDocumentData] = useState(null);

    // Image Modal States
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedImageTitle, setSelectedImageTitle] = useState("");

    const initialValues = useMemo(
        () => ({
            _id: "",
            document_title: "",
            document_short_desc: "",
            document_long_desc: "",
            document_formated_desc1: "",
            document_formated_desc2: "",
            document_formated_desc3: "",
            document_formated_desc4: "",
            document_posted_date: "",
            document_logo: "",
            document_important_dates: [{ dates_label: "", dates_value: "" }],
            document_important_links: [{ links_label: "", links_url: "" }],
            document_application_fees: [{ links_label: "", links_url: "" }],
            document_files: [{ file_label: "", file_path: "" }],
        }),
        []
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

    // Handle logo change
    const handleLogoChange = async (e, setFieldValue) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertFileToBase64(file);
                const extension = file.name.split(".").pop();
                setLogoBase64(base64);
                setFieldValue("document_logo", file.name);
                setFieldValue("extension", extension);
            } catch (error) {
                console.error("Error converting logo:", error);
                setMessage({ text: "Error processing logo file", variant: "danger" });
            }
        }
    };

    // Handle multiple files change
    const handleFilesChange = async (e, setFieldValue, index) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await convertFileToBase64(file);
                const extension = file.name.split(".").pop();

                const newFilesBase64 = [...filesBase64];
                newFilesBase64[index] = { base64, extension, name: file.name };
                setFilesBase64(newFilesBase64);

                setFieldValue(`document_files[${index}].file_path`, base64);
                setFieldValue(`document_files[${index}].extension`, extension);
            } catch (error) {
                console.error("Error converting file:", error);
                setMessage({ text: "Error processing file", variant: "danger" });
            }
        }
    };

    // Fetch document data if in edit mode
    const fetchDocumentData = async (documentId) => {
        setLoading(true);
        try {
            const res = await axios.get(`/job-categories/get_document_by_id/${documentId}`);
            if (res.data.status === 200) {
                const data = res.data?.jsonData;
                console.log(res.data?.jsonData);
                setDocumentData(data);
                return data;
            }
        } catch (error) {
            console.error("Error fetching document:", error);
            setMessage({ text: "Error loading document data", variant: "danger" });
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (isEditMode && id) {
            fetchDocumentData(id);
        }
    }, [isEditMode, id]);

    // Create document using POST API
    const createDocument = async (values) => {
        try {
            const payload = {
                document_title: values.document_title,
                document_short_desc: values.document_short_desc,
                document_long_desc: values.document_long_desc,
                document_formated_desc1: values.document_formated_desc1,
                document_formated_desc2: values.document_formated_desc2,
                document_formated_desc3: values.document_formated_desc3,
                document_formated_desc4: values.document_formated_desc4,
                document_posted_date: Number(new Date(values.document_posted_date).getTime()),
                document_important_dates: values.document_important_dates,
                document_important_links: values.document_important_links,
                document_application_fees: values.document_application_fees,
                document_logo: logoBase64,
                extension: values.extension,
                document_files: values.document_files.map((file, index) => ({
                    file_label: file.file_label,
                    file_path: file.file_path,
                })),
                extensions: filesBase64.map((file) => file?.extension || ""),
            };

            const res = await axios.post(`/job-categories/add_document`, payload);

            if (res.data.status === 200 || res.data.status === 201) {
                const newDocumentId = res.data.documentId || res.data.jsonData?._id;
                setDocumentId(newDocumentId);
                setMessage({ text: "Document created successfully!", variant: "success" });

                setTimeout(() => {
                    navigate("/admin/documents");
                }, 1500);

                return newDocumentId;
            }
        } catch (error) {
            console.error("Error creating document:", error);
            setMessage({
                text: error.response?.data?.message || "Error creating document",
                variant: "danger",
            });
            return null;
        }
    };

    // Update document using PUT API
    const updateDocument = async (values) => {
        if (!documentId) {
            setMessage({ text: "No document to update", variant: "warning" });
            return;
        }

        try {
            const payload = {
                document_title: values.document_title,
                document_short_desc: values.document_short_desc,
                document_long_desc: values.document_long_desc,
                document_formated_desc1: values.document_formated_desc1,
                document_formated_desc2: values.document_formated_desc2,
                document_formated_desc3: values.document_formated_desc3,
                document_formated_desc4: values.document_formated_desc4,
                document_posted_date: Number(new Date(values.document_posted_date).getTime()),
                document_important_dates: values.document_important_dates,
                document_important_links: values.document_important_links,
                document_application_fees: values.document_application_fees,
            };

            if (logoBase64) {
                payload.document_logo = logoBase64;
                payload.extension = values.extension;
            }

            if (filesBase64.length > 0) {
                payload.document_files = values.document_files.map((file, index) => ({
                    file_label: file.file_label,
                    file_path: filesBase64[index]?.base64 || file.file_path,
                }));
                payload.extensions = filesBase64.map((file) => file?.extension || "");
            }

            const res = await axios.put(`/job-categories/update_document/${documentId}`, payload);

            if (res.data.status === 200) {
                setMessage({ text: "Document updated successfully!", variant: "success" });

                setTimeout(() => {
                    navigate("/admin/documents");
                }, 1500);
            }
        } catch (error) {
            console.error("Error updating document:", error);
            setMessage({
                text: error.response?.data?.message || "Error updating document",
                variant: "danger",
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (values) => {
        if (documentId) {
            await updateDocument(values);
        } else {
            await createDocument(values);
        }
    };

    // Function to handle image/file preview
    const handleViewFile = (fileSrc, title) => {
        setSelectedImage(fileSrc);
        setSelectedImageTitle(title);
        setShowImageModal(true);
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
                    validationSchema={documentValidationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize={true}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        isSubmitting,
                    }) => {
                        // Load document data in edit mode
                        useEffect(() => {
                            if (isEditMode && documentData) {
                                setFieldValue("_id", documentData._id || "");
                                setFieldValue("document_title", documentData.document_title || "");
                                setFieldValue("document_short_desc", documentData.document_short_desc || "");
                                setFieldValue("document_long_desc", documentData.document_long_desc || "");
                                setFieldValue("document_formated_desc1", documentData.document_formated_desc1 || "");
                                setFieldValue("document_formated_desc2", documentData.document_formated_desc2 || "");
                                setFieldValue("document_formated_desc3", documentData.document_formated_desc3 || "");
                                setFieldValue("document_formated_desc4", documentData.document_formated_desc4 || "");
                                setFieldValue(
                                    "document_posted_date",
                                    documentData.document_posted_date
                                        ? new Date(documentData.document_posted_date).toISOString().split("T")[0]
                                        : ""
                                );
                                setFieldValue("document_logo", documentData.document_logo || "");
                                setFieldValue(
                                    "document_important_dates",
                                    documentData.document_important_dates || [{ dates_label: "", dates_value: "" }]
                                );
                                setFieldValue(
                                    "document_important_links",
                                    documentData.document_important_links || [{ links_label: "", links_url: "" }]
                                );
                                setFieldValue(
                                    "document_application_fees",
                                    documentData.document_application_fees || [{ links_label: "", links_url: "" }]
                                );
                                setFieldValue(
                                    "document_files",
                                    documentData.document_files || [{ file_label: "", file_path: "" }]
                                );
                            }
                        }, [isEditMode, documentData]);

                        return (
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit(values);
                                }}
                            >
                                {/* Basic Document Details */}
                                <ComponentCard className="mb-3 pb-3" title="Document Details">
                                    <Card.Body>
                                        <Row>
                                            <Col md={8}>
                                                <Form.Group className="mb-2">
                                                    <Form.Label className="mb-1">Document Logo</Form.Label>
                                                    <Form.Control
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleLogoChange(e, setFieldValue)}
                                                    />
                                                    {values.document_logo && (
                                                        <div className="text-success small mt-1">
                                                            Logo selected: {values.document_logo}
                                                        </div>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                {values.document_logo && (
                                                    <div className="mt-2 d-flex align-items-center gap-2">
                                                        <img
                                                            src={logoBase64 || `http://localhost:5000${values.document_logo}`}
                                                            alt="Document Logo"
                                                            style={{ maxWidth: "80px", maxHeight: "80px", cursor: "pointer" }}
                                                            onClick={() => handleViewFile(
                                                                logoBase64 || `http://localhost:5000${values.document_logo}`,
                                                                "Document Logo"
                                                            )}
                                                        />
                                                        <Button
                                                            size="sm"
                                                            variant="outline-primary"
                                                            onClick={() => handleViewFile(
                                                                logoBase64 || `http://localhost:5000${values.document_logo}`,
                                                                "Document Logo"
                                                            )}
                                                            title="View Logo"
                                                        >
                                                            <TbEye size={18} />
                                                        </Button>
                                                    </div>
                                                )}
                                            </Col>
                                            <Col md={6}>
                                                <FormInput
                                                    name="document_title"
                                                    label="Document Title"
                                                    type="text"
                                                    value={values.document_title}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_title}
                                                    errors={errors.document_title}
                                                    placeholder="Enter document title"
                                                    required
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <FormInput
                                                    name="document_posted_date"
                                                    label="Posted Date"
                                                    type="date"
                                                    value={values.document_posted_date}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_posted_date}
                                                    errors={errors.document_posted_date}
                                                    required
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <FormInput
                                                    name="document_short_desc"
                                                    label="Short Description"
                                                    as="textarea"
                                                    value={values.document_short_desc}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_short_desc}
                                                    errors={errors.document_short_desc}
                                                    rows={2}
                                                    placeholder="Enter short description"
                                                    required
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <FormInput
                                                    name="document_long_desc"
                                                    label="Long Description"
                                                    as="textarea"
                                                    value={values.document_long_desc}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_long_desc}
                                                    errors={errors.document_long_desc}
                                                    rows={4}
                                                    placeholder="Enter long description"
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </ComponentCard>

                                {/* Formatted Descriptions */}
                                <ComponentCard className="mb-3 pb-3" title="Formatted Descriptions">
                                    <Card.Body>
                                        <Row>
                                            <Col md={6}>
                                                <FormInput
                                                    name="document_formated_desc1"
                                                    label="Formatted Description 1"
                                                    as="textarea"
                                                    value={values.document_formated_desc1}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_formated_desc1}
                                                    errors={errors.document_formated_desc1}
                                                    rows={3}
                                                    placeholder="Enter formatted description 1"
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <FormInput
                                                    name="document_formated_desc2"
                                                    label="Formatted Description 2"
                                                    as="textarea"
                                                    value={values.document_formated_desc2}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_formated_desc2}
                                                    errors={errors.document_formated_desc2}
                                                    rows={3}
                                                    placeholder="Enter formatted description 2"
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <FormInput
                                                    name="document_formated_desc3"
                                                    label="Formatted Description 3"
                                                    as="textarea"
                                                    value={values.document_formated_desc3}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_formated_desc3}
                                                    errors={errors.document_formated_desc3}
                                                    rows={3}
                                                    placeholder="Enter formatted description 3"
                                                />
                                            </Col>
                                            <Col md={6}>
                                                <FormInput
                                                    name="document_formated_desc4"
                                                    label="Formatted Description 4"
                                                    as="textarea"
                                                    value={values.document_formated_desc4}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    touched={touched.document_formated_desc4}
                                                    errors={errors.document_formated_desc4}
                                                    rows={3}
                                                    placeholder="Enter formatted description 4"
                                                />
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </ComponentCard>

                                {/* Important Dates */}
                                <ComponentCard className="mb-3 pb-3" title="Important Dates">
                                    <Card.Body>
                                        <FieldArray name="document_important_dates">
                                            {({ push, remove }) => (
                                                <>
                                                    {values.document_important_dates.map((date, index) => (
                                                        <Row key={index} className="mb-2">
                                                            <Col md={5}>
                                                                <FormInput
                                                                    name={`document_important_dates[${index}].dates_label`}
                                                                    label="Date Label"
                                                                    value={date.dates_label}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    touched={
                                                                        touched.document_important_dates?.[index]?.dates_label
                                                                    }
                                                                    errors={
                                                                        errors.document_important_dates?.[index]?.dates_label
                                                                    }
                                                                    placeholder="Enter date label"
                                                                />
                                                            </Col>
                                                            <Col md={5}>
                                                                <FormInput
                                                                    name={`document_important_dates[${index}].dates_value`}
                                                                    label="Date Value"
                                                                    type="date"
                                                                    value={date.dates_value}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    touched={
                                                                        touched.document_important_dates?.[index]?.dates_value
                                                                    }
                                                                    errors={
                                                                        errors.document_important_dates?.[index]?.dates_value
                                                                    }
                                                                    placeholder="Enter date value"
                                                                />
                                                            </Col>
                                                            <Col md={2} className="d-flex align-items-center gap-1">
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => remove(index)}
                                                                    disabled={values.document_important_dates.length === 1}
                                                                    className="mt-3 py-2"
                                                                >
                                                                    <TbTrash className="" />
                                                                </Button>
                                                                {index === values.document_important_dates.length - 1 && (
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => push({ dates_label: "", dates_value: "" })}
                                                                        className="mt-3 py-2"
                                                                    >
                                                                        <TbPlus className="" />
                                                                    </Button>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </>
                                            )}
                                        </FieldArray>
                                    </Card.Body>
                                </ComponentCard>

                                {/* Important Links */}
                                <ComponentCard className="mb-3 pb-3" title="Important Links">
                                    <Card.Body>
                                        <FieldArray name="document_important_links">
                                            {({ push, remove }) => (
                                                <>
                                                    {values.document_important_links.map((link, index) => (
                                                        <Row key={index} className="mb-2">
                                                            <Col md={5}>
                                                                <FormInput
                                                                    name={`document_important_links[${index}].links_label`}
                                                                    label="Link Label"
                                                                    value={link.links_label}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    touched={
                                                                        touched.document_important_links?.[index]?.links_label
                                                                    }
                                                                    errors={
                                                                        errors.document_important_links?.[index]?.links_label
                                                                    }
                                                                    placeholder="Enter link label"
                                                                />
                                                            </Col>
                                                            <Col md={5}>
                                                                <FormInput
                                                                    name={`document_important_links[${index}].links_url`}
                                                                    label="Link URL"
                                                                    type="url"
                                                                    value={link.links_url}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    touched={
                                                                        touched.document_important_links?.[index]?.links_url
                                                                    }
                                                                    errors={
                                                                        errors.document_important_links?.[index]?.links_url
                                                                    }
                                                                    placeholder="https://example.com"
                                                                />
                                                            </Col>
                                                            <Col md={2} className="d-flex align-items-center gap-1">
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => remove(index)}
                                                                    disabled={values.document_important_links.length === 1}
                                                                    className="mt-3 py-2"
                                                                >
                                                                    <TbTrash className="" />
                                                                </Button>
                                                                {index === values.document_important_links.length - 1 && (
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => push({ links_label: "", links_url: "" })}
                                                                        className="mt-3 py-2"
                                                                    >
                                                                        <TbPlus className="" />
                                                                    </Button>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </>
                                            )}
                                        </FieldArray>
                                    </Card.Body>
                                </ComponentCard>

                                {/* Application Fees */}
                                <ComponentCard className="mb-3 pb-3" title="Application Fees">
                                    <Card.Body>
                                        <FieldArray name="document_application_fees">
                                            {({ push, remove }) => (
                                                <>
                                                    {values.document_application_fees.map((fee, index) => (
                                                        <Row key={index} className="mb-2">
                                                            <Col md={5}>
                                                                <FormInput
                                                                    name={`document_application_fees[${index}].links_label`}
                                                                    label="Fee Label"
                                                                    value={fee.links_label}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    touched={
                                                                        touched.document_application_fees?.[index]?.links_label
                                                                    }
                                                                    errors={
                                                                        errors.document_application_fees?.[index]?.links_label
                                                                    }
                                                                    placeholder="Enter fee label"
                                                                />
                                                            </Col>
                                                            <Col md={5}>
                                                                <FormInput
                                                                    name={`document_application_fees[${index}].links_url`}
                                                                    label="Fee URL"
                                                                    type="url"
                                                                    value={fee.links_url}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    touched={
                                                                        touched.document_application_fees?.[index]?.links_url
                                                                    }
                                                                    errors={
                                                                        errors.document_application_fees?.[index]?.links_url
                                                                    }
                                                                    placeholder="https://example.com"
                                                                />
                                                            </Col>
                                                            <Col md={2} className="d-flex align-items-center gap-1">
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => remove(index)}
                                                                    disabled={values.document_application_fees.length === 1}
                                                                    className="mt-3 py-2"
                                                                >
                                                                    <TbTrash className="" />
                                                                </Button>
                                                                {index === values.document_application_fees.length - 1 && (
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => push({ links_label: "", links_url: "" })}
                                                                        className="mt-3 py-2"
                                                                    >
                                                                        <TbPlus className="" />
                                                                    </Button>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </>
                                            )}
                                        </FieldArray>
                                    </Card.Body>
                                </ComponentCard>

                                {/* Document Files */}
                                <ComponentCard className="mb-3 pb-3" title="Document Files">
                                    <Card.Body>
                                        <FieldArray name="document_files">
                                            {({ push, remove }) => (
                                                <>
                                                    {values.document_files.map((file, index) => (
                                                        <Row key={index} className="mb-2">
                                                            <Col md={4}>
                                                                <FormInput
                                                                    name={`document_files[${index}].file_label`}
                                                                    label="File Label"
                                                                    value={file.file_label}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    touched={touched.document_files?.[index]?.file_label}
                                                                    errors={errors.document_files?.[index]?.file_label}
                                                                    placeholder="Enter file label"
                                                                />
                                                            </Col>
                                                            <Col md={4}>
                                                                <Form.Group className="mb-2">
                                                                    <Form.Label>Upload File</Form.Label>
                                                                    <Form.Control
                                                                        type="file"
                                                                        accept=".pdf,.doc,.docx"
                                                                        onChange={(e) => handleFilesChange(e, setFieldValue, index)}
                                                                    />
                                                                    {filesBase64[index]?.name && (
                                                                        <div className="text-success small mt-1">
                                                                            File selected: {filesBase64[index].name}
                                                                        </div>
                                                                    )}
                                                                </Form.Group>
                                                            </Col>
                                                            <Col md={2} className="d-flex align-items-center gap-1 mb-4">
                                                                {(filesBase64[index]?.base64 || file.file_path) && (
                                                                    <div className="mt-4">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline-info"
                                                                            onClick={() => {
                                                                                const fileSrc = filesBase64[index]?.base64 || `http://localhost:5000${file.file_path}`;
                                                                                handleViewFile(fileSrc, file.file_label || `Document File ${index + 1}`);
                                                                            }}
                                                                            title="Preview File"
                                                                            className=" py-2 mb-2"
                                                                        >
                                                                            <TbEye size={13} className="" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => remove(index)}
                                                                    disabled={values.document_files.length === 1}
                                                                    className="mt-3 py-2"
                                                                >
                                                                    <TbTrash className="" />
                                                                </Button>
                                                                {index === values.document_files.length - 1 && (
                                                                    <Button
                                                                        variant="primary"
                                                                        size="sm"
                                                                        onClick={() => push({ file_label: "", file_path: "" })}
                                                                        className="mt-3 py-2"
                                                                    >
                                                                        <TbPlus className="" />
                                                                    </Button>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    ))}
                                                </>
                                            )}
                                        </FieldArray>
                                    </Card.Body>
                                </ComponentCard>

                                <div className="text-end my-2">
                                    <Button size="md" type="submit" disabled={isSubmitting}>
                                        {isSubmitting
                                            ? "Saving..."
                                            : documentId
                                                ? "Update Document"
                                                : "Create Document"}
                                    </Button>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </Card.Body>

            {/* Image/PDF Preview Modal */}
            <ImageModal
                show={showImageModal}
                onHide={() => setShowImageModal(false)}
                imageSrc={selectedImage}
                title={selectedImageTitle}
            />
        </div>
    );
};

export default AddDocument;