import React, { useEffect, useState } from "react";
import { Form, Button, Alert, Container, Spinner } from "react-bootstrap";
import axios from "@/api/axios";
import ComponentCard from "@/components/ComponentCard";

const AddJobType = ({ mode = "add", data = null, onCancel = () => {}, onDataChanged = () => {} }) => {
  const isEditMode = mode === "edit" && data;
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("success");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && data) {
      // Clear any existing messages when entering edit mode
      setMessage("");
      setVariant("success");
      // Handle both snake_case and camelCase
      setName(data.job_type_name || data.jobType_name || "");
    } else {
      setName("");
      setMessage("");
    }
  }, [isEditMode, data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setMessage("");
    
    if (!name.trim()) {
      setMessage("Job type name is required");
      setVariant("danger");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: data?._id,
        job_type_name: name.trim(),
      };

      let response;
      if (isEditMode) {
        // Make sure we have an ID
        if (!data?._id) {
          setMessage("Job type ID is missing");
          setVariant("danger");
          setLoading(false);
          return;
        }
        response = await axios.put(`/job-categories/update_job_type/${data._id}`, payload);
        setMessage("Job type updated successfully");
      } else {
        response = await axios.post('/job-categories/create_job_type', payload);
        console.log("create_job_type response:", response.data);
        setMessage("Job type added successfully");
      }
      
      setVariant("success");
      
      if (!isEditMode) {
        setName("");
      }

      // Trigger refresh and hide form after delay
      setTimeout(() => {
        onDataChanged();
        onCancel();
      }, 1500);
    } catch (err) {
      console.error("Add/Update JobType error:", err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Failed to save job type");
      setVariant("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="pt-4">
      <ComponentCard title={isEditMode ? "Edit Job Type" : "Add Job Type"}>
        {message && (
          <Alert variant={variant} dismissible onClose={() => setMessage("")}>
            {message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit} className="py-2">
          <Form.Group className="mb-3" controlId="jobTypeName">
            <Form.Label>
              Job Type Name <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter job type name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              isInvalid={message && variant === "danger" && !name.trim()}
            />
            {message && variant === "danger" && !name.trim() && (
              <Form.Control.Feedback type="invalid">
                Job type name is required
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> {isEditMode ? "Updating..." : "Adding..."}
                </>
              ) : (
                isEditMode ? "Update Job Type" : "Add Job Type"
              )}
            </Button>
            <Button variant="secondary" type="button" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </Form>
      </ComponentCard>
    </Container>
  );
};

export default AddJobType;
