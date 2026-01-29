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
import ImageModal from "@/components/ImageModel";
import FileUploader from "@/components/FileUploader";
import Flatpickr from "react-flatpickr";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import axios from "@/api/axios";
import toast from "react-hot-toast";
import axios2 from "axios";
import "@/global.css";

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
  TbEye,
  TbFile,
  TbEdit,
  TbTrash,
} from "react-icons/tb";
import { formatDate } from "@/components/DateFormat";
/* ---------------------------------------------------
   Custom MultiSelect with Search
----------------------------------------------------*/
const MultiSelectWithSearch = ({ value = [], onChange, options = [], placeholder = "Select items" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleOption = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const removeItem = (optionValue, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const getSelectedLabels = () => {
    return value.map(v => {
      const option = options.find(opt => opt.value === v);
      return option?.name || option?.label || 'Loading...';
    });
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        className="form-control d-flex align-items-center flex-wrap gap-2"
        style={{ minHeight: "38px", cursor: "pointer" }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value.length === 0 ? (
          <span className="text-muted">{placeholder}</span>
        ) : (
          getSelectedLabels().map((label, idx) => (
            <span
              key={idx}
              className="badge bg-primary d-flex align-items-center gap-1"
              style={{ fontSize: "0.875rem" }}
            >
              {label}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: "0.6rem" }}
                onClick={(e) => removeItem(value[idx], e)}
                aria-label="Remove"
              />
            </span>
          ))
        )}
      </div>

      {isOpen && (
        <div
          className="border rounded bg-white shadow-sm"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
            marginTop: "4px"
          }}
        >
          <div className="p-2 border-bottom">
            <FormControl
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-muted text-center">No options found</div>
            ) : (
              filteredOptions.map((option, idx) => (
                <div
                  key={idx}
                  className="p-2 d-flex align-items-center gap-2"
                  style={{
                    cursor: "pointer",
                    backgroundColor: value.includes(option.value) ? "#f8f9fa" : "transparent"
                  }}
                  onClick={() => toggleOption(option.value)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = value.includes(option.value) ? "#f8f9fa" : "transparent";
                  }}
                >
                  <Form.Check
                    type="checkbox"
                    checked={value.includes(option.value)}
                    onChange={() => { }}
                    style={{ pointerEvents: "none" }}
                  />
                  <span>{option.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------
   MultiSelect with Free Text for Cities/Locations
----------------------------------------------------*/
const MultiSelectWithFreeText = ({ value = [], onChange, placeholder = "Enter locations" }) => {
  const [inputValue, setInputValue] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);

  const addItem = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !value.includes(trimmedValue)) {
      onChange([...value, trimmedValue]);
      setInputValue("");
    }
  };

  const removeItem = (itemToRemove, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== itemToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addItem();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="form-control d-flex align-items-center flex-wrap gap-2" style={{ minHeight: "38px", cursor: "text" }}>
      {value.map((item, idx) => (
        <span
          key={idx}
          className="badge bg-primary d-flex align-items-center gap-1"
          style={{ fontSize: "0.875rem" }}
        >
          {item}
          <button
            type="button"
            className="btn-close btn-close-white"
            style={{ fontSize: "0.6rem" }}
            onClick={(e) => removeItem(item, e)}
            aria-label="Remove"
          />
        </span>
      ))}
      <input
        type="text"
        className="border-0 flex-grow-1"
        style={{ outline: "none", minWidth: "120px" }}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addItem}
        onFocus={() => setIsInputFocused(true)}
        placeholder={value.length === 0 ? placeholder : ""}
      />
    </div>
  );
};

