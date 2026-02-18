import React, { useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import {
  TbTrash,
  TbToggleRight,
  TbToggleLeft,
  TbStar,
  TbStarOff,
  TbThumbUp,
  TbThumbDown,
} from "react-icons/tb";
import axios from "@/api/axios";
import toast from "react-hot-toast";

const BulkActionToolbar = ({ selectedIds, onActionComplete, onClearSelection }) => {
  const [loading, setLoading] = useState(false);
  const count = selectedIds.length;

  if (count === 0) return null;

  const handleBulkUpdate = async (columnName, value, label) => {
    if (!window.confirm(`Are you sure you want to set ${label} for ${count} job(s)?`)) return;
    setLoading(true);
    try {
      await axios.post("/job-categories/bulk_update_jobs_status", {
        jobIds: selectedIds,
        updateColumnName: columnName,
        updateValue: value,
      });
      toast.success(`${count} job(s) updated — ${label}`);
      onClearSelection();
      onActionComplete();
    } catch (err) {
      console.error(err);
      toast.error("Bulk update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to DELETE ${count} job(s)? This cannot be undone.`))
      return;
    setLoading(true);
    try {
      await axios.post("/job-categories/bulk_delete_jobs", {
        jobIds: selectedIds,
      });
      toast.success(`${count} job(s) deleted`);
      onClearSelection();
      onActionComplete();
    } catch (err) {
      console.error(err);
      toast.error("Bulk delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2 flex-wrap py-2 px-1 bg-light border rounded mb-2">
      <span className="fw-semibold text-primary ms-2">{count} selected</span>

      {/* Status */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm" disabled={loading}>
          Status
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleBulkUpdate("job_status", 1, "Activate")}>
            <TbToggleRight className="me-2 text-success" /> Activate
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleBulkUpdate("job_status", 0, "Deactivate")}>
            <TbToggleLeft className="me-2 text-secondary" /> Deactivate
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Recommendation */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm" disabled={loading}>
          Recommendation
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleBulkUpdate("jobRecommendation", true, "Recommend ON")}>
            <TbThumbUp className="me-2 text-success" /> Turn ON
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleBulkUpdate("jobRecommendation", false, "Recommend OFF")}>
            <TbThumbDown className="me-2 text-secondary" /> Turn OFF
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Featured */}
      <Dropdown>
        <Dropdown.Toggle variant="outline-secondary" size="sm" disabled={loading}>
          Featured
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleBulkUpdate("jobFeatured", true, "Featured ON")}>
            <TbStar className="me-2 text-warning" /> Turn ON
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleBulkUpdate("jobFeatured", false, "Featured OFF")}>
            <TbStarOff className="me-2 text-secondary" /> Turn OFF
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Delete */}
      {/* <Button
        variant="outline-danger"
        size="sm"
        disabled={loading}
        onClick={handleBulkDelete}
      >
        <TbTrash className="me-1" /> Delete
      </Button> */}

      <Button
        variant="link"
        size="sm"
        className="text-muted ms-auto me-2"
        onClick={onClearSelection}
      >
        Clear selection
      </Button>
    </div>
  );
};

export default BulkActionToolbar;
