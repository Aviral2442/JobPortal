import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import DetailPage from '@/components/DetailPage';

const StudentDetail = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchstudentDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/student/studentAllDetails/${id}`);
      console.log("Fetched student detail:", res.data);
      setStudentData(res.data.jsonData);
    } catch (error) {
      console.error("Error fetching student detail:", error);
      setError("Failed to fetch student details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchstudentDetail();
  }, [id]);

  const handleUpdate = async (field, value) => {
    console.log("Updating field:", field, "with value:", value);
    // Implement update logic here based on field
  };

  // Flatten data for DetailPage component
  const flattenedData = studentData ? {
    // Primary Data
    studentProfilePic: studentData.studentPrimaryData?.studentProfilePic,
    studentFirstName: studentData.studentPrimaryData?.studentFirstName,
    studentLastName: studentData.studentPrimaryData?.studentLastName,
    studentEmail: studentData.studentPrimaryData?.studentEmail,
    studentMobileNo: studentData.studentPrimaryData?.studentMobileNo,
    studentJobType: studentData.studentPrimaryData?.studentJobType?.job_type_name,
    studentResumeFile: studentData.studentPrimaryData?.studentResumeFile,
    studentReferralCode: studentData.studentPrimaryData?.studentReferralCode,
    studentReferralByCode: studentData.studentPrimaryData?.studentReferralByCode,
    accountStatus: studentData.studentPrimaryData?.accountStatus,
    studentCreatedAt: studentData.studentPrimaryData?.studentCreatedAt,
    studentUpdatedAt: studentData.studentPrimaryData?.studentUpdatedAt,

    // Basic Data
    studentDOB: studentData.studentBasicData?.studentDOB,
    studentGender: studentData.studentBasicData?.studentGender,
    studentAlternateMobileNo: studentData.studentBasicData?.studentAlternateMobileNo,
    studentMaritalStatus: studentData.studentBasicData?.studentMaritalStatus,
    studentMotherTongue: studentData.studentBasicData?.studentMotherTongue,
    studentNationality: studentData.studentBasicData?.studentNationality,
    studentCitizenship: studentData.studentBasicData?.studentCitizenship,

    // Current Address
    currentAddressLine1: studentData.studentAddressData?.current?.addressLine1,
    currentAddressLine2: studentData.studentAddressData?.current?.addressLine2,
    currentCity: studentData.studentAddressData?.current?.city,
    currentState: studentData.studentAddressData?.current?.state,
    currentDistrict: studentData.studentAddressData?.current?.district,
    currentCountry: studentData.studentAddressData?.current?.country,
    currentPincode: studentData.studentAddressData?.current?.pincode,

    // Permanent Address
    permanentAddressLine1: studentData.studentAddressData?.permanent?.addressLine1,
    permanentAddressLine2: studentData.studentAddressData?.permanent?.addressLine2,
    permanentCity: studentData.studentAddressData?.permanent?.city,
    permanentState: studentData.studentAddressData?.permanent?.state,
    permanentDistrict: studentData.studentAddressData?.permanent?.district,
    permanentCountry: studentData.studentAddressData?.permanent?.country,
    permanentPincode: studentData.studentAddressData?.permanent?.pincode,
    isPermanentSameAsCurrent: studentData.studentAddressData?.isPermanentSameAsCurrent,

    // Bank Data
    bankHolderName: studentData.studentBankData?.bankHolderName,
    bankName: studentData.studentBankData?.bankName,
    accountNumber: studentData.studentBankData?.accountNumber,
    ifscCode: studentData.studentBankData?.ifscCode,
    branchName: studentData.studentBankData?.branchName,
    passbookUrl: studentData.studentBankData?.passbookUrl,

    // Body Details
    heightCm: studentData.studentBodyData?.heightCm,
    weightKg: studentData.studentBodyData?.weightKg,
    bloodGroup: studentData.studentBodyData?.bloodGroup,
    eyeColor: studentData.studentBodyData?.eyeColor,
    hairColor: studentData.studentBodyData?.hairColor,
    identificationMark1: studentData.studentBodyData?.identificationMark1,
    identificationMark2: studentData.studentBodyData?.identificationMark2,
    disability: studentData.studentBodyData?.disability,
    disabilityType: studentData.studentBodyData?.disabilityType,
    disabilityPercentage: studentData.studentBodyData?.disabilityPercentage,

    // Emergency Contact
    emergencyContactName: studentData.studentEmergencyContactData?.emergencyContactName,
    emergencyRelation: studentData.studentEmergencyContactData?.emergencyRelation,
    emergencyPhoneNumber: studentData.studentEmergencyContactData?.emergencyPhoneNumber,
    emergencyAddress: studentData.studentEmergencyContactData?.emergencyAddress,

    // Parental Info
    fatherName: studentData.studentParentalInfoData?.fatherName,
    fatherContactNumber: studentData.studentParentalInfoData?.fatherContactNumber,
    fatherOccupation: studentData.studentParentalInfoData?.fatherOccupation,
    fatherEmail: studentData.studentParentalInfoData?.fatherEmail,
    fatherAnnualIncome: studentData.studentParentalInfoData?.fatherAnnualIncome,
    motherName: studentData.studentParentalInfoData?.motherName,
    motherContactNumber: studentData.studentParentalInfoData?.motherContactNumber,
    motherOccupation: studentData.studentParentalInfoData?.motherOccupation,
    motherEmail: studentData.studentParentalInfoData?.motherEmail,
    motherAnnualIncome: studentData.studentParentalInfoData?.motherAnnualIncome,
    guardianName: studentData.studentParentalInfoData?.guardianName,
    guardianRelation: studentData.studentParentalInfoData?.guardianRelation,
    guardianContactNumber: studentData.studentParentalInfoData?.guardianContactNumber,
    numberOfFamilyMembers: studentData.studentParentalInfoData?.numberOfFamilyMembers,
    familyType: studentData.studentParentalInfoData?.familyType,

    // Documents
    aadharNumber: studentData.studentDocumentUploadData?.identityDocuments?.aadharNumber,
    panNumber: studentData.studentDocumentUploadData?.identityDocuments?.panNumber,
    voterId: studentData.studentDocumentUploadData?.identityDocuments?.voterId,
    passportNumber: studentData.studentDocumentUploadData?.identityDocuments?.passportNumber,
    drivingLicenseNo: studentData.studentDocumentUploadData?.identityDocuments?.drivingLicenseNo,
  } : {};

  const sections = [
    {
      title: "Primary Information",
      titleColor: "primary",
      fields: [
        { label: "First Name", name: "studentFirstName", editable: false, cols: 4 },
        { label: "Last Name", name: "studentLastName", editable: false, cols: 4 },
        { label: "Email", name: "studentEmail", type: "email", editable: false, cols: 4 },
        { label: "Mobile Number", name: "studentMobileNo", type: "tel", editable: false, cols: 4 },
        { label: "Job Type", name: "studentJobType", editable: false, cols: 4 },
        { label: "Account Status", name: "accountStatus", type: "select", options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "blocked", label: "Blocked" },
        ], editable: true, cols: 4 },
        { label: "Referral Code", name: "studentReferralCode", editable: false, cols: 4 },
        { label: "Referred By Code", name: "studentReferralByCode", editable: false, cols: 4 },
        { label: "Created At", name: "studentCreatedAt", type: "date", editable: false, cols: 4 },
      ],
    },
    {
      title: "Basic Details",
      titleColor: "info",
      fields: [
        { label: "Date of Birth", name: "studentDOB", type: "date", editable: true, cols: 4 },
        { label: "Gender", name: "studentGender", type: "select", options: [
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
          { value: "prefer_not_to_say", label: "Prefer Not to Say" },
        ], editable: true, cols: 4 },
        { label: "Alternate Mobile", name: "studentAlternateMobileNo", type: "tel", editable: true, cols: 4 },
        { label: "Marital Status", name: "studentMaritalStatus", type: "select", options: [
          { value: "single", label: "Single" },
          { value: "married", label: "Married" },
          { value: "other", label: "Other" },
          { value: "prefer_not_to_say", label: "Prefer Not to Say" },
        ], editable: true, cols: 4 },
        { label: "Mother Tongue", name: "studentMotherTongue", editable: true, cols: 4 },
        { label: "Nationality", name: "studentNationality", editable: true, cols: 4 },
        { label: "Citizenship", name: "studentCitizenship", editable: true, cols: 4 },
      ],
    },
    {
      title: "Current Address",
      titleColor: "success",
      fields: [
        { label: "Address Line 1", name: "currentAddressLine1", editable: true, cols: 6 },
        { label: "Address Line 2", name: "currentAddressLine2", editable: true, cols: 6 },
        { label: "City", name: "currentCity", editable: true, cols: 4 },
        { label: "District", name: "currentDistrict", editable: true, cols: 4 },
        { label: "State", name: "currentState", editable: true, cols: 4 },
        { label: "Country", name: "currentCountry", editable: true, cols: 4 },
        { label: "Pincode", name: "currentPincode", editable: true, cols: 4 },
      ],
    },
    {
      title: "Permanent Address",
      titleColor: "success",
      show: !flattenedData.isPermanentSameAsCurrent,
      fields: [
        { label: "Same as Current", name: "isPermanentSameAsCurrent", type: "boolean", editable: false, cols: 12 },
        { label: "Address Line 1", name: "permanentAddressLine1", editable: true, cols: 6 },
        { label: "Address Line 2", name: "permanentAddressLine2", editable: true, cols: 6 },
        { label: "City", name: "permanentCity", editable: true, cols: 4 },
        { label: "District", name: "permanentDistrict", editable: true, cols: 4 },
        { label: "State", name: "permanentState", editable: true, cols: 4 },
        { label: "Country", name: "permanentCountry", editable: true, cols: 4 },
        { label: "Pincode", name: "permanentPincode", editable: true, cols: 4 },
      ],
    },
    {
      title: "Bank Details",
      titleColor: "warning",
      fields: [
        { label: "Account Holder Name", name: "bankHolderName", editable: true, cols: 4 },
        { label: "Bank Name", name: "bankName", editable: true, cols: 4 },
        { label: "Account Number", name: "accountNumber", editable: true, cols: 4 },
        { label: "IFSC Code", name: "ifscCode", editable: true, cols: 4 },
        { label: "Branch Name", name: "branchName", editable: true, cols: 4 },
      ],
    },
    {
      title: "Body Details",
      titleColor: "secondary",
      fields: [
        { label: "Height (cm)", name: "heightCm", type: "number", editable: true, cols: 4 },
        { label: "Weight (kg)", name: "weightKg", type: "number", editable: true, cols: 4 },
        { label: "Blood Group", name: "bloodGroup", editable: true, cols: 4 },
        { label: "Eye Color", name: "eyeColor", editable: true, cols: 4 },
        { label: "Hair Color", name: "hairColor", editable: true, cols: 4 },
        { label: "Identification Mark 1", name: "identificationMark1", editable: true, cols: 6 },
        { label: "Identification Mark 2", name: "identificationMark2", editable: true, cols: 6 },
        { label: "Disability", name: "disability", type: "boolean", editable: true, cols: 4 },
        { label: "Disability Type", name: "disabilityType", editable: true, cols: 4 },
        { label: "Disability %", name: "disabilityPercentage", type: "number", editable: true, cols: 4 },
      ],
    },
    {
      title: "Emergency Contact",
      titleColor: "danger",
      fields: [
        { label: "Contact Name", name: "emergencyContactName", editable: true, cols: 4 },
        { label: "Relation", name: "emergencyRelation", editable: true, cols: 4 },
        { label: "Phone Number", name: "emergencyPhoneNumber", type: "tel", editable: true, cols: 4 },
        { label: "Address", name: "emergencyAddress", type: "textarea", rows: 2, editable: true, cols: 12 },
      ],
    },
    {
      title: "Father's Information",
      titleColor: "info",
      fields: [
        { label: "Father's Name", name: "fatherName", editable: true, cols: 4 },
        { label: "Contact Number", name: "fatherContactNumber", type: "tel", editable: true, cols: 4 },
        { label: "Occupation", name: "fatherOccupation", editable: true, cols: 4 },
        { label: "Email", name: "fatherEmail", type: "email", editable: true, cols: 4 },
        { label: "Annual Income", name: "fatherAnnualIncome", type: "number", editable: true, cols: 4 },
      ],
    },
    {
      title: "Mother's Information",
      titleColor: "info",
      fields: [
        { label: "Mother's Name", name: "motherName", editable: true, cols: 4 },
        { label: "Contact Number", name: "motherContactNumber", type: "tel", editable: true, cols: 4 },
        { label: "Occupation", name: "motherOccupation", editable: true, cols: 4 },
        { label: "Email", name: "motherEmail", type: "email", editable: true, cols: 4 },
        { label: "Annual Income", name: "motherAnnualIncome", type: "number", editable: true, cols: 4 },
      ],
    },
    {
      title: "Guardian Information",
      titleColor: "info",
      fields: [
        { label: "Guardian Name", name: "guardianName", editable: true, cols: 4 },
        { label: "Relation", name: "guardianRelation", editable: true, cols: 4 },
        { label: "Contact Number", name: "guardianContactNumber", type: "tel", editable: true, cols: 4 },
        { label: "Family Members", name: "numberOfFamilyMembers", type: "number", editable: true, cols: 4 },
        { label: "Family Type", name: "familyType", type: "select", options: [
          { value: "joint", label: "Joint" },
          { value: "nuclear", label: "Nuclear" },
          { value: "other", label: "Other" },
        ], editable: true, cols: 4 },
      ],
    },
    {
      title: "Identity Documents",
      titleColor: "dark",
      fields: [
        { label: "Aadhar Number", name: "aadharNumber", editable: false, cols: 4 },
        { label: "PAN Number", name: "panNumber", editable: false, cols: 4 },
        { label: "Voter ID", name: "voterId", editable: false, cols: 4 },
        { label: "Passport Number", name: "passportNumber", editable: false, cols: 4 },
        { label: "Driving License No", name: "drivingLicenseNo", editable: false, cols: 4 },
      ],
    },
  ];

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h4 className="mb-4">Student Details</h4>
      <DetailPage
        data={flattenedData}
        sections={sections}
        onUpdate={handleUpdate}
        editable={true}
      />
    </Container>
  );
};

export default StudentDetail;