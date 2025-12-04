import React, { useState, useEffect } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";
import { TbPencil, TbCheck, TbX } from "react-icons/tb";
import DateConversion from "../DateConversion";

const Section = ({ title, children, titleColor = "primary" }) => (
  <div className="pb-0 pt-0 mb-0 mt-0">
    {title && <h6 className={`text-${titleColor} mb-2`}>{title}</h6>}
    {children}
  </div>
);

const Field = ({
  label,
  value,
  fieldName,
  editable = true,
  onEdit,
  type = "text",
  rows = 3,
  options = [],
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || "");

  const formatDisplayValue = (val) => {
    if (val === null || val === undefined || val === "") return "N/A";

    // Handle boolean values
    if (type === "boolean") {
      return val === true || val === "true" ? "Yes" : "No";
    }

    const valStr = val.toString();

    // For select fields, show the label instead of value
    if (type === "select" && options.length > 0) {
      const option = options.find((opt) => opt.value.toString() === valStr);
      return option ? option.label : valStr;
    }

    // Date formatting
    if (type === "date" || type === "datetime-local") {
      try {
        const date = /^\d+$/.test(valStr)
          ? new Date(parseInt(valStr) * 1000)
          : new Date(valStr);
        if (isNaN(date.getTime())) return valStr;
        return DateConversion(date.toISOString());
      } catch {
        return valStr;
      }
    }

    return valStr;
  };

  const displayValue = formatDisplayValue(value);

  const handleSave = () => {
    onEdit?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    setEditValue(value?.toString() || "");
  }, [value]);

  return (
    <div className="mb-2">
      <Form.Label className="text-muted mb-1 fs-6">{label}</Form.Label>
      <div className="d-flex align-items-center gap-2">
        {isEditing ? (
          <>
            {type === "select" ? (
              <Form.Select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
              >
                <option value="">Select...</option>
                {options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            ) : type === "boolean" ? (
              <Form.Select
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
              >
                <option value="true">Yes</option>
                <option value="false">No</option>
              </Form.Select>
            ) : type === "textarea" ? (
              <Form.Control
                as="textarea"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
                rows={rows}
              />
            ) : (
              <Form.Control
                type={type}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-grow-1"
              />
            )}
            <button
              onClick={handleSave}
              className="p-1 rounded bg-black text-white border-0"
              title="Save"
            >
              <TbCheck size={18} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 rounded border-0"
              title="Cancel"
            >
              <TbX size={18} />
            </button>
          </>
        ) : (
          <div className="d-flex align-items-center flex-grow-1 border rounded">
            {type === "textarea" ? (
              <Form.Control
                as="textarea"
                readOnly
                plaintext
                value={displayValue}
                className="flex-grow-1 px-2 input-field"
                rows={rows}
              />
            ) : (
              <Form.Control
                readOnly
                plaintext
                value={displayValue}
                className="flex-grow-1 px-2 input-field"
              />
            )}
            {editable && onEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-muted bg-transparent border-0 p-1"
                title="Edit"
              >
                <TbPencil size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DetailPage = ({ data, sections, onUpdate, editable = true }) => {
  const handleFieldUpdate = (field, value) => {
    onUpdate?.(field, value);
  };

  return (
    <div>
      {sections.map((section, sectionIndex) => {
        // Skip section if show is explicitly false
        if (section.show === false) return null;

        return (
          <Card className="mb-3" key={sectionIndex}>
            <Card.Body>
              <Section title={section.title} titleColor={section.titleColor}>
                <Row>
                  {section.fields.map((field, fieldIndex) => {
                    const colSize = field.cols || 4;
                    const mdSize = field.type === "textarea" ? 12 : 6;

                    return (
                      <Col lg={colSize} md={mdSize} key={fieldIndex}>
                        <Field
                          label={field.label}
                          value={data?.[field.name]}
                          fieldName={field.name}
                          editable={editable && field.editable !== false}
                          onEdit={(value) => handleFieldUpdate(field.name, value)}
                          type={field.type}
                          rows={field.rows}
                          options={field.options}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Section>
            </Card.Body>
          </Card>
        );
      })}
    </div>
  );
};

export default DetailPage;