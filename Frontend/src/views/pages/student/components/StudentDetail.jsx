import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert, Button } from 'react-bootstrap';
import DetailPage from '@/components/DetailPage';

const StudentDetail = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [sectionData, setSectionData] = useState({});

  const fetchstudentDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/student/studentAllDetails/${id}`);
      console.log("Fetched student detail:", res.data);
      setStudentData(res.data.jsonData);

      // Initialize section data
      const initialData = flattenData(res.data.jsonData);
      setSectionData(initialData);
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

  const flattenData = (data) => {
    if (!data) return {};

    return {
      // Primary Data
      studentProfilePic: data.studentPrimaryData?.studentProfilePic,
      studentFirstName: data.studentPrimaryData?.studentFirstName,
      studentLastName: data.studentPrimaryData?.studentLastName,
      studentEmail: data.studentPrimaryData?.studentEmail,
      studentMobileNo: data.studentPrimaryData?.studentMobileNo,
      studentJobType: data.studentPrimaryData?.studentJobType?.job_type_name,
      studentResumeFile: data.studentPrimaryData?.studentResumeFile,
      studentReferralCode: data.studentPrimaryData?.studentReferralCode,
      studentReferralByCode: data.studentPrimaryData?.studentReferralByCode,
      accountStatus: data.studentPrimaryData?.accountStatus,
      studentCreatedAt: data.studentPrimaryData?.studentCreatedAt,
      studentUpdatedAt: data.studentPrimaryData?.studentUpdatedAt,

      // Basic Data
      studentDOB: data.studentBasicData?.studentDOB,
      studentGender: data.studentBasicData?.studentGender,
      studentAlternateMobileNo: data.studentBasicData?.studentAlternateMobileNo,
      studentMaritalStatus: data.studentBasicData?.studentMaritalStatus,
      studentMotherTongue: data.studentBasicData?.studentMotherTongue,
      studentNationality: data.studentBasicData?.studentNationality,
      studentCitizenship: data.studentBasicData?.studentCitizenship,

      // Current Address
      currentAddressLine1: data.studentAddressData?.current?.addressLine1,
      currentAddressLine2: data.studentAddressData?.current?.addressLine2,
      currentCity: data.studentAddressData?.current?.city,
      currentState: data.studentAddressData?.current?.state,
      currentDistrict: data.studentAddressData?.current?.district,
      currentCountry: data.studentAddressData?.current?.country,
      currentPincode: data.studentAddressData?.current?.pincode,

      // Permanent Address
      permanentAddressLine1: data.studentAddressData?.permanent?.addressLine1,
      permanentAddressLine2: data.studentAddressData?.permanent?.addressLine2,
      permanentCity: data.studentAddressData?.permanent?.city,
      permanentState: data.studentAddressData?.permanent?.state,
      permanentDistrict: data.studentAddressData?.permanent?.district,
      permanentCountry: data.studentAddressData?.permanent?.country,
      permanentPincode: data.studentAddressData?.permanent?.pincode,
      isPermanentSameAsCurrent: data.studentAddressData?.isPermanentSameAsCurrent,

      // Bank Data
      bankHolderName: data.studentBankData?.bankHolderName,
      bankName: data.studentBankData?.bankName,
      accountNumber: data.studentBankData?.accountNumber,
      ifscCode: data.studentBankData?.ifscCode,
      branchName: data.studentBankData?.branchName,
      passbookUrl: data.studentBankData?.passbookUrl,

      // Body Details
      heightCm: data.studentBodyData?.heightCm,
      weightKg: data.studentBodyData?.weightKg,
      bloodGroup: data.studentBodyData?.bloodGroup,
      eyeColor: data.studentBodyData?.eyeColor,
      hairColor: data.studentBodyData?.hairColor,
      identificationMark1: data.studentBodyData?.identificationMark1,
      identificationMark2: data.studentBodyData?.identificationMark2,
      disability: data.studentBodyData?.disability,
      disabilityType: data.studentBodyData?.disabilityType,
      disabilityPercentage: data.studentBodyData?.disabilityPercentage,

      // Emergency Contact
      emergencyContactName: data.studentEmergencyContactData?.emergencyContactName,
      emergencyRelation: data.studentEmergencyContactData?.emergencyRelation,
      emergencyPhoneNumber: data.studentEmergencyContactData?.emergencyPhoneNumber,
      emergencyAddress: data.studentEmergencyContactData?.emergencyAddress,

      // Parental Info
      fatherName: data.studentParentalInfoData?.fatherName,
      fatherContactNumber: data.studentParentalInfoData?.fatherContactNumber,
      fatherOccupation: data.studentParentalInfoData?.fatherOccupation,
      fatherEmail: data.studentParentalInfoData?.fatherEmail,
      fatherAnnualIncome: data.studentParentalInfoData?.fatherAnnualIncome,
      motherName: data.studentParentalInfoData?.motherName,
      motherContactNumber: data.studentParentalInfoData?.motherContactNumber,
      motherOccupation: data.studentParentalInfoData?.motherOccupation,
      motherEmail: data.studentParentalInfoData?.motherEmail,
      motherAnnualIncome: data.studentParentalInfoData?.motherAnnualIncome,
      guardianName: data.studentParentalInfoData?.guardianName,
      guardianRelation: data.studentParentalInfoData?.guardianRelation,
      guardianContactNumber: data.studentParentalInfoData?.guardianContactNumber,
      numberOfFamilyMembers: data.studentParentalInfoData?.numberOfFamilyMembers,
      familyType: data.studentParentalInfoData?.familyType,

      // Documents
      aadharNumber: data.studentDocumentUploadData?.identityDocuments?.aadharNumber,
      panNumber: data.studentDocumentUploadData?.identityDocuments?.panNumber,
      voterId: data.studentDocumentUploadData?.identityDocuments?.voterId,
      passportNumber: data.studentDocumentUploadData?.identityDocuments?.passportNumber,
      drivingLicenseNo: data.studentDocumentUploadData?.identityDocuments?.drivingLicenseNo,

      // Career Preferences
      preferredJobCategory: data.studentCareerPreferencesData?.preferredJobCategory || [],
      preferredJobLocation: data.studentCareerPreferencesData?.preferredJobLocation || [],
      expectedSalaryMin: data.studentCareerPreferencesData?.expectedSalaryMin,
      expectedSalaryMax: data.studentCareerPreferencesData?.expectedSalaryMax,
      employmentType: data.studentCareerPreferencesData?.employmentType || [],
      willingToRelocate: data.studentCareerPreferencesData?.willingToRelocate,

      // Education Details
      highestQualification: data.studentEducationData?.highestQualification,
      tenthSchoolName: data.studentEducationData?.tenth?.schoolName,
      tenthBoard: data.studentEducationData?.tenth?.board,
      tenthPassingYear: data.studentEducationData?.tenth?.passingYear,
      tenthPercentage: data.studentEducationData?.tenth?.percentage,
      twelfthSchoolCollegeName: data.studentEducationData?.twelfth?.schoolCollegeName,
      twelfthBoard: data.studentEducationData?.twelfth?.board,
      twelfthStream: data.studentEducationData?.twelfth?.stream,
      twelfthPassingYear: data.studentEducationData?.twelfth?.passingYear,
      twelfthPercentage: data.studentEducationData?.twelfth?.percentage,
      graduationCollegeName: data.studentEducationData?.graduation?.collegeName,
      graduationCourseName: data.studentEducationData?.graduation?.courseName,
      graduationSpecialization: data.studentEducationData?.graduation?.specialization,
      graduationPassingYear: data.studentEducationData?.graduation?.passingYear,
      graduationPercentage: data.studentEducationData?.graduation?.percentage,
      postGraduationCollegeName: data.studentEducationData?.postGraduation?.collegeName,
      postGraduationCourseName: data.studentEducationData?.postGraduation?.courseName,
      postGraduationSpecialization: data.studentEducationData?.postGraduation?.specialization,
      postGraduationPassingYear: data.studentEducationData?.postGraduation?.passingYear,
      postGraduationPercentage: data.studentEducationData?.postGraduation?.percentage,

      // Skills
      hobbies: Array.isArray(data.studentSkillsData?.hobbies)
        ? data.studentSkillsData.hobbies.join(', ')
        : (data.studentSkillsData?.hobbies || ''),

      technicalSkills: Array.isArray(data.studentSkillsData?.technicalSkills)
        ? data.studentSkillsData.technicalSkills.join(', ')
        : (data.studentSkillsData?.technicalSkills || ''),

      softSkills: Array.isArray(data.studentSkillsData?.softSkills)
        ? data.studentSkillsData.softSkills.join(', ')
        : (data.studentSkillsData?.softSkills || ''),

      computerKnowledge: Array.isArray(data.studentSkillsData?.computerKnowledge)
        ? data.studentSkillsData.computerKnowledge.join(', ')
        : (data.studentSkillsData?.computerKnowledge || ''),

      // Social Links
      linkedInUrl: data.studentSocialLinksData?.linkedInUrl,
      githubUrl: data.studentSocialLinksData?.githubUrl,
      portfolioUrl: data.studentSocialLinksData?.portfolioUrl,
      facebookUrl: data.studentSocialLinksData?.facebookUrl,
      instagramUrl: data.studentSocialLinksData?.instagramUrl,

      // Work Experience
      totalExperienceMonths: data.studentWorkExperienceData?.totalExperienceMonths,
    };
  };

  const handleUpdate = async (field, value) => {
    console.log("Updating field:", field, "with value:", value);
    setSectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveBasicDetails = async () => {
    try {
      const payload = {
        studentDOB: sectionData.studentDOB,
        studentGender: sectionData.studentGender,
        studentAlternateMobileNo: sectionData.studentAlternateMobileNo,
        studentMaritalStatus: sectionData.studentMaritalStatus,
        studentMotherTongue: sectionData.studentMotherTongue,
        studentNationality: sectionData.studentNationality,
        studentCitizenship: sectionData.studentCitizenship,
      };

      const res = await axios.put(`/student/updateStudentBasicDetails/${id}`, payload);
      setMessage({ text: 'Basic details updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating basic details:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating basic details', variant: 'danger' });
    }
  };

  const saveAddressDetails = async () => {
    try {
      const payload = {
        current: {
          addressLine1: sectionData.currentAddressLine1,
          addressLine2: sectionData.currentAddressLine2,
          city: sectionData.currentCity,
          district: sectionData.currentDistrict,
          state: sectionData.currentState,
          country: sectionData.currentCountry,
          pincode: sectionData.currentPincode,
        },
        permanent: {
          addressLine1: sectionData.permanentAddressLine1,
          addressLine2: sectionData.permanentAddressLine2,
          city: sectionData.permanentCity,
          district: sectionData.permanentDistrict,
          state: sectionData.permanentState,
          country: sectionData.permanentCountry,
          pincode: sectionData.permanentPincode,
        },
        isPermanentSameAsCurrent: sectionData.isPermanentSameAsCurrent,
      };

      const res = await axios.put(`/student/updateStudentAddress/${id}`, payload);
      setMessage({ text: 'Address details updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating address:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating address', variant: 'danger' });
    }
  };

  const saveBankDetails = async () => {
    try {
      const payload = {
        bankHolderName: sectionData.bankHolderName,
        bankName: sectionData.bankName,
        accountNumber: sectionData.accountNumber,
        ifscCode: sectionData.ifscCode,
        branchName: sectionData.branchName,
      };

      const res = await axios.put(`/student/updateStudentBankDetails/${id}`, payload);
      setMessage({ text: 'Bank details updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating bank details:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating bank details', variant: 'danger' });
    }
  };

  const saveBodyDetails = async () => {
    try {
      const payload = {
        heightCm: sectionData.heightCm,
        weightKg: sectionData.weightKg,
        bloodGroup: sectionData.bloodGroup,
        eyeColor: sectionData.eyeColor,
        hairColor: sectionData.hairColor,
        identificationMark1: sectionData.identificationMark1,
        identificationMark2: sectionData.identificationMark2,
        disability: sectionData.disability,
        disabilityType: sectionData.disabilityType,
        disabilityPercentage: sectionData.disabilityPercentage,
      };

      const res = await axios.put(`/student/updateStudentBodyDetails/${id}`, payload);
      setMessage({ text: 'Body details updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating body details:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating body details', variant: 'danger' });
    }
  };

  const saveEmergencyContact = async () => {
    try {
      const payload = {
        emergencyContactName: sectionData.emergencyContactName,
        emergencyRelation: sectionData.emergencyRelation,
        emergencyPhoneNumber: sectionData.emergencyPhoneNumber,
        emergencyAddress: sectionData.emergencyAddress,
      };

      const res = await axios.put(`/student/updateStudentEmergencyContact/${id}`, payload);
      setMessage({ text: 'Emergency contact updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating emergency contact:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating emergency contact', variant: 'danger' });
    }
  };

  const saveParentalInfo = async () => {
    try {
      const payload = {
        fatherName: sectionData.fatherName,
        fatherContactNumber: sectionData.fatherContactNumber,
        fatherOccupation: sectionData.fatherOccupation,
        fatherEmail: sectionData.fatherEmail,
        fatherAnnualIncome: sectionData.fatherAnnualIncome,
        motherName: sectionData.motherName,
        motherContactNumber: sectionData.motherContactNumber,
        motherOccupation: sectionData.motherOccupation,
        motherEmail: sectionData.motherEmail,
        motherAnnualIncome: sectionData.motherAnnualIncome,
        guardianName: sectionData.guardianName,
        guardianRelation: sectionData.guardianRelation,
        guardianContactNumber: sectionData.guardianContactNumber,
        numberOfFamilyMembers: sectionData.numberOfFamilyMembers,
        familyType: sectionData.familyType,
      };

      const res = await axios.put(`/student/updateStudentParentalInfo/${id}`, payload);
      setMessage({ text: 'Parental information updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating parental info:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating parental information', variant: 'danger' });
    }
  };

  const saveCareerPreferences = async () => {
    try {
      const payload = {
        preferredJobCategory: sectionData.preferredJobCategory?.split(',').map(s => s.trim()).filter(Boolean) || [],
        preferredJobLocation: sectionData.preferredJobLocation?.split(',').map(s => s.trim()).filter(Boolean) || [],
        expectedSalaryMin: sectionData.expectedSalaryMin,
        expectedSalaryMax: sectionData.expectedSalaryMax,
        employmentType: sectionData.employmentType?.split(',').map(s => s.trim()).filter(Boolean) || [],
        willingToRelocate: sectionData.willingToRelocate,
      };

      await axios.put(`/student/updateStudentCareerPreferences/${id}`, payload);
      setMessage({ text: 'Career preferences updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating career preferences:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating career preferences', variant: 'danger' });
    }
  };


  const saveEducationDetails = async () => {
    try {
      const payload = {
        highestQualification: sectionData.highestQualification,
        tenth: {
          schoolName: sectionData.tenthSchoolName,
          board: sectionData.tenthBoard,
          passingYear: sectionData.tenthPassingYear,
          percentage: sectionData.tenthPercentage,
        },
        twelfth: {
          schoolCollegeName: sectionData.twelfthSchoolCollegeName,
          board: sectionData.twelfthBoard,
          stream: sectionData.twelfthStream,
          passingYear: sectionData.twelfthPassingYear,
          percentage: sectionData.twelfthPercentage,
        },
        graduation: {
          collegeName: sectionData.graduationCollegeName,
          courseName: sectionData.graduationCourseName,
          specialization: sectionData.graduationSpecialization,
          passingYear: sectionData.graduationPassingYear,
          percentage: sectionData.graduationPercentage,
        },
        postGraduation: {
          collegeName: sectionData.postGraduationCollegeName,
          courseName: sectionData.postGraduationCourseName,
          specialization: sectionData.postGraduationSpecialization,
          passingYear: sectionData.postGraduationPassingYear,
          percentage: sectionData.postGraduationPercentage,
        },
      };

      await axios.put(`/student/updateStudentEducationDetails/${id}`, payload);
      setMessage({ text: 'Education details updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating education details:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating education details', variant: 'danger' });
    }
  };

  const saveSkills = async () => {
    try {
      const payload = {
        hobbies: sectionData.hobbies?.split(',').map(s => s.trim()).filter(Boolean) || [],
        technicalSkills: sectionData.technicalSkills?.split(',').map(s => s.trim()).filter(Boolean) || [],
        softSkills: sectionData.softSkills?.split(',').map(s => s.trim()).filter(Boolean) || [],
        computerKnowledge: sectionData.computerKnowledge?.split(',').map(s => s.trim()).filter(Boolean) || [],
      };

      await axios.put(`/student/updateStudentSkills/${id}`, payload);
      setMessage({ text: 'Skills updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating skills:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating skills', variant: 'danger' });
    }
  };

  const saveSocialLinks = async () => {
    try {
      const payload = {
        linkedInUrl: sectionData.linkedInUrl,
        githubUrl: sectionData.githubUrl,
        portfolioUrl: sectionData.portfolioUrl,
        facebookUrl: sectionData.facebookUrl,
        instagramUrl: sectionData.instagramUrl,
      };

      await axios.put(`/student/updateStudentSocialLinks/${id}`, payload);
      setMessage({ text: 'Social links updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating social links:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating social links', variant: 'danger' });
    }
  };

  // ...existing code...

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
        {
          label: "Account Status", name: "accountStatus", type: "select", options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "blocked", label: "Blocked" },
          ], editable: true, cols: 4
        },
        { label: "Referral Code", name: "studentReferralCode", editable: false, cols: 4 },
        { label: "Referred By Code", name: "studentReferralByCode", editable: false, cols: 4 },
        { label: "Created At", name: "studentCreatedAt", type: "date", editable: false, cols: 4 },
      ],
      saveButton: null,
    },
    {
      title: "Basic Details",
      titleColor: "info",
      fields: [
        { label: "Date of Birth", name: "studentDOB", type: "date", editable: true, cols: 4 },
        {
          label: "Gender", name: "studentGender", type: "select", options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
            { value: "prefer_not_to_say", label: "Prefer Not to Say" },
          ], editable: true, cols: 4
        },
        { label: "Alternate Mobile", name: "studentAlternateMobileNo", type: "tel", editable: true, cols: 4 },
        {
          label: "Marital Status", name: "studentMaritalStatus", type: "select", options: [
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
            { value: "other", label: "Other" },
            { value: "prefer_not_to_say", label: "Prefer Not to Say" },
          ], editable: true, cols: 4
        },
        { label: "Mother Tongue", name: "studentMotherTongue", editable: true, cols: 4 },
        { label: "Nationality", name: "studentNationality", editable: true, cols: 4 },
        { label: "Citizenship", name: "studentCitizenship", editable: true, cols: 4 },
      ],
      saveButton: saveBasicDetails,
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
      saveButton: null,
    },
    {
      title: "Permanent Address",
      titleColor: "success",
      show: !sectionData.isPermanentSameAsCurrent,
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
      saveButton: saveAddressDetails,
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
      saveButton: saveBankDetails,
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
      saveButton: saveBodyDetails,
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
      saveButton: saveEmergencyContact,
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
      saveButton: null,
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
      saveButton: null,
    },
    {
      title: "Guardian Information",
      titleColor: "info",
      fields: [
        { label: "Guardian Name", name: "guardianName", editable: true, cols: 4 },
        { label: "Relation", name: "guardianRelation", editable: true, cols: 4 },
        { label: "Contact Number", name: "guardianContactNumber", type: "tel", editable: true, cols: 4 },
        { label: "Family Members", name: "numberOfFamilyMembers", type: "number", editable: true, cols: 4 },
        {
          label: "Family Type", name: "familyType", type: "select", options: [
            { value: "joint", label: "Joint" },
            { value: "nuclear", label: "Nuclear" },
            { value: "other", label: "Other" },
          ], editable: true, cols: 4
        },
      ],
      saveButton: saveParentalInfo,
    },
    {
      title: "Career Preferences",
      titleColor: "primary",
      fields: [
        { label: "Preferred Job Category (comma separated)", name: "preferredJobCategory", type: "textarea", rows: 2, editable: true, cols: 6 },
        { label: "Preferred Job Location (comma separated)", name: "preferredJobLocation", type: "textarea", rows: 2, editable: true, cols: 6 },
        { label: "Expected Salary Min", name: "expectedSalaryMin", type: "number", editable: true, cols: 4 },
        { label: "Expected Salary Max", name: "expectedSalaryMax", type: "number", editable: true, cols: 4 },
        { label: "Employment Type (comma separated)", name: "employmentType", type: "textarea", rows: 2, editable: true, cols: 6 },
        { label: "Willing to Relocate", name: "willingToRelocate", type: "boolean", editable: true, cols: 4 },
      ],
      saveButton: saveCareerPreferences,
    },
    {
      title: "Education Details",
      titleColor: "info",
      fields: [
        {
          label: "Highest Qualification", name: "highestQualification", type: "select", options: [
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
          ], editable: true, cols: 12
        },
        // 10th Standard
        { label: "10th Standard", type: "divider", cols: 12 },
        { label: "School Name", name: "tenthSchoolName", editable: true, cols: 6 },
        { label: "Board", name: "tenthBoard", editable: true, cols: 6 },
        { label: "Passing Year", name: "tenthPassingYear", type: "number", editable: true, cols: 6 },
        { label: "Percentage", name: "tenthPercentage", type: "number", editable: true, cols: 6 },

        // 12th Standard
        { label: "12th Standard", type: "divider", cols: 12 },
        { label: "School/College Name", name: "twelfthSchoolCollegeName", editable: true, cols: 6 },
        { label: "Board", name: "twelfthBoard", editable: true, cols: 6 },
        { label: "Stream", name: "twelfthStream", editable: true, cols: 4 },
        { label: "Passing Year", name: "twelfthPassingYear", type: "number", editable: true, cols: 4 },
        { label: "Percentage", name: "twelfthPercentage", type: "number", editable: true, cols: 4 },

        // Graduation
        { label: "Graduation", type: "divider", cols: 12 },
        { label: "College Name", name: "graduationCollegeName", editable: true, cols: 6 },
        { label: "Course Name", name: "graduationCourseName", editable: true, cols: 6 },
        { label: "Specialization", name: "graduationSpecialization", editable: true, cols: 4 },
        { label: "Passing Year", name: "graduationPassingYear", type: "number", editable: true, cols: 4 },
        { label: "Percentage", name: "graduationPercentage", type: "number", editable: true, cols: 4 },

        // Post Graduation
        { label: "Post Graduation", type: "divider", cols: 12 },
        { label: "College Name", name: "postGraduationCollegeName", editable: true, cols: 6 },
        { label: "Course Name", name: "postGraduationCourseName", editable: true, cols: 6 },
        { label: "Specialization", name: "postGraduationSpecialization", editable: true, cols: 4 },
        { label: "Passing Year", name: "postGraduationPassingYear", type: "number", editable: true, cols: 4 },
        { label: "Percentage", name: "postGraduationPercentage", type: "number", editable: true, cols: 4 },
      ],
      saveButton: saveEducationDetails,
    },
    {
      title: "Skills & Knowledge",
      titleColor: "success",
      fields: [
        { label: "Hobbies (comma separated)", name: "hobbies", type: "textarea", rows: 2, editable: true, cols: 12 },
        { label: "Technical Skills (comma separated)", name: "technicalSkills", type: "textarea", rows: 2, editable: true, cols: 12 },
        { label: "Soft Skills (comma separated)", name: "softSkills", type: "textarea", rows: 2, editable: true, cols: 12 },
        { label: "Computer Knowledge (comma separated)", name: "computerKnowledge", type: "textarea", rows: 2, editable: true, cols: 12 },
      ],
      saveButton: saveSkills,
    },
    {
      title: "Social Media Links",
      titleColor: "primary",
      fields: [
        { label: "LinkedIn URL", name: "linkedInUrl", type: "url", editable: true, cols: 6 },
        { label: "GitHub URL", name: "githubUrl", type: "url", editable: true, cols: 6 },
        { label: "Portfolio URL", name: "portfolioUrl", type: "url", editable: true, cols: 6 },
        { label: "Facebook URL", name: "facebookUrl", type: "url", editable: true, cols: 6 },
        { label: "Instagram URL", name: "instagramUrl", type: "url", editable: true, cols: 6 },
      ],
      saveButton: saveSocialLinks,
    },
    {
      title: "Work Experience",
      titleColor: "warning",
      fields: [
        { label: "Total Experience (Months)", name: "totalExperienceMonths", type: "number", editable: true, cols: 4 },
      ],
      saveButton: null,
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
      saveButton: null,
    },
  ];

  // ...existing code...

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

      {message.text && (
        <Alert
          variant={message.variant}
          onClose={() => setMessage({ text: '', variant: '' })}
          dismissible
        >
          {message.text}
        </Alert>
      )}

      <DetailPage
        data={sectionData}
        sections={sections}
        onUpdate={handleUpdate}
        editable={true}
      />
    </Container>
  );
};

export default StudentDetail;