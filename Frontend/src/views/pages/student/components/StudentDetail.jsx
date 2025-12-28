import axios from '@/api/axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Card, CardBody, ProgressBar, Row, Col } from 'react-bootstrap';
import DetailPage from '@/components/DetailPage';
import { TbUser, TbMapPin, TbBuildingBank, TbHeart, TbUsers, TbSchool, TbBriefcase, TbCertificate, TbFileText, TbLink, TbSettings } from 'react-icons/tb';

const StudentDetail = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: '', variant: '' });
  const [sectionData, setSectionData] = useState({});
  const [uploadFiles, setUploadFiles] = useState({}); // For file uploads
  const [certificates, setCertificates] = useState([]); // Store all certificates
  const [editingCertificateIndex, setEditingCertificateIndex] = useState(null); // Track which certificate is being edited
  const [profileCompletion, setProfileCompletion] = useState({
    data: {},
    percentage: 0
  });

  const fetchstudentDetail = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/student/studentAllDetails/${id}`);
      console.log("Fetched student detail:", res.data);
      setStudentData(res.data.jsonData);

      // Initialize section data
      const initialData = flattenData(res.data.jsonData);
      setSectionData(initialData);

      // Set profile completion data
      if (res.data.jsonData?.studentPrimaryData?.profileCompletion) {
        const completionData = res.data.jsonData.studentPrimaryData.profileCompletion;
        const totalSections = Object.keys(completionData).length;
        const completedSections = Object.values(completionData).filter(value => value === 1).length;
        const percentage = totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
        
        setProfileCompletion({
          data: completionData,
          percentage: percentage
        });
      }
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

    // Handle array data by getting first element
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

    // Filter out null values from certificates array
    const validCertificates = (certificatesData?.certificates || []).filter(cert => cert !== null);
    setCertificates(validCertificates);

    // Get the first experience if exists (for single experience display)
    const firstExperience = workExperienceData?.experiences?.[0] || {};

    // Get the first valid certificate if exists
    const firstCertificate = validCertificates[0] || {};

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
      studentDOB: basicData?.studentDOB,
      studentGender: basicData?.studentGender,
      studentAlternateMobileNo: basicData?.studentAlternateMobileNo,
      studentMaritalStatus: basicData?.studentMaritalStatus,
      studentMotherTongue: basicData?.studentMotherTongue,
      studentNationality: basicData?.studentNationality,
      studentCitizenship: basicData?.studentCitizenship,

      // Current Address
      currentAddressLine1: addressData?.current?.addressLine1,
      currentAddressLine2: addressData?.current?.addressLine2,
      currentCity: addressData?.current?.city,
      currentState: addressData?.current?.state,
      currentDistrict: addressData?.current?.district,
      currentCountry: addressData?.current?.country,
      currentPincode: addressData?.current?.pincode,

      // Permanent Address
      permanentAddressLine1: addressData?.permanent?.addressLine1,
      permanentAddressLine2: addressData?.permanent?.addressLine2,
      permanentCity: addressData?.permanent?.city,
      permanentState: addressData?.permanent?.state,
      permanentDistrict: addressData?.permanent?.district,
      permanentCountry: addressData?.permanent?.country,
      permanentPincode: addressData?.permanent?.pincode,
      isPermanentSameAsCurrent: addressData?.isPermanentSameAsCurrent,

      // Bank Data
      bankHolderName: bankData?.bankHolderName,
      bankName: bankData?.bankName,
      accountNumber: bankData?.accountNumber,
      ifscCode: bankData?.ifscCode,
      branchName: bankData?.branchName,
      passbookUrl: bankData?.passbookUrl,

      // Body Details
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

      // Emergency Contact
      emergencyContactName: emergencyData?.emergencyContactName,
      emergencyRelation: emergencyData?.emergencyRelation,
      emergencyPhoneNumber: emergencyData?.emergencyPhoneNumber,
      emergencyAddress: emergencyData?.emergencyAddress,

      // Parental Info
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

      // Documents - Identity Documents (already in existing section)
      aadharNumber: documentData?.identityDocuments?.aadharNumber,
      panNumber: documentData?.identityDocuments?.panNumber,
      voterId: documentData?.identityDocuments?.voterId,
      passportNumber: documentData?.identityDocuments?.passportNumber,
      drivingLicenseNo: documentData?.identityDocuments?.drivingLicenseNo,

      // Documents - Identity Document Files
      aadharFrontImg: documentData?.identityDocuments?.aadharFrontImg,
      aadharBackImg: documentData?.identityDocuments?.aadharBackImg,
      panImg: documentData?.identityDocuments?.panImg,
      drivingLicenseFrontImg: documentData?.identityDocuments?.drivingLicenseFrontImg,
      categoryCertificateImg: documentData?.identityDocuments?.categoryCertificateImg,
      domicileCertificateImg: documentData?.identityDocuments?.domicileCertificateImg,
      incomeCertificateImg: documentData?.identityDocuments?.incomeCertificateImg,
      birthCertificateImg: documentData?.identityDocuments?.birthCertificateImg,

      // Other Documents
      otherDocumentName: documentData?.otherDocuments?.[0]?.documentName || '',
      otherDocumentFile: documentData?.otherDocuments?.[0]?.documentFile || '',

      // Career Preferences
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

      // Education Details
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
      hobbies: Array.isArray(skillsData?.hobbies)
        ? skillsData.hobbies.join(', ')
        : (skillsData?.hobbies || ''),

      technicalSkills: Array.isArray(skillsData?.technicalSkills)
        ? skillsData.technicalSkills.join(', ')
        : (skillsData?.technicalSkills || ''),

      softSkills: Array.isArray(skillsData?.softSkills)
        ? skillsData.softSkills.join(', ')
        : (skillsData?.softSkills || ''),

      computerKnowledge: Array.isArray(skillsData?.computerKnowledge)
        ? skillsData.computerKnowledge.join(', ')
        : (skillsData?.computerKnowledge || ''),

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
      certificateFile: firstCertificate.certificateFile || '',
    };
  };

  const handleUpdate = async (field, value) => {
    console.log("Updating field:", field, "with value:", value);

    // Handle file uploads
    if (value instanceof File) {
      setUploadFiles(prev => ({
        ...prev,
        [field]: value
      }));
      // Update field with file name for display
      setSectionData(prev => ({
        ...prev,
        [field]: value.name
      }));
      return;
    }

    // Handle isPermanentSameAsCurrent checkbox
    if (field === "isPermanentSameAsCurrent") {
      if (value === true) {
        // Copy current address to permanent address
        setSectionData(prev => ({
          ...prev,
          [field]: value,
          permanentAddressLine1: prev.currentAddressLine1,
          permanentAddressLine2: prev.currentAddressLine2,
          permanentCity: prev.currentCity,
          permanentDistrict: prev.currentDistrict,
          permanentState: prev.currentState,
          permanentCountry: prev.currentCountry,
          permanentPincode: prev.currentPincode,
        }));
      } else {
        // Clear all permanent address fields when unchecked
        setSectionData(prev => ({
          ...prev,
          [field]: value,
          permanentAddressLine1: "",
          permanentAddressLine2: "",
          permanentCity: "",
          permanentDistrict: "",
          permanentState: "",
          permanentCountry: "",
          permanentPincode: "",
        }));
      }
      return;
    }

    // For other fields, update normally
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

      await axios.put(`/student/updateStudentBasicDetails/${id}`, payload);
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

      await axios.put(`/student/updateStudentAddress/${id}`, payload);
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

      await axios.put(`/student/updateStudentBankDetails/${id}`, payload);
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

      await axios.put(`/student/updateStudentBodyDetails/${id}`, payload);
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

      await axios.put(`/student/updateStudentEmergencyContact/${id}`, payload);
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

      await axios.put(`/student/updateStudentParentalInfo/${id}`, payload);
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
        expectedSalaryMin: Number(sectionData.expectedSalaryMin) || 0,
        expectedSalaryMax: Number(sectionData.expectedSalaryMax) || 0,
        employmentType: sectionData.employmentType?.split(',').map(s => s.trim()).filter(Boolean) || [],
        willingToRelocate: Boolean(sectionData.willingToRelocate),
      };

      console.log('Career Preferences Payload:', payload);

      await axios.put(`/student/updateStudentCareerPreferences/${id}`, payload);
      setMessage({ text: 'Career preferences updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating career preferences:", error);
      console.error("Error response:", error.response?.data);
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


  const saveWorkExperience = async () => {
    try {
      const payload = {
        experiences: [
          {
            companyName: sectionData.companyName,
            jobTitle: sectionData.jobTitle,
            jobType: sectionData.jobType,
            experienceDurationMonths: parseInt(sectionData.experienceDurationMonths) || 0,
            startDate: sectionData.experienceStartDate,
            endDate: sectionData.experienceEndDate,
            responsibilities: sectionData.responsibilities,
          }
        ]
      };

      await axios.put(`/student/updateStudentWorkExperience/${id}`, payload);
      setMessage({ text: 'Work experience updated successfully!', variant: 'success' });
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating work experience:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating work experience', variant: 'danger' });
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
      certificateFile: '',
    }));
    setEditingCertificateIndex(null);
    setUploadFiles(prev => ({ ...prev, certificateFile: null }));
    setMessage({ text: 'Fill in new certificate details and click Save', variant: 'info' });
  };
  
  // Edit existing certificate
  const editCertificate = (index) => {
    const cert = certificates[index];
    console.log("Editing certificate:", cert); // Debug log
    setSectionData(prev => ({
      ...prev,
      certificationName: cert.certificationName || '',
      issuingOrganization: cert.issuingOrganization || '',
      issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '', // Format date properly
      expirationDate: cert.expirationDate ? cert.expirationDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      certificateUrl: cert.certificateUrl || '',
      certificateFile: cert.certificateFile || '',
    }));
    setEditingCertificateIndex(index);
    setMessage({ text: `Editing certificate: ${cert.certificationName}`, variant: 'info' });
  };

  const saveCertificates = async () => {
    try {
      // Validate required fields
      if (!sectionData.certificationName || !sectionData.issuingOrganization || !sectionData.issueDate) {
        setMessage({ text: 'Please fill in Certification Name, Issuing Organization, and Issue Date', variant: 'warning' });
        return;
      }

      // Prepare certificate data
      const certificateData = {
        certificationName: sectionData.certificationName,
        issuingOrganization: sectionData.issuingOrganization,
        issueDate: sectionData.issueDate,
        expirationDate: sectionData.expirationDate || null,
        credentialId: sectionData.credentialId || null,
        certificateUrl: sectionData.certificateUrl || null,
      };

      // If editing existing certificate, include the certificate ID
      if (editingCertificateIndex !== null) {
        const existingCert = certificates[editingCertificateIndex];
        console.log("Existing certificate being edited:", existingCert); // Debug log
        
        if (existingCert && existingCert._id) {
          certificateData.certificateId = existingCert._id.toString();
          console.log("Certificate ID being sent:", certificateData.certificateId); // Debug log
        }
      }

      console.log("Saving certificate data:", certificateData); // Debug log

      await axios.put(`/student/updateStudentCertificates/${id}`, certificateData);

      setMessage({ text: 'Certificate saved successfully!', variant: 'success' });
      setUploadFiles(prev => ({ ...prev, certificateFile: null }));
      setEditingCertificateIndex(null);
      
      // Clear form after save
      setSectionData(prev => ({
        ...prev,
        certificationName: '',
        issuingOrganization: '',
        issueDate: '',
        expirationDate: '',
        credentialId: '',
        certificateUrl: '',
        certificateFile: '',
      }));

      
      
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error saving certificate:", error);
      console.error("Error response:", error.response?.data); // Debug log
      setMessage({ text: error.response?.data?.message || 'Error saving certificate', variant: 'danger' });
    }
  };

  const saveDocumentUploads = async () => {
    try {
      const formData = new FormData();

      // Add identity document numbers
      const identityDocuments = {
        aadharNumber: sectionData.aadharNumber || null,
        panNumber: sectionData.panNumber || null,
        voterId: sectionData.voterId || null,
        passportNumber: sectionData.passportNumber || null,
        drivingLicenseNo: sectionData.drivingLicenseNo || null,
      };

      formData.append('identityDocuments', JSON.stringify(identityDocuments));

      // Add other document if provided
      if (sectionData.otherDocumentName) {
        const otherDocuments = [{
          documentName: sectionData.otherDocumentName,
        }];
        formData.append('otherDocuments', JSON.stringify(otherDocuments));
      }

      // Add all uploaded files
      const fileFields = [
        'aadharFrontImg',
        'aadharBackImg',
        'panImg',
        'drivingLicenseFrontImg',
        'categoryCertificateImg',
        'domicileCertificateImg',
        'incomeCertificateImg',
        'birthCertificateImg',
        'otherDocumentFile'
      ];

      fileFields.forEach(field => {
        if (uploadFiles[field]) {
          formData.append(field, uploadFiles[field]);
        }
      });

      await axios.put(`/student/updateStudentDocumentUpload/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setMessage({ text: 'Documents updated successfully!', variant: 'success' });
      // Clear uploaded files
      setUploadFiles({});
      await fetchstudentDetail();
    } catch (error) {
      console.error("Error updating documents:", error);
      setMessage({ text: error.response?.data?.message || 'Error updating documents', variant: 'danger' });
    }
  };

  // Profile completion section items with icons
  const completionSections = [
    { key: 'studentBasicData', label: 'Basic Info', icon: TbUser },
    { key: 'studentAddressData', label: 'Address', icon: TbMapPin },
    { key: 'studentBankData', label: 'Bank', icon: TbBuildingBank },
    { key: 'studentBodyData', label: 'Body Details', icon: TbHeart },
    { key: 'studentEmergencyData', label: 'Emergency', icon: TbUsers },
    { key: 'studentParentData', label: 'Parents', icon: TbUsers },
    { key: 'studentEducationData', label: 'Education', icon: TbSchool },
    { key: 'studentSkillsData', label: 'Skills', icon: TbSettings },
    { key: 'studentWorkExperienceData', label: 'Experience', icon: TbBriefcase },
    { key: 'studentCertificationsData', label: 'Certificates', icon: TbCertificate },
    { key: 'studentDocumentsData', label: 'Documents', icon: TbFileText },
    { key: 'studentPreferencesData', label: 'Preferences', icon: TbSettings },
    { key: 'studentSocialData', label: 'Social Links', icon: TbLink },
    { key: 'studentResume', label: 'Resume', icon: TbFileText },
  ];

  const getProgressVariant = (percentage) => {
    if (percentage < 30) return 'danger';
    if (percentage < 60) return 'warning';
    if (percentage < 90) return 'info';
    return 'success';
  };

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
        { label: "Date of Birth", name: "studentDOB", type: "date", editable: true, cols: 3 },
        {
          label: "Gender", name: "studentGender", type: "select", options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
            { value: "prefer_not_to_say", label: "Prefer Not to Say" },
          ], editable: true, cols: 3
        },
        { label: "Alternate Mobile", name: "studentAlternateMobileNo", type: "tel", editable: true, cols: 3 },
        {
          label: "Marital Status", name: "studentMaritalStatus", type: "select", options: [
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
            { value: "other", label: "Other" },
            { value: "prefer_not_to_say", label: "Prefer Not to Say" },
          ], editable: true, cols: 3
        },
        { label: "Mother Tongue", name: "studentMotherTongue", editable: true, cols: 3 },
        { label: "Nationality", name: "studentNationality", editable: true, cols: 3 },
        { label: "Citizenship", name: "studentCitizenship", editable: true, cols: 3 },
      ],
      saveButton: saveBasicDetails,
    },
    {
      title: "Address",
      titleColor: "success",
      fields: [
        { label: "Current Address", type: "divider", cols: 12 },
        { label: "Address Line 1", name: "currentAddressLine1", editable: true, cols: 6 },
        { label: "Address Line 2", name: "currentAddressLine2", editable: true, cols: 6 },
        { label: "City", name: "currentCity", editable: true, cols: 2 },
        { label: "District", name: "currentDistrict", editable: true, cols: 2 },
        { label: "State", name: "currentState", editable: true, cols: 2 },
        { label: "Country", name: "currentCountry", editable: true, cols: 2 },
        { label: "Pincode", name: "currentPincode", editable: true, cols: 2 },

        { label: "Permanent Address", type: "divider", cols: 12 },
        { label: "Same as Current", name: "isPermanentSameAsCurrent", type: "checkbox", editable: true, cols: 12 },
        { label: "Address Line 1", name: "permanentAddressLine1", editable: true, cols: 6 },
        { label: "Address Line 2", name: "permanentAddressLine2", editable: true, cols: 6 },
        { label: "City", name: "permanentCity", editable: true, cols: 2 },
        { label: "District", name: "permanentDistrict", editable: true, cols: 2 },
        { label: "State", name: "permanentState", editable: true, cols: 2 },
        { label: "Country", name: "permanentCountry", editable: true, cols: 2 },
        { label: "Pincode", name: "permanentPincode", editable: true, cols: 2 },
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
        { label: "Height (cm)", name: "heightCm", type: "number", editable: true, cols: 2 },
        { label: "Weight (kg)", name: "weightKg", type: "number", editable: true, cols: 2 },
        { label: "Blood Group", name: "bloodGroup", editable: true, cols: 2 },
        { label: "Eye Color", name: "eyeColor", editable: true, cols: 2 },
        { label: "Hair Color", name: "hairColor", editable: true, cols: 2 },
        { label: "Identification Mark 1", name: "identificationMark1", editable: true, cols: 6 },
        { label: "Identification Mark 2", name: "identificationMark2", editable: true, cols: 6 },
        { label: "Disability", name: "disability", type: "checkbox", editable: true, cols: 4 },
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
      title: "Parental Information",
      titleColor: "info",
      fields: [
        { label: "Father's Information", type: "divider", cols: 12 },
        { label: "Father's Name", name: "fatherName", editable: true, cols: 4 },
        { label: "Contact Number", name: "fatherContactNumber", type: "tel", editable: true, cols: 4 },
        { label: "Occupation", name: "fatherOccupation", editable: true, cols: 4 },
        { label: "Email", name: "fatherEmail", type: "email", editable: true, cols: 4 },
        { label: "Annual Income", name: "fatherAnnualIncome", type: "number", editable: true, cols: 4 },

        { label: "Mother's Information", type: "divider", cols: 12 },
        { label: "Mother's Name", name: "motherName", editable: true, cols: 4 },
        { label: "Contact Number", name: "motherContactNumber", type: "tel", editable: true, cols: 4 },
        { label: "Occupation", name: "motherOccupation", editable: true, cols: 4 },
        { label: "Email", name: "motherEmail", type: "email", editable: true, cols: 4 },
        { label: "Annual Income", name: "motherAnnualIncome", type: "number", editable: true, cols: 4 },

        { label: "Guardian's Information", type: "divider", cols: 12 },
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
        { label: "Willing to Relocate", name: "willingToRelocate", type: "checkbox", editable: true, cols: 4 },
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
        { label: "10th Standard", type: "divider", cols: 12 },
        { label: "School Name", name: "tenthSchoolName", editable: true, cols: 6 },
        { label: "Board", name: "tenthBoard", editable: true, cols: 6 },
        { label: "Passing Year", name: "tenthPassingYear", type: "number", editable: true, cols: 6 },
        { label: "Percentage", name: "tenthPercentage", type: "number", editable: true, cols: 6 },

        { label: "12th Standard", type: "divider", cols: 12 },
        { label: "School/College Name", name: "twelfthSchoolCollegeName", editable: true, cols: 6 },
        { label: "Board", name: "twelfthBoard", editable: true, cols: 6 },
        { label: "Stream", name: "twelfthStream", editable: true, cols: 4 },
        { label: "Passing Year", name: "twelfthPassingYear", type: "number", editable: true, cols: 4 },
        { label: "Percentage", name: "twelfthPercentage", type: "number", editable: true, cols: 4 },

        { label: "Graduation", type: "divider", cols: 12 },
        { label: "College Name", name: "graduationCollegeName", editable: true, cols: 6 },
        { label: "Course Name", name: "graduationCourseName", editable: true, cols: 6 },
        { label: "Specialization", name: "graduationSpecialization", editable: true, cols: 4 },
        { label: "Passing Year", name: "graduationPassingYear", type: "number", editable: true, cols: 4 },
        { label: "Percentage", name: "graduationPercentage", type: "number", editable: true, cols: 4 },

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
        { label: "Experience Details", type: "divider", cols: 12 },
        { label: "Company Name", name: "companyName", editable: true, cols: 6 },
        { label: "Job Title", name: "jobTitle", editable: true, cols: 6 },
        {
          label: "Job Type", name: "jobType", type: "select", options: [
            { value: "Full-time", label: "Full-time" },
            { value: "Part-time", label: "Part-time" },
            { value: "Contract", label: "Contract" },
            { value: "Internship", label: "Internship" },
            { value: "Freelance", label: "Freelance" },
          ], editable: true, cols: 4
        },
        { label: "Duration (Months)", name: "experienceDurationMonths", type: "number", editable: true, cols: 4 },
        { label: "Start Date", name: "experienceStartDate", type: "date", editable: true, cols: 4 },
        { label: "End Date", name: "experienceEndDate", type: "date", editable: true, cols: 4 },
        { label: "Responsibilities", name: "responsibilities", type: "textarea", rows: 3, editable: true, cols: 12 },
      ],
      saveButton: saveWorkExperience,
    },
    // {
    //   title: "Certifications",
    //   titleColor: "success",
    //   fields: [
    //     { label: "Certification Name", name: "certificationName", editable: true, cols: 6 },
    //     { label: "Issuing Organization", name: "issuingOrganization", editable: true, cols: 6 },
    //     { label: "Issue Date", name: "issueDate", type: "date", editable: true, cols: 4 },
    //     { label: "Expiration Date", name: "expirationDate", type: "date", editable: true, cols: 4 },
    //     { label: "Credential ID", name: "credentialId", editable: true, cols: 4 },
    //     { label: "Certificate URL", name: "certificateUrl", type: "url", editable: true, cols: 6 },
    //     { label: "Certificate File", name: "certificateFile", type: "file", accept: ".pdf,.jpg,.jpeg,.png", editable: true, cols: 6 },
    //   ],
    //   saveButton: saveCertificates,
    // },
    {
      title: "Document Uploads",
      titleColor: "info",
      fields: [
        { label: "Aadhar Front Image", name: "aadharFrontImg", type: "file", accept: "image/*", editable: true, cols: 6 },
        { label: "Aadhar Back Image", name: "aadharBackImg", type: "file", accept: "image/*", editable: true, cols: 6 },
        { label: "PAN Image", name: "panImg", type: "file", accept: "image/*", editable: true, cols: 6 },
        { label: "Driving License Front", name: "drivingLicenseFrontImg", type: "file", accept: "image/*", editable: true, cols: 6 },

        { label: "Aadhar Number", name: "aadharNumber", editable: true, cols: 4 },
        { label: "PAN Number", name: "panNumber", editable: true, cols: 4 },
        { label: "Voter ID", name: "voterId", editable: true, cols: 4 },
        { label: "Passport Number", name: "passportNumber", editable: true, cols: 4 },
        { label: "Driving License No", name: "drivingLicenseNo", editable: true, cols: 4 },
      ],
      saveButton: saveDocumentUploads,
    },
    {
      title: "Certifications",
      titleColor: "success",
      fields: [
        { label: "Certification Name", name: "certificationName", editable: true, cols: 6 },
        { label: "Issuing Organization", name: "issuingOrganization", editable: true, cols: 6 },
        { label: "Issue Date", name: "issueDate", type: "date", editable: true, cols: 4 },
        { label: "Expiration Date", name: "expirationDate", type: "date", editable: true, cols: 4 },
        { label: "Credential ID", name: "credentialId", editable: true, cols: 4 },
        { label: "Certificate URL", name: "certificateUrl", type: "url", editable: true, cols: 6 },
        { label: "Certificate File", name: "certificateFile", type: "file", accept: ".pdf,.jpg,.jpeg,.png", editable: true, cols: 6 },
      ],
      saveButton: saveCertificates,
      additionalButtons: [
        {
          label: "Add Certificate",
          variant: "primary",
          onClick: addNewCertificate,
          icon: "plus"
        }
      ],
      customContent: certificates.length > 0 && (
        <div className="mt-3 mb-3">
          <h6 className="mb-3">Existing Certificates ({certificates.filter(cert => cert !== null).length})</h6>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
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
                {certificates.filter(cert => cert !== null).map((cert, index) => (
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
            </table>
          </div>
        </div>
      ),
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

      {message.text && (
        <Alert
          variant={message.variant}
          onClose={() => setMessage({ text: '', variant: '' })}
          dismissible
        >
          {message.text}
        </Alert>
      )}

      {/* Profile Completion Progress Card */}
      <Card className="mb-4 shadow-sm">
        <CardBody>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">
              <TbUser className="me-2" />
              Profile Completion
            </h5>
            <span className={`badge bg-${getProgressVariant(profileCompletion.percentage)} fs-6`}>
              {profileCompletion.percentage}%
            </span>
          </div>
          
          <ProgressBar 
            now={profileCompletion.percentage} 
            variant={getProgressVariant(profileCompletion.percentage)}
            animated
            striped
            style={{ height: '12px' }}
            className="mb-3"
          />
        </CardBody>
      </Card>

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