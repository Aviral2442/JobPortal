import { useState, useMemo, useEffect } from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Table, Alert, Image } from "react-bootstrap";
import SnowEditor from "@/components/SnowEditor";
import { useNavigate, useParams } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import FileUploader from "@/components/FileUploader";
import { FaRegTrashAlt } from "react-icons/fa";
import axios from "@/api/axios";
import { fileToBase64, filesToBase64, validateFileType, validateFileSize } from "@/utils/fileToBase64";
import ImageModal from "@/components/ImageModel";

const jobValidationSchema = Yup.object({
  _id: Yup.string(),
  metaDetails: Yup.object({
    job_meta_title: Yup.string().required("Meta Title is required").max(60, "Max 60 characters allowed"),
    job_meta_description: Yup.string().max(160, "Max 160 characters allowed"),
    job_meta_keywords: Yup.string().max(10, "Max 10 keywords allowed"),
    job_meta_schemas: Yup.string(),
  }),
  job_title: Yup.string().required("Post Title is required"),
  job_organization: Yup.string().required("Organization is required"),
  job_advertisement_no: Yup.string().required("Advertisement Number is required"),
  job_type: Yup.string().required("Job Type is required"),
  job_sector: Yup.string().required("Sector is required"),
  job_short_desc: Yup.string().required("Short Description is required"),
  job_category: Yup.string().required("Category is required"),
  job_sub_category: Yup.string().required("Sub Category is required"),
  dates: Yup.array().of(
    Yup.object({
      label: Yup.string().required("Date label is required"),
      date: Yup.string().required("Date is required"),
    })
  ),
  fees: Yup.array().of(
    Yup.object({
      category: Yup.string().required("Category is required"),
      fee: Yup.number().required("Fee is required").min(0),
    })
  ),
  vacancies: Yup.array().of(
    Yup.object({
      postName: Yup.string().required("Post name is required"),
      total: Yup.number().min(0).required("Total is required"),
      UR: Yup.number().min(0),
      EWS: Yup.number().min(0),
      OBC: Yup.number().min(0),
      SC: Yup.number().min(0),
      ST: Yup.number().min(0),
      PWD: Yup.number().min(0),
      ExService: Yup.number().min(0),
    })
  ),
  eligibility: Yup.object({
    qualification: Yup.string().required("Qualification is required"),
    ageMin: Yup.number().min(0).required("Minimum age is required"),
    ageMax: Yup.number().min(0).required("Maximum age is required"),
    experience: Yup.string(),
    extraRequirements: Yup.string(),
  }),
  salary: Yup.object({
    min: Yup.number().min(0).required("Minimum salary is required"),
    max: Yup.number().min(0).required("Maximum salary is required"),
    inHand: Yup.number().min(0).required("In-hand salary is required"),
    allowances: Yup.string(),
    salaryBondConditions: Yup.string(),
  }),
  selection: Yup.array().of(Yup.string().required("Selection step is required")),
  links: Yup.array().of(
    Yup.object({
      type: Yup.string().required("Link type is required"),
      label: Yup.string().required("Link label is required"),
      url: Yup.string().url("Must be a valid URL").required("URL is required"),
    })
  ),
  howToApply: Yup.string().required("How to Apply is required"),
  job_logo: Yup.string(),
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
      <Form.Label>
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

export default function AddJob() {
  const navigate = useNavigate();
  const { id } = useParams(); // Get job ID from URL params for edit mode
  const isEditMode = Boolean(id);

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [message, setMessage] = useState({ text: "", variant: "" });
  const [categoryList, setCategoryList] = useState([]);
  const [subcategoryList, setSubcategoryList] = useState([]);
  const [sectorList, setSectorList] = useState([]);
  const [jobTypeList, setJobTypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImageTitle, setSelectedImageTitle] = useState("");

  const requiredSections = [
    "basicDetails", "dates", "fees", "vacancies",
    "eligibility", "salary", "paymentOptions", "selection", "links",
    "howToApply", "metaDetails"
  ];
  const [sectionsTracking, setSectionsTracking] = useState(
    Object.fromEntries(requiredSections.map((s) => [s, false]))
  );


  //fetch sector and job type values initially
  const fetchSectorsAndTypes = async () => {
    try {
      const [sector, jobType] = await Promise.all([
        axios.get('/job-categories/get_job_sector_list'),
        axios.get('/job-categories/get_job_type_list')
      ]);
      
      const sectorData = sector.data?.jsonData?.data || sector.data?.jsonData || sector.data || [];
      const jobTypeData = jobType.data?.jsonData?.jobTypes || jobType.data?.jsonData || jobType.data || [];
      
      setSectorList(Array.isArray(sectorData) ? sectorData : []);
      setJobTypeList(Array.isArray(jobTypeData) ? jobTypeData : []);
      
      console.log('Sectors fetched:', sectorData);
      console.log('Job Types fetched:', jobTypeData);
    } catch (error) {
      console.error('Error fetching sectors and types:', error);
      setSectorList([]);
      setJobTypeList([]);
    }
  }

  // Fetch categories when sector is selected
  const fetchCategoriesBySector = async (sectorId) => {
    if (!sectorId) {
      setCategoryList([]);
      return;
    }
    
    try {
      const response = await axios.get(`/job-categories/get_job_category_list_using_sector/${sectorId}`);
      const categoryData = response.data?.jsonData?.categories || [];
      console.log('Categories fetched for sector:', categoryData);
      setCategoryList(Array.isArray(categoryData) ? categoryData : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategoryList([]);
    }
  };

  // Fetch subcategories when category is selected
  const fetchSubcategoriesByCategory = async (categoryId) => {
    if (!categoryId) {
      setSubcategoryList([]);
      return;
    }
    
    try {
      const response = await axios.get(`/job-categories/get_job_subcategory_list_using_category/${categoryId}`);
      const subcategoryData = response.data?.jsonData?.subcategories || [];
      setSubcategoryList(Array.isArray(subcategoryData) ? subcategoryData : []);
      console.log('Subcategories fetched for category:', subcategoryData);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubcategoryList([]);
    }
  };

  useEffect(() => {
    fetchSectorsAndTypes();
  }, []);

  // Fetch job data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchJobData(id);
    }
  }, [isEditMode, id]);

  const fetchJobData = async (jobId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/jobs/${jobId}`);
      console.log("Job data fetched for edit:", response.data);
      const jobData = response.data;
      if (jobData) {
        // Transform backend data to form format
        const transformedData = transformBackendToForm(jobData);
        // Set initial values will be handled by Formik's enableReinitialize
        return transformedData;
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
      setMessage({ text: "Error loading job data", variant: "danger" });
    } finally {
      setLoading(false);
    }
  };

  const transformBackendToForm = (jobData) => {
    // Transform backend data structure to match form structure
    return {
      _id: jobData._id || "",
      metaDetails: {
        job_meta_title: jobData.job_meta_title || "",
        job_meta_description: jobData.job_meta_description || "",
        job_meta_keywords: jobData.job_meta_keywords || "",
        job_meta_schemas: jobData.job_meta_schemas || "",
      },
      job_title: jobData.job_title || "",
      job_organization: jobData.job_organization || "",
      job_advertisement_no: jobData.job_advertisement_no || "",
      // Handle ObjectId references - can be populated objects or just IDs
      job_type: typeof jobData.job_type === 'object' ? jobData.job_type?._id : jobData.job_type || "",
      job_sector: typeof jobData.job_sector === 'object' ? jobData.job_sector?._id : jobData.job_sector || "",
      job_short_desc: jobData.job_short_desc || "",
      job_category: typeof jobData.job_category === 'object' ? jobData.job_category?._id : jobData.job_category || "",
      job_sub_category: typeof jobData.job_sub_category === 'object' ? jobData.job_sub_category?._id : jobData.job_sub_category || "",
      dates: transformDatesFromBackend(jobData),
      fees: transformFeesFromBackend(jobData),
      vacancies: transformVacanciesFromBackend(jobData),
      eligibility: {
        qualification: jobData.job_eligibility_qualifications || "",
        ageMin: jobData.job_eligibility_age_min || 0,
        ageMax: jobData.job_eligibility_age_max || 0,
        experience: jobData.job_eligibility_experience || "",
        extraRequirements: jobData.job_extra_criteria || "",
      },
      salary: {
        min: jobData.job_salary_min || 0,
        max: jobData.job_salary_max || 0,
        inHand: jobData.job_salary_inhand || 0,
        allowances: jobData.job_salary_allowance || "",
        salaryBondConditions: jobData.job_salary_bond_condition || "",
      },
      paymentOptions: {
        debitCard: jobData.job_pmt_debit_card || false,
        creditCard: jobData.job_pmt_credit_card || false,
        netBanking: jobData.job_pmt_net_banking || false,
        upi: jobData.job_pmt_upi || false,
        wallets: jobData.job_pmt_wallets || false,
        eChallen: jobData.job_pmt_e_challan || false,
      },
      selection: jobData.selection || ["Shortlisting / Written Test", "Document Verification"],
      links: transformLinksFromBackend(jobData),
      howToApply: jobData.howToApply || "",
      job_logo: jobData.job_logo || "",
      files: jobData.files || [],
    };
  };

  const transformDatesFromBackend = (jobData) => {
    const dateMapping = {
      "Application Start Date": "job_start_date",
      "Application End Date": "job_end_date",
      "Notification Release Date": "job_notification_release_date",
      "Fee Payment Last Date": "job_fees_pmt_last_date",
      "Correction Start Date": "job_correction_start_date",
      "Correction End Date": "job_correction_end_date",
      "Application Reopen Start Date": "job_reopen_start_date",
      "Application Reopen End Date": "job_reopen_end_date",
      "Application Last date Extended": "job_last_date_extended",
      "Fee Payment Last Date Extended": "job_fees_pmt_last_date_extended",
      "Exam Date": "job_exam_date",
      "Exam Date Extended": "job_exam_date_extended",
      "Joining Date": "job_joining_date",
      "Re-Exam Date": "job_re_exam_date",
    };

    return Object.entries(dateMapping).map(([label, field]) => ({
      label,
      date: jobData[field] ? new Date(jobData[field] * 1000).toISOString().split('T')[0] : "",
    }));
  };

  const transformFeesFromBackend = (jobData) => {
    return [
      { category: "General", fee: jobData.job_fees_general || "" },
      { category: "OBC", fee: jobData.job_fees_obc || "" },
      { category: "SC", fee: jobData.job_fees_sc || "" },
      { category: "ST", fee: jobData.job_fees_st || "" },
      { category: "EWS", fee: jobData.job_fees_ews || "" },
      { category: "PWD", fee: jobData.job_fees_pwd || "" },
      { category: "Ex-Serviceman", fee: jobData.job_fees_ex_serviceman || "" },
    ];
  };

  const transformVacanciesFromBackend = (jobData) => {
    return [{
      postName: jobData.job_title || "",
      total: jobData.job_vacancy_total || 0,
      UR: jobData.job_vacancy_for_general || 0,
      EWS: jobData.job_vacancy_for_ews || 0,
      OBC: jobData.job_vacancy_for_obc || 0,
      SC: jobData.job_vacancy_for_sc || 0,
      ST: jobData.job_vacancy_for_st || 0,
      PWD: jobData.job_vacancy_for_pwd || 0,
      ExService: jobData.job_vacancy_for_ex_serviceman || 0,
    }];
  };

  const transformLinksFromBackend = (jobData) => {
    if (jobData.job_important_links && Array.isArray(jobData.job_important_links) && jobData.job_important_links.length > 0) {
      return jobData.job_important_links.map(link => ({
        type: link.type || "Other",
        label: link.label || "",
        url: link.url || "",
      }));
    }
    return [{ type: "Apply Online", label: "Apply Online", url: "" }];
  };

  const initialValues = useMemo(() => ({
    _id: "",
    metaDetails: { job_meta_title: "", job_meta_description: "", job_meta_keywords: "", job_meta_schemas: "" },
    job_title: "",
    job_organization: "",
    job_advertisement_no: "",
    job_type: "",
    job_sector: "",
    job_short_desc: "",
    job_category: "",
    job_sub_category: "",
    dates: [
      { label: "Application Start Date", date: "" },
      { label: "Application End Date", date: "" },
      { label: "Notification Release Date", date: "" },
      { label: "Fee Payment Last Date", date: "" },
      { label: "Correction Start Date", date: "" },
      { label: "Correction End Date", date: "" },
      { label: "Application Reopen Start Date", date: "" },
      { label: "Application Reopen End Date", date: "" },
      { label: "Application Last date Extended", date: "" },
      { label: "Fee Payment Last Date Extended", date: "" },
      { label: "Exam Date", date: "" },
      { label: "Exam Date Extended", date: "" },
      { label: "Joining Date", date: "" },
      { label: "Re-Exam Date", date: "" },
    ],
    fees: [
      { category: "General", fee: "" },
      { category: "OBC", fee: "" },
      { category: "SC", fee: "" },
      { category: "ST", fee: "" },
      { category: "EWS", fee: "" },
      { category: "PWD", fee: "" },
      { category: "Ex-Serviceman", fee: "" },
    ],
    vacancies: [{
      postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PWD: 0, ExService: 0, extraRequirements: ""
    }],
    eligibility: {
      qualification: "",
      ageMin: 0,
      ageMax: 0,
      experience: "",
      extraRequirements: "",
    },
    salary: {
      min: 0,
      max: 0,
      inHand: 0,
      allowances: "",
      salaryBondConditions: "",
    },
    paymentOptions: {
      debitCard: false,
      creditCard: false,
      netBanking: false,
      upi: false,
      wallets: false,
      eChallen: false
    },
    selection: ["Shortlisting / Written Test", "Document Verification"],
    links: [{ type: "Apply Online", label: "Apply Online", url: "" }],
    howToApply: "",
    job_logo: "",
    files: [],
  }), []);

  const ensureJobId = async (values, setFieldValue) => {
    if (values._id) return values._id;

    if (!values.job_title || !values.job_organization || !values.job_short_desc) {
      setMessage({ text: "Please fill required fields: Title, Organization, and Short Description", variant: "danger" });
      return null;
    }

    const minimal = {
      job_title: values.job_title.trim(),
      job_short_desc: values.job_short_desc.trim(),
      job_advertisement_no: values.job_advertisement_no.trim(),
      job_organization: values.job_organization.trim(),
      job_type: values.job_type,
      job_sector: values.job_sector,
      job_category: values.job_category || "",
      job_sub_category: values.job_sub_category || "",
      job_status: 0, // Active by default
      job_vacancy_total: 0, // Initialize with 0
    };

    try {
      const res = await axios.post(`/jobs/add`, minimal, {
        headers: { "Content-Type": "application/json" },
      });
      const id = res?.data?.data?._id;
      console.log("Created job with ID:", res.data);
      if (id) {
        setFieldValue("_id", id);
        setMessage({ text: "Job created successfully.", variant: "success" });
      }
      return id;
    } catch (error) {
      console.error("Error creating job:", error);
      setMessage({ text: error.response?.data?.message || "Error creating job", variant: "danger" });
      return null;
    }
  };

  const uploadLogo = async (values, setFieldValue) => {
    const id = await ensureJobId(values, setFieldValue);
    if (!id || !logoFile) {
      setMessage({ text: "Select a logo to upload.", variant: "warning" });
      return;
    }

    // Validate file
    if (!validateFileType(logoFile, ['jpg', 'jpeg', 'png', 'gif'])) {
      setMessage({ text: "Invalid file type. Only images (jpg, jpeg, png, gif) are allowed for logo.", variant: "danger" });
      return;
    }

    if (!validateFileSize(logoFile, 5)) {
      setMessage({ text: "File size exceeds 5MB limit.", variant: "danger" });
      return;
    }

    try {
      const { base64, extension } = await fileToBase64(logoFile);
      
      // Update job with logo
      await axios.put(`/jobs/update_job/${id}`, {
        job_logo: base64,
        extension: extension
      }, {
        headers: { "Content-Type": "application/json" }
      });
      
      setFieldValue("job_logo", base64);
      setLogoFile(null);
      setLogoPreview("");
      setMessage({ text: "Logo uploaded successfully.", variant: "success" });
    } catch (e) {
      console.error("Error uploading logo:", e);
      setMessage({ text: e.response?.data?.message || "Error uploading logo", variant: "danger" });
    }
  };

  const maybeRedirect = (state) => {
    if (requiredSections.every((s) => state[s])) {
      setTimeout(() => navigate("/admin/jobs"), 500);
    }
  };

  const saveSection = async (section, values, setFieldValue) => {
    const id = await ensureJobId(values, setFieldValue);
    if (!id) return;

    let sectionData = null;

    if (section === "basicDetails") {
      // Validate basic details
      if (!values.job_title || !values.job_organization || !values.job_short_desc) {
        setMessage({ text: "Please fill all required fields in Basic Details", variant: "danger" });
        return;
      }

      sectionData = {
        job_title: values.job_title.trim(),
        job_short_desc: values.job_short_desc.trim(),
        job_advertisement_no: values.job_advertisement_no.trim(),
        job_organization: values.job_organization.trim(),
        job_type: values.job_type,
        job_sector: values.job_sector,
        job_category: values.job_category,
        job_sub_category: values.job_sub_category,
      };
    } else if (section === "dates") {
      // Filter out empty dates and validate
      const validDates = (values.dates || []).filter(d => d.label && d.date);

      if (validDates.length === 0) {
        setMessage({ text: "Please add at least one date", variant: "warning" });
        return;
      }

      // Map dates to model fields
      const dateMapping = {
        "Application Start Date": "job_start_date",
        "Application End Date": "job_end_date",
        "Notification Release Date": "job_notification_release_date",
        "Fee Payment Last Date": "job_fees_pmt_last_date",
        "Correction Start Date": "job_correction_start_date",
        "Correction End Date": "job_correction_end_date",
        "Application Reopen Start Date": "job_reopen_start_date",
        "Application Reopen End Date": "job_reopen_end_date",
        "Application Last date Extended": "job_last_date_extended",
        "Fee Payment Last Date Extended": "job_fees_pmt_last_date_extended",
        "Exam Date": "job_exam_date",
        "Exam Date Extended": "job_exam_date_extended",
        "Joining Date": "job_joining_date",
        "Re-Exam Date": "job_re_exam_date",
      };

      sectionData = {};
      validDates.forEach((d) => {
        const fieldName = dateMapping[d.label];
        if (fieldName && d.date) {
          sectionData[fieldName] = Math.floor(new Date(d.date).getTime() / 1000);
        }
      });

    } else if (section === "fees") {
      // Filter out empty fees
      const validFees = (values.fees || []).filter(f => f.category && f.fee !== "" && f.fee !== null);

      if (validFees.length === 0) {
        setMessage({ text: "Please add at least one fee entry", variant: "warning" });
        return;
      }

      sectionData = {};
      validFees.forEach((f) => {
        const key = (f.category || "").toLowerCase().trim();
        const feeValue = Number(f.fee) || 0;

        if (key.includes("general") || key.includes("ur")) {
          sectionData.job_fees_general = feeValue;
        } else if (key.includes("obc")) {
          sectionData.job_fees_obc = feeValue;
        } else if (key.includes("sc")) {
          sectionData.job_fees_sc = feeValue;
        } else if (key.includes("st")) {
          sectionData.job_fees_st = feeValue;
        } else if (key.includes("ews")) {
          sectionData.job_fees_ews = feeValue;
        } else if (key.includes("pwd")) {
          sectionData.job_fees_pwd = feeValue;
        } else if (key.includes("ex-serviceman") || key.includes("exservice")) {
          sectionData.job_fees_ex_serviceman = feeValue;
        }
      });

    } else if (section === "vacancies") {
      // Validate vacancies
      const vacancy = values.vacancies?.[0];
      if (!vacancy || !vacancy.postName || vacancy.total === 0) {
        setMessage({ text: "Please fill vacancy details", variant: "warning" });
        return;
      }

      sectionData = {
        job_vacancy_total: Number(vacancy.total) || 0,
        job_vacancy_for_general: Number(vacancy.UR) || 0,
        job_vacancy_for_obc: Number(vacancy.OBC) || 0,
        job_vacancy_for_sc: Number(vacancy.SC) || 0,
        job_vacancy_for_st: Number(vacancy.ST) || 0,
        job_vacancy_for_pwd: Number(vacancy.PWD) || 0,
        job_vacancy_for_ews: Number(vacancy.EWS) || 0,
        job_vacancy_for_ex_serviceman: Number(vacancy.ExService) || 0,
      };

    } else if (section === "eligibility") {
      // Validate eligibility
      if (!values.eligibility?.qualification || !values.eligibility?.ageMin || !values.eligibility?.ageMax) {
        setMessage({ text: "Please fill all required eligibility fields", variant: "warning" });
        return;
      }

      sectionData = {
        job_eligibility_age_min: Number(values.eligibility.ageMin) || 0,
        job_eligibility_age_max: Number(values.eligibility.ageMax) || 0,
        job_eligibility_qualifications: values.eligibility.qualification.trim(),
        job_eligibility_experience: values.eligibility.experience?.trim() || "",
        job_extra_criteria: values.eligibility.extraRequirements?.trim() || "",
      };

    } else if (section === "salary") {
      // Validate salary
      if (!values.salary?.min || !values.salary?.max || !values.salary?.inHand) {
        setMessage({ text: "Please fill all required salary fields", variant: "warning" });
        return;
      }

      sectionData = {
        job_salary_min: Number(values.salary.min) || 0,
        job_salary_max: Number(values.salary.max) || 0,
        job_salary_inhand: Number(values.salary.inHand) || 0,
        job_salary_allowance: Number(values.salary.allowances) || 0,
        job_salary_bond_condition: values.salary.salaryBondConditions?.trim() || "",
      };

    } else if (section === "paymentOptions") {
      // NEW: Payment Options section
      sectionData = {
        job_pmt_debit_card: values.paymentOptions.debitCard || false,
        job_pmt_credit_card: values.paymentOptions.creditCard || false,
        job_pmt_net_banking: values.paymentOptions.netBanking || false,
        job_pmt_upi: values.paymentOptions.upi || false,
        job_pmt_wallets: values.paymentOptions.wallets || false,
        job_pmt_e_challan: values.paymentOptions.eChallen || false,
      };
    } else if (section === "selection") {
      // Filter out empty selection steps
      const validSelection = (values.selection || []).filter(s => s && s.trim());

      if (validSelection.length === 0) {
        setMessage({ text: "Please add at least one selection step", variant: "warning" });
        return;
      }

      sectionData = { selection: validSelection };

    } else if (section === "links") {
      // Filter out incomplete links
      const validLinks = (values.links || []).filter(l => l.type && l.label && l.url);

      if (validLinks.length === 0) {
        setMessage({ text: "Please add at least one complete link", variant: "warning" });
        return;
      }

      // Send as array of objects with type, label, and url
      const linksArray = validLinks.map((l) => ({
        type: l.type.trim(),
        label: l.label.trim(),
        url: l.url.trim(),
      }));

      sectionData = { job_important_links: linksArray };

    } else if (section === "howToApply") {
      if (!values.howToApply || values.howToApply.trim() === "") {
        setMessage({ text: "Please fill 'How to Apply' section", variant: "warning" });
        return;
      }

      sectionData = { howToApply: values.howToApply.trim() };

    } else if (section === "metaDetails") {
      if (!values.metaDetails?.job_meta_title) {
        setMessage({ text: "Meta Title is required", variant: "warning" });
        return;
      }

      sectionData = {
        job_meta_title: values.metaDetails.job_meta_title?.trim() || "",
        job_meta_description: values.metaDetails.job_meta_description?.trim() || "",
        job_meta_keywords: values.metaDetails.job_meta_keywords?.trim() || "",
        job_meta_schemas: values.metaDetails.job_meta_schemas?.trim() || "",
      };
    } else if (section === "files") {
      // Handle file uploads with base64 conversion
      if (!uploadedFiles || uploadedFiles.length === 0) {
        setMessage({ text: "Please select files to upload", variant: "warning" });
        return;
      }

      // Validate all files
      for (const file of uploadedFiles) {
        if (!validateFileType(file)) {
          setMessage({ text: `Invalid file type: ${file.name}. Only images and documents are allowed.`, variant: "danger" });
          return;
        }
        if (!validateFileSize(file)) {
          setMessage({ text: `File size exceeds 5MB limit: ${file.name}`, variant: "danger" });
          return;
        }
      }

      try {
        // Convert files to base64
        const { base64Files, extensions } = await filesToBase64(uploadedFiles);
        
        // Append new files to existing files array
        const existingFiles = values.files || [];
        
        // Update job with files (append mode)
        const res = await axios.put(`/jobs/update_job/${id}`, {
          files: base64Files,
          extensions: extensions
        }, {
          headers: { "Content-Type": "application/json" }
        });
        
        // Get updated files from response
        const updatedFiles = res.data?.data?.files || [...existingFiles, ...base64Files];
        setFieldValue('files', updatedFiles);
        
        console.log("Files uploaded:", res.data);
        setMessage({ text: "Files uploaded successfully!", variant: "success" });
        setUploadedFiles([]); // Clear uploaded files

        if (requiredSections.includes(section)) {
          setSectionsTracking((prev) => {
            const updated = { ...prev, [section]: true };
            maybeRedirect(updated);
            return updated;
          });
        }
        return; // Exit early for files
      } catch (error) {
        console.error("Error uploading files:", error);
        setMessage({
          text: error.response?.data?.message || "Error uploading files",
          variant: "danger",
        });
        return;
      }
    }

    if (!sectionData || Object.keys(sectionData).length === 0) {
      console.warn("No valid data to save for section:", section);
      setMessage({ text: "No data to save. Please fill required fields.", variant: "warning" });
      return;
    }

    try {
      const res = await axios.post(`/jobs/save-section`, {
        jobId: id,
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

  const deleteSectionItem = async (section, index, values, arrayHelpers) => {
    // Allow deletion even without job ID (for new items not yet saved)
    if (values._id) {
      try {
        const res = await axios.delete(`/jobs/${values._id}/section/${section}/${index}`);
        console.log(`Deleted item from section ${section} at index ${index}:`, res.data);
        setMessage({ text: `${section} item deleted successfully!`, variant: "success" });
      } catch (error) {
        console.error(`Error deleting ${section} item:`, error);
        setMessage({ text: `Error deleting ${section} item`, variant: "danger" });
        return; // Don't remove from UI if API call failed
      }
    }
    // Remove from form state
    arrayHelpers.remove(index);
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
          validationSchema={jobValidationSchema}
          onSubmit={(values) => console.log("Form submitted:", values)}
          enableReinitialize={true} // Allow form to update when fetching edit data
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => {
            // Load job data in edit mode
            useEffect(() => {
              if (isEditMode && id && !values._id) {
                fetchJobData(id).then((data) => {
                  if (data) {
                    Object.entries(data).forEach(([key, value]) => {
                      setFieldValue(key, value);
                    });
                    if (data.job_logo) {
                      setLogoPreview(data.job_logo);
                    }
                    // Fetch categories and subcategories for edit mode
                    if (data.job_sector) {
                      fetchCategoriesBySector(data.job_sector);
                    }
                    if (data.job_category) {
                      fetchSubcategoriesByCategory(data.job_category);
                    }
                  }
                });
              }
            }, [isEditMode, id]);

            // Fetch categories when sector changes
            useEffect(() => {
              if (values.job_sector) {
                fetchCategoriesBySector(values.job_sector);
                // Clear category and subcategory when sector changes
                if (!isEditMode || values._id) {
                  setFieldValue('job_category', '');
                  setFieldValue('job_sub_category', '');
                  setSubcategoryList([]);
                }
              } else {
                setCategoryList([]);
                setSubcategoryList([]);
              }
            }, [values.job_sector]);

            // Fetch subcategories when category changes
            useEffect(() => {
              if (values.job_category) {
                fetchSubcategoriesByCategory(values.job_category);
                // Clear subcategory when category changes
                if (!isEditMode || values._id) {
                  setFieldValue('job_sub_category', '');
                }
              } else {
                setSubcategoryList([]);
              }
            }, [values.job_category]);

            return (
              <Form onSubmit={(e) => e.preventDefault()}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4>{isEditMode ? "Edit Job" : "Add New Job"}</h4>
                  {isEditMode && (
                    <Button variant="outline-secondary" onClick={() => navigate("/admin/jobs")}>
                      Cancel
                    </Button>
                  )}
                </div>

                {/* Basic Details */}
                <ComponentCard className="mb-3" title="Basic Job Details" isCollapsible defaultOpen={false}>
                  <Card.Body className="">
                    <Row>
                      <Col md={4}>
                        <FormInput
                          name="job_title"
                          label="Job Title"
                          value={values.job_title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.job_title}
                          errors={errors.job_title}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          name="job_short_desc"
                          label="Short Description"
                          as="textarea"
                          value={values.job_short_desc}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{ height: "37px" }}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          name="job_advertisement_no"
                          label="Advertisement Number"
                          value={values.job_advertisement_no}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          errors={errors.job_advertisement_no}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          name="job_organization"
                          label="Organization"
                          value={values.job_organization}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.job_organization}
                          errors={errors.job_organization}
                          required
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>
                            Job Type
                            <span className="text-danger ms-1">*</span>
                          </Form.Label>
                          <Form.Select 
                            name="job_type" 
                            value={values.job_type} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.job_type && errors.job_type}
                          >
                            <option value="">Select Job Type</option>
                            {jobTypeList.map((type) => (
                              <option key={type._id} value={type._id}>
                                {type.job_type_name}
                              </option>
                            ))}
                          </Form.Select>
                          {touched.job_type && errors.job_type && (
                            <div className="text-danger small mt-1">{errors.job_type}</div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>
                            Sector
                            <span className="text-danger ms-1">*</span>
                          </Form.Label>
                          <Form.Select 
                            name="job_sector" 
                            value={values.job_sector} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.job_sector && errors.job_sector}
                          >
                            <option value="">Select Sector</option>
                            {sectorList.map((sector) => (
                              <option key={sector._id} value={sector._id}>
                                {sector.job_sector_name}
                              </option>
                            ))}
                          </Form.Select>
                          {touched.job_sector && errors.job_sector && (
                            <div className="text-danger small mt-1">{errors.job_sector}</div>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>
                            Category
                            <span className="text-danger ms-1">*</span>
                          </Form.Label>
                          <Form.Select 
                            name="job_category" 
                            value={values.job_category} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.job_category && errors.job_category}
                            disabled={!values.job_sector}
                          >
                            <option value="">{!values.job_sector ? "Select Sector First" : "Select Category"}</option>
                            {categoryList.map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.category_name}
                              </option>
                            ))}
                          </Form.Select>
                          {touched.job_category && errors.job_category && (
                            <div className="text-danger small mt-1">{errors.job_category}</div>
                          )}
                          {!values.job_sector && (
                            <Form.Text className="text-muted">Please select a sector first</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>
                            Sub-Category
                            <span className="text-danger ms-1">*</span>
                          </Form.Label>
                          <Form.Select 
                            name="job_sub_category" 
                            value={values.job_sub_category} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isInvalid={touched.job_sub_category && errors.job_sub_category}
                            disabled={!values.job_category}
                          >
                            <option value="">{!values.job_category ? "Select Category First" : "Select SubCategory"}</option>
                            {subcategoryList.map((subCat) => (
                              <option key={subCat._id} value={subCat._id}>
                                {subCat.subcategory_name}
                              </option>
                            ))}
                          </Form.Select>
                          {touched.job_sub_category && errors.job_sub_category && (
                            <div className="text-danger small mt-1">{errors.job_sub_category}</div>
                          )}
                          {!values.job_category && (
                            <Form.Text className="text-muted">Please select a category first</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-2">
                          <Form.Label>Logo</Form.Label>
                          <div className="d-flex align-items-center gap-3">
                            <Form.Control
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                setLogoFile(file || null);
                                setLogoPreview(file ? URL.createObjectURL(file) : "");
                              }}
                            />
                            {logoPreview && <Image src={logoPreview} alt="Logo" height={40} />}
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => uploadLogo(values, setFieldValue)}
                              disabled={!logoFile}
                            >
                              Upload
                            </Button>
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className="text-end mt-2">
                      <Button size="sm" onClick={() => saveSection("basicDetails", values, setFieldValue)}>
                        Save Basic Details
                      </Button>
                    </div>
                  </Card.Body>
                </ComponentCard>

                {/* Important Dates */}
                <ComponentCard className="mb-3" title="Important Dates" isCollapsible>
                  <Card.Body>
                    <FieldArray name="dates">
                      {(arrayHelpers) => (
                        <>
                          <Table bordered size="sm">
                            <thead>
                              <tr>
                                <th>Label</th>
                                <th>Date</th>
                                <th className="text-center" style={{ width: '100px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.dates.map((field, idx) => (
                                <tr key={idx}>
                                  <td>
                                    <span>{field.label}</span>
                                  </td>
                                  <td>
                                    <Form.Control
                                      className="border-0 shadow-none"
                                      type="date"
                                      name={`dates.${idx}.date`}
                                      value={field.date}
                                      onChange={handleChange}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <Button
                                      size="sm"
                                      variant="light"
                                      onClick={() => deleteSectionItem("dates", idx, values, arrayHelpers)}
                                    >
                                      <FaRegTrashAlt />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <div className="d-flex justify-content-end gap-2 align-items-center mt-2">
                            <Button size="sm" variant="outline-primary" onClick={() => arrayHelpers.push({ label: "", date: "" })}>
                              + Add Date
                            </Button>
                            <Button size="sm" onClick={() => saveSection("dates", values, setFieldValue)}>
                              Save Dates
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Card.Body>
                </ComponentCard>

                {/* Application Fee */}
                <ComponentCard className="mb-3" title="Application Fee" isCollapsible>
                  <Card.Body>
                    <FieldArray name="fees">
                      {(arrayHelpers) => (
                        <>
                          <Table bordered size="sm">
                            <thead>
                              <tr>
                                <th>Category</th>
                                <th>Fee</th>
                                <th className="text-center" style={{ width: '100px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.fees.map((f, idx) => (
                                <tr key={idx}>
                                  <td>
                                    <span>{f.category}</span>
                                  </td>
                                  <td>
                                    <Form.Control
                                      className="border-0 shadow-none"
                                      type="number"
                                      name={`fees.${idx}.fee`}
                                      value={f.fee}
                                      onChange={handleChange}
                                    />
                                  </td>
                                  <td className="text-center">
                                    <Button
                                      size="sm"
                                      variant="light"
                                      onClick={() => deleteSectionItem("fees", idx, values, arrayHelpers)}
                                    >
                                      <FaRegTrashAlt />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <div className="d-flex justify-content-end gap-2 align-items-center mt-2">
                            <Button size="sm" variant="outline-primary" onClick={() => arrayHelpers.push({ category: "", fee: "" })}>
                              + Add Fee
                            </Button>
                            <Button size="sm" onClick={() => saveSection("fees", values, setFieldValue)}>
                              Save Fees
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Card.Body>
                </ComponentCard>

                {/* Vacancies */}
                <ComponentCard className="mb-3" title="Vacancies" isCollapsible>
                  <Card.Body>
                    <FieldArray name="vacancies">
                      {(arrayHelpers) => (
                        <>
                          <Table bordered size="sm" responsive>
                            <thead>
                              <tr>
                                <th>Post</th>
                                <th>Total</th>
                                <th>UR</th>
                                <th>EWS</th>
                                <th>OBC</th>
                                <th>SC</th>
                                <th>ST</th>
                                <th>PWD</th>
                                <th>Ex-Service</th>
                                <th style={{ width: '100px' }}>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {values.vacancies.map((v, idx) => (
                                <tr key={idx}>
                                  {["postName", "total", "UR", "EWS", "OBC", "SC", "ST", "PWD", "ExService"].map((fld) => (
                                    <td key={fld}>
                                      <Form.Control
                                        className="border-0 shadow-none"
                                        type={fld === "postName" ? "text" : "number"}
                                        name={`vacancies.${idx}.${fld}`}
                                        value={v[fld]}
                                        onChange={handleChange}
                                      />
                                    </td>
                                  ))}
                                  <td className="text-center">
                                    <Button
                                      size="sm"
                                      variant="light"
                                      onClick={() => deleteSectionItem("vacancies", idx, values, arrayHelpers)}
                                    >
                                      <FaRegTrashAlt />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <div className="d-flex justify-content-end gap-2 align-items-center mt-2">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => arrayHelpers.push({
                                postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PWD: 0, ExService: 0
                              })}
                            >
                              + Add Vacancy
                            </Button>
                            <Button size="sm" onClick={() => saveSection("vacancies", values, setFieldValue)}>
                              Save Vacancies
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Card.Body>
                </ComponentCard>

                {/* Eligibility - Add experience field */}
                <ComponentCard className="mb-3" title="Eligibility" isCollapsible>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <FormInput
                          name="eligibility.qualification"
                          label="Qualification *"
                          value={values.eligibility.qualification}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.eligibility?.qualification}
                          errors={errors.eligibility?.qualification}
                        />
                      </Col>
                      <Col md={2}>
                        <FormInput
                          name="eligibility.ageMin"
                          label="Min Age *"
                          type="number"
                          value={values.eligibility.ageMin}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.eligibility?.ageMin}
                          errors={errors.eligibility?.ageMin}
                        />
                      </Col>
                      <Col md={2}>
                        <FormInput
                          name="eligibility.ageMax"
                          label="Max Age *"
                          type="number"
                          value={values.eligibility.ageMax}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.eligibility?.ageMax}
                          errors={errors.eligibility?.ageMax}
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          name="eligibility.experience"
                          label="Experience Required"
                          value={values.eligibility.experience}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Col>
                      <Col md={12}>
                        <FormInput
                          name="eligibility.extraRequirements"
                          label="Extra Requirements"
                          as="textarea"
                          value={values.eligibility.extraRequirements}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          rows={2}
                        />
                      </Col>
                    </Row>
                    <div className="text-end mt-2">
                      <Button size="sm" onClick={() => saveSection("eligibility", values, setFieldValue)}>
                        Save Eligibility
                      </Button>
                    </div>
                  </Card.Body>
                </ComponentCard>

                {/* Salary - Add bond condition field */}
                <ComponentCard className="mb-3" title="Salary & Benefits" isCollapsible>
                  <Card.Body>
                    <Row className="">
                      <Col md={3}>
                        <FormInput
                          name="salary.min"
                          label="Min Salary *"
                          type="number"
                          value={values.salary.min}
                          onChange={handleChange}
                          touched={touched.salary?.min}
                          errors={errors.salary?.min}
                        />
                      </Col>
                      <Col md={3}>
                        <FormInput
                          name="salary.max"
                          label="Max Salary *"
                          type="number"
                          value={values.salary.max}
                          onChange={handleChange}
                          touched={touched.salary?.max}
                          errors={errors.salary?.max}
                        />
                      </Col>
                      <Col md={3}>
                        <FormInput
                          name="salary.inHand"
                          label="In Hand *"
                          type="number"
                          value={values.salary.inHand}
                          onChange={handleChange}
                          touched={touched.salary?.inHand}
                          errors={errors.salary?.inHand}
                        />
                      </Col>
                      <Col md={3}>
                        <FormInput
                          name="salary.allowances"
                          label="Allowances"
                          type="number"
                          value={values.salary.allowances}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col md={12}>
                        <Form.Label>Bond Condition</Form.Label>
                        <SnowEditor value={values.salaryBondConditions} onChange={(v) => setFieldValue("salaryBondConditions", v)} />
                      </Col>
                    </Row>
                    <div className="text-end mt-2">
                      <Button size="sm" onClick={() => saveSection("salary", values, setFieldValue)}>
                        Save Salary
                      </Button>
                    </div>
                  </Card.Body>
                </ComponentCard>

                {/* Payment Options - NEW SECTION */}
                <ComponentCard className="mb-3" title="Payment Options" isCollapsible>
                  <Card.Body>
                    <Row>
                      <Col >
                        <Form.Check
                          type="checkbox"
                          id="paymentOptions.debitCard"
                          name="paymentOptions.debitCard"
                          label="Debit Card"
                          checked={values.paymentOptions.debitCard}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col >
                        <Form.Check
                          type="checkbox"
                          id="paymentOptions.creditCard"
                          name="paymentOptions.creditCard"
                          label="Credit Card"
                          checked={values.paymentOptions.creditCard}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          id="paymentOptions.netBanking"
                          name="paymentOptions.netBanking"
                          label="Net Banking"
                          checked={values.paymentOptions.netBanking}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col >
                        <Form.Check
                          type="checkbox"
                          id="paymentOptions.upi"
                          name="paymentOptions.upi"
                          label="UPI"
                          checked={values.paymentOptions.upi}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col >
                        <Form.Check
                          type="checkbox"
                          id="paymentOptions.wallets"
                          name="paymentOptions.wallets"
                          label="Wallets (Paytm, PhonePe, etc.)"
                          checked={values.paymentOptions.wallets}
                          onChange={handleChange}
                        />
                      </Col>
                      <Col>
                        <Form.Check
                          type="checkbox"
                          id="paymentOptions.eChallen"
                          name="paymentOptions.eChallen"
                          label="E-Challan"
                          checked={values.paymentOptions.eChallen}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                    <div className="text-end mt-2">
                      <Button size="sm" onClick={() => saveSection("paymentOptions", values, setFieldValue)}>
                        Save Payment Options
                      </Button>
                    </div>
                  </Card.Body>
                </ComponentCard>

                {/* Selection Process */}
                <ComponentCard className="mb-3" title="Selection Process" isCollapsible>
                  <Card.Body>
                    <FieldArray name="selection">
                      {(arrayHelpers) => (
                        <>
                          {values.selection.map((s, idx) => (
                            <Row key={idx} className="mb-2">
                              <Col md={10}>
                                <Form.Control name={`selection.${idx}`} value={s} onChange={handleChange} />
                              </Col>
                              <Col md={2} className="d-flex justify-content-center">
                                <Button
                                  size="sm"
                                  variant="light"
                                  onClick={() => deleteSectionItem("selection", idx, values, arrayHelpers)}
                                >
                                  <FaRegTrashAlt />
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <div className="d-flex justify-content-end gap-2 align-items-center mt-2">
                            <Button size="sm" variant="outline-primary" onClick={() => arrayHelpers.push("")}>
                              + Add Step
                            </Button>
                            <Button size="sm" onClick={() => saveSection("selection", values, setFieldValue)}>
                              Save Selection
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Card.Body>
                </ComponentCard>

                {/* Important Links */}
                <ComponentCard className="mb-3" title="Important Links" isCollapsible>
                  <Card.Body>
                    <FieldArray name="links">
                      {(arrayHelpers) => (
                        <>
                          {values.links.map((l, idx) => (
                            <Row key={idx} className="mb-2">
                              <Col md={3}>
                                <Form.Control
                                  name={``}
                                  value={l.type}
                                  onChange={handleChange}
                                  placeholder="Type"
                                />
                              </Col>
                              <Col md={3}>
                                <Form.Control
                                  name={`links.${idx}.label`}
                                  value={l.label}
                                  onChange={handleChange}
                                  placeholder="Label"
                                />
                              </Col>
                              <Col md={4}>
                                <Form.Control
                                  name={`links.${idx}.url`}
                                  value={l.url}
                                  onChange={handleChange}
                                  placeholder="URL"
                                  type="url"
                                />
                              </Col>
                              <Col md={2} className="d-flex justify-content-center">
                                <Button
                                  size="sm"
                                  variant="light"
                                  onClick={() => deleteSectionItem("links", idx, values, arrayHelpers)}
                                >
                                  <FaRegTrashAlt />
                                </Button>
                              </Col>
                            </Row>
                          ))}
                          <div className="d-flex justify-content-end gap-2 align-items-center mt-2">
                            <Button size="sm" variant="outline-primary" onClick={() => arrayHelpers.push({ type: "", label: "", url: "" })}>
                              + Add Link
                            </Button>
                            <Button size="sm" onClick={() => saveSection("links", values, setFieldValue)}>
                              Save Links
                            </Button>
                          </div>
                        </>
                      )}
                    </FieldArray>
                  </Card.Body>
                </ComponentCard>

                {/* How To Apply */}
                <ComponentCard className="mb-3" title="How To Apply" isCollapsible>
                  <Card.Body>
                    <SnowEditor value={values.howToApply} onChange={(v) => setFieldValue("howToApply", v)} />
                    <div className="text-end mt-2">
                      <Button size="sm" onClick={() => saveSection("howToApply", values, setFieldValue)}>
                        Save How To Apply
                      </Button>
                    </div>
                  </Card.Body>
                </ComponentCard>

                {/* Files */}
                <ComponentCard className="mb-3" title="Files" isCollapsible>
                  <Card.Body>
                    {/* Display existing files */}
                    {values.files && values.files.length > 0 && (
                      <div className="mb-3">
                        <h6>Existing Files</h6>
                        <Table bordered size="sm">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>File Path</th>
                              <th>Preview</th>
                              <th className="text-center" style={{ width: '100px' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {values.files.map((file, idx) => {
                              const fileName = file.split('/').pop();
                              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(file);
                              const isPdf = /\.pdf$/i.test(file);
                              const fileUrl = `http://localhost:5000${file}`;
                              
                              return (
                                <tr key={idx}>
                                  <td>{idx + 1}</td>
                                  <td>
                                    <small className="text-break">{fileName}</small>
                                  </td>
                                  <td>
                                    {isImage ? (
                                      <Image 
                                        src={fileUrl} 
                                        alt={fileName}
                                        thumbnail
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', cursor: 'pointer' }}
                                        onClick={() => {
                                          setSelectedImage(fileUrl);
                                          setSelectedImageTitle(fileName);
                                          setShowImageModal(true);
                                        }}
                                      />
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        variant="outline-primary"
                                        onClick={() => {
                                          if (isPdf) {
                                            setSelectedImage(fileUrl);
                                            setSelectedImageTitle(fileName);
                                            setShowImageModal(true);
                                          } else {
                                            window.open(fileUrl, '_blank');
                                          }
                                        }}
                                      >
                                        View
                                      </Button>
                                    )}
                                  </td>
                                  <td className="text-center">
                                    <Button
                                      size="sm"
                                      variant="outline-danger"
                                      onClick={async () => {
                                        try {
                                          const updatedFiles = values.files.filter((_, i) => i !== idx);
                                          await axios.put(`/jobs/update_job/${values._id}`, {
                                            files: updatedFiles
                                          });
                                          setFieldValue('files', updatedFiles);
                                          setMessage({ text: "File deleted successfully!", variant: "success" });
                                        } catch (error) {
                                          setMessage({ text: "Error deleting file", variant: "danger" });
                                        }
                                      }}
                                      disabled={!values._id}
                                    >
                                      <FaRegTrashAlt />
                                    </Button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    )}

                    {/* Upload new files */}
                    <div>
                      <h6>Upload New Files</h6>
                      <FileUploader files={uploadedFiles} setFiles={setUploadedFiles} multiple maxFileCount={12} />
                      <div className="text-end mt-2">
                        <Button size="sm" onClick={() => saveSection("files", values, setFieldValue)} disabled={uploadedFiles.length === 0}>
                          Upload Files
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </ComponentCard>

                {/* SEO & Meta */}
                <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <FormInput
                          name="metaDetails.job_meta_title"
                          label="Meta Title"
                          sublabel="Max 60 characters"
                          value={values.metaDetails.job_meta_title}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.metaDetails?.job_meta_title}
                          errors={errors.metaDetails?.job_meta_title}
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          name="metaDetails.job_meta_description"
                          label="Meta Description"
                          sublabel="Max 160 characters"
                          value={values.metaDetails.job_meta_description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          name="metaDetails.job_meta_keywords"
                          label="Meta Keywords"
                          sublabel="Comma separated, max 10 keywords"
                          value={values.metaDetails.job_meta_keywords}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          name="metaDetails.job_meta_schemas"
                          label="Meta Schemas"
                          value={values.metaDetails.job_meta_schemas}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Col>
                    </Row>
                    <div className="text-end mt-2">
                      <Button size="sm" onClick={() => saveSection("metaDetails", values, setFieldValue)}>
                        Save Meta Details
                      </Button>
                    </div>
                  </Card.Body>
                </ComponentCard>
              </Form>
            );
          }}
        </Formik>

        {/* Image Modal */}
        <ImageModal
          show={showImageModal}
          onHide={() => setShowImageModal(false)}
          imageSrc={selectedImage}
          title={selectedImageTitle}
        />
      </Card.Body>
    </div>
  );
}