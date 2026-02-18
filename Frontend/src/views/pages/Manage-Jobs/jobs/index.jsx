import { Link, useNavigate } from "react-router-dom";
import Government from "./components/GovernmentList"
import Private from "./components/PrivateList"
import PSUList from "./components/PSUList"
import { Nav, NavItem, NavLink, TabContainer, TabPane, TabContent } from "react-bootstrap";
import ComponentCard from "@/components/ComponentCard";
import axios from "@/api/axios";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("Private");

  const csvInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleCsvClick = () => {
    if (csvInputRef.current) csvInputRef.current.click();
  };

  const handleCsvChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    console.log('Selected file:', file);
    // basic validation
    if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
      toast.error('Please select a valid CSV file');
      e.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('CSV file is too large (max 10MB)');
      e.target.value = '';
      return;
    }

    const formData = new FormData();
    // backend expects field name `csv`
    formData.append('csv', file);

    try {
      setUploading(true);
      const res = await axios.post('/jobs/bulk-upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data?.message || 'CSV uploaded');
      // optionally show details in console
      console.log('Bulk upload result:', res.data);

      // reload to reflect new jobs (simple, reliable)
      // window.location.reload();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="mt-4 pb-3">
      <TabContainer activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav className="nav-tabs nav-bordered mb-3">
          <NavItem className="nav-tabs-nav d-flex">
            <NavLink eventKey="Private" id="0">Private Sector</NavLink>
            <NavLink eventKey="GovernMent" id="2">Government Sector</NavLink>
            <NavLink eventKey="PSU" id="3">PSU Sector</NavLink>
          </NavItem>
        </Nav>
        <ComponentCard
          title={
            <div className="d-flex align-items-center justify-content-between">
              <h4 className="mb-0 ">{activeTab} Jobs</h4>
            </div>
          }
          className="py-2"
          isLink={
            <div className="d-flex align-items-center gap-2">
              <Link to="/admin/jobs/add" className="btn btn-sm btn-primary">+ Add Job</Link>

              {/* CSV upload: hidden input + button */}
              <div>
                <input
                  ref={csvInputRef}
                  id="jobs-csv-input"
                  type="file"
                  accept=".csv,text/csv"
                  style={{ display: "none" }}
                  onChange={handleCsvChange}
                />
                <button
                  id="jobs-csv-button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleCsvClick}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload CSV"}
                </button>
              </div>
            </div>
          }
        >
        <TabContent className="pt-2">
          <TabPane eventKey="Private">
            <Private isActive={activeTab === "Private"} />
          </TabPane>

          <TabPane eventKey="GovernMent">
            <Government isActive={activeTab === "GovernMent"} />
          </TabPane>

          <TabPane eventKey="PSU">
            <PSUList isActive={activeTab === "PSU"} />
          </TabPane>
        </TabContent>
      </ComponentCard>
      </TabContainer>
    </div>
  );
};

export default Page;