/* ---------------------------------------------------
   MultiSelect with API Search for Cities
----------------------------------------------------*/
const MultiSelectWithApiSearch = ({ value = [], onChange, placeholder = "Search cities" }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = React.useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch cities from API when search term changes
  useEffect(() => {
    const fetchCities = async () => {
      if (searchTerm.length < 2) {
        setCityOptions([]);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`https://medcab.onrender.com/api/get_city_search?search=${searchTerm}`);
        const data = await response.json();
        // console.log('Fetched cities data:', data.status);  
        if (data.status === 200 && data.jsonData?.city_list) {
          const formatted = data.jsonData.city_list.map(city => ({
            value: city.city_name,
            name: city.city_name
          }));
          setCityOptions(formatted);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCityOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchCities, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const toggleCity = (cityName) => {
    if (value.includes(cityName)) {
      onChange(value.filter(v => v !== cityName));
    } else {
      onChange([...value, cityName]);
    }
  };

  const removeCity = (cityName, e) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== cityName));
  };

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div
        className="form-control d-flex align-items-center flex-wrap gap-2"
        style={{ minHeight: "38px", cursor: "pointer" }}
        onClick={() => setIsOpen(true)}
      >
        {value.length === 0 ? (
          <span className="text-muted">{placeholder}</span>
        ) : (
          value.map((city, idx) => (
            <span
              key={idx}
              className="badge bg-primary d-flex align-items-center gap-1"
              style={{ fontSize: "0.875rem" }}
            >
              {city}
              <button
                type="button"
                className="btn-close btn-close-white"
                style={{ fontSize: "0.6rem" }}
                onClick={(e) => removeCity(city, e)}
                aria-label="Remove"
              />
            </span>
          ))
        )}
      </div>

      {isOpen && (
        <div
          className="border rounded bg-white shadow-sm"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: "300px",
            overflowY: "auto",
            marginTop: "4px"
          }}
        >
          <div className="p-2 border-bottom">
            <FormControl
              type="text"
              placeholder="Type to search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div>
            {loading ? (
              <div className="p-3 text-muted text-center">
                <Spinner size="sm" /> Loading cities...
              </div>
            ) : searchTerm.length < 2 ? (
              <div className="p-3 text-muted text-center">Type at least 2 characters to search</div>
            ) : cityOptions.length === 0 ? (
              <div className="p-3 text-muted text-center">No cities found</div>
            ) : (
              cityOptions.map((city, idx) => (
                <div
                  key={idx}
                  className="p-2 d-flex align-items-center gap-2"
                  style={{
                    cursor: "pointer",
                    backgroundColor: value.includes(city.value) ? "#f8f9fa" : "transparent"
                  }}
                  onClick={() => toggleCity(city.value)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#e9ecef"}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = value.includes(city.value) ? "#f8f9fa" : "transparent";
                  }}
                >
                  <Form.Check
                    type="checkbox"
                    checked={value.includes(city.value)}
                    onChange={() => { }}
                    style={{ pointerEvents: "none" }}
                  />
                  <span>{city.name}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------------------------------------------
   Header with Progress
----------------------------------------------------*/
const Header = ({ withProgress }) => {
  const { goToStep, activeStep, stepCount } = useWizard();

  const steps = [
    { icon: TbUserCircle, label: "Primary Info", desc: "Basic details" },
    { icon: TbUserCircle, label: "Basic Details", desc: "Personal info" },
    { icon: TbMapPin, label: "Address", desc: "Address Info" },
    { icon: TbBuildingBank, label: "Bank Details", desc: "Financial" },
    { icon: TbMan, label: "Body Detail", desc: "Physical" },
    { icon: TbPhone, label: "Emergency", desc: "Contact detail" },
    { icon: TbUsers, label: "Parental Info", desc: "Guardian details" },
    { icon: TbSettings, label: "Preferences", desc: "Career goals" },
    { icon: TbSchool, label: "Education", desc: "Academic detail" },
    { icon: TbSettings, label: "Skills", desc: "Your Abilities" },
    { icon: TbLink, label: "Social Links", desc: "Online presence" },
    { icon: TbBriefcase, label: "Experience", desc: "Work history" },
    { icon: TbCertificate, label: "Certificates", desc: "Certifications" },
    { icon: TbFileText, label: "Documents", desc: "Upload files" },
    { icon: TbFile, label: "Resume", desc: "Upload resume" },
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
const RenderField = ({ field, value, onChange, onViewImage, careerPreferences }) => {
  if (field.type === "divider") {
    return (
      <Col xl={12}>
        <h6 className="text-primary border-bottom pb-2 mb-3 mt-3">
          {field.label}
        </h6>
      </Col>
    );
  }

  const handleChange = async (e) => {
    if (field.type === "checkbox") {
      onChange(field.name, e.target.checked);
    } else if (field.type === "file") {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result;
          // Extract pure base64 without data:mime;base64, prefix
          const pureBase64 = result.includes(',') ? result.split(',')[1] : result;

          // Extract file extension
          const fileExtension = file.name.split('.').pop().toLowerCase();

          // Store pure base64 and extension separately
          onChange(field.name, pureBase64);
          onChange(`${field.name}Extension`, fileExtension);

          // Store full data URI for preview
          onChange(`${field.name}Preview`, result);
        };
        reader.onerror = () => {
          toast.error("Failed to read file");
        };
        reader.readAsDataURL(file);
      }
    } else {
      onChange(field.name, e.target.value);
    }
  };

  const handleDateChange = (dates) => {
    onChange(field.name, dates[0]);
  };


  // for image/file preview
  const getPreviewSrc = (fieldName) => {
    const previewField = `${fieldName}Preview`;
    const baseValue = value;

    // If we have a preview data URI stored, use it
    const previewValue = typeof sectionData !== 'undefined' ? sectionData[previewField] : null;
    if (previewValue && previewValue.startsWith("data:")) {
      return previewValue;
    }

    // If base value is already a data URI
    if (baseValue && baseValue.startsWith("data:")) {
      return baseValue;
    }

    // If base value is a file path from backend
    if (baseValue && (baseValue.startsWith("/") || baseValue.startsWith("uploads"))) {
      return `https://jobportalbackend-3ew9.onrender.com${baseValue}`;
    }

    return "";
  };

  

  return (
    <Col xl={field.cols || 4}>
      <FormGroup className="mb-3">
        <FormLabel>
          {field.label}
        </FormLabel>

        {field.type === "select" ? (
          <FormSelect value={value || ""} onChange={handleChange} disabled={field.disabled}>
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
            value={(() => {
              // Don't use formatDate here - Flatpickr needs actual Date or valid date string
              if (!value || value === '-' || value === '') return '';
              // If it's a Unix timestamp (number or numeric string)
              const numValue = Number(value);
              if (!isNaN(numValue) && numValue > 0) {
                // Convert seconds to milliseconds if needed
                return new Date(numValue < 10000000000 ? numValue * 1000 : numValue);
              }
              // If it's already a date string, return as-is
              const parsed = new Date(value);
              return isNaN(parsed.getTime()) ? '' : parsed;
            })()}
            options={{ dateFormat: "d M, Y" }}
            onChange={handleDateChange}
            disabled={field.disabled}
          />
        ) : field.type === "textarea" ? (
          <Form.Control
            as="textarea"
            rows={field.rows || 3}
            value={value || ""}
            onChange={handleChange}
            disabled={field.disabled}
          />
        ) : field.type === "checkbox" ? (
          <Form.Check
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            disabled={field.disabled}
          />
        ) : field.type === "file" ? (
          <>
            {value && typeof value === "string" && (
              <div className="border rounded p-3 mb-2 bg-light d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center gap-3">
                  {/* Preview Thumbnail */}
                  <div
                    className="border rounded bg-white d-flex align-items-center justify-content-center"
                    style={{
                      width: '80px',
                      height: '80px',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {(() => {
                      const previewSrc = getPreviewSrc(field.name);
                      const isImage = field.accept?.includes('image') ||
                        previewSrc.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
                        previewSrc.startsWith('data:image');

                      if (isImage && previewSrc) {
                        return (
                          <img
                            src={previewSrc}
                            alt="Preview"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        );
                      } else {
                        return (
                          <div className="text-center text-muted">
                            <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem' }}></i>
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* File Info */}
                  <div>
                    <div className="fw-semibold text-success mb-1">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      File Uploaded Successfully
                    </div>
                    <small className="text-muted d-block">
                      Click the eye icon to view full file
                    </small>
                  </div>
                </div>

                {/* View Button */}
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => onViewImage && onViewImage(getPreviewSrc(field.name), field.label)}
                  title="View uploaded file"
                  className="d-flex align-items-center gap-1"
                >
                  <TbEye size={18} />
                  View
                </Button>
              </div>
            )}

            <FormControl
              type="file"
              accept={field.accept}
              onChange={handleChange}
              key={value ? 'has-file' : 'no-file'}
              disabled={field.disabled}
              className={value ? 'mt-2' : ''}
            />

            {!value && (
              <small className="text-muted d-block mt-1">
                <i className="bi bi-info-circle me-1"></i>
                {field.accept ? `Accepted formats: ${field.accept}` : 'Select a file to upload'}
              </small>
            )}
          </>
        ) : field.type === "multiselect" ? (
          <MultiSelectWithSearch
            value={value || []}
            onChange={(newValue) => onChange(field.name, newValue)}
            options={field.options || []}
            placeholder={field.placeholder || `Select ${field.label}`}
          />
        ) : field.type === "multiselectfreetext" ? (
          <MultiSelectWithFreeText
            value={value || []}
            onChange={(newValue) => onChange(field.name, newValue)}
            placeholder={field.placeholder || `Enter ${field.label}`}
          />
        ) : field.type === "multiselectapi" ? (
          <MultiSelectWithApiSearch
            value={value || []}
            onChange={(newValue) => onChange(field.name, newValue)}
            placeholder={field.placeholder || `Search ${field.label}`}
          />
        ) : (
          <FormControl
            type={field.type || "text"}
            value={value || ""}
            onChange={handleChange}
            disabled={field.disabled}
          />
        )}
      </FormGroup>
    </Col>
  );
};

/* ---------------------------------------------------
   Step Builder
----------------------------------------------------*/
const StepSection = ({ title, fields, data, next, prev, onChange, onSave, apiEndpoint, saving, customContent, additionalButtons, onViewImage, careerPreferences }) => {
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
            onViewImage={onViewImage}
            careerPreferences={careerPreferences}
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
  const [additionalEducation, setAdditionalEducation] = useState([]);
  const [editingCertificateIndex, setEditingCertificateIndex] = useState(null);
  const [editingExperienceIndex, setEditingExperienceIndex] = useState(null);
  const [editingAdditionalEduIndex, setEditingAdditionalEduIndex] = useState(null);
  const [imageModalShow, setImageModalShow] = useState(false);
  const [imageModalSrc, setImageModalSrc] = useState("");
  const [imageModalTitle, setImageModalTitle] = useState("");
  const [careerPreferences, setCareerPreferences] = useState([]);
  const [uploadedResumeFiles, setUploadedResumeFiles] = useState([]);
  const [languageProficiency, setLanguageProficiency] = useState([]);
  const [otherDocuments, setOtherDocuments] = useState([]);
  const [editingOtherDocIndex, setEditingOtherDocIndex] = useState(null);


  const handleViewImage = (imageSrc, title) => {
    setImageModalSrc(imageSrc);
    setImageModalTitle(title);
    setImageModalShow(true);
  };

  // Fetch career preferences
  useEffect(() => {
    const fetchCareerPreferences = async () => {
      try {
        const response = await axios.get('/job-categories/get_career_preferences_list');
        if (response.data.status === 200) {
          console.log('Fetched career preferences:', response.data.jsonData?.data);
          const formatted = (response.data?.jsonData?.data || []).map(item => ({
            value: item._id || item.value,
            name: Array.isArray(item.careerPreferenceName)
              ? item.careerPreferenceName.join(', ')
              : item.careerPreferenceName || item.name || 'Unknown'
          }));
          console.log('Formatted career preferences:', formatted);
          setCareerPreferences(formatted);
        }
      } catch (error) {
        console.error('Error fetching career preferences:', error);
      }
    };
    fetchCareerPreferences();
  }, []);

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
    setSectionData((prev) => {
      const updated = { ...prev, [fieldName]: value };

      // Auto-fill permanent address when "Same as Current" is checked
      if (fieldName === 'isPermanentSameAsCurrent' && value === true) {
        updated.permanentAddressLine1 = prev.currentAddressLine1 || '';
        updated.permanentAddressLine2 = prev.currentAddressLine2 || '';
        updated.permanentCity = prev.currentCity || '';
        updated.permanentState = prev.currentState || '';
        updated.permanentCountry = prev.currentCountry || '';
        updated.permanentPincode = prev.currentPincode || '';
      }

      return updated;
    });
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

      // Special handling for Career Preferences - send array of IDs
      if (endpoint.includes('updateStudentCareerPreferences')) {
        payload.preferredJobCategory = sectionData.preferredJobCategory || [];
        payload.preferredJobLocation = sectionData.preferredJobLocation || [];
      }

      // Special handling for Address - needs nested structure
      if (endpoint.includes('updateStudentAddress')) {
        payload = {
          current: {
            addressLine1: sectionData.currentAddressLine1 || '',
            addressLine2: sectionData.currentAddressLine2 || '',
            city: sectionData.currentCity || '',
            state: sectionData.currentState || '',
            country: sectionData.currentCountry || '',
            pincode: sectionData.currentPincode || '',
          },
          permanent: {
            addressLine1: sectionData.permanentAddressLine1 || '',
            addressLine2: sectionData.permanentAddressLine2 || '',
            city: sectionData.permanentCity || '',
            state: sectionData.permanentState || '',
            country: sectionData.permanentCountry || '',
            pincode: sectionData.permanentPincode || '',
          },
          isPermanentSameAsCurrent: sectionData.isPermanentSameAsCurrent || false,
        };
      }

      // 🔥 BANK DETAILS FIX
      if (endpoint.includes('updateStudentBankDetails')) {
        payload = {
          bankHolderName: sectionData.bankHolderName || '',
          bankName: sectionData.bankName || '',
          accountNumber: sectionData.accountNumber || '',
          ifscCode: sectionData.ifscCode || '',
          branchName: sectionData.branchName || '',
          passbookUrl: sectionData.passbookUrl || '', // Send pure base64
          extension: sectionData.passbookUrlExtension
        };

        console.log('Bank details payload:', payload);
        await axios.put(endpoint, payload); // JSON ONLY
        toast.success("Bank details saved successfully");
        return;
      }


      // Special handling for Skills - backend expects arrays
      if (endpoint.includes('updateStudentSkills')) {
        const convertToArray = (value) =>
          typeof value === 'string'
            ? value.split(',').map(v => v.trim()).filter(Boolean)
            : Array.isArray(value)
              ? value
              : [];

        payload = {
          hobbies: convertToArray(sectionData.hobbies),
          technicalSkills: convertToArray(sectionData.technicalSkills),
          softSkills: convertToArray(sectionData.softSkills),
          computerKnowledge: convertToArray(sectionData.computerKnowledge),
          languageProficiency: languageProficiency || []
        };
        const sanitize = (arr = []) =>
          arr.filter(v => v && v.trim() !== "");

        payload.technicalSkills = sanitize(payload.technicalSkills);
        payload.softSkills = sanitize(payload.softSkills);
        payload.hobbies = sanitize(payload.hobbies);
        payload.computerKnowledge = sanitize(payload.computerKnowledge);

        console.log('Skills payload:', payload);
        await axios.put(endpoint, payload);
        toast.success('Skills updated successfully!');
        return;
      }



      // 🔥 EDUCATION SAVE FIX
      if (endpoint.includes('updateStudentEducationDetails')) {
        // Build additional education array from existing entries
        const additionalEduArray = [...(additionalEducation || [])];

        // If form fields have values, add/update entry
        if (sectionData.additionalEduName || sectionData.additionalInstitutionName ||
          sectionData.additionalPassingYear || sectionData.additionalPercentage) {

          const newAdditionalEdu = {
            additionalEduName: sectionData.additionalEduName || '',
            institutionName: sectionData.additionalInstitutionName || '',
            passingYear: sectionData.additionalPassingYear || '',
            percentage: sectionData.additionalPercentage || '',
            marksheetFile: sectionData.additionalMarksheetFile || '',
            extension: sectionData.additionalMarksheetFileExtension || 'pdf'
          };

          // Add to array if it's new data
          if (editingAdditionalEduIndex !== null) {
            additionalEduArray[editingAdditionalEduIndex] = newAdditionalEdu;
          } else {
            additionalEduArray.push(newAdditionalEdu);
          }
          setEditingAdditionalEduIndex(null);
        }

        const payload = {
          highestQualification: sectionData.highestQualification || null,

          tenth: {
            schoolName: sectionData.tenthSchoolName || '',
            board: sectionData.tenthBoard || '',
            passingYear: sectionData.tenthPassingYear || '',
            percentage: sectionData.tenthPercentage || '',
            marksheetFile: sectionData.tenthMarksheetFile || '',
            extension: sectionData.tenthMarksheetFileExtension || 'pdf'
          },

          twelfth: {
            schoolCollegeName: sectionData.twelfthSchoolCollegeName || '',
            board: sectionData.twelfthBoard || '',
            stream: sectionData.twelfthStream || '',
            passingYear: sectionData.twelfthPassingYear || '',
            percentage: sectionData.twelfthPercentage || '',
            marksheetFile: sectionData.twelfthMarksheetFile || '',
            extension: sectionData.twelfthMarksheetFileExtension || 'pdf'
          },

          graduation: {
            collegeName: sectionData.graduationCollegeName || '',
            courseName: sectionData.graduationCourseName || '',
            specialization: sectionData.graduationSpecialization || '',
            passingYear: sectionData.graduationPassingYear || '',
            percentage: sectionData.graduationPercentage || '',
            marksheetFile: sectionData.graduationMarksheetFile || '',
            extension: sectionData.graduationMarksheetFileExtension || 'pdf'
          },

          postGraduation: {
            collegeName: sectionData.postGraduationCollegeName || '',
            courseName: sectionData.postGraduationCourseName || '',
            specialization: sectionData.postGraduationSpecialization || '',
            passingYear: sectionData.postGraduationPassingYear || '',
            percentage: sectionData.postGraduationPercentage || '',
            marksheetFile: sectionData.postGraduationMarksheetFile || '',
            extension: sectionData.postGraduationMarksheetFileExtension || 'pdf'
          },

          additionalEducation: additionalEduArray

        };

        console.log('Education payload being sent:', payload);
        await axios.put(endpoint, payload); // JSON ONLY
        toast.success("Education details saved successfully");

        // Clear additional education form fields after save
        setSectionData(prev => ({
          ...prev,
          additionalEduName: '',
          additionalInstitutionName: '',
          additionalPassingYear: '',
          additionalPercentage: '',
          additionalMarksheetFile: '',
        }));

        return;
      }


      // Special handling for Work Experience - backend expects array of experiences
      if (endpoint.includes('updateStudentWorkExperience')) {
        // Collect all work experiences from state
        const allExperiences = [...workExperiences];

        // If we're adding/editing an experience, update the array
        if (payload.companyName && payload.jobTitle) {
          // Convert date strings to Unix timestamps (seconds)
          const startTimestamp = payload.experienceStartDate
            ? Math.floor(new Date(payload.experienceStartDate).getTime() / 1000)
            : null;
          const endTimestamp = payload.experienceEndDate
            ? Math.floor(new Date(payload.experienceEndDate).getTime() / 1000)
            : null;

          const experienceData = {
            companyName: payload.companyName,
            jobTitle: payload.jobTitle,
            jobType: payload.jobType,
            experienceDurationMonths: parseInt(payload.experienceDurationMonths) || 0,
            startDate: startTimestamp,
            endDate: endTimestamp,
            responsibilities: payload.responsibilities,
            currentlyWorking: sectionData.currentlyWorking || false,
            experienceCertificateFile: payload.experienceCertificateFile || '',
            extension: sectionData.experienceCertificateFileExtension || 'pdf'
          };

          if (editingExperienceIndex !== null) {
            // Update existing experience
            const existingExp = allExperiences[editingExperienceIndex];
            allExperiences[editingExperienceIndex] = {
              ...existingExp,
              ...experienceData
            };
          } else {
            // Add new experience
            allExperiences.push(experienceData);
          }
        }

        // Backend auto-calculates totalExperienceMonths, so we don't send it
        payload = {
          experiences: allExperiences
        };

        console.log('Work experience payload:', payload);
      }

      // 🔥 DOCUMENT UPLOAD FIX - Convert all images to base64 with extensions
      if (endpoint.includes('updateStudentDocumentUpload')) {
        // Build other documents array from existing entries
        const otherDocsArray = [...(otherDocuments || [])];

        // If form fields have values, add/update entry
        if (sectionData.documentName || sectionData.documentFile) {
          const newDoc = {
            documentName: sectionData.documentName || '',
            documentFile: sectionData.documentFile || '',
            extension: sectionData.documentFileExtension || ''
          };

          if (editingOtherDocIndex !== null) {
            // Update existing document
            otherDocsArray[editingOtherDocIndex] = newDoc;
            setEditingOtherDocIndex(null);
          } else {
            // Add new document
            otherDocsArray.push(newDoc);
          }
          setOtherDocuments(otherDocsArray);
        }

        payload = {
          identityDocuments: {
            aadharNumber: sectionData.aadharNumber || '',
            panNumber: sectionData.panNumber || '',
            voterId: sectionData.voterId || '',
            passportNumber: sectionData.passportNumber || '',
            drivingLicenseNo: sectionData.drivingLicenseNo || '',
            // Images as base64
            aadharFrontImg: sectionData.aadharFrontImg || '',
            aadharBackImg: sectionData.aadharBackImg || '',
            panImg: sectionData.panImg || '',
            categoryCertificateImg: sectionData.categoryCertificateImg,
            drivingLicenseFrontImg: sectionData.drivingLicenseFrontImg,
            domicileCertificateImg: sectionData.domicileCertificateImg,
            incomeCertificateImg: sectionData.incomeCertificateImg || '',
            birthCertificateImg: sectionData.birthCertificateImg || '',
            // Extensions for each file
            aadharFrontImgExtension: sectionData.aadharFrontImgExtension || '',
            aadharBackImgExtension: sectionData.aadharBackImgExtension || '',
            panImgExtension: sectionData.panImgExtension || '',
            categoryCertificateImgExtension: sectionData.categoryCertificateImgExtension || '',
            drivingLicenseFrontImgExtension: sectionData.drivingLicenseFrontImgExtension || '',
            domicileCertificateImgExtension: sectionData.domicileCertificateImgExtension || '',
            incomeCertificateImgExtension: sectionData.incomeCertificateImgExtension || '',
            birthCertificateImgExtension: sectionData.birthCertificateImgExtension || '',
          },
          otherDocuments: otherDocsArray
        };

        console.log('Document upload payload:', payload);
        await axios.put(endpoint, payload); // JSON ONLY with base64
        toast.success("Documents saved successfully");
        
        // Clear other document form fields after save
        setSectionData(prev => ({
          ...prev,
          documentName: '',
          documentFile: '',
          extension: ''
        }));
        
        return;
      }

      console.log('Endpoint:', endpoint);
      console.log('Payload being sent:', payload);

      if (endpoint.includes('updateStudentCertificates')) {
        if (!payload.certificationName || !payload.issuingOrganization || !payload.issueDate) {
          toast.error('Please fill in Certification Name, Issuing Organization, and Issue Date');
          setSaving(false);
          return;
        }

        // Convert issueDate and expirationDate to Unix timestamps (seconds)
        const issueTimestamp = payload.issueDate
          ? Math.floor(new Date(payload.issueDate).getTime() / 1000)
          : null;
        const expirationTimestamp = payload.expirationDate
          ? Math.floor(new Date(payload.expirationDate).getTime() / 1000)
          : null;

        console.log("certificate")

        payload.issueDate = issueTimestamp;
        payload.expirationDate = expirationTimestamp;
        payload.extension = sectionData.certificateFileExtension || 'pdf';

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
        // Append payload fields first
        Object.keys(payload).forEach(key => {
          const value = payload[key];
          if (value instanceof File) {
            formData.append(key, value);
          } else if (value !== undefined && value !== null) {
            // Use JSON.stringify for arrays and objects to preserve structure
            if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        // If education update, also append any marksheet files from sectionData
        if (endpoint.includes('updateStudentEducationDetails')) {
          const fileFields = [
            'tenthMarksheetFile',
            'twelfthMarksheetFile',
            'graduationMarksheetFile',
            'postGraduationMarksheetFile',
            'additionalMarksheetFile'
          ];

          fileFields.forEach(fieldName => {
            const fileVal = sectionData[fieldName];
            if (fileVal instanceof File) {
              formData.append(fieldName, fileVal);
            }
          });
        }

        console.log('Sending FormData with files');
        const response = await axios.put(endpoint, formData, {
          headers: {
            'Content-Type': 'application/json',
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
          experienceCertificateFile: '',
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
    toast.success('Fill in new certificate details and click Save');
  };

  // Edit existing certificate
  const editCertificate = (index) => {
    const cert = certificates[index];
    setSectionData(prev => ({
      ...prev,
      certificationName: cert.certificationName || '',
      issuingOrganization: cert.issuingOrganization || '',
      issueDate: cert.issueDate && typeof cert.issueDate === 'string' ? cert.issueDate.split('T')[0] : '',
      expirationDate: cert.expirationDate && typeof cert.expirationDate === 'string' ? cert.expirationDate.split('T')[0] : '',
      credentialId: cert.credentialId || '',
      certificateUrl: cert.certificateUrl || '',
    }));
    setEditingCertificateIndex(index);
    toast.success(`Editing certificate: ${cert.certificationName}`);
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
      experienceCertificateFile: '',
    }));
    setEditingExperienceIndex(null);
    toast.success('Fill in new work experience details and click Save');
  };

  // Edit existing work experience
  const editExperience = (index) => {
    const exp = workExperiences[index];

    // Convert Unix timestamps (seconds) to date strings for the form
    const formatDateFromTimestamp = (timestamp) => {
      if (!timestamp || timestamp === 0 || isNaN(timestamp)) return '';
      try {
        // Backend stores as seconds, convert to milliseconds for JS Date
        const date = new Date(timestamp * 1000);
        if (isNaN(date.getTime())) return '';
        return date.toISOString().split('T')[0];
      } catch (error) {
        console.error('Error formatting date:', error);
        return '';
      }
    };

    setSectionData(prev => ({
      ...prev,
      companyName: exp.companyName || '',
      jobTitle: exp.jobTitle || '',
      jobType: exp.jobType || '',
      experienceDurationMonths: exp.experienceDurationMonths || '',
      experienceStartDate: formatDateFromTimestamp(exp.startDate),
      experienceEndDate: formatDateFromTimestamp(exp.endDate),
      responsibilities: exp.responsibilities || '',
      experienceCertificateFile: exp.experienceCertificateFile || '',
    }));
    setEditingExperienceIndex(index);
    toast.success(`Editing experience: ${exp.companyName}`);
  };

  // Edit existing additional education
  const editAdditionalEducation = (index) => {
    const edu = additionalEducation[index];
    setSectionData(prev => ({
      ...prev,
      additionalEduName: edu.additionalEduName || '',
      additionalInstitutionName: edu.institutionName || '',
      additionalPassingYear: edu.passingYear || '',
      additionalPercentage: edu.percentage || '',
      additionalMarksheetFile: edu.marksheetFile || '',
    }));
    setEditingAdditionalEduIndex(index);
    toast.success(`Editing additional education: ${edu.additionalEduName}`);
  };

  // Add new other document - clear form
  const addNewOtherDocument = () => {
    setSectionData(prev => ({
      ...prev,
      documentName: '',
      documentFile: '',
      documentFileExtension: ''
    }));
    setEditingOtherDocIndex(null);
    toast.success('Fill in new document details and click Save');
  };

  // Edit existing other document
  const editOtherDocument = (index) => {
    const doc = otherDocuments[index];
    setSectionData(prev => ({
      ...prev,
      documentName: doc.documentName || '',
      documentFile: doc.documentFile || '',
      documentFileExtension: doc.extension || ''
    }));
    setEditingOtherDocIndex(index);
    toast.success(`Editing document: ${doc.documentName}`);
  };

  // Delete other document
  const deleteOtherDocument = async (index) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    
    try {
      const updatedDocs = otherDocuments.filter((_, i) => i !== index);
      setOtherDocuments(updatedDocs);
      
      // Save updated list to backend
      const payload = {
        identityDocuments: {
          aadharNumber: sectionData.aadharNumber || '',
          panNumber: sectionData.panNumber || '',
          voterId: sectionData.voterId || '',
          passportNumber: sectionData.passportNumber || '',
          drivingLicenseNo: sectionData.drivingLicenseNo || '',
          aadharFrontImg: sectionData.aadharFrontImg || '',
          aadharBackImg: sectionData.aadharBackImg || '',
          panImg: sectionData.panImg || '',
          categoryCertificateImg: sectionData.categoryCertificateImg,
          drivingLicenseFrontImg: sectionData.drivingLicenseFrontImg,
          domicileCertificateImg: sectionData.domicileCertificateImg,
          incomeCertificateImg: sectionData.incomeCertificateImg || '',
          birthCertificateImg: sectionData.birthCertificateImg || '',
          aadharFrontImgExtension: sectionData.aadharFrontImgExtension || '',
          aadharBackImgExtension: sectionData.aadharBackImgExtension || '',
          panImgExtension: sectionData.panImgExtension || '',
          categoryCertificateImgExtension: sectionData.categoryCertificateImgExtension || '',
          drivingLicenseFrontImgExtension: sectionData.drivingLicenseFrontImgExtension || '',
          domicileCertificateImgExtension: sectionData.domicileCertificateImgExtension || '',
          incomeCertificateImgExtension: sectionData.incomeCertificateImgExtension || '',
          birthCertificateImgExtension: sectionData.birthCertificateImgExtension || '',
        },
        otherDocuments: updatedDocs
      };
      
      await axios.put(`/student/updateStudentDocumentUpload/${id}`, payload);
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  // Handle resume file upload
  const handleResumeUpload = async () => {
    if (!uploadedResumeFiles || uploadedResumeFiles.length === 0) {
      toast.error('Please select a resume file to upload');
      return;
    }

    try {
      setSaving(true);
      const file = uploadedResumeFiles[0];
      const extension = file.name.split('.').pop().toLowerCase();

      // Convert file to base64
      const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

      const base64String = await toBase64(file);

      const response = await axios.put(`/student/uploadStudentResume/${id}`, {
        studentResumeFile: base64String,
        extension: extension
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        toast.success('Resume uploaded successfully');
        setUploadedResumeFiles([]);
        // Refresh data to get updated resume file path
        const res = await axios.get(`/student/studentAllDetails/${id}`);
        if (res.data.jsonData) {
          setSectionData(prev => ({
            ...prev,
            studentResumeFile: res.data?.jsonData?.studentPrimaryData?.studentResumeFile,
          }));
        }
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setSaving(false);
    }
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

    // Store all certificates, work experiences, and additional education
    const validCertificates = (certificatesData?.certificates || []).filter(cert => cert !== null);
    setCertificates(validCertificates);
    const validExperiences = (workExperienceData?.experiences || []).filter(exp => exp !== null);
    setWorkExperiences(validExperiences);
    const validAdditionalEdu = (educationData?.additionalEducation || []).filter(edu => edu !== null);
    setAdditionalEducation(validAdditionalEdu);
    const validLanguageProficiency = (skillsData?.languageProficiency || []).filter(lang => lang !== null);
    setLanguageProficiency(validLanguageProficiency);
    const validOtherDocuments = (documentData?.otherDocuments || []).filter(doc => doc !== null);
    setOtherDocuments(validOtherDocuments);

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
      studentResumeFile: data.studentPrimaryData?.studentResumeFile || '',
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
      currentCountry: addressData?.current?.country,
      currentPincode: addressData?.current?.pincode,
      permanentAddressLine1: addressData?.permanent?.addressLine1,
      permanentAddressLine2: addressData?.permanent?.addressLine2,
      permanentCity: addressData?.permanent?.city,
      permanentState: addressData?.permanent?.state,
      permanentCountry: addressData?.permanent?.country,
      permanentPincode: addressData?.permanent?.pincode,
      isPermanentSameAsCurrent: addressData?.isPermanentSameAsCurrent,

      // Bank
      bankHolderName: bankData?.bankHolderName,
      bankName: bankData?.bankName,
      accountNumber: bankData?.accountNumber,
      ifscCode: bankData?.ifscCode,
      branchName: bankData?.branchName,
      passbookUrl: bankData?.passbookUrl,

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
        ? preferencesData.preferredJobCategory.map(item => item._id || item)
        : [],

      preferredJobLocation: Array.isArray(preferencesData?.preferredJobLocation)
        ? preferencesData.preferredJobLocation
        : (preferencesData?.preferredJobLocation ? [preferencesData.preferredJobLocation] : []),
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
      tenthMarksheetFile: educationData?.tenth?.marksheetFile,
      twelfthSchoolCollegeName: educationData?.twelfth?.schoolCollegeName,
      twelfthBoard: educationData?.twelfth?.board,
      twelfthStream: educationData?.twelfth?.stream,
      twelfthPassingYear: educationData?.twelfth?.passingYear,
      twelfthPercentage: educationData?.twelfth?.percentage,
      twelfthMarksheetFile: educationData?.twelfth?.marksheetFile,
      graduationCollegeName: educationData?.graduation?.collegeName,
      graduationCourseName: educationData?.graduation?.courseName,
      graduationSpecialization: educationData?.graduation?.specialization,
      graduationPassingYear: educationData?.graduation?.passingYear,
      graduationPercentage: educationData?.graduation?.percentage,
      graduationMarksheetFile: educationData?.graduation?.marksheetFile,
      postGraduationCollegeName: educationData?.postGraduation?.collegeName,
      postGraduationCourseName: educationData?.postGraduation?.courseName,
      postGraduationSpecialization: educationData?.postGraduation?.specialization,
      postGraduationPassingYear: educationData?.postGraduation?.passingYear,
      postGraduationPercentage: educationData?.postGraduation?.percentage,
      postGraduationMarksheetFile: educationData?.postGraduation?.marksheetFile,

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

      // Work Experience - format dates properly
      totalExperienceMonths: workExperienceData?.totalExperienceMonths || 0,
      companyName: firstExperience.companyName || '',
      jobTitle: firstExperience.jobTitle || '',
      jobType: firstExperience.jobType || '',
      experienceDurationMonths: firstExperience.experienceDurationMonths || 0,
      currentlyWorking: firstExperience.currentlyWorking || false,
      experienceStartDate: firstExperience.startDate && !isNaN(firstExperience.startDate) && firstExperience.startDate > 0
        ? new Date(firstExperience.startDate * 1000).toISOString().split('T')[0]
        : '',
      experienceEndDate: firstExperience.endDate && !isNaN(firstExperience.endDate) && firstExperience.endDate > 0
        ? new Date(firstExperience.endDate * 1000).toISOString().split('T')[0]
        : '',
      responsibilities: firstExperience.responsibilities || '',
      experienceCertificateFile: firstExperience.experienceCertificateFile || '',

      // Certificates
      certificationName: firstCertificate.certificationName || '',
      issuingOrganization: firstCertificate.issuingOrganization || '',
      issueDate: firstCertificate.issueDate && !isNaN(firstCertificate.issueDate) && firstCertificate.issueDate > 0
        ? new Date(firstCertificate.issueDate * 1000).toISOString().split('T')[0]
        : '',
      expirationDate: firstCertificate.expirationDate && !isNaN(firstCertificate.expirationDate) && firstCertificate.expirationDate > 0
        ? new Date(firstCertificate.expirationDate * 1000).toISOString().split('T')[0]
        : '',
      credentialId: firstCertificate.credentialId || '',
      certificateUrl: firstCertificate.certificateUrl || '',
      certificateFile: firstCertificate.certificateFile || '',
      // Documents
      aadharNumber: documentData?.identityDocuments?.aadharNumber,
      panNumber: documentData?.identityDocuments?.panNumber,
      voterId: documentData?.identityDocuments?.voterId,
      passportNumber: documentData?.identityDocuments?.passportNumber,
      drivingLicenseNo: documentData?.identityDocuments?.drivingLicenseNo,
      aadharFrontImg: documentData?.identityDocuments?.aadharFrontImg,
      aadharBackImg: documentData?.identityDocuments?.aadharBackImg,
      panImg: documentData?.identityDocuments?.panImg,
      categoryCertificateImg: documentData?.identityDocuments?.categoryCertificateImg,
      drivingLicenseFrontImg: documentData?.identityDocuments?.drivingLicenseFrontImg,
      domicileCertificateImg: documentData?.identityDocuments?.domicileCertificateImg,
      incomeCertificateImg: documentData?.identityDocuments?.incomeCertificateImg,
      birthCertificateImg: documentData?.identityDocuments?.birthCertificateImg,
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
                onViewImage={handleViewImage}
                fields={[
                  { name: "studentFirstName", label: "First Name", type: "text", cols: 4, disabled: true },
                  { name: "studentLastName", label: "Last Name", type: "text", cols: 4, disabled: true },
                  { name: "studentEmail", label: "Email", type: "email", cols: 4, disabled: true },
                  { name: "studentMobileNo", label: "Mobile Number", type: "tel", cols: 4, disabled: true },
                  { name: "studentJobSector", label: "Job Sector", type: "text", cols: 4, disabled: true },
                  {
                    name: "accountStatus", label: "Account Status", type: "select", cols: 4, disabled: true,
                    options: [
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                      { value: "blocked", label: "Blocked" },
                    ]
                  },
                  { name: "studentReferralCode", label: "Referral Code", type: "text", cols: 4, disabled: true },
                  { name: "studentReferralByCode", label: "Referred By Code", type: "text", cols: 4, disabled: true },
                  { name: "studentCreatedAt", label: "Created At", type: "date", cols: 4, disabled: true },
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
                onViewImage={handleViewImage}
                fields={[
                  { name: "studentDOB", label: "Date of Birth", type: "date", cols: 3 },
                  {
                    name: "studentGender", label: "Gender", type: "select", cols: 3,
                    options: [
                      { value: "male", label: "Male" },
                      { value: "female", label: "Female" },
                    ]
                  },
                  { name: "studentAlternateMobileNo", label: "Alternate Mobile", type: "number", cols: 3 },
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
                onViewImage={handleViewImage}
                fields={[
                  { label: "Current Address", type: "divider", cols: 12 },
                  { name: "currentAddressLine1", label: "Address Line 1", type: "text", cols: 6 },
                  { name: "currentAddressLine2", label: "Address Line 2", type: "text", cols: 6 },
                  { name: "currentCity", label: "City", type: "text", cols: 2 },
                  { name: "currentState", label: "State", type: "text", cols: 2 },
                  { name: "currentCountry", label: "Country", type: "text", cols: 2 },
                  { name: "currentPincode", label: "Pincode", type: "number", cols: 2 },

                  { label: "Permanent Address", type: "divider", cols: 12 },
                  { name: "isPermanentSameAsCurrent", label: "Same as Current", type: "checkbox", cols: 12 },
                  { name: "permanentAddressLine1", label: "Address Line 1", type: "text", cols: 6 },
                  { name: "permanentAddressLine2", label: "Address Line 2", type: "text", cols: 6 },
                  { name: "permanentCity", label: "City", type: "text", cols: 2 },
                  { name: "permanentState", label: "State", type: "text", cols: 2 },
                  { name: "permanentCountry", label: "Country", type: "text", cols: 2 },
                  { name: "permanentPincode", label: "Pincode", type: "number", cols: 2 },
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
                apiEndpoint={`/student/updateStudentBankDetails/${id}`}
                saving={saving}
                onViewImage={handleViewImage}
                fields={[
                  { label: "Bank Details", type: "divider", cols: 12 },
                  { name: "bankHolderName", label: "Account Holder Name", type: "text", cols: 4 },
                  { name: "bankName", label: "Bank Name", type: "text", cols: 4 },
                  { name: "accountNumber", label: "Account Number", type: "text", cols: 4 },
                  { name: "ifscCode", label: "IFSC Code", type: "text", cols: 4 },
                  { name: "branchName", label: "Branch Name", type: "text", cols: 4 },
                  { name: "passbookUrl", label: "Passbook Image", type: "file", cols: 4 },
                ]}
              />

              <StepSection
                title="Body Details"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentBodyDetails/${id}`}
                saving={saving}
                onViewImage={handleViewImage}
                fields={[
                  { label: "Body Details", type: "divider", cols: 12 },
                  { name: "heightCm", label: "Height (cm)", type: "number", cols: 2 },
                  { name: "weightKg", label: "Weight (kg)", type: "number", cols: 2 },
                  {
                    name: "bloodGroup", label: "Blood Group", type: "select", cols: 2,
                    options: [
                      { value: "A+", label: "A+" },
                      { value: "A-", label: "A-" },
                      { value: "B+", label: "B+" },
                      { value: "B-", label: "B-" },
                      { value: "AB+", label: "AB+" },
                      { value: "AB-", label: "AB-" },
                      { value: "O+", label: "O+" },
                      { value: "O-", label: "O-" },
                    ]
                  },
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
                onViewImage={handleViewImage}
                fields={[
                  { name: "emergencyContactName", label: "Contact Name", type: "text", cols: 4 },
                  { name: "emergencyRelation", label: "Relation", type: "text", cols: 4 },
                  { name: "emergencyPhoneNumber", label: "Phone Number", type: "number", cols: 4 },
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
                onViewImage={handleViewImage}
                fields={[
                  { label: "Father's Information", type: "divider", cols: 12 },
                  { name: "fatherName", label: "Father's Name", type: "text", cols: 4 },
                  { name: "fatherContactNumber", label: "Contact Number", type: "number", cols: 4 },
                  { name: "fatherOccupation", label: "Occupation", type: "text", cols: 4 },
                  { name: "fatherEmail", label: "Email", type: "email", cols: 4 },
                  { name: "fatherAnnualIncome", label: "Annual Income", type: "number", cols: 4 },

                  { label: "Mother's Information", type: "divider", cols: 12 },
                  { name: "motherName", label: "Mother's Name", type: "text", cols: 4 },
                  { name: "motherContactNumber", label: "Contact Number", type: "number", cols: 4 },
                  { name: "motherOccupation", label: "Occupation", type: "text", cols: 4 },
                  { name: "motherEmail", label: "Email", type: "email", cols: 4 },
                  { name: "motherAnnualIncome", label: "Annual Income", type: "number", cols: 4 },

                  { label: "Guardian's Information", type: "divider", cols: 12 },
                  { name: "guardianName", label: "Guardian Name", type: "text", cols: 4 },
                  { name: "guardianRelation", label: "Relation", type: "text", cols: 4 },
                  { name: "guardianContactNumber", label: "Contact Number", type: "number", cols: 4 },
                  { label: "Additional's Info", type: "divider", cols: 12 },
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
                onViewImage={handleViewImage}
                careerPreferences={careerPreferences}
                fields={[
                  {
                    name: "preferredJobCategory",
                    label: "Preferred Job Category",
                    type: "multiselect",
                    cols: 6,
                    options: careerPreferences,
                    placeholder: "Select your preferred job categories"
                  },
                  {
                    name: "preferredJobLocation",
                    label: "Preferred Job Location",
                    type: "multiselectapi",
                    cols: 6,
                    placeholder: "Search and select cities"
                  },
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
                onViewImage={handleViewImage}
                additionalButtons={[
                  {
                    label: "Add New Additional Education",
                    variant: "primary",
                    onClick: () => {
                      setSectionData(prev => ({
                        ...prev,
                        additionalEduName: '',
                        additionalInstitutionName: '',
                        additionalPassingYear: '',
                        additionalPercentage: '',
                        additionalMarksheetFile: '',
                      }));
                      toast.success('Fill in new additional education details and click Save');
                    },
                    icon: "plus"
                  }
                ]}
                customContent={
                  <>
                    {additionalEducation.length > 0 && (
                      <div className="mb-3">
                        <h6 className="mb-3">Existing Additional Education ({additionalEducation.length})</h6>
                        <div className="table-responsive">
                          <Table bordered hover>
                            <thead className="table-light">
                              <tr>
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '40%' }}>Course/Certification Name</th>
                                <th style={{ width: '30%' }}>Institution</th>
                                <th style={{ width: '12%' }}>Year</th>
                                <th style={{ width: '13%' }}>Percentage</th>
                                <th style={{ width: '10%' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {additionalEducation.map((edu, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{edu.additionalEduName}</td>
                                  <td>{edu.institutionName}</td>
                                  <td>{edu.passingYear}</td>
                                  <td>{edu.percentage}%</td>
                                  <td>
                                    <button
                                      type="button"
                                      className="eye-icon"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        editAdditionalEducation(index);
                                      }}
                                    >
                                      <TbEdit />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                  </>
                }
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
                  { name: "tenthPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "tenthPercentage", label: "Percentage", type: "number", cols: 4 },
                  { name: "tenthMarksheetFile", label: "Marksheet", type: "file", accept: ".pdf,.jpg,.jpeg,.png", cols: 4 },

                  { label: "12th Standard", type: "divider", cols: 12 },
                  { name: "twelfthSchoolCollegeName", label: "School/College Name", type: "text", cols: 6 },
                  { name: "twelfthBoard", label: "Board", type: "text", cols: 6 },
                  { name: "twelfthStream", label: "Stream", type: "text", cols: 4 },
                  { name: "twelfthPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "twelfthPercentage", label: "Percentage", type: "number", cols: 4 },
                  { name: "twelfthMarksheetFile", label: "Marksheet", type: "file", accept: ".pdf,.jpg,.jpeg,.png", cols: 4 },

                  { label: "Graduation", type: "divider", cols: 12 },
                  { name: "graduationCollegeName", label: "College Name", type: "text", cols: 6 },
                  { name: "graduationCourseName", label: "Course Name", type: "text", cols: 6 },
                  { name: "graduationSpecialization", label: "Specialization", type: "text", cols: 4 },
                  { name: "graduationPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "graduationPercentage", label: "Percentage", type: "number", cols: 4 },
                  { name: "graduationMarksheetFile", label: "Marksheet", type: "file", accept: ".pdf,.jpg,.jpeg,.png", cols: 4 },

                  { label: "Post Graduation", type: "divider", cols: 12 },
                  { name: "postGraduationCollegeName", label: "College Name", type: "text", cols: 6 },
                  { name: "postGraduationCourseName", label: "Course Name", type: "text", cols: 6 },
                  { name: "postGraduationSpecialization", label: "Specialization", type: "text", cols: 4 },
                  { name: "postGraduationPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "postGraduationPercentage", label: "Percentage", type: "number", cols: 4 },
                  { name: "postGraduationMarksheetFile", label: "Marksheet", type: "file", accept: ".pdf,.jpg,.jpeg,.png", cols: 4 },

                  { label: "Additional Education", type: "divider", cols: 12 },
                  { name: "additionalEduName", label: "Course/Certification Name", type: "text", cols: 6 },
                  { name: "additionalInstitutionName", label: "Institution Name", type: "text", cols: 6 },
                  { name: "additionalPassingYear", label: "Passing Year", type: "number", cols: 4 },
                  { name: "additionalPercentage", label: "Percentage/Grade", type: "number", cols: 4 },
                  { name: "additionalMarksheetFile", label: "Certificate/Marksheet", type: "file", accept: ".pdf,.jpg,.jpeg,.png", cols: 4 },
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
                onViewImage={handleViewImage}
                customContent={
                  <>
                    {languageProficiency.length > 0 && (
                      <div className="mb-3">
                        <h6 className="mb-3">Language Proficiency ({languageProficiency.length})</h6>
                        <div className="table-responsive">
                          <Table bordered hover>
                            <thead className="table-light">
                              <tr>
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '35%' }}>Language</th>
                                <th style={{ width: '20%' }}>Read</th>
                                <th style={{ width: '20%' }}>Write</th>
                                <th style={{ width: '20%' }}>Speak</th>
                              </tr>
                            </thead>
                            <tbody>
                              {languageProficiency.map((lang, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{lang.language}</td>
                                  <td>{lang.read ? '✓ Yes' : '✗ No'}</td>
                                  <td>{lang.write ? '✓ Yes' : '✗ No'}</td>
                                  <td>{lang.speak ? '✓ Yes' : '✗ No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                    <div className="mb-4 p-3 bg-light rounded">
                      <h6 className="mb-3 text-primary border-bottom pb-2">Add Language Proficiency</h6>
                      <Row>
                        <Col xl={4}>
                          <FormGroup>
                            <FormLabel>Language</FormLabel>
                            <FormControl
                              type="text"
                              placeholder="e.g., English, Hindi, Marathi"
                              value={sectionData.newLanguage || ''}
                              onChange={(e) => handleFieldChange('newLanguage', e.target.value)}
                            />
                          </FormGroup>
                        </Col>
                        <Col xl={8}>
                          <FormLabel>Proficiency</FormLabel>
                          <div className="d-flex gap-4 align-items-center" style={{ marginTop: '8px' }}>
                            <Form.Check
                              type="checkbox"
                              label="Read"
                              checked={sectionData.newLanguageRead || false}
                              onChange={(e) => handleFieldChange('newLanguageRead', e.target.checked)}
                            />
                            <Form.Check
                              type="checkbox"
                              label="Write"
                              checked={sectionData.newLanguageWrite || false}
                              onChange={(e) => handleFieldChange('newLanguageWrite', e.target.checked)}
                            />
                            <Form.Check
                              type="checkbox"
                              label="Speak"
                              checked={sectionData.newLanguageSpeak || false}
                              onChange={(e) => handleFieldChange('newLanguageSpeak', e.target.checked)}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Button
                        variant="primary"
                        size="sm"
                        className="mt-3"
                        onClick={() => {
                          if (!sectionData.newLanguage) {
                            toast.error('Please enter a language name');
                            return;
                          }
                          const newLang = {
                            language: sectionData.newLanguage,
                            read: sectionData.newLanguageRead || false,
                            write: sectionData.newLanguageWrite || false,
                            speak: sectionData.newLanguageSpeak || false
                          };
                          setLanguageProficiency([...languageProficiency, newLang]);
                          setSectionData(prev => ({
                            ...prev,
                            newLanguage: '',
                            newLanguageRead: false,
                            newLanguageWrite: false,
                            newLanguageSpeak: false
                          }));
                          toast.success('Language added! Click Save Changes to save.');
                        }}
                      >
                        <i className="bi bi-plus-circle me-1"></i> Add Language
                      </Button>
                    </div>
                  </>
                }
                fields={[
                  { name: "hobbies", label: "Hobbies (comma-separated)", type: "textarea", rows: 2, cols: 12 },
                  { name: "technicalSkills", label: "Technical Skills (comma-separated)", type: "textarea", rows: 2, cols: 12 },
                  { name: "softSkills", label: "Soft Skills (comma-separated)", type: "textarea", rows: 2, cols: 12 },
                  { name: "computerKnowledge", label: "Computer Knowledge (comma-separated)", type: "textarea", rows: 2, cols: 12 },
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
                onViewImage={handleViewImage}
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
                onViewImage={handleViewImage}
                additionalButtons={[
                  {
                    label: "Add New Experience",
                    variant: "primary",
                    onClick: addNewExperience,
                    icon: "plus"
                  }
                ]}
                customContent={(
                  <>
                    <div className="mb-4 p-3 bg-light rounded">
                      <Row>
                        <Col xl={4}>
                          <FormGroup>
                            <FormLabel className="fw-semibold">Total Work Experience (in Months)</FormLabel>
                            <FormControl
                              type="number"
                              value={sectionData.totalExperienceMonths || 0}
                              onChange={(e) => handleFieldChange('totalExperienceMonths', e.target.value)}
                              placeholder="e.g., 24 for 2 years"
                            />
                            <Form.Text className="text-muted">
                              This is your total work experience across all jobs/internships
                            </Form.Text>
                          </FormGroup>
                        </Col>
                      </Row>
                    </div>

                    {workExperiences.length > 0 && (
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

                    <h6 className="mb-3 mt-4 text-primary border-bottom pb-2">
                      {editingExperienceIndex !== null ? 'Edit' : 'Add'} Individual Job/Internship Details
                    </h6>
                  </>
                )}
                fields={[
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
                  { name: "experienceDurationMonths", label: "Duration of this Job (Months)", type: "number", cols: 4 },
                  { name: "experienceStartDate", label: "Start Date", type: "date", cols: 4 },
                  { name: "experienceEndDate", label: "End Date", type: "date", cols: 4 },
                  { name: "experienceCertificateFile", label: "Certificate File", type: "file", cols: 4 },
                  { name: "currentlyWorking", label: "Currently Working", type: "checkbox", cols: 4 },
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
                onViewImage={handleViewImage}
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
                  { name: "issueDate", label: "Issue Date", type: "date", cols: 3 },
                  { name: "expirationDate", label: "Expiration Date", type: "date", cols: 3 },
                  { name: "credentialId", label: "Credential ID", type: "text", cols: 3 },
                  { name: "certificateUrl", label: "Certificate URL", type: "url", cols: 3 },
                  { name: "certificateFile", label: "Certificate File", type: "file", cols: 4 },
                ]}
              />

              {/* Step 13: Documents */}
              <StepSection
                title="Document Uploads"
                data={sectionData}
                next
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/updateStudentDocumentUpload/${id}`}
                saving={saving}
                onViewImage={handleViewImage}
                additionalButtons={[
                  {
                    label: "Add New Document",
                    variant: "primary",
                    onClick: addNewOtherDocument,
                    icon: "plus"
                  }
                ]}
                customContent={
                  <>
                    {otherDocuments.length > 0 && (
                      <div className="mb-4">
                        <h6 className="mb-3">Other Documents ({otherDocuments.length})</h6>
                        <div className="table-responsive">
                          <Table bordered hover>
                            <thead className="table-light">
                              <tr>
                                <th style={{ width: '5%' }}>#</th>
                                <th style={{ width: '50%' }}>Document Name</th>
                                <th style={{ width: '15%' }}>File</th>
                                <th style={{ width: '10%' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {otherDocuments.map((doc, index) => (
                                <tr key={index} className={editingOtherDocIndex === index ? 'table-active' : ''}>
                                  <td>{index + 1}</td>
                                  <td>{doc.documentName}</td>
                                  <td>
                                    {doc.documentFile && (
                                      <Button
                                        size="sm"
                                        variant="outline-info"
                                        onClick={() => handleViewImage(doc.documentFile, doc.documentName)}
                                      >
                                        <i className="bi bi-eye"></i> View
                                      </Button>
                                    )}
                                  </td>
                                  <td>
                                    <div className="d-flex gap-1">
                                      <Button
                                        size="sm"
                                        variant="outline-primary"
                                        onClick={() => editOtherDocument(index)}
                                      >
                                        <TbEdit/>
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => deleteOtherDocument(index)}
                                      >
                                        <TbTrash/>  
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </div>
                    )}
                    <h6 className="mb-3 mt-4 text-primary border-bottom pb-2">
                      {editingOtherDocIndex !== null ? 'Edit' : 'Add'} Other Document
                    </h6>
                  </>
                }
                fields={[
                  { name: "aadharNumber", label: "Aadhar Number", type: "number", cols: 4 },
                  { name: "panNumber", label: "PAN Number", type: "text", cols: 4 },
                  { name: "voterId", label: "Voter ID", type: "text", cols: 4 },
                  { name: "passportNumber", label: "Passport Number", type: "text", cols: 4 },
                  { name: "drivingLicenseNo", label: "Driving License No", type: "text", cols: 4 },
                  { label: "Documents files", type: "divider", cols: 12 },
                  { name: "aadharFrontImg", label: "Aadhar Front Image", type: "file", cols: 4 },
                  { name: "aadharBackImg", label: "Aadhar Back Image", type: "file", cols: 4 },
                  { name: "panImg", label: "PAN Card Image", type: "file", cols: 4 },
                  { name: "drivingLicenseFrontImg", label: "Driving License Front Image", type: "file", cols: 4 },
                  { name: "categoryCertificateImg", label: "Category Certificate Image", type: "file", cols: 4 },
                  { name: "domicileCertificateImg", label: "Domicile Certificate Image", type: "file", cols: 4 },
                  { name: "incomeCertificateImg", label: "Income Certificate Image", type: "file", cols: 4 },
                  { name: "birthCertificateImg", label: "Birth Certificate Image", type: "file", cols: 4 },
                  { label: "Other Documents", type: "divider", cols: 12 },
                  { name: "documentName", label: "Document Name", type: "text", cols: 6 },
                  { name: "documentFile", label: "Document File", type: "file", cols: 6 }
                ]}
              />

              {/* Step 14: Resume Upload */}
              <StepSection
                title="Resume Upload"
                data={sectionData}
                prev
                onChange={handleFieldChange}
                onSave={handleSave}
                apiEndpoint={`/student/uploadStudentResume/${id}`}
                saving={saving}
                onViewImage={handleViewImage}
                customContent={
                  <div>
                    <div className="alert alert-info mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      Upload your latest resume in PDF, DOC, or DOCX format. Maximum file size: 10MB.
                    </div>

                    <div className="mb-3">
                      <FormLabel className="fw-semibold mb-2">Select Resume File</FormLabel>
                      <FileUploader
                        files={uploadedResumeFiles}
                        setFiles={setUploadedResumeFiles}
                        multiple={false}
                        maxFileCount={1}
                        accept={{
                          'application/pdf': ['.pdf'],
                          'application/msword': ['.doc'],
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                        }}
                        maxSize={10 * 1024 * 1024}
                      />
                      <div className="text-end mt-3">
                        <Button
                          variant="primary"
                          onClick={handleResumeUpload}
                          disabled={saving || uploadedResumeFiles.length === 0}
                        >
                          {saving ? (
                            <>
                              <Spinner size="sm" className="me-2" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-upload me-2"></i>
                              Upload Resume
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    {sectionData.studentResumeFile && (
                      <div className="alert alert-success mt-3">
                        <i className="bi bi-check-circle me-2"></i>
                        <strong>Current Resume:</strong>
                        <a
                          href={`${sectionData.studentResumeFile}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ms-2 text-decoration-underline"
                        >
                          View/Download Resume
                        </a>
                      </div>
                    )}
                  </div>
                }
                fields={[]}
              />


            </Wizard>
          </ComponentCard>
        </Col>
      </Row>

      <ImageModal
        show={imageModalShow}
        onHide={() => setImageModalShow(false)}
        imageSrc={imageModalSrc}
        title={imageModalTitle}
      />
    </Container>
  );
};

export default WizardStudentDetail;
