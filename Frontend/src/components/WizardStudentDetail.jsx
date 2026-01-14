import React, { useState, useEffect } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  ProgressBar,
  Row,
  Spinner,
  Alert,
  Table,
} from "react-bootstrap";
import { Wizard, useWizard } from "react-use-wizard";
import PageTitle from "@/components/PageTitle";
import ComponentCard from "@/components/ComponentCard";
import Flatpickr from "react-flatpickr";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import axios from "@/api/axios";
import toast from "react-hot-toast";

import {
  TbUserCircle,
  TbMapPin,
  TbBuildingBank,
  TbHeart,
  TbPhone,
  TbUsers,
  TbSettings,
  TbSchool,
  TbBriefcase,
  TbCertificate,
  TbFileText,
  TbLink,
  TbBodyScan,
  TbMan,
} from "react-icons/tb";

/* ---------------------------------------------------
   Header with Progress
----------------------------------------------------*/
const Header = ({ withProgress }) => {
  const { goToStep, activeStep, stepCount } = useWizard();

  const steps = [
    { icon: TbUserCircle, label: "Primary Info", desc: "Basic details" },
    { icon: TbUserCircle, label: "Basic Details", desc: "Personal info" },
    { icon: TbMapPin, label: "Address", desc: "Where you live" },
    { icon: TbBuildingBank, label: "Bank Details", desc: "Financial" },
    { icon: TbMan, label: "Body Details", desc: "Physical" },
    { icon: TbPhone, label: "Emergency", desc: "Contact details" },
    { icon: TbUsers, label: "Parental Info", desc: "Guardian details" },
    { icon: TbSettings, label: "Preferences", desc: "Career goals" },
    { icon: TbSchool, label: "Education", desc: "Academic details" },
    { icon: TbSettings, label: "Skills", desc: "Your abilities" },
    { icon: TbLink, label: "Social Links", desc: "Online presence" },
    { icon: TbBriefcase, label: "Experience", desc: "Work history" },
    { icon: TbCertificate, label: "Certificates", desc: "Certifications" },
    { icon: TbFileText, label: "Documents", desc: "Upload files" },
  ];

  return (
    <>
      {withProgress && (
        <ProgressBar
          now={(activeStep + 1) * (100 / stepCount)}
          className="mb-3"
          style={{ height: "6px" }}
        />
      )}

      <ul className="nav nav-tabs wizard-tabs mb-3">
        {steps.map((step, index) => (
          <li className="nav-item" key={index}>
            <button
              className={clsx(
                "nav-link d-flex w-100 text-start border-0",
                activeStep === index && "active",
                activeStep > index && "wizard-item-done"
              )}
              onClick={() => goToStep(index)}
            >
              <span className="d-flex align-items-center">
                <step.icon className="fs-32" />
                <span className="flex-grow-1 ms-2 text-truncate">
                  <span className="mb-0 lh-base d-block fw-semibold text-body fs-base">
                    {step.label}
                  </span>
                  <span className="fs-xxs mb-0">{step.desc}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

/* ---------------------------------------------------
   Field Renderer
----------------------------------------------------*/
const RenderField = ({ field, value, onChange }) => {
  if (field.type === "divider") {
    return (
      <Col xl={12}>
        <h6 className="text-primary border-bottom pb-2 mb-3 mt-3">
          {field.label}
        </h6>
      </Col>
    );
  }

  const handleChange = (e) => {
    if (field.type === "checkbox") {
      onChange(field.name, e.target.checked);
    } else if (field.type === "file") {
      onChange(field.name, e.target.files[0]);
    } else {
      onChange(field.name, e.target.value);
    }
  };

  const handleDateChange = (dates) => {
    onChange(field.name, dates[0]);
  };

  return (
    <Col xl={field.cols || 4}>
      <FormGroup className="mb-3">
        <FormLabel>{field.label}</FormLabel>

        {field.type === "select" ? (
          <FormSelect value={value || ""} onChange={handleChange}>
            <option value="">Select</option>
            {field.options?.map((opt, idx) => (
              <option key={idx} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </FormSelect>
        ) : field.type === "date" ? (
          <Flatpickr
            className="form-control"
            value={value}
            options={{ dateFormat: "d M, Y" }}
            onChange={handleDateChange}
          />
        ) : field.type === "textarea" ? (
          <Form.Control
            as="textarea"
            rows={field.rows || 3}
            value={value || ""}
            onChange={handleChange}
          />
        ) : field.type === "checkbox" ? (
          <Form.Check
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
          />
        ) : field.type === "file" ? (
          <FormControl
            type="file"
            accept={field.accept}
            onChange={handleChange}
          />
        ) : (
          <FormControl
            type={field.type || "text"}
            value={value || ""}
            onChange={handleChange}
          />
        )}
      </FormGroup>
    </Col>
  );
};

/* ---------------------------------------------------
   Step Builder
----------------------------------------------------*/
const StepSection = ({ title, fields, data, next, prev, onChange, onSave, apiEndpoint, saving, customContent, additionalButtons }) => {
  const { nextStep, previousStep } = useWizard();

  const handleSave = async () => {
    await onSave(apiEndpoint, fields);
  };

  return (
    <Form>
      {customContent && <div className="mb-3">{customContent}</div>}
      
      <Row>
        {fields.map((field, idx) => (
          <RenderField 
            key={idx} 
            field={field} 
            value={data?.[field.name]} 
            onChange={onChange}
          />
        ))}
      </Row>

      <div className="d-flex justify-content-between align-items-center my-3">
        <div>
          {prev && (
            <Button variant="dark" onClick={previousStep} className="me-2">
              ← Back
            </Button>
          )}
          {additionalButtons && additionalButtons.map((btn, idx) => (
            <Button 
              key={idx}
              variant={btn.variant || "secondary"} 
              onClick={btn.onClick}
              className="me-2"
            >
              {btn.icon && <i className={`bi bi-${btn.icon} me-1`}></i>}
              {btn.label}
            </Button>
          ))}
        </div>
        <div>
          <Button 
            variant="light" 
            onClick={handleSave} 
            disabled={saving}
            className="me-2"
          >
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
          {next && (
            <Button variant="primary" onClick={nextStep}>
              Next →
            </Button>
          )}
        </div>
      </div>
    </Form>
  );
};

/* ---------------------------------------------------
   Main Wizard Component
----------------------------------------------------*/
const WizardStudentDetail = () => {
  const { id } = useParams();
  const [sectionData, setSectionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certificates, setCertificates] = useState([]);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [editingCertificateIndex, setEditingCertificateIndex] = useState(null);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/student/studentAllDetails/${id}`);
        console.log("Fetched student details:", res.data); 
        const flattened = flattenData(res.data.jsonData);
        setSectionData(flattened);
      } catch (error) {
        console.error("Error fetching student details:", error);
        toast.error("Failed to fetch student details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleFieldChange = (fieldName, value) => {
    setSectionData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSave = async (endpoint, fields) => {
    try {
      setSaving(true);
      
      // Prepare data based on the fields in the current section
      let payload = {};
      fields.forEach((field) => {
        if (field.type !== "divider" && field.name) {
          const value = sectionData[field.name];
          // Include all values including empty strings (to allow clearing fields)
          // Only exclude undefined and null
          if (value !== undefined && value !== null) {
            payload[field.name] = value;
          }
        }
      });

      // Special handling for Address - needs nested structure
      if (endpoint.includes('updateStudentAddress')) {
        payload = {
          current: {
            addressLine1: sectionData.currentAddressLine1 || '',
            addressLine2: sectionData.currentAddressLine2 || '',
            city: sectionData.currentCity || '',
            district: sectionData.currentDistrict || '',
            state: sectionData.currentState || '',
            country: sectionData.currentCountry || '',
            pincode: sectionData.currentPincode || '',
          },
          permanent: {
            addressLine1: sectionData.permanentAddressLine1 || '',
            addressLine2: sectionData.permanentAddressLine2 || '',
            city: sectionData.permanentCity || '',
            district: sectionData.permanentDistrict || '',
            state: sectionData.permanentState || '',
            country: sectionData.permanentCountry || '',
            pincode: sectionData.permanentPincode || '',
          },
          isPermanentSameAsCurrent: sectionData.isPermanentSameAsCurrent || false,
        };
      }

      console.log('Endpoint:', endpoint);
      console.log('Payload being sent:', payload);

      // Special handling for certificates
      if (endpoint.includes('updateStudentCertificates')) {
        // Validate required fields
        if (!payload.certificationName || !payload.issuingOrganization || !payload.issueDate) {
          toast.error('Please fill in Certification Name, Issuing Organization, and Issue Date');
          setSaving(false);
          return;
        }
        
        // If editing existing certificate, include the certificate ID
        if (editingCertificateIndex !== null) {
          const existingCert = certificates[editingCertificateIndex];
          if (existingCert && existingCert._id) {
            payload.certificateId = existingCert._id.toString();
            console.log('Editing certificate with ID:', payload.certificateId);
          }
        }
      }

      // Special handling for work experience
      if (endpoint.includes('updateStudentWorkExperience')) {
        // If editing existing experience, include the experience ID
        if (editingExperienceIndex !== null) {
          const existingExp = workExperiences[editingExperienceIndex];
          if (existingExp && existingExp._id) {
            payload.experienceId = existingExp._id.toString();
            console.log('Editing experience with ID:', payload.experienceId);
          }
        }
      }

      // Handle file uploads separately if needed
      const hasFiles = fields.some(f => f.type === "file");
      
      if (hasFiles) {
        const formData = new FormData();
        Object.keys(payload).forEach(key => {
          const value = payload[key];
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            formData.append(key, value.toString());
          }
        });
        
        console.log('Sending FormData with files');
        const response = await axios.put(endpoint, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Response:', response.data);
      } else {
        console.log('Sending JSON payload');
        const response = await axios.put(endpoint, payload);
        console.log('Response:', response.data);
      }

      toast.success("Changes saved successfully!");
      
      // Clear certificate/experience form after save
      if (endpoint.includes('updateStudentCertificates')) {
        setEditingCertificateIndex(null);
        // Clear certificate fields
        setSectionData(prev => ({
          ...prev,
          certificationName: '',
          issuingOrganization: '',
          issueDate: '',
          expirationDate: '',
          credentialId: '',
          certificateUrl: '',
        }));
      }
      
      if (endpoint.includes('updateStudentWorkExperience')) {
        setEditingExperienceIndex(null);
        // Clear experience fields
        setSectionData(prev => ({
          ...prev,
          companyName: '',
          jobTitle: '',
          jobType: '',
          experienceDurationMonths: '',
          experienceStartDate: '',
          experienceEndDate: '',
          responsibilities: '',
        }));
      }
      
      // Refresh data
      const res = await axios.get(`/student/studentAllDetails/${id}`);
      const flattened = flattenData(res.data.jsonData);
      setSectionData(flattened);
      
    } catch (error) {
      console.error("Error saving data:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Add new certificate - clear form
  const addNewCertificate = () => {
    setSectionData(prev => ({
      ...prev,
      certificationName: '',
      issuingOrganization: '',
      issueDate: '',
      expirationDate: '',
      credentialId: '',
      certificateUrl: '',
    }));
    setEditingCertificateIndex(null);
    toast.info('Fill in new certificate details and click Save');
  };

  // Edit existing certificate
  const editCertificate = (index) => {
    const cert = certificates[index];
    setSectionData(prev => ({
      ...prev,
      certificationName: cert.certificationName || '',
      issuingOrganization: cert.issuingOrganization || '',
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
      expirationDate: cert.expirationDate ? cert.expirationDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      certificateUrl: cert.certificateUrl || '',
    }));
    setEditingCertificateIndex(index);
    toast.info(`Editing certificate: ${cert.certificationName}`);
  };

  // Add new work experience - clear form
  const addNewExperience = () => {
    setSectionData(prev => ({
      ...prev,
      companyName: '',
      jobTitle: '',
      jobType: '',
      experienceDurationMonths: '',
      experienceStartDate: '',
      experienceEndDate: '',
      responsibilities: '',
    }));
    setEditingExperienceIndex(null);
    toast.info('Fill in new work experience details and click Save');
  };

  // Edit existing work experience
  const editExperience = (index) => {
    const exp = workExperiences[index];
    setSectionData(prev => ({
      ...prev,
      companyName: exp.companyName || '',
      jobTitle: exp.jobTitle || '',
      jobType: exp.jobType || '',
      experienceDurationMonths: exp.experienceDurationMonths || '',
      experienceStartDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      experienceEndDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      responsibilities: exp.responsibilities || '',
    }));
    setEditingExperienceIndex(index);
    toast.info(`Editing experience: ${exp.companyName}`);
  };

  const flattenData = (data) => {
    if (!data) return {};

    const addressData = Array.isArray(data.studentAddressData) ? data.studentAddressData[0] : data.studentAddressData;
    const bankData = Array.isArray(data.studentBankData) ? data.studentBankData[0] : data.studentBankData;
    const bodyData = Array.isArray(data.studentBodyData) ? data.studentBodyData[0] : data.studentBodyData;
    const emergencyData = Array.isArray(data.studentEmergencyContactData) ? data.studentEmergencyContactData[0] : data.studentEmergencyContactData;
    const parentalData = Array.isArray(data.studentParentalInfoData) ? data.studentParentalInfoData[0] : data.studentParentalInfoData;
    const preferencesData = Array.isArray(data.studentPreferencesData) ? data.studentPreferencesData[0] : data.studentPreferencesData;
    const educationData = Array.isArray(data.studentEducationData) ? data.studentEducationData[0] : data.studentEducationData;
    const skillsData = Array.isArray(data.studentSkillsData) ? data.studentSkillsData[0] : data.studentSkillsData;
    const socialLinksData = Array.isArray(data.studentSocialLinksData) ? data.studentSocialLinksData[0] : data.studentSocialLinksData;
    const workExperienceData = Array.isArray(data.studentWorkExperienceData) ? data.studentWorkExperienceData[0] : data.studentWorkExperienceData;
    const documentData = Array.isArray(data.studentDocumentUploadData) ? data.studentDocumentUploadData[0] : data.studentDocumentUploadData;
    const certificatesData = Array.isArray(data.studentCertificatesData) ? data.studentCertificatesData[0] : data.studentCertificatesData;
    const basicData = Array.isArray(data.studentBasicData) ? data.studentBasicData[0] : data.studentBasicData;

    // Store all certificates and work experiences
    const validCertificates = (certificatesData?.certificates || []).filter(cert => cert !== null);
    setCertificates(validCertificates);
    const validExperiences = (workExperienceData?.experiences || []).filter(exp => exp !== null);
    setWorkExperiences(validExperiences);

    const firstExperience = validExperiences[0] || {};
    const firstCertificate = validCertificates[0] || {};

    return {
      // Primary Data
      studentFirstName: data.studentPrimaryData?.studentFirstName,
      studentLastName: data.studentPrimaryData?.studentLastName,
      studentEmail: data.studentPrimaryData?.studentEmail,
      studentMobileNo: data.studentPrimaryData?.studentMobileNo,
      studentJobSector: data.studentPrimaryData?.studentJobSector?.job_sector_name,
      accountStatus: data.studentPrimaryData?.accountStatus,
      studentReferralCode: data.studentPrimaryData?.studentReferralCode,
      studentReferralByCode: data.studentPrimaryData?.studentReferralByCode,
      studentCreatedAt: data.studentPrimaryData?.studentCreatedAt,

      // Basic Data
      studentDOB: basicData?.studentDOB,
      studentGender: basicData?.studentGender,
      studentAlternateMobileNo: basicData?.studentAlternateMobileNo,
      studentMaritalStatus: basicData?.studentMaritalStatus,
      studentMotherTongue: basicData?.studentMotherTongue,
      studentNationality: basicData?.studentNationality,
      studentCitizenship: basicData?.studentCitizenship,

      // Address
      currentAddressLine1: addressData?.current?.addressLine1,
      currentAddressLine2: addressData?.current?.addressLine2,
      currentCity: addressData?.current?.city,
      currentState: addressData?.current?.state,
      currentDistrict: addressData?.current?.district,
      currentCountry: addressData?.current?.country,
      currentPincode: addressData?.current?.pincode,
      permanentAddressLine1: addressData?.permanent?.addressLine1,
      permanentAddressLine2: addressData?.permanent?.addressLine2,
      permanentCity: addressData?.permanent?.city,
      permanentState: addressData?.permanent?.state,
      permanentDistrict: addressData?.permanent?.district,
      permanentCountry: addressData?.permanent?.country,
      permanentPincode: addressData?.permanent?.pincode,
      isPermanentSameAsCurrent: addressData?.isPermanentSameAsCurrent,

      // Bank
      bankHolderName: bankData?.bankHolderName,
      bankName: bankData?.bankName,
      accountNumber: bankData?.accountNumber,
      ifscCode: bankData?.ifscCode,
      branchName: bankData?.branchName,

      // Body
      heightCm: bodyData?.heightCm,
      weightKg: bodyData?.weightKg,
      bloodGroup: bodyData?.bloodGroup,
      eyeColor: bodyData?.eyeColor,
      hairColor: bodyData?.hairColor,
      identificationMark1: bodyData?.identificationMark1,
      identificationMark2: bodyData?.identificationMark2,
      disability: bodyData?.disability,
      disabilityType: bodyData?.disabilityType,
      disabilityPercentage: bodyData?.disabilityPercentage,

      // Emergency
      emergencyContactName: emergencyData?.emergencyContactName,
      emergencyRelation: emergencyData?.emergencyRelation,
      emergencyPhoneNumber: emergencyData?.emergencyPhoneNumber,
      emergencyAddress: emergencyData?.emergencyAddress,

      // Parental
      fatherName: parentalData?.fatherName,
      fatherContactNumber: parentalData?.fatherContactNumber,
      fatherOccupation: parentalData?.fatherOccupation,
      fatherEmail: parentalData?.fatherEmail,
      fatherAnnualIncome: parentalData?.fatherAnnualIncome,
      motherName: parentalData?.motherName,
      motherContactNumber: parentalData?.motherContactNumber,
      motherOccupation: parentalData?.motherOccupation,
      motherEmail: parentalData?.motherEmail,
      motherAnnualIncome: parentalData?.motherAnnualIncome,
      guardianName: parentalData?.guardianName,
      guardianRelation: parentalData?.guardianRelation,
      guardianContactNumber: parentalData?.guardianContactNumber,
      numberOfFamilyMembers: parentalData?.numberOfFamilyMembers,
      familyType: parentalData?.familyType,

      // Preferences
      preferredJobCategory: Array.isArray(preferencesData?.preferredJobCategory)
        ? preferencesData.preferredJobCategory.join(', ')
        : (preferencesData?.preferredJobCategory || ''),
      preferredJobLocation: Array.isArray(preferencesData?.preferredJobLocation)
        ? preferencesData.preferredJobLocation.join(', ')
        : (preferencesData?.preferredJobLocation || ''),
      expectedSalaryMin: preferencesData?.expectedSalaryMin,
      expectedSalaryMax: preferencesData?.expectedSalaryMax,
      employmentType: Array.isArray(preferencesData?.employmentType)
        ? preferencesData.employmentType.join(', ')
        : (preferencesData?.employmentType || ''),
      willingToRelocate: preferencesData?.willingToRelocate,

      // Education
      highestQualification: educationData?.highestQualification,
      tenthSchoolName: educationData?.tenth?.schoolName,
      tenthBoard: educationData?.tenth?.board,
      tenthPassingYear: educationData?.tenth?.passingYear,
      tenthPercentage: educationData?.tenth?.percentage,
      twelfthSchoolCollegeName: educationData?.twelfth?.schoolCollegeName,
      twelfthBoard: educationData?.twelfth?.board,
      twelfthStream: educationData?.twelfth?.stream,
      twelfthPassingYear: educationData?.twelfth?.passingYear,
      twelfthPercentage: educationData?.twelfth?.percentage,
      graduationCollegeName: educationData?.graduation?.collegeName,
      graduationCourseName: educationData?.graduation?.courseName,
      graduationSpecialization: educationData?.graduation?.specialization,
      graduationPassingYear: educationData?.graduation?.passingYear,
      graduationPercentage: educationData?.graduation?.percentage,
      postGraduationCollegeName: educationData?.postGraduation?.collegeName,
      postGraduationCourseName: educationData?.postGraduation?.courseName,
      postGraduationSpecialization: educationData?.postGraduation?.specialization,
      postGraduationPassingYear: educationData?.postGraduation?.passingYear,
      postGraduationPercentage: educationData?.postGraduation?.percentage,

      // Skills
      hobbies: Array.isArray(skillsData?.hobbies) ? skillsData.hobbies.join(', ') : (skillsData?.hobbies || ''),
      technicalSkills: Array.isArray(skillsData?.technicalSkills) ? skillsData.technicalSkills.join(', ') : (skillsData?.technicalSkills || ''),
      softSkills: Array.isArray(skillsData?.softSkills) ? skillsData.softSkills.join(', ') : (skillsData?.softSkills || ''),
      computerKnowledge: Array.isArray(skillsData?.computerKnowledge) ? skillsData.computerKnowledge.join(', ') : (skillsData?.computerKnowledge || ''),

      // Social Links
      linkedInUrl: socialLinksData?.linkedInUrl,
      githubUrl: socialLinksData?.githubUrl,
      portfolioUrl: socialLinksData?.portfolioUrl,
      facebookUrl: socialLinksData?.facebookUrl,
      instagramUrl: socialLinksData?.instagramUrl,

      // Work Experience
      totalExperienceMonths: workExperienceData?.totalExperienceMonths || 0,
      companyName: firstExperience.companyName || '',
      jobTitle: firstExperience.jobTitle || '',
      jobType: firstExperience.jobType || '',
      experienceDurationMonths: firstExperience.experienceDurationMonths || 0,
      experienceStartDate: firstExperience.startDate || '',
      experienceEndDate: firstExperience.endDate || '',
      responsibilities: firstExperience.responsibilities || '',

      // Certificates
      certificationName: firstCertificate.certificationName || '',
      issuingOrganization: firstCertificate.issuingOrganization || '',
      issueDate: firstCertificate.issueDate || '',
      expirationDate: firstCertificate.expirationDate || '',
      credentialId: firstCertificate.credentialId || '',
      certificateUrl: firstCertificate.certificateUrl || '',

      // Documents
      aadharNumber: documentData?.identityDocuments?.aadharNumber,
      panNumber: documentData?.identityDocuments?.panNumber,
      voterId: documentData?.identityDocuments?.voterId,
      passportNumber: documentData?.identityDocuments?.passportNumber,
      drivingLicenseNo: documentData?.identityDocuments?.drivingLicenseNo,
    };
  };

  if (loading) {
    return <Container fluid><PageTitle title="Loading..." /></Container>;
  }

  return (
    <Container fluid>
      {/* <PageTitle title="Student Wizard" subtitle="All student details" /> */}

      <Row className="mt-4">
        <Col cols={12}>
          <ComponentCard title="Student Details Wizard">
            <Wizard header={<Header withProgress />}>
              {/* Step 1: Primary Information */}
              <StepSection
                title="Primary Information"
                data={sectionData}
                next
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentBasicDetails/${id}`}
                saving={saving}
                fields={[
                  { name: "studentFirstName", label: "First Name", type: "text", cols: 4 },
                  { name: "studentLastName", label: "Last Name", type: "text", cols: 4 },
                  { name: "studentEmail", label: "Email", type: "email", cols: 4 },
                  { name: "studentMobileNo", label: "Mobile Number", type: "tel", cols: 4 },
                  { name: "studentJobSector", label: "Job Sector", type: "text", cols: 4 },
                  {
                    name: "accountStatus", label: "Account Status", type: "select", cols: 4,
                    options: [
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                      { value: "blocked", label: "Blocked" },
                    ]
                  },
                  { name: "studentReferralCode", label: "Referral Code", type: "text", cols: 4 },
                  { name: "studentReferralByCode", label: "Referred By Code", type: "text", cols: 4 },
                  { name: "studentCreatedAt", label: "Created At", type: "date", cols: 4 },
                ]}
              />

              {/* Step 2: Basic Details */}
              <StepSection
                title="Basic Details"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentBasicDetails/${id}`}
                saving={saving}
                fields={[
                  { name: "studentDOB", label: "Date of Birth", type: "date", cols: 3 },
                  {
                    name: "studentGender", label: "Gender", type: "select", cols: 3,
                    options: [
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" }, 
                    ]
                  },
                  { name: "studentAlternateMobileNo", label: "Alternate Mobile", type: "tel", cols: 3 },
                  {
                    name: "studentMaritalStatus", label: "Marital Status", type: "select", cols: 3,
                    options: [
                      { value: "single", label: "Single" },
                      { value: "married", label: "Married" },
                      { value: "other", label: "Other" },
                      { value: "prefer_not_to_say", label: "Prefer Not to Say" },
                    ]
                  },
                  { name: "studentMotherTongue", label: "Mother Tongue", type: "text", cols: 3 },
                  { name: "studentNationality", label: "Nationality", type: "text", cols: 3 },
                  { name: "studentCitizenship", label: "Citizenship", type: "text", cols: 3 },
                ]}
              />

              {/* Step 3: Address */}
              <StepSection
                title="Address"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentAddress/${id}`}
                saving={saving}
                fields={[
                  { label: "Current Address", type: "divider", cols: 12 },
                  { name: "currentAddressLine1", label: "Address Line 1", type: "text", cols: 6 },
                  { name: "currentAddressLine2", label: "Address Line 2", type: "text", cols: 6 },
                  { name: "currentCity", label: "City", type: "text", cols: 2 },
                  { name: "currentDistrict", label: "District", type: "text", cols: 2 },
                  { name: "currentState", label: "State", type: "text", cols: 2 },
                  { name: "currentCountry", label: "Country", type: "text", cols: 2 },
                  { name: "currentPincode", label: "Pincode", type: "text", cols: 2 },

                  { label: "Permanent Address", type: "divider", cols: 12 },
                  { name: "isPermanentSameAsCurrent", label: "Same as Current", type: "checkbox", cols: 12 },
                  { name: "permanentAddressLine1", label: "Address Line 1", type: "text", cols: 6 },
                  { name: "permanentAddressLine2", label: "Address Line 2", type: "text", cols: 6 },
                  { name: "permanentCity", label: "City", type: "text", cols: 2 },
                  { name: "permanentDistrict", label: "District", type: "text", cols: 2 },
                  { name: "permanentState", label: "State", type: "text", cols: 2 },
                  { name: "permanentCountry", label: "Country", type: "text", cols: 2 },
                  { name: "permanentPincode", label: "Pincode", type: "text", cols: 2 },
                ]}
              />

              {/* Step 4: Bank & Body Details */}
              <StepSection
                title="Bank Details"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentBodyDetails/${id}`}
                saving={saving}
                fields={[
                  { label: "Bank Details", type: "divider", cols: 12 },
                  { name: "bankHolderName", label: "Account Holder Name", type: "text", cols: 4 },
                  { name: "bankName", label: "Bank Name", type: "text", cols: 4 },
                  { name: "accountNumber", label: "Account Number", type: "text", cols: 4 },
                  { name: "ifscCode", label: "IFSC Code", type: "text", cols: 4 },
                  { name: "branchName", label: "Branch Name", type: "text", cols: 4 },
                ]}
              />

              <StepSection
                title="Body Details"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentBankDetails/${id}`}
                saving={saving}
                fields={[
                  { label: "Body Details", type: "divider", cols: 12 },
                  { name: "heightCm", label: "Height (cm)", type: "number", cols: 2 },
                  { name: "weightKg", label: "Weight (kg)", type: "number", cols: 2 },
                  { name: "bloodGroup", label: "Blood Group", type: "text", cols: 2 },
                  { name: "eyeColor", label: "Eye Color", type: "text", cols: 2 },
                  { name: "hairColor", label: "Hair Color", type: "text", cols: 2 },
                  { name: "identificationMark1", label: "Identification Mark 1", type: "text", cols: 6 },
                  { name: "identificationMark2", label: "Identification Mark 2", type: "text", cols: 6 },
                  { name: "disability", label: "Disability", type: "checkbox", cols: 4 },
                  { name: "disabilityType", label: "Disability Type", type: "text", cols: 4 },
                  { name: "disabilityPercentage", label: "Disability %", type: "number", cols: 4 },
                ]}
              />

              {/* Step 5: Emergency Contact */}
              <StepSection
                title="Emergency Contact"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentEmergencyContact/${id}`}
                saving={saving}
                fields={[
                  { name: "emergencyContactName", label: "Contact Name", type: "text", cols: 4 },
                  { name: "emergencyRelation", label: "Relation", type: "text", cols: 4 },
                  { name: "emergencyPhoneNumber", label: "Phone Number", type: "tel", cols: 4 },
                  { name: "emergencyAddress", label: "Address", type: "textarea", rows: 2, cols: 12 },
                ]}
              />

              {/* Step 6: Parental Info */}
              <StepSection
                title="Parental Information"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentParentalInfo/${id}`}
                saving={saving}
                fields={[
                  { label: "Father's Information", type: "divider", cols: 12 },
                  { name: "fatherName", label: "Father's Name", type: "text", cols: 4 },
                  { name: "fatherContactNumber", label: "Contact Number", type: "tel", cols: 4 },
                  { name: "fatherOccupation", label: "Occupation", type: "text", cols: 4 },
                  { name: "fatherEmail", label: "Email", type: "email", cols: 4 },
                  { name: "fatherAnnualIncome", label: "Annual Income", type: "number", cols: 4 },

                  { label: "Mother's Information", type: "divider", cols: 12 },
                  { name: "motherName", label: "Mother's Name", type: "text", cols: 4 },
                  { name: "motherContactNumber", label: "Contact Number", type: "tel", cols: 4 },
                  { name: "motherOccupation", label: "Occupation", type: "text", cols: 4 },
                  { name: "motherEmail", label: "Email", type: "email", cols: 4 },
                  { name: "motherAnnualIncome", label: "Annual Income", type: "number", cols: 4 },

                  { label: "Guardian's Information", type: "divider", cols: 12 },
                  { name: "guardianName", label: "Guardian Name", type: "text", cols: 4 },
                  { name: "guardianRelation", label: "Relation", type: "text", cols: 4 },
                  { name: "guardianContactNumber", label: "Contact Number", type: "tel", cols: 4 },
                  { name: "numberOfFamilyMembers", label: "Family Members", type: "number", cols: 4 },
                  {
                    name: "familyType", label: "Family Type", type: "select", cols: 4,
                    options: [
                      { value: "joint", label: "Joint" },
                      { value: "nuclear", label: "Nuclear" },
                      { value: "other", label: "Other" },
                    ]
                  },
                ]}
              />

              {/* Step 7: Career Preferences */}
              <StepSection
                title="Career Preferences"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentCareerPreferences/${id}`}
                saving={saving}
                fields={[
                  { name: "preferredJobCategory", label: "Preferred Job Category", type: "textarea", rows: 2, cols: 6 },
                  { name: "preferredJobLocation", label: "Preferred Job Location", type: "textarea", rows: 2, cols: 6 },
                  { name: "expectedSalaryMin", label: "Expected Salary Min", type: "number", cols: 4 },
                  { name: "expectedSalaryMax", label: "Expected Salary Max", type: "number", cols: 4 },
                  { name: "employmentType", label: "Employment Type", type: "textarea", rows: 2, cols: 6 },
                  { name: "willingToRelocate", label: "Willing to Relocate", type: "checkbox", cols: 4 },
                ]}
              />

              {/* Step 8: Education */}
              <StepSection
                title="Education Details"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentEducationDetails/${id}`}
                saving={saving}
                fields={[
                  {
                    name: "highestQualification", label: "Highest Qualification", type: "select", cols: 12,
                    options: [
                      { value: "No formal education", label: "No formal education" },
                      { value: "Primary", label: "Primary" },
                      { value: "Secondary", label: "Secondary" },
                      { value: "Higher Secondary", label: "Higher Secondary" },
                      { value: "Diploma", label: "Diploma" },
                      { value: "ITI", label: "ITI" },
                      { value: "Polytechnic", label: "Polytechnic" },
                      { value: "Certificate", label: "Certificate" },
                      { value: "Vocational", label: "Vocational" },
                      { value: "Bachelors", label: "Bachelors" },
                      { value: "Masters", label: "Masters" },
                      { value: "MPhil", label: "MPhil" },
                      { value: "PhD", label: "PhD" },
                      { value: "Other", label: "Other" },
                    ]
                  },

                  { label: "10th Standard", type: "divider", cols: 12 },
                  { name: "tenthSchoolName", label: "School Name", type: "text", cols: 6 },
                  { name: "tenthBoard", label: "Board", type: "text", cols: 6 },
                  { name: "tenthPassingYear", label: "Passing Year", type: "number", cols: 6 },
                  { name: "tenthPercentage", label: "Percentage", type: "number", cols: 6 },

                  { label: "12th Standard", type: "divider", cols: 12 },
                  { name: "twelfthSchoolCollegeName", label: "School/College Name", type: "text", cols: 6 },
                  { name: "twelfthBoard", label: "Board", type: "text", cols: 6 },
                  { name: "twelfthStream", label: "Stream", type: "text", cols: 4 },
                  { name: "twelfthPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "twelfthPercentage", label: "Percentage", type: "number", cols: 4 },

                  { label: "Graduation", type: "divider", cols: 12 },
                  { name: "graduationCollegeName", label: "College Name", type: "text", cols: 6 },
                  { name: "graduationCourseName", label: "Course Name", type: "text", cols: 6 },
                  { name: "graduationSpecialization", label: "Specialization", type: "text", cols: 4 },
                  { name: "graduationPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "graduationPercentage", label: "Percentage", type: "number", cols: 4 },

                  { label: "Post Graduation", type: "divider", cols: 12 },
                  { name: "postGraduationCollegeName", label: "College Name", type: "text", cols: 6 },
                  { name: "postGraduationCourseName", label: "Course Name", type: "text", cols: 6 },
                  { name: "postGraduationSpecialization", label: "Specialization", type: "text", cols: 4 },
                  { name: "postGraduationPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "postGraduationPercentage", label: "Percentage", type: "number", cols: 4 },
                ]}
              />

              {/* Step 9: Skills */}
              <StepSection
                title="Skills & Knowledge"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentSkills/${id}`}
                saving={saving}
                fields={[
                  { name: "hobbies", label: "Hobbies", type: "textarea", rows: 2, cols: 12 },
                  { name: "technicalSkills", label: "Technical Skills", type: "textarea", rows: 2, cols: 12 },
                  { name: "softSkills", label: "Soft Skills", type: "textarea", rows: 2, cols: 12 },
                  { name: "computerKnowledge", label: "Computer Knowledge", type: "textarea", rows: 2, cols: 12 },
                ]}
              />

              {/* Step 10: Social Links */}
              <StepSection
                title="Social Media Links"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentSocialLinks/${id}`}
                saving={saving}
                fields={[
                  { name: "linkedInUrl", label: "LinkedIn URL", type: "url", cols: 6 },
                  { name: "githubUrl", label: "GitHub URL", type: "url", cols: 6 },
                  { name: "portfolioUrl", label: "Portfolio URL", type: "url", cols: 6 },
                  { name: "facebookUrl", label: "Facebook URL", type: "url", cols: 6 },
                  { name: "instagramUrl", label: "Instagram URL", type: "url", cols: 6 },
                ]}
              />

              {/* Step 11: Work Experience */}
              <StepSection
                title="Work Experience"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentWorkExperience/${id}`}
                saving={saving}
                additionalButtons={[
                  {
                    label: "Add New Experience",
                    variant: "primary",
                    onClick: addNewExperience,
                    icon: "plus"
                  }
                ]}
                customContent={workExperiences.length > 0 && (
                  <div className="mb-3">
                    <h6 className="mb-3">Existing Work Experiences ({workExperiences.length})</h6>
                    <div className="table-responsive">
                      <Table bordered hover>
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: '5%' }}>#</th>
                            <th style={{ width: '30%' }}>Company</th>
                            <th style={{ width: '25%' }}>Job Title</th>
                            <th style={{ width: '15%' }}>Type</th>
                            <th style={{ width: '15%' }}>Duration</th>
                            <th style={{ width: '10%' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workExperiences.map((exp, index) => (
                            <tr key={index} className={editingExperienceIndex === index ? 'table-active' : ''}>
                              <td>{index + 1}</td>
                              <td>{exp.companyName}</td>
                              <td>{exp.jobTitle}</td>
                              <td>{exp.jobType}</td>
                              <td>{exp.experienceDurationMonths} months</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => editExperience(index)}
                                >
                                  <i className="bi bi-pencil"></i> Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
                fields={[
                  { name: "totalExperienceMonths", label: "Total Experience (Months)", type: "number", cols: 4 },
                  { label: "Experience Details", type: "divider", cols: 12 },
                  { name: "companyName", label: "Company Name", type: "text", cols: 6 },
                  { name: "jobTitle", label: "Job Title", type: "text", cols: 6 },
                  {
                    name: "jobType", label: "Job Type", type: "select", cols: 4,
                    options: [
                      { value: "Full-time", label: "Full-time" },
                      { value: "Part-time", label: "Part-time" },
                      { value: "Contract", label: "Contract" },
                      { value: "Internship", label: "Internship" },
                      { value: "Freelance", label: "Freelance" },
                    ]
                  },
                  { name: "experienceDurationMonths", label: "Duration (Months)", type: "number", cols: 4 },
                  { name: "experienceStartDate", label: "Start Date", type: "date", cols: 4 },
                  { name: "experienceEndDate", label: "End Date", type: "date", cols: 4 },
                  { name: "responsibilities", label: "Responsibilities", type: "textarea", rows: 3, cols: 12 },
                ]}
              />

              {/* Step 12: Certificates */}
              <StepSection
                title="Certifications"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentCertificates/${id}`}
                saving={saving}
                additionalButtons={[
                  {
                    label: "Add New Certificate",
                    variant: "primary",
                    onClick: addNewCertificate,
                    icon: "plus"
                  }
                ]}
                customContent={certificates.length > 0 && (
                  <div className="mb-3">
                    <h6 className="mb-3">Existing Certificates ({certificates.length})</h6>
                    <div className="table-responsive">
                      <Table bordered hover>
                        <thead className="table-light">
                          <tr>
                            <th style={{ width: '5%' }}>#</th>
                            <th style={{ width: '30%' }}>Name</th>
                            <th style={{ width: '30%' }}>Organization</th>
                            <th style={{ width: '15%' }}>Issue Date</th>
                            <th style={{ width: '10%' }}>Expiration</th>
                            <th style={{ width: '10%' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificates.map((cert, index) => (
                            <tr key={index} className={editingCertificateIndex === index ? 'table-active' : ''}>
                              <td>{index + 1}</td>
                              <td>{cert.certificationName}</td>
                              <td>{cert.issuingOrganization}</td>
                              <td>{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString() : 'N/A'}</td>
                              <td>{cert.expirationDate ? new Date(cert.expirationDate).toLocaleDateString() : 'N/A'}</td>
                              <td>
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => editCertificate(index)}
                                >
                                  <i className="bi bi-pencil"></i> Edit
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                )}
                fields={[
                  { name: "certificationName", label: "Certification Name", type: "text", cols: 6 },
                  { name: "issuingOrganization", label: "Issuing Organization", type: "text", cols: 6 },
                  { name: "issueDate", label: "Issue Date", type: "date", cols: 4 },
                  { name: "expirationDate", label: "Expiration Date", type: "date", cols: 4 },
                  { name: "credentialId", label: "Credential ID", type: "text", cols: 4 },
                  { name: "certificateUrl", label: "Certificate URL", type: "url", cols: 12 },
                ]}
              />

              {/* Step 13: Documents */}
              <StepSection
                title="Document Uploads"
                data={sectionData}
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentDocumentUpload/${id}`}
                saving={saving}
                fields={[
                  { name: "aadharNumber", label: "Aadhar Number", type: "text", cols: 4 },
                  { name: "panNumber", label: "PAN Number", type: "text", cols: 4 },
                  { name: "voterId", label: "Voter ID", type: "text", cols: 4 },
                  { name: "passportNumber", label: "Passport Number", type: "text", cols: 4 },
                  { name: "drivingLicenseNo", label: "Driving License No", type: "text", cols: 4 },
                ]}
              />
            </Wizard>
          </ComponentCard>
        </Col>
      </Row>
    </Container>
  );
};

export default WizardStudentDetail;
